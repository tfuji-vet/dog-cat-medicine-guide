export interface Medicine {
  id: string;
  /** 商品名（日本語） */
  name: string;
  /** 薬名（日本語） */
  genericName?: string;
  category: string;
  target: ('犬' | '猫')[];
  dosage: string;
  dosageRange: {
    dog?: { min: number; max: number; unit: string; frequency: string };
    cat?: { min: number; max: number; unit: string; frequency: string };
  };
  indications: string[];
  mechanism: string;
  contraindications: string[];
  sideEffects: string[];
  notes?: string;
}