import { useState } from 'react';
import { Medicine } from '../types/medicine';
import { Pill, Calculator, Pin } from 'lucide-react';
import categoryStylesJson from '../data/categoryStyles.json';

type CategoryStyle = {
  borderColor: string;
  chipBg: string;
  chipText: string;
};

const CATEGORY_STYLES = categoryStylesJson as Record<string, CategoryStyle>;

const DEFAULT_CATEGORY_STYLE: CategoryStyle = {
  borderColor: '#A7F3D0',
  chipBg: '#ECFDF5',
  chipText: '#065F46',
};

function getCategoryStyle(name: string): CategoryStyle {
  return CATEGORY_STYLES[name] ?? DEFAULT_CATEGORY_STYLE;
}

function parseCategories(raw: string): string[] {
  return raw
    .split(/[,、/／・]/)
    .map((c) => c.trim())
    .filter(Boolean);
}

function buildBorderGradient(colors: string[]): string {
  if (colors.length === 0) {
    return `linear-gradient(to right, ${DEFAULT_CATEGORY_STYLE.borderColor}, ${DEFAULT_CATEGORY_STYLE.borderColor})`;
  }
  if (colors.length === 1) {
    return `linear-gradient(to right, ${colors[0]}, ${colors[0]})`;
  }
  const [c1, c2, c3] =
    colors.length === 2 ? [colors[0], colors[1], colors[1]] : [colors[0], colors[1], colors[2]];
  return `linear-gradient(to right, ${c1}, ${c2}, ${c3})`;
}

interface MedicineCardProps {
  medicine: Medicine;
  onClick: () => void;
  weight: number;
  animalType: '犬' | '猫';
  isPinned?: boolean;
  onPinChange?: (pinned: boolean) => void;
}

export function MedicineCard({
  medicine,
  onClick,
  weight,
  animalType,
  isPinned,
  onPinChange,
}: MedicineCardProps) {
  const [internalPinned, setInternalPinned] = useState(false);
  const pinned = isPinned ?? internalPinned;
  const categoryNames = parseCategories(medicine.category);
  const categoryStyles = categoryNames.map(getCategoryStyle);
  const borderColors = categoryStyles.map((s) => s.borderColor);
  const isMultiCategory = borderColors.length > 1;

  const singleCategoryStyle = categoryStyles[0] ?? DEFAULT_CATEGORY_STYLE;

  const borderClass = isMultiCategory
    ? 'border-2 border-transparent'
    : 'border';

  const borderStyle = isMultiCategory
    ? { borderImage: `${buildBorderGradient(borderColors)} 1` }
    : { borderColor: singleCategoryStyle.borderColor };

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
      className={`bg-white rounded-lg shadow-md hover:shadow-xl transition-all cursor-pointer p-5 ${borderClass}`}
      style={borderStyle}
    >
      <div className="flex items-start gap-3 mb-3">
        <div className="bg-emerald-100 p-2 rounded-lg">
          <Pill className="text-emerald-700" size={24} />
        </div>
        <div className="flex-1 flex items-start">
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
          <button
            type="button"
            className={`ml-3 mt-0.5 rounded-full p-1.5 border transition-colors ${
              pinned
                ? 'bg-red-50 border-red-400 hover:bg-red-100'
                : 'bg-white/90 border-transparent hover:bg-emerald-50'
            }`}
            onClick={(e) => {
              e.stopPropagation();
              const next = !pinned;
              onPinChange?.(next);
              if (isPinned === undefined) {
                setInternalPinned(next);
              }
            }}
            aria-label="この薬を固定"
          >
            <Pin
              size={20}
              className={pinned ? 'text-red-600' : 'text-gray-400'}
            />
          </button>
        </div>
      </div>

      <div className="flex gap-2 mb-3">
        {categoryNames.map((name) => {
          const style = getCategoryStyle(name);
          return (
            <span
              key={name}
              className="px-2 py-1 text-xs rounded-full font-medium border"
              style={{
                backgroundColor: style.chipBg,
                color: style.chipText,
                borderColor: style.borderColor,
              }}
            >
              {name}
            </span>
          );
        })}
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