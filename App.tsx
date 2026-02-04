import { useState } from 'react';
import { SearchBar } from './components/SearchBar';
import { MedicineCard } from './components/MedicineCard';
import { MedicineDetail } from './components/MedicineDetail';
import { FilterBar } from './components/FilterBar';
import { Medicine } from './types/medicine';
import { medicineData } from './data/medicineData';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const [searchType, setSearchType] = useState<'all' | 'product' | 'name' | 'disease'>('all');
  const [weight, setWeight] = useState('');
  const [animalType, setAnimalType] = useState<'犬' | '猫'>('犬');
  const [selectedCategory, setSelectedCategory] = useState('すべて');

  const filteredMedicines = medicineData.filter((medicine) => {
    // カテゴリフィルター
    if (selectedCategory !== 'すべて' && medicine.category !== selectedCategory) {
      return false;
    }

    // 検索フィルター
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    
    if (searchType === 'name') {
      // 薬名で検索
      return (medicine.genericName?.toLowerCase().includes(query) ?? false);
    } else if (searchType === 'product') {
      // 商品名で検索
      return medicine.name.toLowerCase().includes(query);
    } else if (searchType === 'disease') {
      return medicine.indications.some(indication =>
        indication.toLowerCase().includes(query)
      );
    } else {
      // すべて: 商品名・薬名・疾患名
      return (
        medicine.name.toLowerCase().includes(query) ||
        (medicine.genericName?.toLowerCase().includes(query) ?? false) ||
        medicine.indications.some(indication =>
          indication.toLowerCase().includes(query)
        )
      );
    }
  });

  return (
    <div className="min-h-screen bg-emerald-50">
      <header className="bg-gradient-to-r from-emerald-800 to-emerald-900 shadow-lg sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-emerald-50 mb-4">🐾 犬猫治療薬ガイド</h1>
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            searchType={searchType}
            setSearchType={setSearchType}
            weight={weight}
            setWeight={setWeight}
            animalType={animalType}
            setAnimalType={setAnimalType}
          />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <FilterBar
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />

        <div className="mb-4 text-sm text-emerald-900">
          {filteredMedicines.length}件の治療薬が見つかりました
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMedicines.map((medicine) => (
            <MedicineCard
              key={medicine.id}
              medicine={medicine}
              onClick={() => setSelectedMedicine(medicine)}
              weight={parseFloat(weight) || 0}
              animalType={animalType}
            />
          ))}
        </div>

        {filteredMedicines.length === 0 && (
          <div className="text-center py-12">
            <p className="text-emerald-800">検索条件に一致する治療薬が見つかりませんでした</p>
          </div>
        )}
      </main>

      {selectedMedicine && (
        <MedicineDetail
          medicine={selectedMedicine}
          onClose={() => setSelectedMedicine(null)}
          weight={parseFloat(weight) || 0}
          animalType={animalType}
        />
      )}
    </div>
  );
}