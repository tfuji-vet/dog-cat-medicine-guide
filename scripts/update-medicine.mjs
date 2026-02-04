/**
 * 治療薬を 1 件更新する（data/medicines.json の id で指定した項目だけ上書き）
 * 使い方: npm run data:update -- 9 --name "新しい名前" --category "胃薬"
 * 指定したオプションだけ更新され、省略した項目はそのままです。
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_PATH = join(__dirname, '..', 'data', 'medicines.json');

function parseArg(name) {
  const i = process.argv.indexOf(name);
  if (i === -1) return undefined;
  const v = process.argv[i + 1];
  return v === undefined || v.startsWith('--') ? '' : v;
}

function main() {
  const id = process.argv[2];
  if (!id) {
    console.error('使い方: npm run data:update -- <id> [--name "名前"] [--category "カテゴリ"] ...');
    console.error('例: npm run data:update -- 8 --name "ガバペンチン（更新）"');
    process.exit(1);
  }

  const medicines = JSON.parse(readFileSync(DATA_PATH, 'utf-8'));
  const index = medicines.findIndex((m) => m.id === id);
  if (index === -1) {
    console.error('id が見つかりません:', id);
    process.exit(1);
  }

  const doc = medicines[index];
  const name = parseArg('--name');
  if (name !== undefined) doc.name = name;
  const category = parseArg('--category');
  if (category !== undefined) doc.category = category;
  const genericName = parseArg('--genericName');
  if (genericName !== undefined) doc.genericName = genericName || undefined;
  const targetStr = parseArg('--target');
  if (targetStr !== undefined) {
    doc.target = targetStr ? targetStr.split(',').map((s) => s.trim()).filter(Boolean) : [];
  }
  const dosage = parseArg('--dosage');
  if (dosage !== undefined) doc.dosage = dosage;
  const mechanism = parseArg('--mechanism');
  if (mechanism !== undefined) doc.mechanism = mechanism;
  const notes = parseArg('--notes');
  if (notes !== undefined) doc.notes = notes || undefined;
  const indications = parseArg('--indications');
  if (indications !== undefined) {
    doc.indications = indications ? indications.split(',').map((s) => s.trim()).filter(Boolean) : [];
  }
  const contraindications = parseArg('--contraindications');
  if (contraindications !== undefined) {
    doc.contraindications = contraindications ? contraindications.split(',').map((s) => s.trim()).filter(Boolean) : [];
  }
  const sideEffects = parseArg('--sideEffects');
  if (sideEffects !== undefined) {
    doc.sideEffects = sideEffects ? sideEffects.split(',').map((s) => s.trim()).filter(Boolean) : [];
  }

  writeFileSync(DATA_PATH, JSON.stringify(medicines, null, 2), 'utf-8');
  console.log('更新しました id:', id);
}

main();
