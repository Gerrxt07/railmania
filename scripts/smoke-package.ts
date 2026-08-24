import { existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { execFile, spawn } from 'node:child_process';
import { promisify } from 'node:util';

interface ProcessRecord {
  command: string;
  parentPid: number;
  pid: number;
}

const execFileAsync = promisify(execFile);

function packagedExecutable(): string {
  const packageRoot = resolve(`out/Railmania-${process.platform}-${process.arch}`);

  if (process.platform === 'darwin') {
    return join(packageRoot, 'Railmania.app', 'Contents', 'MacOS', 'Railmania');
  }

  if (process.platform === 'win32') {
    return join(packageRoot, 'Railmania.exe');
  }

  return join(packageRoot, 'Railmania');
}

const executable = packagedExecutable();
if (!existsSync(executable)) {
  throw new Error(`Packaged executable not found: ${executable}`);
}

async function processSnapshot(): Promise<ProcessRecord[]> {
  if (process.platform === 'win32') {
    const command = [
      'Get-CimInstance Win32_Process',
      'Select-Object ProcessId,ParentProcessId,CommandLine',
      'ConvertTo-Json -Compress',
    ].join(' | ');
    const { stdout } = await execFileAsync('powershell.exe', [
      '-NoLogo',
      '-NoProfile',
      '-NonInteractive',
      '-Command',
      command,
    ]);
    const parsed = JSON.parse(stdout) as
      | { CommandLine?: string; ParentProcessId: number; ProcessId: number }
      | Array<{ CommandLine?: string; ParentProcessId: number; ProcessId: number }>;
    const records = Array.isArray(parsed) ? parsed : [parsed];

    return records.map((record) => ({
      command: record.CommandLine ?? '',
      parentPid: record.ParentProcessId,
      pid: record.ProcessId,
    }));
  }

  const { stdout } = await execFileAsync('ps', ['-axo', 'pid=,ppid=,command=']);
  const records: ProcessRecord[] = [];

  for (const line of stdout.split('\n')) {
    const match = /^\s*(\d+)\s+(\d+)\s+(.*)$/.exec(line);
    if (match?.[1] === undefined || match[2] === undefined || match[3] === undefined) continue;
    records.push({
      command: match[3],
      parentPid: Number(match[2]),
      pid: Number(match[1]),
    });
  }

  return records;
}

async function hasRendererDescendant(rootPid: number): Promise<boolean> {
  const records = await processSnapshot();
  const descendants = new Set([rootPid]);
  let foundNewProcess = true;

  while (foundNewProcess) {
    foundNewProcess = false;
    for (const record of records) {
      if (!descendants.has(record.parentPid) || descendants.has(record.pid)) continue;
      descendants.add(record.pid);
      foundNewProcess = true;
    }
  }

  return records.some((record) => {
    return descendants.has(record.pid) && record.command.includes('--type=renderer');
  });
}

function delay(milliseconds: number): Promise<void> {
  return new Promise((resolveDelay) => setTimeout(resolveDelay, milliseconds));
}

const child = spawn(executable, ['--campaign=test', 'save-slot-1'], {
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
const readinessDeadline = Date.now() + 10_000;
let rendererStarted = false;

while (child.exitCode === null && Date.now() < readinessDeadline) {
  if (child.pid !== undefined && await hasRendererDescendant(child.pid)) {
    rendererStarted = true;
    break;
  }
  await delay(100);
}

if (!rendererStarted) {
  if (child.exitCode === null) child.kill('SIGTERM');
  const result = await exit;
  throw new Error(
    `Packaged renderer did not start (code=${String(result.code)}, signal=${String(result.signal)}).\n${output}`,
  );
}

child.kill('SIGTERM');
await exit;

const blockedLaunch = spawn(executable, ['--no-sandbox'], {
  stdio: 'ignore',
});
const blockedExit = new Promise<number | null>((resolveExit) => {
  blockedLaunch.once('exit', (code) => resolveExit(code));
});
let blockedTimeoutId: NodeJS.Timeout | undefined;
const blockedTimeout = new Promise<'timeout'>((resolveTimeout) => {
  blockedTimeoutId = setTimeout(() => resolveTimeout('timeout'), 5_000);
});
const blockedResult = await Promise.race([blockedExit, blockedTimeout]);
if (blockedTimeoutId !== undefined) clearTimeout(blockedTimeoutId);

if (blockedResult === 'timeout') {
  blockedLaunch.kill('SIGTERM');
  await blockedExit;
  throw new Error('Packaged app did not reject a blocked launch argument.');
}

if (blockedResult !== 2) {
  throw new Error(`Packaged app returned ${String(blockedResult)} for a blocked launch argument.`);
}

console.log('Packaged app started a renderer with normal arguments and rejected blocked switches.');
