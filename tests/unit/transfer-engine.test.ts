import { derivePrefs, rankTransferSystems, scoreSystem } from '@/features/recommendations/transfer/engine';
import { TRANSFER_SYSTEMS } from '@/features/recommendations/transfer/data';

describe('transfer engine', () => {
  it('derivePrefs returns base prefs with no answers', () => {
    const prefs = derivePrefs({});
    expect(prefs.cost).toBeGreaterThanOrEqual(1);
    expect(prefs.simple).toBeGreaterThanOrEqual(1);
  });

  it('cost priority boosts cost weight', () => {
    const base = derivePrefs({});
    const withCost = derivePrefs({ q4: 'cost' });
    expect(withCost.cost).toBeGreaterThan(base.cost);
  });

  it('cash pickup answer boosts cash weight', () => {
    const base = derivePrefs({});
    const withCash = derivePrefs({ q7: 'yes' });
    expect(withCash.cash).toBeGreaterThan(base.cash);
  });

  it('scoreSystem returns positive number for valid system', () => {
    const prefs = derivePrefs({ q4: 'cost' });
    const score = scoreSystem(TRANSFER_SYSTEMS[0], prefs);
    expect(score).toBeGreaterThan(0);
  });

  it('rankTransferSystems returns topN sorted descending', () => {
    const ranked = rankTransferSystems({}, 5);
    expect(ranked.length).toBe(5);
    for (let i = 1; i < ranked.length; i++) {
      expect(ranked[i - 1].totalScore).toBeGreaterThanOrEqual(ranked[i].totalScore);
    }
  });

  it('rank field starts at 1', () => {
    const ranked = rankTransferSystems({}, 3);
    expect(ranked[0].rank).toBe(1);
    expect(ranked[1].rank).toBe(2);
    expect(ranked[2].rank).toBe(3);
  });
});
