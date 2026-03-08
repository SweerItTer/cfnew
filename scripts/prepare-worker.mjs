import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SOURCE_FILE = '少年你相信光吗';
const OUTPUT_FILE = '_worker.js';

export async function prepareWorker(options = {}) {
  const rootDir = options.rootDir ?? path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const sourcePath = path.join(rootDir, SOURCE_FILE);
  const outputPath = path.join(rootDir, OUTPUT_FILE);

  try {
    await fs.access(sourcePath);
  } catch {
    throw new Error(`Source worker file not found: ${sourcePath}`);
  }

  const contents = await fs.readFile(sourcePath, 'utf8');
  await fs.writeFile(outputPath, contents, 'utf8');
  return outputPath;
}

async function main() {
  const outputPath = await prepareWorker();
  console.log(`Prepared Cloudflare Worker entry: ${outputPath}`);
}

const currentFilePath = fileURLToPath(import.meta.url);

if (process.argv[1] && path.resolve(process.argv[1]) === currentFilePath) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
