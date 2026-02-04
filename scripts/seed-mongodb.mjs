/**
 * MongoDB に medicines.json / categories.json のデータを投入するスクリプト
 * 使い方: MongoDB を起動した状態で npm run seed:mongo
 * 接続先: MONGODB_URI または既定で mongodb://localhost:27017/dog-cat-medicine-guide
 */
import { MongoClient } from 'mongodb';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_NAME = 'dog-cat-medicine-guide';
const URI = process.env.MONGODB_URI || `mongodb://localhost:27017`;

async function main() {
  const medicinesPath = join(__dirname, '..', 'data', 'medicines.json');
  const categoriesPath = join(__dirname, '..', 'data', 'categories.json');

  const medicines = JSON.parse(readFileSync(medicinesPath, 'utf-8'));
  const categories = JSON.parse(readFileSync(categoriesPath, 'utf-8'));

  const client = new MongoClient(URI);
  try {
    await client.connect();
    const db = client.db(DB_NAME);

    const medicinesCol = db.collection('medicines');
    await medicinesCol.deleteMany({});
    const resultMedicines = await medicinesCol.insertMany(
      medicines.map((doc) => ({ ...doc, _id: doc.id }))
    );
    console.log(`medicines: ${resultMedicines.insertedCount} 件投入`);

    const categoriesCol = db.collection('categories');
    await categoriesCol.deleteMany({});
    await categoriesCol.insertOne({ _id: 'default', categories });
    console.log('categories: 1 件投入');

    console.log('MongoDB シード完了:', DB_NAME);
  } finally {
    await client.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
