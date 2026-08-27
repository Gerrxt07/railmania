import {
  FuseState,
  FuseV1Options,
  getCurrentFuseWire,
  type FuseConfig,
} from '@electron/fuses';
import { readdir, rm, stat } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { spawn } from 'node:child_process';

interface ReleaseTarget {
  readonly arch: 'arm64' | 'x64';
  readonly platform: 'darwin' | 'win32';
}

const targets: readonly ReleaseTarget[] = [
  { platform: 'darwin', arch: 'arm64' },
  { platform: 'win32', arch: 'x64' },
];
const expectedFuses = new Map<FuseV1Options, FuseState>([
  [FuseV1Options.RunAsNode, FuseState.DISABLE],
  [FuseV1Options.EnableCookieEncryption, FuseState.ENABLE],
  [FuseV1Options.EnableNodeOptionsEnvironmentVariable, FuseState.DISABLE],
  [FuseV1Options.EnableNodeCliInspectArguments, FuseState.DISABLE],
  [FuseV1Options.EnableEmbeddedAsarIntegrityValidation, FuseState.ENABLE],
  [FuseV1Options.OnlyLoadAppFromAsar, FuseState.ENABLE],
  [FuseV1Options.LoadBrowserProcessSpecificV8Snapshot, FuseState.DISABLE],
  [FuseV1Options.GrantFileProtocolExtraPrivileges, FuseState.DISABLE],
  [FuseV1Options.WasmTrapHandlers, FuseState.ENABLE],
]);
const outputRoot = resolve('out');

function run(command: string, arguments_: readonly string[]): Promise<void> {
  return new Promise((resolveRun, rejectRun) => {
    const child = spawn(command, arguments_, {
      cwd: process.cwd(),
      env: { ...process.env, NODE_ENV: 'production' },
      stdio: 'inherit',
    });

    child.once('error', rejectRun);
    child.once('exit', (code, signal) => {
      if (code === 0) {
        resolveRun();
        return;
      }

      rejectRun(new Error(
        `${command} ${arguments_.join(' ')} failed (code=${String(code)}, signal=${String(signal)})`,
      ));
    });
  });
}

function packageRoot(target: ReleaseTarget): string {
  return join(outputRoot, `Railmania-${target.platform}-${target.arch}`);
}

function executablePath(target: ReleaseTarget): string {
  const root = packageRoot(target);
  return target.platform === 'darwin'
    ? join(root, 'Railmania.app')
    : join(root, 'Railmania.exe');
}

function asarPath(target: ReleaseTarget): string {
  const root = packageRoot(target);
  return target.platform === 'darwin'
    ? join(root, 'Railmania.app', 'Contents', 'Resources', 'app.asar')
    : join(root, 'resources', 'app.asar');
}

async function verifyTarget(target: ReleaseTarget): Promise<void> {
  const executable = executablePath(target);
  const archive = asarPath(target);
  const archiveStats = await stat(archive);
  if (!archiveStats.isFile() || archiveStats.size === 0) {
    throw new Error(`Invalid ASAR archive: ${archive}`);
  }

  const resourcesPath = join(archive, '..');
  const resourceEntries = await readdir(resourcesPath);
  if (resourceEntries.includes('app')) {
    throw new Error(`Loose application directory found: ${join(resourcesPath, 'app')}`);
  }

  const fuseWire = await getCurrentFuseWire(executable) as FuseConfig<FuseState>;
  for (const [fuse, expectedState] of expectedFuses) {
    if (fuseWire[fuse] !== expectedState) {
      throw new Error(
        `Fuse ${FuseV1Options[fuse]} has state ${String(fuseWire[fuse])}; expected ${String(expectedState)}`,
      );
    }
  }

  if (target.platform === 'darwin' && process.platform === 'darwin') {
    await run('/usr/bin/codesign', ['--verify', '--deep', '--strict', executable]);
  }

  console.log(`Verified ${target.platform}-${target.arch}`);
}

console.log('Cleaning generated output');
await rm(outputRoot, { force: true, recursive: true });

await run('bun', ['ci']);
await run('bun', ['run', 'check']);
await run('bun', ['run', 'deps:check']);
await run('bun', ['run', 'audit']);
await run('git', ['diff', '--check']);

for (const target of targets) {
  console.log(`Packaging ${target.platform}-${target.arch}`);
  await run('bun', [
    'x',
    'electron-forge',
    'package',
    `--platform=${target.platform}`,
    `--arch=${target.arch}`,
  ]);
  await verifyTarget(target);
}

const hasNativeTarget = targets.some((target) => {
  return target.platform === process.platform && target.arch === process.arch;
});
if (hasNativeTarget) await run('bun', ['run', 'smoke:package']);

console.log('Release pipeline passed');
