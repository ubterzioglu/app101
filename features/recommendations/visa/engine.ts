import { VISA_QUESTIONS, RESULTS, VISA_START, type VisaQuestion, type VisaResult } from './data';

const RESULT_PREFIX = 'RESULT:';

export function getQuestion(id: string): VisaQuestion | undefined {
  return VISA_QUESTIONS.find((q) => q.id === id);
}

export function getResult(id: string): VisaResult | undefined {
  return RESULTS.find((r) => r.id === id);
}

export function isResultTarget(next: string): boolean {
  return next.startsWith(RESULT_PREFIX);
}

export function resultIdFromTarget(next: string): string {
  return next.slice(RESULT_PREFIX.length);
}

export const startQuestionId = VISA_START;

/**
 * Resolves the next navigation target into either a question or a result.
 * Returns one of { question } or { result }.
 */
export function resolveNext(next: string): { question?: VisaQuestion; result?: VisaResult } {
  if (isResultTarget(next)) {
    return { result: getResult(resultIdFromTarget(next)) };
  }
  return { question: getQuestion(next) };
}
