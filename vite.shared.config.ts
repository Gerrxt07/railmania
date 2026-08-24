import JavaScriptObfuscator from 'javascript-obfuscator';
import type { Plugin } from 'vite';

type ObfuscationEnvironment = 'browser' | 'node';

export function obfuscateProductionBundle(environment: ObfuscationEnvironment): Plugin {
  const allowDynamicCode = environment === 'node';

  return {
    name: 'railmania-production-obfuscation',
    apply: 'build',
    enforce: 'post',
    generateBundle(_options, bundle) {
      for (const item of Object.values(bundle)) {
        if (item.type !== 'chunk') continue;

        item.code = JavaScriptObfuscator.obfuscate(item.code, {
          compact: true,
          controlFlowFlattening: true,
          controlFlowFlatteningThreshold: 0.5,
          deadCodeInjection: true,
          deadCodeInjectionThreshold: 0.15,
          debugProtection: allowDynamicCode,
          debugProtectionInterval: 0,
          disableConsoleOutput: allowDynamicCode,
          identifierNamesGenerator: 'hexadecimal',
          numbersToExpressions: true,
          renameGlobals: false,
          selfDefending: allowDynamicCode,
          simplify: true,
          splitStrings: true,
          splitStringsChunkLength: 8,
          stringArray: true,
          stringArrayCallsTransform: true,
          stringArrayEncoding: ['base64'],
          stringArrayIndexShift: true,
          stringArrayRotate: true,
          stringArrayShuffle: true,
          stringArrayThreshold: 0.8,
          transformObjectKeys: true,
          unicodeEscapeSequence: false,
  }).getObfuscatedCode();
      }
    },
  };
}

export const hardenedBuild = {
  minify: 'oxc' as const,
  sourcemap: false as const,
  reportCompressedSize: false,
};
