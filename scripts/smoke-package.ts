import { once } from 'node:events';
import { existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { spawn } from 'node:child_process';

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

const child = spawn(executable, [], {
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

const earlyExit = new Promise<{ code: number | null; signal: NodeJS.Signals | null }>((resolveExit) => {
  child.once('exit', (code, signal) => resolveExit({ code, signal }));
});
const survived = new Promise<'survived'>((resolveSurvival) => {
  setTimeout(() => resolveSurvival('survived'), 5_000);
});

const result = await Promise.race([earlyExit, survived]);
if (result !== 'survived') {
  throw new Error(
    `Packaged app exited before five seconds (code=${String(result.code)}, signal=${String(result.signal)}).\n${output}`,
  );
}

const stopped = once(child, 'exit');
child.kill('SIGTERM');
await stopped;

console.log('Packaged app stayed alive for five seconds.');
