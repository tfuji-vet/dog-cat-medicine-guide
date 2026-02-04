import type { Medicine } from '../types/medicine';

const ARRAY_SEP = '|';
const CSV_HEADER =
  'id,name,genericName,category,target,dosage,dogMin,dogMax,dogUnit,dogFreq,catMin,catMax,catUnit,catFreq,indications,mechanism,contraindications,sideEffects,notes';

function escapeCsvField(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n') || value.includes('\r')) {
    return '"' + value.replace(/"/g, '""') + '"';
  }
  return value;
}

/** 治療薬一覧を CSV 文字列に変換（1行目はヘッダー） */
export function medicinesToCsv(medicines: Medicine[]): string {
  const rows = [CSV_HEADER];
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
  return rows.join('\r\n');
}

/** CSV 1行をパース（ダブルクォート・カンマ対応） */
function parseCsvLine(line: string): string[] {
  const result: string[] = [];
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

function parseNum(v: string): number {
  const n = Number(v);
  return Number.isNaN(n) ? 0 : n;
}

/** CSV 文字列を治療薬配列に変換（1行目はヘッダーとしてスキップ） */
export function parseCsvToMedicines(csvText: string): Medicine[] {
  const lines = csvText.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) return [];
  const medicines: Medicine[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = parseCsvLine(lines[i]);
    if (cols.length < 19) continue;
    const [id, name, genericName, category, targetStr, dosage, dogMin, dogMax, dogUnit, dogFreq, catMin, catMax, catUnit, catFreq, indicationsStr, mechanism, contraindicationsStr, sideEffectsStr, notes] = cols;
    const target = targetStr ? targetStr.split(ARRAY_SEP).map((s) => s.trim()).filter(Boolean) : [];
    const indications = indicationsStr ? indicationsStr.split(ARRAY_SEP).map((s) => s.trim()).filter(Boolean) : [];
    const contraindications = contraindicationsStr ? contraindicationsStr.split(ARRAY_SEP).map((s) => s.trim()).filter(Boolean) : [];
    const sideEffects = sideEffectsStr ? sideEffectsStr.split(ARRAY_SEP).map((s) => s.trim()).filter(Boolean) : [];
    medicines.push({
      id: (id ?? '').trim() || String(i),
      name: (name ?? '').trim(),
      genericName: (genericName ?? '').trim() || undefined,
      category: (category ?? '').trim(),
      target: target as ('犬' | '猫')[],
      dosage: (dosage ?? '').trim().replace(/\s*\/\s*/g, '\n'),
      dosageRange: {
        dog: dogMin !== '' || dogMax !== '' ? { min: parseNum(dogMin), max: parseNum(dogMax), unit: (dogUnit ?? '').trim() || 'mg/kg', frequency: (dogFreq ?? '').trim() } : undefined,
        cat: catMin !== '' || catMax !== '' ? { min: parseNum(catMin), max: parseNum(catMax), unit: (catUnit ?? '').trim() || 'mg/kg', frequency: (catFreq ?? '').trim() } : undefined,
      },
      indications,
      mechanism: (mechanism ?? '').trim(),
      contraindications,
      sideEffects,
      notes: (notes ?? '').trim() || undefined,
    });
  }
  return medicines;
}
