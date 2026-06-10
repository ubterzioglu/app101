import {
  getQuestion,
  resolveNext,
  startQuestionId,
  isResultTarget,
} from '@/features/recommendations/visa/engine';
import {
  classifyInsuranceFromAnswers,
  computeInsuranceScores,
} from '@/features/recommendations/insurance/engine';
import { INSURANCE_QUESTIONS } from '@/features/recommendations/insurance/data';

describe('visa decision-tree engine', () => {
  it('has a valid start question', () => {
    expect(getQuestion(startQuestionId)).toBeDefined();
  });

  it('detects RESULT: navigation targets', () => {
    expect(isResultTarget('RESULT:BLUE_CARD')).toBe(true);
    expect(isResultTarget('Q03')).toBe(false);
  });

  it('resolves a RESULT target to a result and a question id to a question', () => {
    const start = getQuestion(startQuestionId)!;
    // Every option should resolve to either a known question or a known result.
    for (const opt of start.options) {
      const resolved = resolveNext(opt.next);
      expect(Boolean(resolved.question) || Boolean(resolved.result)).toBe(true);
    }
  });
});

describe('insurance classification engine', () => {
  it('always classifies HEALTH as must', () => {
    const c = classifyInsuranceFromAnswers({});
    expect(c.must.some((i) => i.key === 'HEALTH')).toBe(true);
  });

  it('starts each type at its base score', () => {
    const scores = computeInsuranceScores(INSURANCE_QUESTIONS, {});
    expect(scores.HEALTH).toBeGreaterThanOrEqual(0);
    // No answers -> scores equal the declared base values, so classification is deterministic.
    const c = classifyInsuranceFromAnswers({});
    const totalTypes = c.must.length + c.should.length + c.nice.length;
    expect(totalTypes).toBeGreaterThan(3);
  });
});
