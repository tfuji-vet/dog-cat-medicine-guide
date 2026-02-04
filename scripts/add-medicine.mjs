/**
 * 治療薬を 1 件追加する（data/medicines.json に追記）
 * 使い方: npm run data:add -- --name "商品名" --category "抗生物質" [--genericName "薬名"]
 * name=商品名、genericName=薬名（いずれも日本語）
 * 省略した項目は空または既定値で入ります。あとで JSON を直接編集するか data:update で更新できます。
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_PATH = join(__dirname, '..', 'data', 'medicines.json');

function parseArg(name) {
  const i = process.argv.indexOf(name);
  if (i === -1) return null;
  const v = process.argv[i + 1];
  return v === undefined || v.startsWith('--') ? '' : v;
}

function main() {
  const name = parseArg('--name');
  const category = parseArg('--category');
  if (!name || !category) {
    console.error('使い方: npm run data:add -- --name "商品名" --category "カテゴリ" [--genericName "薬名"]');
    console.error('例: npm run data:add -- --name "サワシリン" --category "抗生物質" --genericName "アモキシシリン"');
    process.exit(1);
  }

  const medicines = JSON.parse(readFileSync(DATA_PATH, 'utf-8'));
  const maxId = Math.max(0, ...medicines.map((m) => parseInt(m.id, 10) || 0));
  const newId = String(maxId + 1);

  const targetStr = parseArg('--target');
  const target = targetStr ? targetStr.split(',').map((s) => s.trim()).filter(Boolean) : ['犬', '猫'];

  const newMedicine = {
    id: newId,
    name,
    genericName: parseArg('--genericName') || undefined, // 薬名（日本語）
    category,
    target,
    dosage: parseArg('--dosage') || `犬: 要追記\n猫: 要追記`,
    dosageRange: {
      dog: { min: 0, max: 0, unit: 'mg/kg', frequency: '要追記' },
      cat: { min: 0, max: 0, unit: 'mg/kg', frequency: '要追記' },
    },
    indications: (parseArg('--indications') || '').split(',').map((s) => s.trim()).filter(Boolean),
    mechanism: parseArg('--mechanism') || '要追記',
    contraindications: (parseArg('--contraindications') || '').split(',').map((s) => s.trim()).filter(Boolean),
    sideEffects: (parseArg('--sideEffects') || '').split(',').map((s) => s.trim()).filter(Boolean),
    notes: parseArg('--notes') || undefined,
  };

  medicines.push(newMedicine);
  writeFileSync(DATA_PATH, JSON.stringify(medicines, null, 2), 'utf-8');
  console.log('追加しました id:', newId, 'name:', name);
}

main();
