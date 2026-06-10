// Generic recommendation scoring engine, shared by the bank/insurance/visa/
// transfer tools (plan §13.1, §13.2). Ported from the web bank scoring logic:
//   answers -> profile scores (sum of option.add) -> per-item weighted score
//   -> ranked top-N.

export interface RecOption {
  key: string;
  label: string;
  desc?: string;
  add: Record<string, number>;
}

export interface RecQuestion {
  id: string;
  title: string;
  desc?: string;
  category?: string;
  type?: 'single' | 'yesno';
  options: RecOption[];
}

export interface RecItem {
  id: string;
  name: string;
  type?: string;
  weights: Record<string, number>;
}

export interface RankedItem extends RecItem {
  score: number;
  rank: number;
}

export type Answers = Record<string, string>; // questionId -> optionKey

/** Sum profile scores from the selected answer options. */
export function computeProfileScores(
  questions: RecQuestion[],
  profileKeys: string[],
  answers: Answers
): Record<string, number> {
  const scores: Record<string, number> = {};
  for (const k of profileKeys) scores[k] = 0;

  for (const q of questions) {
    const chosen = answers[q.id];
    if (!chosen) continue;
    const opt = q.options.find((o) => o.key === chosen);
    if (!opt) continue;
    for (const k of Object.keys(opt.add)) {
      scores[k] = (scores[k] || 0) + opt.add[k];
    }
  }
  return scores;
}

/** Weighted score of one item against the profile scores. */
export function computeItemScore(
  item: RecItem,
  profileKeys: string[],
  scores: Record<string, number>
): number {
  let total = 0;
  for (const k of profileKeys) {
    const s = scores[k] || 0;
    const w = item.weights[k] || 0;
    total += s * w;
  }
  return total;
}

/** Rank items by weighted score, returning the top N (default 3). */
export function rankItems(
  items: RecItem[],
  profileKeys: string[],
  scores: Record<string, number>,
  topN = 3
): RankedItem[] {
  return items
    .map((item) => ({ ...item, score: computeItemScore(item, profileKeys, scores) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topN)
    .map((item, idx) => ({ ...item, rank: idx + 1 }));
}

/** Top profile signals (positive scores), highest first. */
export function topSignals(
  scores: Record<string, number>,
  topN = 3
): { key: string; score: number }[] {
  return Object.keys(scores)
    .map((k) => ({ key: k, score: scores[k] || 0 }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topN);
}

export interface RecConfig {
  profileKeys: string[];
  profileTitles: Record<string, string>;
  questions: RecQuestion[];
  items: RecItem[];
}

/** End-to-end: answers -> ranked top-N recommendations. */
export function recommend(config: RecConfig, answers: Answers, topN = 3): RankedItem[] {
  const scores = computeProfileScores(config.questions, config.profileKeys, answers);
  return rankItems(config.items, config.profileKeys, scores, topN);
}
