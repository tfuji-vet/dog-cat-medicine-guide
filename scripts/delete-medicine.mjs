/**
 * 治療薬を 1 件削除する（data/medicines.json から id で削除）
 * 使い方: npm run data:delete -- 3   （id が "3" の薬を削除）
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_PATH = join(__dirname, '..', 'data', 'medicines.json');

function main() {
  const id = process.argv[2];
  if (!id) {
    console.error('使い方: npm run data:delete -- <id>');
    console.error('例: npm run data:delete -- 8');
    process.exit(1);
  }

  const medicines = JSON.parse(readFileSync(DATA_PATH, 'utf-8'));
  const before = medicines.length;
  const next = medicines.filter((m) => m.id !== id);
  if (next.length === before) {
    console.error('id が見つかりません:', id);
    process.exit(1);
  }

  writeFileSync(DATA_PATH, JSON.stringify(next, null, 2), 'utf-8');
  console.log('削除しました id:', id);
}

main();
