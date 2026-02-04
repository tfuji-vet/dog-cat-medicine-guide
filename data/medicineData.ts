import type { Medicine } from '../types/medicine';

// データの正は JSON（MongoDB 投入・mongoimport 兼用）
import medicinesJson from './medicines.json';
import categoriesJson from './categories.json';

export const medicineData: Medicine[] = medicinesJson as Medicine[];
export const categories: string[] = categoriesJson as string[];