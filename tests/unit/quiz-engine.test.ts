import {
  answerQuestion,
  buildQuizSession,
  formatDuration,
  isFinished,
  isPassing,
  remainingSeconds,
  shuffle,
} from '@/features/citizenship/quiz-engine';
import { REAL_TOTAL, type CitizenshipQuestion } from '@/features/citizenship/types';

function makeQuestions(prefix: string, count: number, eyalet: string): CitizenshipQuestion[] {
  return Array.from({ length: count }, (_, i) => ({
    id: Number(`${prefix}${i}`.replace(/\D/g, '')) + i,
    soru_almanca: `${prefix} Q${i}`,
    soru_turkce: `${prefix} S${i}`,
    secenekler: { a: 'A', b: 'B', c: 'C', d: 'D' },
    dogru_cevap: 'a',
    eyalet,
  }));
}

// Deterministic RNG for reproducible shuffles.
function seededRng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

describe('shuffle', () => {
  it('is immutable and preserves all elements', () => {
    const input = [1, 2, 3, 4, 5];
    const out = shuffle(input, seededRng(1));
    expect(out).toHaveLength(5);
    expect([...out].sort()).toEqual([1, 2, 3, 4, 5]);
    expect(input).toEqual([1, 2, 3, 4, 5]);
  });
});

describe('buildQuizSession real mode', () => {
  const general = makeQuestions('g', 50, 'Genel');
  const state = makeQuestions('s', 10, 'Bayern');

  it('produces exactly 33 questions (30 general + 3 state)', () => {
    const session = buildQuizSession({
      mode: 'real',
      state: 'Bayern',
      generalQuestions: general,
      stateQuestions: state,
      rng: seededRng(42),
      now: 1_000_000,
    });
    expect(session.questions).toHaveLength(REAL_TOTAL);
    const stateCount = session.questions.filter((q) => q.eyalet === 'Bayern').length;
    const generalCount = session.questions.filter((q) => q.eyalet === 'Genel').length;
    expect(stateCount).toBe(3);
    expect(generalCount).toBe(30);
  });

  it('sets a 60-minute endsAt timestamp', () => {
    const session = buildQuizSession({
      mode: 'real',
      state: 'Bayern',
      generalQuestions: general,
      stateQuestions: state,
      now: 1_000_000,
    });
    expect(session.endsAt).toBe(1_000_000 + 60 * 60 * 1000);
  });

  it('throws when pools are insufficient', () => {
    expect(() =>
      buildQuizSession({ mode: 'real', generalQuestions: makeQuestions('g', 5, 'Genel'), stateQuestions: state })
    ).toThrow('Genel soru sayısı yetersiz.');
    expect(() =>
      buildQuizSession({ mode: 'real', generalQuestions: general, stateQuestions: makeQuestions('s', 1, 'Bayern') })
    ).toThrow('Eyalet soru sayısı yetersiz.');
  });
});

describe('buildQuizSession all/state modes', () => {
  it('all mode caps at 300', () => {
    const session = buildQuizSession({ mode: 'all', generalQuestions: makeQuestions('g', 400, 'Genel') });
    expect(session.questions).toHaveLength(300);
    expect(session.endsAt).toBeUndefined();
  });

  it('state mode caps at 10', () => {
    const session = buildQuizSession({
      mode: 'state',
      state: 'Bayern',
      generalQuestions: [],
      stateQuestions: makeQuestions('s', 25, 'Bayern'),
    });
    expect(session.questions).toHaveLength(10);
  });
});

describe('answer + progression', () => {
  const session = buildQuizSession({
    mode: 'state',
    state: 'Bayern',
    generalQuestions: [],
    stateQuestions: makeQuestions('s', 3, 'Bayern'),
    rng: seededRng(7),
  });

  it('counts correct answers and is immutable', () => {
    const first = session.questions[0];
    const after = answerQuestion(session, first.id, first.dogru_cevap);
    expect(after.correctCount).toBe(1);
    expect(session.correctCount).toBe(0);
  });

  it('ignores duplicate answers for the same question', () => {
    const first = session.questions[0];
    const once = answerQuestion(session, first.id, first.dogru_cevap);
    const twice = answerQuestion(once, first.id, 'b');
    expect(twice.correctCount).toBe(1);
  });
});

describe('timer (timestamp-based)', () => {
  it('computes remaining seconds from endsAt, surviving background gaps', () => {
    const session = buildQuizSession({
      mode: 'real',
      state: 'Bayern',
      generalQuestions: makeQuestions('g', 30, 'Genel'),
      stateQuestions: makeQuestions('s', 3, 'Bayern'),
      now: 0,
    });
    // 10 minutes elapsed wall-clock, regardless of interval ticks.
    expect(remainingSeconds(session, 10 * 60 * 1000)).toBe(50 * 60);
    // Past the end -> clamps to 0.
    expect(remainingSeconds(session, 61 * 60 * 1000)).toBe(0);
  });

  it('formats mm:ss', () => {
    expect(formatDuration(3600)).toBe('60:00');
    expect(formatDuration(65)).toBe('01:05');
  });
});

describe('pass threshold', () => {
  it('passes at 17 correct, fails at 16', () => {
    expect(isPassing(17)).toBe(true);
    expect(isPassing(16)).toBe(false);
  });
});

describe('isFinished', () => {
  it('is true once currentIndex reaches question count', () => {
    const s = buildQuizSession({
      mode: 'state',
      generalQuestions: [],
      stateQuestions: makeQuestions('s', 2, 'Bayern'),
    });
    expect(isFinished({ ...s, currentIndex: 2 })).toBe(true);
    expect(isFinished({ ...s, currentIndex: 1 })).toBe(false);
  });
});
