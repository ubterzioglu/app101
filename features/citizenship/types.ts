// Vatandaşlık testi tipleri. Table: vatandaslik_sorulari (plan §2.3).

export interface CitizenshipQuestion {
  id: number;
  soru_almanca: string;
  soru_turkce: string;
  secenekler: Record<string, string>;
  dogru_cevap: string;
  image_url?: string;
  eyalet: string;
}

export type QuizMode = 'all' | 'state' | 'real';

export interface QuizSession {
  mode: QuizMode;
  state?: string;
  questions: CitizenshipQuestion[];
  currentIndex: number;
  correctCount: number;
  answered: Record<number, string>;
  startedAt: number;
  endsAt?: number;
}

// 16 German states (matches the web app's EYALETLER list).
export const GERMAN_STATES = [
  'Baden-Württemberg',
  'Bayern',
  'Berlin',
  'Brandenburg',
  'Bremen',
  'Hamburg',
  'Hessen',
  'Mecklenburg-Vorpommern',
  'Niedersachsen',
  'Nordrhein-Westfalen',
  'Rheinland-Pfalz',
  'Saarland',
  'Sachsen',
  'Sachsen-Anhalt',
  'Schleswig-Holstein',
  'Thüringen',
] as const;

export const GENERAL_POOL = 'Genel';

// Real exam constants (plan §12.6).
export const REAL_GENERAL_COUNT = 30;
export const REAL_STATE_COUNT = 3;
export const REAL_TOTAL = REAL_GENERAL_COUNT + REAL_STATE_COUNT; // 33
export const REAL_PASS_THRESHOLD = 17;
export const REAL_DURATION_MS = 60 * 60 * 1000; // 60 minutes

export const ALL_MODE_LIMIT = 300;
export const STATE_MODE_LIMIT = 10;
