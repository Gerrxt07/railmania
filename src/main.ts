import { app, BrowserWindow, Menu, net, protocol, session } from 'electron';
import { isAbsolute, normalize, relative, resolve, sep } from 'node:path';
import { pathToFileURL } from 'node:url';

const APP_SCHEME = 'railmania';
const APP_HOST = 'app';
const PRODUCTION_ORIGIN = `${APP_SCHEME}://${APP_HOST}`;
const INTERNAL_SMOKE_TEST = process.env.RAILMANIA_INTERNAL_SMOKE_TEST === '1';
const BLOCKED_CONSOLE_METHODS = ['debug', 'error', 'info', 'log', 'trace', 'warn'] as const;
const configuredSessions = new WeakSet<Electron.Session>();

delete process.env.RAILMANIA_INTERNAL_SMOKE_TEST;

const launchArguments = process.argv.slice(1);
if (!app.isPackaged && launchArguments[0] !== undefined) {
  const developmentEntry = resolve(launchArguments[0]);
  if (developmentEntry === resolve(app.getAppPath())) launchArguments.shift();
}

const hasBlockedLaunchArgument = launchArguments.some((argument) => {
  return process.platform !== 'darwin' || !/^-psn_\d+_\d+$/.test(argument);
});

if (hasBlockedLaunchArgument) process.exit(2);

for (const method of BLOCKED_CONSOLE_METHODS) {
  Object.defineProperty(console, method, {
    configurable: false,
    value: () => undefined,
    writable: false,
  });
}
Object.freeze(console);

for (const switchName of ['inspect', 'inspect-brk', 'remote-debugging-pipe', 'remote-debugging-port']) {
  app.commandLine.removeSwitch(switchName);
}

app.enableSandbox();

app.on('open-file', (event) => event.preventDefault());
app.on('open-url', (event) => event.preventDefault());

protocol.registerSchemesAsPrivileged([
  {
    scheme: APP_SCHEME,
    privileges: {
      standard: true,
      secure: true,
      supportFetchAPI: true,
      corsEnabled: false,
      stream: true,
    },
  },
]);

function isAppUrl(url: URL): boolean {
  return (
    url.protocol === `${APP_SCHEME}:` &&
    url.host === APP_HOST &&
    url.username === '' &&
    url.password === '' &&
    url.port === ''
  );
}

function isTrustedUrl(rawUrl: string): boolean {
  try {
    const url = new URL(rawUrl);
    if (isAppUrl(url)) return true;

    return (
      !app.isPackaged &&
      MAIN_WINDOW_VITE_DEV_SERVER_URL !== undefined &&
      url.origin === new URL(MAIN_WINDOW_VITE_DEV_SERVER_URL).origin
    );
  } catch {
    return false;
  }
}

function isAllowedNetworkRequest(rawUrl: string, hasWebContents: boolean): boolean {
  try {
    const url = new URL(rawUrl);

    if (isAppUrl(url)) return true;
    if (url.protocol === 'file:' && !hasWebContents) return true;
    if (app.isPackaged || MAIN_WINDOW_VITE_DEV_SERVER_URL === undefined) return false;

    const developmentUrl = new URL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
    const allowedProtocols = developmentUrl.protocol === 'https:'
      ? new Set(['https:', 'wss:'])
      : new Set(['http:', 'ws:']);

    return (
      allowedProtocols.has(url.protocol) &&
      url.hostname === developmentUrl.hostname &&
      url.port === developmentUrl.port
    );
  } catch {
    return false;
  }
}

function configureSession(currentSession: Electron.Session): void {
  if (configuredSessions.has(currentSession)) return;
  configuredSessions.add(currentSession);

  currentSession.setPermissionCheckHandler(() => false);
  currentSession.setPermissionRequestHandler((_webContents, _permission, callback) => {
    callback(false);
  });
  currentSession.setDevicePermissionHandler(() => false);
  currentSession.on('will-download', (event) => event.preventDefault());

  currentSession.webRequest.onBeforeRequest((details, callback) => {
    callback({
      cancel: !isAllowedNetworkRequest(details.url, details.webContentsId !== undefined),
    });
  });

  currentSession.webRequest.onHeadersReceived((details, callback) => {
    const connectSource = app.isPackaged ? "'self'" : "'self' ws:";
    const policy = [
      "default-src 'none'",
      "script-src 'self'",
      "style-src 'self'",
      "img-src 'self' data:",
      "font-src 'self'",
      `connect-src ${connectSource}`,
      "worker-src 'self' blob:",
      "object-src 'none'",
      "base-uri 'none'",
      "form-action 'none'",
      "frame-ancestors 'none'",
    ].join('; ');

    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [policy],
        'Cross-Origin-Opener-Policy': ['same-origin'],
        'Cross-Origin-Resource-Policy': ['same-origin'],
        'Referrer-Policy': ['no-referrer'],
        'X-Content-Type-Options': ['nosniff'],
      },
    });
  });
}

