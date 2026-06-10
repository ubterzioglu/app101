// Sigorta seçim aracı tipleri. Ported from web sigorta-secim/types.ts.

export interface InsuranceType {
  key: string;
  title: string;
  base: number;
  mustAt: number;
  shouldAt: number;
  reasons: string[];
}

export interface Provider {
  name: string;
  desc: string;
  url: string;
}

export interface InsuranceOption {
  key: string;
  label: string;
  desc: string;
  add?: Record<string, number>;
}

export interface InsuranceQuestion {
  id: string;
  title: string;
  desc: string;
  type: 'single' | 'yesno';
  options?: InsuranceOption[];
  weight?: Record<string, Record<string, number>>;
}

export interface ScoredInsurance extends InsuranceType {
  score: number;
}

export interface ClassifiedInsurance {
  must: ScoredInsurance[];
  should: ScoredInsurance[];
  nice: ScoredInsurance[];
}
