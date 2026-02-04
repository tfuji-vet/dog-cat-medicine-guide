import { useEffect, useState } from 'react';
import { SearchBar } from './components/SearchBar';
import { MedicineCard } from './components/MedicineCard';
import { MedicineDetail } from './components/MedicineDetail';
import { FilterBar } from './components/FilterBar';
import { Medicine } from './types/medicine';
import { medicineData } from './data/medicineData';
import { Pill } from 'lucide-react';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const [searchType, setSearchType] = useState<'all' | 'product' | 'name' | 'disease'>('all');
  const [weight, setWeight] = useState('');
  const [animalType, setAnimalType] = useState<'犬' | '猫'>('犬');
  const [selectedCategory, setSelectedCategory] = useState('すべて');
  const [isCompactHeader, setIsCompactHeader] = useState(false);
  const [pinnedIds, setPinnedIds] = useState<string[]>([]);
  const [isPinnedPopupOpen, setIsPinnedPopupOpen] = useState(false);

  useEffect(() => {
    let timeoutId: number | null = null;

    const updateCompactState = () => {
      const y = window.scrollY;
      // ほぼ最上部（20px 未満）まで戻ったらだけヘッダーを広げる
      setIsCompactHeader(y > 20);
    };

    const handleScroll = () => {
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }
      // スクロールが止まってから 400ms 後に状態を判定する（ゆっくり切り替え）
      timeoutId = window.setTimeout(updateCompactState, 400);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // 初期状態も現在のスクロール位置から判定
    updateCompactState();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }
    };
  }, []);

  // ピン付きの薬がゼロになったらポップアップを自動で閉じる
  useEffect(() => {
    if (isPinnedPopupOpen && pinnedIds.length === 0) {
      setIsPinnedPopupOpen(false);
    }
  }, [isPinnedPopupOpen, pinnedIds]);

  const parseCategories = (category: string): string[] => {
    return category
      .split(/[,、/／・]/)
      .map((c) => c.trim())
      .filter(Boolean);
  };

  const filteredMedicines = medicineData.filter((medicine) => {
    // カテゴリフィルター
    if (selectedCategory !== 'すべて') {
      const categories = parseCategories(medicine.category);
      if (!categories.includes(selectedCategory)) {
        return false;
      }
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

  const handlePinChange = (id: string, pinned: boolean) => {
    setPinnedIds((prev) => {
      if (pinned) {
        if (prev.includes(id)) return prev;
        return [...prev, id];
      }
      return prev.filter((x) => x !== id);
    });
  };

  return (
    <div className="min-h-screen bg-emerald-50">
      <header className="bg-gradient-to-r from-emerald-800 to-emerald-900 shadow-lg sticky top-0 z-10">
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-300 ${isCompactHeader ? 'py-2' : 'py-4'}`}>
          <div className="flex items-start justify-between mb-2">
            <h1
              className={`text-2xl font-bold text-emerald-50 transition-all duration-300 ${
                isCompactHeader ? 'text-lg' : 'text-2xl'
              }`}
            >
              🐾 犬猫治療薬ガイド
            </h1>
            <button
              type="button"
              className="flex items-center gap-2 rounded-full bg-emerald-900/40 px-3 py-1.5 hover:bg-emerald-800/60 cursor-pointer"
              onClick={() => {
                if (pinnedIds.length > 0) {
                  setIsPinnedPopupOpen(true);
                }
              }}
            >
              {pinnedIds.length > 0 && (
                <span className="text-lg font-bold text-emerald-50 min-w-[28px] text-center">
                  {pinnedIds.length}
                </span>
              )}
              <div className="flex items-center justify-center w-11 h-11 rounded-full bg-emerald-950/40">
                <Pill className="text-emerald-100" size={26} />
              </div>
            </button>
          </div>
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            searchType={searchType}
            setSearchType={setSearchType}
            weight={weight}
            setWeight={setWeight}
            animalType={animalType}
            setAnimalType={setAnimalType}
            compact={isCompactHeader}
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
              isPinned={pinnedIds.includes(medicine.id)}
              onPinChange={(pinned) => handlePinChange(medicine.id, pinned)}
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

      {/* ピン付きの薬をまとめて表示する中央ポップアップ（ヘッダーの上にかぶせる） */}
      {isPinnedPopupOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4"
          onClick={() => setIsPinnedPopupOpen(false)}
        >
          <div
            className="max-w-5xl w-full bg-white rounded-lg shadow-xl border border-emerald-200 p-4 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-emerald-900">
                ピン付きの薬（{pinnedIds.length}件）
              </h2>
              <button
                type="button"
                className="text-xs text-gray-500 hover:text-emerald-800"
                onClick={() => setIsPinnedPopupOpen(false)}
              >
                閉じる
              </button>
            </div>
            {pinnedIds.length === 0 ? (
              <p className="text-xs text-gray-500">
                ピンが付いた薬がありません。カード右上のピンをタップして追加できます。
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pinnedIds
                  .map((id) => medicineData.find((m) => m.id === id))
                  .filter((m): m is Medicine => Boolean(m))
                  .map((medicine) => (
                    <MedicineCard
                      key={medicine.id}
                      medicine={medicine}
                      onClick={() => {
                        setSelectedMedicine(medicine);
                        setIsPinnedPopupOpen(false);
                      }}
                      weight={parseFloat(weight) || 0}
                      animalType={animalType}
                      isPinned={pinnedIds.includes(medicine.id)}
                      onPinChange={(pinned) => handlePinChange(medicine.id, pinned)}
                    />
                  ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}