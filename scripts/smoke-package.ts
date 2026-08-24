import { existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { spawn } from 'node:child_process';

const READY_MARKER = 'RAILMANIA_SMOKE_READY';

function packagedExecutable(): string {
  const packageRoot = resolve(`out/Railmania-${process.platform}-${process.arch}`);

  if (process.platform === 'darwin') {
    return join(packageRoot, 'Railmania.app', 'Contents', 'MacOS', 'railmania');
  }

  if (process.platform === 'win32') {
    return join(packageRoot, 'railmania.exe');
  }

  return join(packageRoot, 'railmania');
}

const executable = packagedExecutable();
if (!existsSync(executable)) {
  throw new Error(`Packaged executable not found: ${executable}`);
}

const child = spawn(executable, ['--railmania-smoke-test'], {
  env: {
    ...process.env,
    ELECTRON_ENABLE_LOGGING: '1',
  },
  stdio: ['ignore', 'pipe', 'pipe'],
});

let output = '';
child.stdout.setEncoding('utf8');
child.stderr.setEncoding('utf8');
child.stdout.on('data', (chunk: string) => {
  output += chunk;
});
child.stderr.on('data', (chunk: string) => {
  output += chunk;
});

const exit = new Promise<{ code: number | null; signal: NodeJS.Signals | null }>((resolveExit) => {
  child.once('exit', (code, signal) => resolveExit({ code, signal }));
});
let timeoutId: NodeJS.Timeout | undefined;
const timeout = new Promise<'timeout'>((resolveTimeout) => {
  timeoutId = setTimeout(() => resolveTimeout('timeout'), 10_000);
});

const result = await Promise.race([exit, timeout]);
if (timeoutId !== undefined) clearTimeout(timeoutId);
if (result === 'timeout') {
  child.kill('SIGTERM');
  await exit;
  throw new Error(`Packaged app did not become ready within ten seconds.\n${output}`);
}

if (result.code !== 0 || !output.includes(READY_MARKER)) {
  throw new Error(
    `Packaged app failed readiness check (code=${String(result.code)}, signal=${String(result.signal)}).\n${output}`,
  );
}

console.log('Packaged app reached renderer readiness.');
