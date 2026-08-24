import { execFile } from 'node:child_process';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { promisify } from 'node:util';

interface IconSpec {
  readonly pixels: number;
  readonly type: string;
}

const iconSpecs: readonly IconSpec[] = [
  { pixels: 16, type: 'icp4' },
  { pixels: 32, type: 'icp5' },
  { pixels: 64, type: 'icp6' },
  { pixels: 128, type: 'ic07' },
  { pixels: 256, type: 'ic08' },
  { pixels: 512, type: 'ic09' },
  { pixels: 1024, type: 'ic10' },
];
const execFileAsync = promisify(execFile);
const sourcePath = resolve('build-resources/railmania-logo.png');
const outputPath = resolve('build-resources/railmania.icns');
const temporaryDirectory = await mkdtemp(join(tmpdir(), 'railmania-icon-'));

try {
  const chunks: Buffer[] = [];

  for (const spec of iconSpecs) {
    const pngPath = join(temporaryDirectory, `${spec.pixels}.png`);
    await execFileAsync('/usr/bin/sips', [
      '--resampleHeightWidth',
      String(spec.pixels),
      String(spec.pixels),
      sourcePath,
      '--out',
      pngPath,
    ]);

    const png = await readFile(pngPath);
    const chunkHeader = Buffer.alloc(8);
    chunkHeader.write(spec.type, 0, 4, 'ascii');
    chunkHeader.writeUInt32BE(chunkHeader.length + png.length, 4);
    chunks.push(chunkHeader, png);
  }

  const body = Buffer.concat(chunks);
  const fileHeader = Buffer.alloc(8);
  fileHeader.write('icns', 0, 4, 'ascii');
  fileHeader.writeUInt32BE(fileHeader.length + body.length, 4);
  await writeFile(outputPath, Buffer.concat([fileHeader, body]));
} finally {
  await rm(temporaryDirectory, { recursive: true });
}

console.log(`Built ${outputPath}`);
