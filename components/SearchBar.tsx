import { Search, Weight } from 'lucide-react';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchType: 'all' | 'product' | 'name' | 'disease';
  setSearchType: (type: 'all' | 'product' | 'name' | 'disease') => void;
  weight: string;
  setWeight: (weight: string) => void;
  animalType: '犬' | '猫';
  setAnimalType: (type: '犬' | '猫') => void;
}

export function SearchBar({ 
  searchQuery, 
  setSearchQuery, 
  searchType, 
  setSearchType,
  weight,
  setWeight,
  animalType,
  setAnimalType
}: SearchBarProps) {
  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="商品名・薬名・疾患名で検索..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-white border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
        />
      </div>
      
      <div className="flex gap-2">
        <button
          onClick={() => setSearchType('all')}
          className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
            searchType === 'all'
              ? 'bg-emerald-700 text-white shadow-md'
              : 'bg-white text-emerald-800 hover:bg-emerald-100 border border-emerald-300'
          }`}
        >
          すべて
        </button>
        <button
          onClick={() => setSearchType('product')}
          className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
            searchType === 'product'
              ? 'bg-emerald-700 text-white shadow-md'
              : 'bg-white text-emerald-800 hover:bg-emerald-100 border border-emerald-300'
          }`}
        >
          商品名
        </button>
        <button
          onClick={() => setSearchType('name')}
          className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
            searchType === 'name'
              ? 'bg-emerald-700 text-white shadow-md'
              : 'bg-white text-emerald-800 hover:bg-emerald-100 border border-emerald-300'
          }`}
        >
          薬名
        </button>
        <button
          onClick={() => setSearchType('disease')}
          className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
            searchType === 'disease'
              ? 'bg-emerald-700 text-white shadow-md'
              : 'bg-white text-emerald-800 hover:bg-emerald-100 border border-emerald-300'
          }`}
        >
          疾患名
        </button>
      </div>

      <div className="bg-white border border-emerald-300 rounded-lg p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <Weight className="text-emerald-700" size={20} />
          <span className="font-semibold text-emerald-900">投与量計算</span>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-emerald-800 mb-1">対象動物</label>
            <div className="flex gap-2">
              <button
                onClick={() => setAnimalType('犬')}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  animalType === '犬'
                    ? 'bg-emerald-700 text-white shadow-md'
                    : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-300'
                }`}
              >
                🐕 犬
              </button>
              <button
                onClick={() => setAnimalType('猫')}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  animalType === '猫'
                    ? 'bg-emerald-700 text-white shadow-md'
                    : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-300'
                }`}
              >
                🐱 猫
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm text-emerald-800 mb-1">体重 (kg)</label>
            <input
              type="number"
              placeholder="例: 5.5"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              min="0"
              step="0.1"
              className="w-full px-4 py-2 bg-white border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}