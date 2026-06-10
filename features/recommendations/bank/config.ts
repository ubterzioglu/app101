import type { RecConfig } from '@/features/recommendations/engine';
import { BANKS, BANK_PROFILES, BANK_QUESTIONS } from './data';

export const bankConfig: RecConfig = {
  profileKeys: Object.keys(BANK_PROFILES),
  profileTitles: Object.fromEntries(
    Object.entries(BANK_PROFILES).map(([k, v]) => [k, v.title])
  ),
  questions: BANK_QUESTIONS,
  items: BANKS,
};
