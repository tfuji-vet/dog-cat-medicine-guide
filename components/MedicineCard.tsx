import { Medicine } from '../types/medicine';
import { Pill, Calculator } from 'lucide-react';

interface MedicineCardProps {
  medicine: Medicine;
  onClick: () => void;
  weight: number;
  animalType: '犬' | '猫';
}

export function MedicineCard({ medicine, onClick, weight, animalType }: MedicineCardProps) {
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
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all cursor-pointer p-5 border border-emerald-200 hover:border-emerald-400"
    >
      <div className="flex items-start gap-3 mb-3">
        <div className="bg-emerald-100 p-2 rounded-lg">
          <Pill className="text-emerald-700" size={24} />
        </div>
        <div className="flex-1">
          <p className="text-xs text-gray-500 mb-0.5">商品名</p>
          <h3 className="font-bold text-lg text-gray-900">{medicine.name}</h3>
          {medicine.genericName && (
            <>
              <p className="text-xs text-gray-500 mt-1.5 mb-0.5">薬名</p>
              <p className="text-sm text-gray-600">{medicine.genericName}</p>
            </>
          )}
        </div>
      </div>

      <div className="flex gap-2 mb-3">
        <span className="px-2 py-1 bg-emerald-100 text-emerald-800 text-xs rounded-full font-medium">
          {medicine.category}
        </span>
        {medicine.target.map((target) => (
          <span
            key={target}
            className="px-2 py-1 bg-teal-100 text-teal-800 text-xs rounded-full font-medium"
          >
            {target}
          </span>
        ))}
      </div>

      {dosage && medicine.target.includes(animalType) && (
        <div className="mb-3 bg-gradient-to-r from-emerald-100 to-teal-100 p-3 rounded-lg border border-emerald-300">
          <div className="flex items-center gap-2 mb-1">
            <Calculator className="text-emerald-700" size={16} />
            <span className="text-xs font-semibold text-emerald-900">
              推奨投与量 ({weight}kg)
            </span>
          </div>
          <p className="text-sm text-emerald-900 font-medium">
            {dosage.min}mg - {dosage.max}mg
          </p>
          <p className="text-xs text-emerald-800">{dosage.frequency}</p>
        </div>
      )}

      <div className="mb-3">
        <p className="text-sm text-gray-600 font-semibold mb-1">適応疾患</p>
        <div className="flex flex-wrap gap-1">
          {medicine.indications.slice(0, 3).map((indication, index) => (
            <span
              key={index}
              className="text-xs bg-emerald-50 text-emerald-800 px-2 py-1 rounded border border-emerald-300"
            >
              {indication}
            </span>
          ))}
          {medicine.indications.length > 3 && (
            <span className="text-xs text-gray-500 px-2 py-1">
              +{medicine.indications.length - 3}件
            </span>
          )}
        </div>
      </div>

      <button className="text-emerald-700 text-sm font-medium hover:text-emerald-800">
        詳細を見る →
      </button>
    </div>
  );
}