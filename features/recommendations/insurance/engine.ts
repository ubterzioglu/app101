import { INSURANCE_TYPES, INSURANCE_QUESTIONS } from './data';
import type {
  ClassifiedInsurance,
  InsuranceQuestion,
  ScoredInsurance,
} from './types';

export type InsuranceAnswers = Record<string, string>;

// Ported 1:1 from web SigortaClient scoring (base + add/weight, classify into
// must/should/nice with HEALTH always must).
export function computeInsuranceScores(
  questions: InsuranceQuestion[],
  answers: InsuranceAnswers
): Record<string, number> {
  const s: Record<string, number> = {};
  for (const k of Object.keys(INSURANCE_TYPES)) s[k] = INSURANCE_TYPES[k].base || 0;

  for (const q of questions) {
    const a = answers[q.id];
    if (!a) continue;

    let add: Record<string, number> = {};
    if (q.type === 'yesno') {
      add = q.weight?.[a] || {};
    } else if (q.type === 'single' && q.options) {
      const opt = q.options.find((o) => o.key === a);
      add = opt?.add || {};
    }
    for (const k of Object.keys(add)) {
      s[k] = (s[k] || 0) + add[k];
    }
  }
  return s;
}

export function classifyInsurance(scores: Record<string, number>): ClassifiedInsurance {
  const must: ScoredInsurance[] = [];
  const should: ScoredInsurance[] = [];
  const nice: ScoredInsurance[] = [];

  for (const key of Object.keys(INSURANCE_TYPES)) {
    const item: ScoredInsurance = { ...INSURANCE_TYPES[key], score: scores[key] || 0 };
    if (key === 'HEALTH') {
      must.push(item);
      continue;
    }
    if (item.score >= item.mustAt) must.push(item);
    else if (item.score >= item.shouldAt) should.push(item);
    else nice.push(item);
  }

  const sortDesc = (a: { score: number }, b: { score: number }) => b.score - a.score;
  must.sort(sortDesc);
  should.sort(sortDesc);
  nice.sort(sortDesc);
  return { must, should, nice };
}

export function classifyInsuranceFromAnswers(answers: InsuranceAnswers): ClassifiedInsurance {
  return classifyInsurance(computeInsuranceScores(INSURANCE_QUESTIONS, answers));
}
