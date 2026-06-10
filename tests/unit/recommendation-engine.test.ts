import {
  computeProfileScores,
  computeItemScore,
  rankItems,
  recommend,
  topSignals,
  type RecConfig,
} from '@/features/recommendations/engine';
import { bankConfig } from '@/features/recommendations/bank/config';

const config: RecConfig = {
  profileKeys: ['A', 'B'],
  profileTitles: { A: 'Alpha', B: 'Beta' },
  questions: [
    { id: 'q1', title: 'Q1', options: [
      { key: 'a', label: 'A', add: { A: 3 } },
      { key: 'b', label: 'B', add: { B: 3 } },
    ] },
    { id: 'q2', title: 'Q2', options: [
      { key: 'a', label: 'A', add: { A: 2 } },
      { key: 'b', label: 'B', add: { B: 2 } },
    ] },
  ],
  items: [
    { id: 'x', name: 'X', weights: { A: 5, B: -2 } },
    { id: 'y', name: 'Y', weights: { A: -2, B: 5 } },
  ],
};

describe('recommendation engine', () => {
  it('sums profile scores from chosen options', () => {
    const scores = computeProfileScores(config.questions, config.profileKeys, { q1: 'a', q2: 'a' });
    expect(scores).toEqual({ A: 5, B: 0 });
  });

  it('computes weighted item score', () => {
    const score = computeItemScore(config.items[0], config.profileKeys, { A: 5, B: 0 });
    expect(score).toBe(25);
  });

  it('ranks items and recommends the best fit', () => {
    const allA = recommend(config, { q1: 'a', q2: 'a' });
    expect(allA[0].id).toBe('x');
    const allB = recommend(config, { q1: 'b', q2: 'b' });
    expect(allB[0].id).toBe('y');
  });

  it('assigns sequential ranks', () => {
    const ranked = rankItems(config.items, config.profileKeys, { A: 5, B: 0 });
    expect(ranked.map((r) => r.rank)).toEqual([1, 2]);
  });

  it('topSignals returns only positive scores, highest first', () => {
    expect(topSignals({ A: 5, B: 0, C: -1 })).toEqual([{ key: 'A', score: 5 }]);
  });
});

describe('bank config integration', () => {
  it('has 8 profiles and a non-trivial bank/question set', () => {
    expect(bankConfig.profileKeys.length).toBe(8);
    expect(bankConfig.items.length).toBeGreaterThan(10);
    expect(bankConfig.questions.length).toBeGreaterThanOrEqual(10);
  });

  it('produces 3 ranked recommendations for a digital-expat profile', () => {
    const answers = Object.fromEntries(bankConfig.questions.map((q) => [q.id, q.options[0].key]));
    const recs = recommend(bankConfig, answers, 3);
    expect(recs).toHaveLength(3);
    expect(recs[0].score).toBeGreaterThanOrEqual(recs[1].score);
  });
});
