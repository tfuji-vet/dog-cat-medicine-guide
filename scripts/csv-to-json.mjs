/**
 * CSV ファイルを読み、data/medicines.json に書き出す
 * 対応形式:
 *   - 全19列 … そのまま取り込み
 *   - id,name の2列のみ … その2列でレコード作成（他は空）
 * 使い方: npm run data:import -- data/medicines_2026-02-04.import.csv
 * または: npm run data:import -- medicines_2026-02-04.import.csv （data/ から探す）
 * 省略時は data/medicines_import.csv を参照
 */
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname, basename } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '..', 'data');
const ARRAY_SEP = '|';

/** 引数で指定された CSV の実在パスを返す。見つからなければ null */
function resolveCsvPath(arg) {
  if (!arg || typeof arg !== 'string') return null;
  const cwd = process.cwd();
  const candidates = [
    join(cwd, arg),
    join(DATA_DIR, arg),
    join(DATA_DIR, basename(arg)),
    arg,
  ];
  for (const p of candidates) {
    if (existsSync(p)) return p;
  }
  return null;
}

function parseCsvLine(line) {
  const result = [];
  let i = 0;
  while (i < line.length) {
    if (line[i] === '"') {
      let s = '';
      i++;
      while (i < line.length) {
        if (line[i] === '"') {
          if (line[i + 1] === '"') {
            s += '"';
            i += 2;
          } else {
            i++;
            break;
          }
        } else {
          s += line[i];
          i++;
        }
      }
      result.push(s);
    } else {
      let s = '';
      while (i < line.length && line[i] !== ',') {
        s += line[i];
        i++;
      }
      result.push(s);
      if (i < line.length) i++;
    }
  }
  return result;
}

function parseNum(v) {
  const n = Number(v);
  return Number.isNaN(n) ? 0 : n;
}

function emptyMedicine(id, name) {
  return {
    id: (id ?? '').trim() || '',
    name: (name ?? '').trim() || '',
    genericName: undefined,
    category: '',
    target: [],
    dosage: '',
    dosageRange: { dog: undefined, cat: undefined },
    indications: [],
    mechanism: '',
    contraindications: [],
    sideEffects: [],
    notes: undefined,
  };
}

function parseCsvToMedicines(csvText) {
  const raw = csvText.replace(/^\uFEFF/, '');
  const lines = raw.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) return [];
  const medicines = [];
  for (let i = 1; i < lines.length; i++) {
    let cols = parseCsvLine(lines[i]);
    if (cols.length < 2) {
      console.warn(`[${i + 1}行目] 列数が2未満のためスキップしました: ${cols.length}列`);
      continue;
    }
    const id = (cols[0] ?? '').trim();
    const name = (cols[1] ?? '').trim();
    if (!id && !name) {
      console.warn(`[${i + 1}行目] id と name が両方空のためスキップしました`);
      continue;
    }
    if (cols.length >= 15) {
      while (cols.length < 19) cols.push('');
      const [
        _id,
        _name,
        genericName,
        category,
        targetStr,
        dosage,
        dogMin,
        dogMax,
        dogUnit,
        dogFreq,
        catMin,
        catMax,
        catUnit,
        catFreq,
        indicationsStr,
        mechanism,
        contraindicationsStr,
        sideEffectsStr,
        notes,
      ] = cols;
      const target = targetStr ? targetStr.split(ARRAY_SEP).map((s) => s.trim()).filter(Boolean) : [];
      const indications = indicationsStr ? indicationsStr.split(ARRAY_SEP).map((s) => s.trim()).filter(Boolean) : [];
      const contraindications = contraindicationsStr
        ? contraindicationsStr.split(ARRAY_SEP).map((s) => s.trim()).filter(Boolean)
        : [];
      const sideEffects = sideEffectsStr ? sideEffectsStr.split(ARRAY_SEP).map((s) => s.trim()).filter(Boolean) : [];
      medicines.push({
        id: id || String(i),
        name: name || '',
        genericName: (genericName ?? '').trim() || undefined,
        category: (category ?? '').trim(),
        target,
        dosage: (dosage ?? '').trim().replace(/\s*\/\s*/g, '\n'),
        dosageRange: {
          dog:
            dogMin !== '' || dogMax !== ''
              ? { min: parseNum(dogMin), max: parseNum(dogMax), unit: (dogUnit ?? '').trim() || 'mg/kg', frequency: (dogFreq ?? '').trim() }
              : undefined,
          cat:
            catMin !== '' || catMax !== ''
              ? { min: parseNum(catMin), max: parseNum(catMax), unit: (catUnit ?? '').trim() || 'mg/kg', frequency: (catFreq ?? '').trim() }
              : undefined,
        },
        indications,
        mechanism: (mechanism ?? '').trim(),
        contraindications,
        sideEffects,
        notes: (notes ?? '').trim() || undefined,
      });
    } else {
      medicines.push(emptyMedicine(id || String(i), name));
    }
  }
  return medicines;
}

function main() {
  const arg = process.argv[2];
  const csvPath = arg ? resolveCsvPath(arg) : (existsSync(join(DATA_DIR, 'medicines_import.csv')) ? join(DATA_DIR, 'medicines_import.csv') : null);
  const jsonPath = join(DATA_DIR, 'medicines.json');

  if (!csvPath) {
    const tried = arg
      ? `指定: ${arg} → ${join(process.cwd(), arg)}, ${join(DATA_DIR, arg)}, ${join(DATA_DIR, basename(arg))}`
      : `省略時: ${join(DATA_DIR, 'medicines_import.csv')}`;
    console.error('CSV ファイルが見つかりません。');
    console.error('  npm run data:import -- data/medicines_2026-02-04.import.csv');
    console.error('  試したパス:', tried);
    process.exit(1);
  }

  console.log('読み込み:', csvPath);
  const csvText = readFileSync(csvPath, 'utf-8');
  const medicines = parseCsvToMedicines(csvText);
  if (medicines.length === 0) {
    console.error('CSV から読み取れたデータがありません。ヘッダー行と1行以上のデータが必要です。');
    process.exit(1);
  }

  writeFileSync(jsonPath, JSON.stringify(medicines, null, 2), 'utf-8');
  console.log(`${medicines.length} 件を ${jsonPath} に書き込みました。`);
}

main();
