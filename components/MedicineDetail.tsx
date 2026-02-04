import { Medicine } from '../types/medicine';
import { X, Pill, AlertTriangle, Info, Activity, Calculator } from 'lucide-react';

interface MedicineDetailProps {
  medicine: Medicine;
  onClose: () => void;
  weight: number;
  animalType: '犬' | '猫';
}

export function MedicineDetail({ medicine, onClose, weight, animalType }: MedicineDetailProps) {
  const getDosageCalculation = () => {
    if (weight <= 0) return null;
    
    const range = animalType === '犬' ? medicine.dosageRange.dog : medicine.dosageRange.cat;
    if (!range) return null;
    
    const minDose = (range.min * weight).toFixed(2);
    const maxDose = (range.max * weight).toFixed(2);
    
    return {
      min: minDose,
      max: maxDose,
      frequency: range.frequency
    };
  };

  const dosage = getDosageCalculation();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border-2 border-emerald-300">
        <div className="sticky top-0 bg-gradient-to-r from-emerald-800 to-emerald-900 border-b border-emerald-900 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white p-2 rounded-lg">
              <Pill className="text-emerald-700" size={24} />
            </div>
            <div>
              <p className="text-xs text-emerald-200 mb-0.5">商品名</p>
              <h2 className="text-2xl font-bold text-white">{medicine.name}</h2>
              {medicine.genericName && (
                <>
                  <p className="text-xs text-emerald-200 mt-2 mb-0.5">薬名</p>
                  <p className="text-sm text-emerald-100">{medicine.genericName}</p>
                </>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-emerald-900 rounded-lg transition-colors text-white"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* 対象動物・分類 */}
          <div>
            <div className="flex gap-2 mb-4">
              <span className="px-3 py-1.5 bg-emerald-100 text-emerald-800 text-sm font-medium rounded-full border border-emerald-400">
                {medicine.category}
              </span>
              {medicine.target.map((target) => (
                <span
                  key={target}
                  className="px-3 py-1.5 bg-teal-100 text-teal-800 text-sm font-medium rounded-full border border-teal-400"
                >
                  {target}
                </span>
              ))}
            </div>
          </div>

          {/* 投与量計算結果 */}
          {dosage && medicine.target.includes(animalType) && (
            <div className="bg-gradient-to-r from-emerald-100 to-teal-100 p-5 rounded-lg border-2 border-emerald-400 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Calculator className="text-emerald-700" size={24} />
                <h3 className="font-bold text-emerald-900 text-lg">
                  推奨投与量計算 ({animalType} {weight}kg)
                </h3>
              </div>
              <div className="bg-white p-4 rounded-lg border border-emerald-300">
                <p className="text-2xl font-bold text-emerald-900 mb-2">
                  {dosage.min}mg - {dosage.max}mg
                </p>
                <p className="text-sm text-emerald-800 font-medium">{dosage.frequency}</p>
              </div>
              <p className="text-xs text-emerald-800 mt-2">
                ※この投与量は目安です。必ず獣医師の指示に従ってください。
              </p>
            </div>
          )}

          {/* 用法・用量 */}
          <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-300">
            <div className="flex items-center gap-2 mb-2">
              <Pill className="text-emerald-700" size={20} />
              <h3 className="font-bold text-emerald-900">用法・用量</h3>
            </div>
            <p className="text-gray-700 whitespace-pre-line">{medicine.dosage}</p>
          </div>

          {/* 適応疾患 */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Info className="text-emerald-700" size={20} />
              <h3 className="font-bold text-emerald-900">適応疾患</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {medicine.indications.map((indication, index) => (
                <span
                  key={index}
                  className="bg-emerald-100 text-emerald-800 px-3 py-1.5 rounded-lg text-sm border border-emerald-400"
                >
                  {indication}
                </span>
              ))}
            </div>
          </div>

          {/* 作用機序 */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Activity className="text-teal-700" size={20} />
              <h3 className="font-bold text-emerald-900">作用機序</h3>
            </div>
            <p className="text-gray-700 leading-relaxed">{medicine.mechanism}</p>
          </div>

          {/* 禁忌 */}
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="text-red-600" size={20} />
              <h3 className="font-bold text-gray-900">禁忌</h3>
            </div>
            <ul className="space-y-2">
              {medicine.contraindications.map((contraindication, index) => (
                <li key={index} className="flex items-start gap-2 text-gray-700">
                  <span className="text-red-600 mt-1">•</span>
                  <span>{contraindication}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 副作用 */}
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="text-yellow-600" size={20} />
              <h3 className="font-bold text-gray-900">副作用</h3>
            </div>
            <ul className="space-y-2">
              {medicine.sideEffects.map((sideEffect, index) => (
                <li key={index} className="flex items-start gap-2 text-gray-700">
                  <span className="text-yellow-600 mt-1">•</span>
                  <span>{sideEffect}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 注意事項 */}
          {medicine.notes && (
            <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-300">
              <div className="flex items-center gap-2 mb-2">
                <Info className="text-emerald-700" size={20} />
                <h3 className="font-bold text-emerald-900">注意事項</h3>
              </div>
              <p className="text-gray-700">{medicine.notes}</p>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 bg-emerald-50 px-6 py-4 border-t border-emerald-300">
          <button
            onClick={onClose}
            className="w-full bg-emerald-700 text-white py-3 rounded-lg font-medium hover:bg-emerald-800 transition-colors shadow-md"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
}