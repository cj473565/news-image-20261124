// news-image-20261124 entry runner.
//
// The artwork itself lives in entry.png next to this file. At grading
// time the platform only runs this program, so its job is deliberately
// small: check that the image is really there and looks like a PNG or
// JPEG, then copy its bytes unchanged into the output directory.

import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

// Where this script sits on disk; entry.png is expected alongside it.
const HERE = dirname(fileURLToPath(import.meta.url));
const SOURCE_PATH = join(HERE, 'entry.png');

// The grader mounts its output volume at /output, but a local run can
// point MAKEFUN_OUTPUT_DIR anywhere to try the program out.
function resolveOutputDir(): string {
  const fromEnv = process.env.MAKEFUN_OUTPUT_DIR;
  return fromEnv && fromEnv.trim() !== '' ? fromEnv : '/output';
}

// Fail loudly: a message on stderr and a non-zero exit code, so a broken
// submission never looks like a successful one.
function fail(reason: string): never {
  console.error(`news-image: error: ${reason}`);
  process.exit(1);
}

// Read the source image, making sure the file exists and is not empty.
function loadSourceImage(): Buffer {
  if (!existsSync(SOURCE_PATH)) {
    fail(`entry.png not found next to main.ts (looked for ${SOURCE_PATH})`);
  }
  const info = statSync(SOURCE_PATH);
  if (!info.isFile()) {
    fail(`entry.png exists but is not a regular file: ${SOURCE_PATH}`);
  }
  if (info.size === 0) {
    fail('entry.png is empty (0 bytes)');
  }
  return readFileSync(SOURCE_PATH);
}

// Sniff the first bytes: PNG files start with 89 50 4E 47, JPEG files
// with FF D8 FF. Anything else is rejected before it reaches the output.
// Returns the format name it recognised, so callers can report it and
// compare it against what later lands on disk.
function checkImageSignature(data: Buffer): string {
  const isPng =
    data.length >= 4 &&
    data[0] === 0x89 && data[1] === 0x50 && data[2] === 0x4e && data[3] === 0x47;
  const isJpeg =
    data.length >= 3 &&
    data[0] === 0xff && data[1] === 0xd8 && data[2] === 0xff;
  if (!isPng && !isJpeg) {
    fail('entry.png has an unrecognised header: expected a PNG or JPEG signature');
  }
  return isPng ? 'PNG' : 'JPEG';
}

// Create the output directory if needed, write the bytes verbatim, and
// verify afterwards that what landed on disk is the same size. As a
// second check, the written file is read back and its header sniffed
// again: the format recognised there must match the source's format,
// so a truncated or corrupted write cannot slip through unnoticed.
function publishImage(data: Buffer, outputDir: string, format: string): string {
  mkdirSync(outputDir, { recursive: true });
  const targetPath = join(outputDir, 'entry.png');
  writeFileSync(targetPath, data);

  const written = statSync(targetPath).size;
  if (written !== data.length) {
    fail(`size mismatch after writing: source is ${data.length} bytes, output is ${written} bytes`);
  }

  const writtenFormat = checkImageSignature(readFileSync(targetPath));
  if (writtenFormat !== format) {
    fail(`format mismatch after writing: source is ${format}, output reads back as ${writtenFormat}`);
  }
  return targetPath;
}

function main(): void {
  const image = loadSourceImage();
  const format = checkImageSignature(image);
  const outputDir = resolveOutputDir();
  const targetPath = publishImage(image, outputDir, format);
  console.log(`news-image: wrote ${image.length} bytes (${format}) to ${targetPath}`);
}

main();
