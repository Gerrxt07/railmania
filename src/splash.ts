import './splash.css';

const blockedConsoleMethods = ['debug', 'error', 'info', 'log', 'trace', 'warn'] as const;

for (const method of blockedConsoleMethods) {
  Object.defineProperty(console, method, {
    configurable: false,
    value: () => undefined,
    writable: false,
  });
}
Object.freeze(console);