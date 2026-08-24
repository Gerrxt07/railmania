import type { ForgeConfig } from '@electron-forge/shared-types';
import { VitePlugin } from '@electron-forge/plugin-vite';
import { flipFuses, FuseV1Options, FuseVersion } from '@electron/fuses';
import { execFile } from 'node:child_process';
import { join, resolve } from 'node:path';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
const macSigningIdentity = process.env.RAILMANIA_MAC_SIGN_IDENTITY;

function electronExecutable(buildPath: string, platform: string): string {
  const packageRoot = resolve(buildPath, '../..');

  if (platform === 'darwin' || platform === 'mas') {
    return join(packageRoot, 'MacOS', 'Electron');
  }

  return join(packageRoot, platform === 'win32' ? 'electron.exe' : 'electron');
}

const config: ForgeConfig = {
  packagerConfig: {
    appBundleId: 'com.railmania.game',
    appCategoryType: 'public.app-category.games',
    asar: true,
    executableName: 'railmania',
    name: 'Railmania',
    ...(macSigningIdentity === undefined
      ? {}
      : {
          osxSign: {
            identity: macSigningIdentity,
          },
        }),
  },
  rebuildConfig: {},
  makers: [],
  hooks: {
    packageAfterCopy: async (_forgeConfig, buildPath, _electronVersion, platform, arch) => {
      await flipFuses(electronExecutable(buildPath, platform), {
        version: FuseVersion.V1,
        resetAdHocDarwinSignature:
          (platform === 'darwin' || platform === 'mas') && arch === 'arm64',
        strictlyRequireAllFuses: true,
        [FuseV1Options.RunAsNode]: false,
        [FuseV1Options.EnableCookieEncryption]: true,
        [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
        [FuseV1Options.EnableNodeCliInspectArguments]: false,
        [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
        [FuseV1Options.OnlyLoadAppFromAsar]: true,
        [FuseV1Options.LoadBrowserProcessSpecificV8Snapshot]: false,
        [FuseV1Options.GrantFileProtocolExtraPrivileges]: false,
        [FuseV1Options.WasmTrapHandlers]: true,
      });
    },
    postPackage: async (_forgeConfig, packageResult) => {
      if (packageResult.platform !== 'darwin' || macSigningIdentity !== undefined) return;

      for (const outputPath of packageResult.outputPaths) {
        const appPath = outputPath.endsWith('.app')
          ? outputPath
          : join(outputPath, 'Railmania.app');

        await execFileAsync('/usr/bin/codesign', [
          '--force',
          '--deep',
          '--strict',
          '--sign',
          '-',
          appPath,
        ]);
      }
    },
  },
  plugins: [
    new VitePlugin({
      build: [
        {
          entry: 'src/main.ts',
          config: 'vite.main.config.ts',
          target: 'main',
        },
      ],
      renderer: [
        {
          name: 'main_window',
          config: 'vite.renderer.config.ts',
        },
      ],
    }),
  ],
};

export default config;
