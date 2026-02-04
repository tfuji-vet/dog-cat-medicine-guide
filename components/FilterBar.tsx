import { Filter } from 'lucide-react';
import { categories } from '../data/medicineData';

interface FilterBarProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

export function FilterBar({ selectedCategory, setSelectedCategory }: FilterBarProps) {
  return (
    <div className="mb-6 bg-white p-4 rounded-lg shadow-md border border-emerald-200">
      <div className="flex items-center gap-2 mb-3">
        <Filter className="text-emerald-700" size={20} />
        <span className="font-semibold text-emerald-900">薬剤分類</span>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedCategory === category
                ? 'bg-emerald-700 text-white shadow-md'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-300'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}