function registerAppProtocol(): void {
  protocol.handle(APP_SCHEME, async (request) => {
    if (request.method !== 'GET') {
      return new Response(null, {
        status: 405,
        headers: { Allow: 'GET' },
      });
    }

    let requestUrl: URL;
    try {
      requestUrl = new URL(request.url);
    } catch {
      return new Response(null, { status: 400 });
    }

    if (
      !isAppUrl(requestUrl) ||
      requestUrl.search !== ''
    ) {
      return new Response(null, { status: 400 });
    }

    const rendererRoot = resolve(app.getAppPath(), `.vite/renderer/${MAIN_WINDOW_VITE_NAME}`);
    let requestedPath: string;
    try {
      requestedPath = decodeURIComponent(requestUrl.pathname === '/' ? '/index.html' : requestUrl.pathname);
    } catch {
      return new Response(null, { status: 400 });
    }

    if (requestedPath.includes('\0')) return new Response(null, { status: 400 });

    const filePath = resolve(rendererRoot, normalize(requestedPath).replace(/^[/\\]+/, ''));
    const pathFromRoot = relative(rendererRoot, filePath);

    if (isAbsolute(pathFromRoot) || pathFromRoot.startsWith(`..${sep}`) || pathFromRoot === '..') {
      return new Response(null, { status: 404 });
    }

    try {
      return await net.fetch(pathToFileURL(filePath).toString());
    } catch {
      return new Response(null, { status: 404 });
    }
  });
}

async function completeSmokeTest(): Promise<void> {
  const malformedEncoding = await net.fetch(`${PRODUCTION_ORIGIN}/%E0%A4%A`);
  const forbiddenMethod = await net.fetch(`${PRODUCTION_ORIGIN}/index.html`, { method: 'POST' });
  const externalNetworkAllowed = isAllowedNetworkRequest('https://example.com/', true);

  if (malformedEncoding.status !== 400 || forbiddenMethod.status !== 405 || externalNetworkAllowed) {
    throw new Error('Packaged security readiness checks failed.');
  }

  process.stdout.write('RAILMANIA_SMOKE_READY\n');
  app.quit();
}

function createWindow(): BrowserWindow {
  const window = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 960,
    minHeight: 640,
    show: false,
    backgroundColor: '#0b0d10',
    autoHideMenuBar: true,
    title: 'Railmania',
    webPreferences: {
      allowRunningInsecureContent: false,
      contextIsolation: true,
      devTools: false,
      experimentalFeatures: false,
      navigateOnDragDrop: false,
      nodeIntegration: false,
      sandbox: true,
      safeDialogs: true,
      spellcheck: false,
      webSecurity: true,
      webviewTag: false,
    },
  });

  window.once('ready-to-show', () => {
    if (INTERNAL_SMOKE_TEST) {
      void completeSmokeTest().catch((error: unknown) => {
        const message = error instanceof Error ? error.message : 'Unknown smoke test error';
        process.stderr.write(`${message}\n`);
        app.exit(1);
      });
      return;
    }

    window.show();
  });

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL !== undefined && !app.isPackaged) {
    void window.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    void window.loadURL(`${PRODUCTION_ORIGIN}/index.html`);
  }

  return window;
}

if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  app.on('web-contents-created', (_event, contents) => {
    configureSession(contents.session);
    contents.setWindowOpenHandler(() => ({ action: 'deny' }));
    contents.on('will-navigate', (event, targetUrl) => {
      if (!isTrustedUrl(targetUrl)) event.preventDefault();
    });
    contents.on('will-redirect', (event, targetUrl) => {
      if (!isTrustedUrl(targetUrl)) event.preventDefault();
    });
    contents.on('will-attach-webview', (event) => event.preventDefault());
    contents.on('context-menu', (event) => event.preventDefault());
    contents.on('select-bluetooth-device', (event, _devices, callback) => {
      event.preventDefault();
      callback('');
    });
    contents.setIgnoreMenuShortcuts(true);
    contents.on('before-input-event', (event, input) => {
      const isFunctionKey = /^F(?:[1-9]|1[0-2])$/.test(input.key);
      if (input.alt || input.control || input.meta || isFunctionKey) event.preventDefault();
    });
    contents.on('devtools-opened', () => {
      contents.closeDevTools();
    });
  });

  app.whenReady().then(() => {
    Menu.setApplicationMenu(null);
    configureSession(session.defaultSession);
    registerAppProtocol();
    createWindow();

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
  });
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
  });
}
