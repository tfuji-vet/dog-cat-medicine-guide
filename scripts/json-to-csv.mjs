/**
 * data/medicines.json を CSV に変換して出力する（変更者向け・UIには出さない）
 * 使い方:
 *   npm run data:export                    … 全列で出力
 *   npm run data:export -- out.csv         … 全列で out.csv に出力
 *   npm run data:export -- --id-name       … id,name のみで出力
 *   npm run data:export -- --id-name out.csv … id,name のみで out.csv に出力
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '..', 'data');
const ARRAY_SEP = '|';
const CSV_HEADER_FULL =
  'id,name,genericName,category,target,dosage,dogMin,dogMax,dogUnit,dogFreq,catMin,catMax,catUnit,catFreq,indications,mechanism,contraindications,sideEffects,notes';
const CSV_HEADER_ID_NAME = 'id,name';

function escapeCsvField(value) {
  if (value.includes(',') || value.includes('"') || value.includes('\n') || value.includes('\r')) {
    return '"' + value.replace(/"/g, '""') + '"';
  }
  return value;
}

function medicinesToCsvFull(medicines) {
  const rows = [CSV_HEADER_FULL];
  for (const m of medicines) {
    const target = (m.target ?? []).join(ARRAY_SEP);
    const indications = (m.indications ?? []).join(ARRAY_SEP);
    const contraindications = (m.contraindications ?? []).join(ARRAY_SEP);
    const sideEffects = (m.sideEffects ?? []).join(ARRAY_SEP);
    const dog = m.dosageRange?.dog;
    const cat = m.dosageRange?.cat;
    const row = [
      m.id,
      escapeCsvField(m.name ?? ''),
      escapeCsvField(m.genericName ?? ''),
      escapeCsvField(m.category ?? ''),
      escapeCsvField(target),
      escapeCsvField((m.dosage ?? '').replace(/\n/g, ' / ')),
      dog?.min ?? '',
      dog?.max ?? '',
      dog?.unit ?? '',
      dog?.frequency ?? '',
      cat?.min ?? '',
      cat?.max ?? '',
      cat?.unit ?? '',
      cat?.frequency ?? '',
      escapeCsvField(indications),
      escapeCsvField(m.mechanism ?? ''),
      escapeCsvField(contraindications),
      escapeCsvField(sideEffects),
      escapeCsvField(m.notes ?? ''),
    ].join(',');
    rows.push(row);
  }
  return '\uFEFF' + rows.join('\r\n');
}

function medicinesToCsvIdName(medicines) {
  const rows = [CSV_HEADER_ID_NAME];
  for (const m of medicines) {
    rows.push([m.id, escapeCsvField(m.name ?? '')].join(','));
  }
  return '\uFEFF' + rows.join('\r\n');
}

function main() {
  const args = process.argv.slice(2);
  const idNameOnly = args[0] === '--id-name' || args[0] === '--minimal';
  const pathArg = idNameOnly ? args[1] : args[0];

  const jsonPath = join(DATA_DIR, 'medicines.json');
  const medicines = JSON.parse(readFileSync(jsonPath, 'utf-8'));
  const csv = idNameOnly ? medicinesToCsvIdName(medicines) : medicinesToCsvFull(medicines);

  const outPath = pathArg
    ? join(process.cwd(), pathArg)
    : join(DATA_DIR, `medicines_${new Date().toISOString().slice(0, 10)}.csv`);
  writeFileSync(outPath, csv, 'utf-8');
  console.log(`${medicines.length} 件を ${idNameOnly ? 'id,name のみで' : '全列で'} ${outPath} に出力しました。`);
}

main();
