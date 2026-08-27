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
const macOutputPath = resolve('build-resources/railmania.icns');
const windowsOutputPath = resolve('build-resources/railmania.ico');
const windowsIconSizes = [16, 24, 32, 48, 64, 128, 256] as const;
const temporaryDirectory = await mkdtemp(join(tmpdir(), 'railmania-icon-'));

try {
  const resizedIcons = new Map<number, Buffer>();
  const getResizedIcon = async (pixels: number): Promise<Buffer> => {
    const cachedIcon = resizedIcons.get(pixels);
    if (cachedIcon !== undefined) return cachedIcon;

    const pngPath = join(temporaryDirectory, `${pixels}.png`);
    await execFileAsync('/usr/bin/sips', [
      '--resampleHeightWidth',
      String(pixels),
      String(pixels),
      sourcePath,
      '--out',
      pngPath,
    ]);
    const png = await readFile(pngPath);
    resizedIcons.set(pixels, png);
    return png;
  };

  const chunks: Buffer[] = [];

  for (const spec of iconSpecs) {
    const png = await getResizedIcon(spec.pixels);
    const chunkHeader = Buffer.alloc(8);
    chunkHeader.write(spec.type, 0, 4, 'ascii');
    chunkHeader.writeUInt32BE(chunkHeader.length + png.length, 4);
    chunks.push(chunkHeader, png);
  }

  const body = Buffer.concat(chunks);
  const fileHeader = Buffer.alloc(8);
  fileHeader.write('icns', 0, 4, 'ascii');
  fileHeader.writeUInt32BE(fileHeader.length + body.length, 4);
  await writeFile(macOutputPath, Buffer.concat([fileHeader, body]));

  const windowsImages = await Promise.all(windowsIconSizes.map(getResizedIcon));
  const windowsHeader = Buffer.alloc(6 + windowsImages.length * 16);
  windowsHeader.writeUInt16LE(0, 0);
  windowsHeader.writeUInt16LE(1, 2);
  windowsHeader.writeUInt16LE(windowsImages.length, 4);

  let imageOffset = windowsHeader.length;
  for (const [index, png] of windowsImages.entries()) {
    const size = windowsIconSizes[index];
    if (size === undefined) throw new Error(`Missing Windows icon size at index ${String(index)}`);

    const entryOffset = 6 + index * 16;
    windowsHeader.writeUInt8(size === 256 ? 0 : size, entryOffset);
    windowsHeader.writeUInt8(size === 256 ? 0 : size, entryOffset + 1);
    windowsHeader.writeUInt8(0, entryOffset + 2);
    windowsHeader.writeUInt8(0, entryOffset + 3);
    windowsHeader.writeUInt16LE(1, entryOffset + 4);
    windowsHeader.writeUInt16LE(32, entryOffset + 6);
    windowsHeader.writeUInt32LE(png.length, entryOffset + 8);
    windowsHeader.writeUInt32LE(imageOffset, entryOffset + 12);
    imageOffset += png.length;
  }

  await writeFile(windowsOutputPath, Buffer.concat([windowsHeader, ...windowsImages]));
} finally {
  await rm(temporaryDirectory, { recursive: true });
}

console.log(`Built ${macOutputPath}`);
console.log(`Built ${windowsOutputPath}`);
