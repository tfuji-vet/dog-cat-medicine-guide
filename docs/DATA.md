# 治療薬データの扱い方

## 1. データだけ取ってくる方法

### アプリ内（TypeScript/React）

**治療薬一覧だけ使う場合**

```ts
import { medicineData } from './data/medicineData';
// または JSON を直接
import medicines from './data/medicines.json';
```

**カテゴリ一覧だけ使う場合**

```ts
import { categories } from './data/medicineData';
// または
import categories from './data/categories.json';
```

**型付きで使う場合**

```ts
import type { Medicine } from './types/medicine';
import { medicineData } from './data/medicineData';

const list: Medicine[] = medicineData;
```

### コマンドライン・他ツールで JSON だけ欲しい場合

- 治療薬: `data/medicines.json` をそのまま開く（配列の JSON）
- カテゴリ: `data/categories.json` をそのまま開く（文字列の配列）

---

## 2. CSV のエクスポート・インポート（変更者のみ・UIには出さない）

CSV のダウンロードや反映は **画面上には出しません**。変更ができる人だけが、次のコマンドで行います。

### CSV エクスポート（JSON → CSV）

```bash
npm run data:export
```

- `data/medicines.json` を CSV に変換し、`data/medicines_YYYY-MM-DD.csv` に出力します。
- 出力先を指定: `npm run data:export -- 出力パス.csv`
- **id と name のみ**で出力: `npm run data:export -- --id-name` または `npm run data:export -- --id-name 出力パス.csv`

### CSV インポート（CSV → JSON に反映）

- **全19列の CSV** … そのまま取り込み。
- **id と name の2列のみの CSV** … その2列でレコードを作成し、他は空で取り込み（後から JSON や全列 CSV で追記可能）。

1. 編集した CSV を保存する（例: `data/medicines_import.csv`）。
2. 次を実行して `data/medicines.json` を上書きする。

```bash
npm run data:import -- data/medicines_import.csv
```

3. ファイルパスを省略すると `data/medicines_import.csv` を参照する。
4. その後、アプリを再読み込みするか `npm run dev` で起動し直すと、新しい JSON が読み込まれる。MongoDB を使う場合は `npm run seed:mongo` で DB にも反映できる。

---

## 3. 追加・削除・更新の方法

### 方法A: JSON を直接編集する

| 操作 | やり方 |
|------|--------|
| **追加** | `data/medicines.json` の配列に、既存と同じ形式のオブジェクトを 1 件追加する。`id` は既存と重ならない番号（例: `"9"`）にする。 |
| **削除** | `data/medicines.json` から該当の薬オブジェクトを丸ごと削除する。 |
| **更新** | `data/medicines.json` 内の該当オブジェクトのプロパティを書き換える。 |

編集後はファイルを保存するだけ。開発サーバー（`npm run dev`）を動かしていれば、多くの場合そのまま画面に反映されます（反映されない場合はブラウザをリロード）。

**1件の薬のフォーマット例**（`name`＝商品名・`genericName`＝薬名、いずれも日本語）

```json
{
  "id": "9",
  "name": "商品名（例: サワシリン）",
  "genericName": "薬名（例: アモキシシリン）",
  "category": "抗生物質",
  "target": ["犬", "猫"],
  "dosage": "犬: 〇mg/kg 1日〇回\n猫: 〇mg/kg 1日〇回",
  "dosageRange": {
    "dog": { "min": 0, "max": 0, "unit": "mg/kg", "frequency": "1日1回" },
    "cat": { "min": 0, "max": 0, "unit": "mg/kg", "frequency": "1日1回" }
  },
  "indications": ["適応1", "適応2"],
  "mechanism": "作用機序の説明",
  "contraindications": ["禁忌1"],
  "sideEffects": ["副作用1"],
  "notes": "備考（任意）"
}
```

### 方法B: スクリプトで操作する（推奨）

| 操作 | コマンド |
|------|----------|
| **追加** | `npm run data:add -- --name "商品名" --category "抗生物質" [--genericName "薬名"]` |
| **削除** | `npm run data:delete -- 9` （id を指定） |
| **更新** | `npm run data:update -- 9 --name "新しい商品名"` （id と変更したい項目を指定） |
| **CSV から JSON へ反映** | `npm run data:import -- [CSVファイルパス]` （省略時は `data/medicines_import.csv`） |

詳細は各スクリプトのヘルプを参照（後述）。

---

## 4. 反映の仕方

### 画面への反映

- **開発中（`npm run dev`）**: JSON を保存すると、Vite がファイル変更を検知して再読み込みし、画面に反映されます。反映されない場合はブラウザを **再読み込み（F5）** してください。
- **ビルド後（`npm run build`）**: JSON を書き換えたあと、もう一度 `npm run build` すると、新しいデータが含まれた静的ファイルができます。そのファイルを配布・デプロイすれば反映されます。

### MongoDB への反映（MongoDB を使う場合）

- データの「正」は **JSON ファイル** です。JSON を編集 or スクリプトで追加・削除・更新したあと、MongoDB に同じ内容を入れ直すには次を実行します。

```bash
npm run seed:mongo
```

- これで `data/medicines.json` と `data/categories.json` の内容が、MongoDB の `dog-cat-medicine-guide`  DB に投入されます（既存の medicines / categories はいったん消してから投入されます）。

**手順の流れ**

1. JSON を編集する、または `npm run data:add` / `data:delete` / `data:update` で変更する  
2. 画面を確認したい → ブラウザをリロード（必要なら `npm run dev` のまま）  
3. MongoDB も同じ内容にしたい → `npm run seed:mongo` を実行する  

---

## 5. カテゴリの追加・削除

- ファイル: `data/categories.json`
- 形式: `["すべて", "抗生物質", "ステロイド", ...]` という **文字列の配列**
- **追加**: 配列に新しい文字列を 1 個足す（先頭の `"すべて"` は残すことを推奨）
- **削除**: 配列から該当の文字列を 1 個削除する
- 反映: 保存後、画面をリロード。MongoDB を使う場合は `npm run seed:mongo` で DB に反映されます。
