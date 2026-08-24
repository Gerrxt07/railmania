import { app, BrowserWindow, net, protocol, session } from 'electron';
import { dirname, join, normalize, relative, resolve, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const APP_SCHEME = 'railmania';
const APP_HOST = 'app';
const PRODUCTION_ORIGIN = `${APP_SCHEME}://${APP_HOST}`;
const currentDirectory = dirname(fileURLToPath(import.meta.url));

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

function isTrustedUrl(rawUrl: string): boolean {
  try {
    const url = new URL(rawUrl);
    if (url.origin === PRODUCTION_ORIGIN) return true;

    return (
      !app.isPackaged &&
      MAIN_WINDOW_VITE_DEV_SERVER_URL !== undefined &&
      url.origin === new URL(MAIN_WINDOW_VITE_DEV_SERVER_URL).origin
    );
  } catch {
    return false;
  }
}

function configureSession(): void {
  const currentSession = session.defaultSession;

  currentSession.setPermissionCheckHandler(() => false);
  currentSession.setPermissionRequestHandler((_webContents, _permission, callback) => {
    callback(false);
  });
  currentSession.setDevicePermissionHandler(() => false);

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
  protocol.handle(APP_SCHEME, (request) => {
    const requestUrl = new URL(request.url);
    if (requestUrl.host !== APP_HOST) return new Response(null, { status: 404 });

    const rendererRoot = resolve(currentDirectory, `../renderer/${MAIN_WINDOW_VITE_NAME}`);
    const requestedPath = decodeURIComponent(requestUrl.pathname === '/' ? '/index.html' : requestUrl.pathname);
    const filePath = resolve(rendererRoot, normalize(requestedPath).replace(/^[/\\]+/, ''));
    const pathFromRoot = relative(rendererRoot, filePath);

    if (pathFromRoot.startsWith(`..${sep}`) || pathFromRoot === '..') {
      return new Response(null, { status: 404 });
    }

    return net.fetch(pathToFileURL(filePath).toString());
  });
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
      devTools: !app.isPackaged,
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

  window.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
  window.webContents.on('will-navigate', (event, targetUrl) => {
    if (!isTrustedUrl(targetUrl)) event.preventDefault();
  });
  window.webContents.on('will-redirect', (event, targetUrl) => {
    if (!isTrustedUrl(targetUrl)) event.preventDefault();
  });
  window.webContents.on('select-bluetooth-device', (event, _devices, callback) => {
    event.preventDefault();
    callback('');
  });
  window.webContents.on('will-attach-webview', (event) => event.preventDefault());
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
  app.on('second-instance', () => {
    const window = BrowserWindow.getAllWindows()[0];
    if (window === undefined) return;
    if (window.isMinimized()) window.restore();
    window.focus();
  });

  app.whenReady().then(() => {
    configureSession();
    registerAppProtocol();
    createWindow();

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
  });

  app.on('web-contents-created', (_event, contents) => {
    contents.on('will-attach-webview', (event) => event.preventDefault());
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
  });
}
