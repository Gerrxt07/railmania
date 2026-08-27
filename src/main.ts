import { app, BrowserWindow, Menu, protocol, session } from 'electron';
import { readFile } from 'node:fs/promises';
import { extname, isAbsolute, normalize, relative, resolve, sep } from 'node:path';

const APP_SCHEME = 'railmania';
const APP_HOST = 'app';
const PRODUCTION_ORIGIN = `${APP_SCHEME}://${APP_HOST}`;
const CONTENT_TYPES = new Map<string, string>([
  ['.css', 'text/css; charset=utf-8'],
  ['.html', 'text/html; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.wasm', 'application/wasm'],
  ['.avif', 'image/avif'],
  ['.gif', 'image/gif'],
  ['.ico', 'image/x-icon'],
  ['.jpeg', 'image/jpeg'],
  ['.jpg', 'image/jpeg'],
  ['.png', 'image/png'],
  ['.svg', 'image/svg+xml'],
  ['.webp', 'image/webp'],
  ['.woff', 'font/woff'],
  ['.woff2', 'font/woff2'],
]);
const BLOCKED_CONSOLE_METHODS = ['debug', 'error', 'info', 'log', 'trace', 'warn'] as const;
const BLOCKED_LAUNCH_SWITCHES = new Set([
  'allow-file-access-from-files',
  'allow-running-insecure-content',
  'auto-open-devtools-for-tabs',
  'browser-subprocess-path',
  'custom-devtools-frontend',
  'disable-features',
  'disable-gpu-sandbox',
  'disable-namespace-sandbox',
  'disable-sandbox',
  'disable-seccomp-filter-sandbox',
  'disable-setuid-sandbox',
  'disable-site-isolation-trials',
  'disable-web-security',
  'enable-blink-features',
  'enable-experimental-web-platform-features',
  'enable-features',
  'enable-logging',
  'gpu-launcher',
  'host-resolver-rules',
  'host-rules',
  'ignore-certificate-errors',
  'ignore-certificate-errors-spki-list',
  'in-process-gpu',
  'in-process-plugins',
  'inspect',
  'inspect-brk',
  'inspect-port',
  'inspect-publish-uid',
  'inspect-wait',
  'js-flags',
  'load-extension',
  'log-file',
  'log-net-log',
  'no-sandbox',
  'proxy-pac-url',
  'proxy-server',
  'remote-allow-origins',
  'remote-debugging-address',
  'remote-debugging-pipe',
  'remote-debugging-port',
  'renderer-cmd-prefix',
  'single-process',
  'user-data-dir',
  'utility-cmd-prefix',
]);
const configuredSessions = new WeakSet<Electron.Session>();

const hasBlockedLaunchArgument = process.argv.slice(1).some((argument) => {
  if (!argument.startsWith('--')) return false;
  const switchName = argument.slice(2).split('=', 1)[0]?.toLowerCase();
  return switchName !== undefined && BLOCKED_LAUNCH_SWITCHES.has(switchName);
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

for (const switchName of BLOCKED_LAUNCH_SWITCHES) {
  app.commandLine.removeSwitch(switchName);
}

app.enableSandbox();

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

function isAllowedNetworkRequest(rawUrl: string): boolean {
  try {
    const url = new URL(rawUrl);

    if (isAppUrl(url)) return true;
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
      cancel: !isAllowedNetworkRequest(details.url),
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
      "worker-src 'self'",
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

    if (requestedPath.includes('\u0000')) return new Response(null, { status: 400 });

    const filePath = resolve(rendererRoot, normalize(requestedPath).replace(/^[/\\]+/, ''));
    const pathFromRoot = relative(rendererRoot, filePath);

    if (isAbsolute(pathFromRoot) || pathFromRoot.startsWith(`..${sep}`) || pathFromRoot === '..') {
      return new Response(null, { status: 404 });
    }

    const contentType = CONTENT_TYPES.get(extname(filePath).toLowerCase());
    if (contentType === undefined) return new Response(null, { status: 415 });

    try {
      const body = await readFile(filePath);
      return new Response(Uint8Array.from(body), {
        status: 200,
        headers: {
          'Content-Type': contentType,
        },
      });
    } catch {
      return new Response(null, { status: 404 });
    }
  });
}

function createWindow(): BrowserWindow {
  const window = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 960,
    minHeight: 640,
    show: false,
    fullscreen: true,
    backgroundColor: '#000000',
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

  window.once('ready-to-show', () => window.show());

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
    contents.on('before-input-event', (event, input) => {
      const key = input.key.toLowerCase();
      const isDevToolsShortcut =
        key === 'f12' ||
        (input.control && input.shift && ['c', 'i', 'j', 'k'].includes(key)) ||
        (input.meta && input.alt && ['c', 'i', 'j'].includes(key)) ||
        (input.meta && input.shift && key === 'c');

      if (isDevToolsShortcut) event.preventDefault();
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
