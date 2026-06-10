import {
  ALL_MODE_LIMIT,
  GENERAL_POOL,
  REAL_DURATION_MS,
  REAL_GENERAL_COUNT,
  REAL_PASS_THRESHOLD,
  REAL_STATE_COUNT,
  STATE_MODE_LIMIT,
  type CitizenshipQuestion,
  type QuizMode,
  type QuizSession,
} from './types';

export type RandomFn = () => number;

/** Fisher–Yates shuffle (immutable). Accepts an injectable RNG for tests. */
export function shuffle<T>(input: readonly T[], rng: RandomFn = Math.random): T[] {
  const arr = [...input];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }
  return arr;
}

interface BuildSessionArgs {
  mode: QuizMode;
  state?: string;
  /** All questions where eyalet === 'Genel'. */
  generalQuestions: CitizenshipQuestion[];
  /** Questions for the selected state (only needed for state/real modes). */
  stateQuestions?: CitizenshipQuestion[];
  rng?: RandomFn;
  /** Injectable clock for deterministic tests. */
  now?: number;
}

/**
 * Builds a quiz session for the requested mode (plan §12.6):
 *  - all:   up to 300 shuffled general questions
 *  - state: up to 10 shuffled state questions
 *  - real:  30 general + 3 state, shuffled together (33 total), 60-min timer
 */
export function buildQuizSession({
  mode,
  state,
  generalQuestions,
  stateQuestions = [],
  rng = Math.random,
  now = Date.now(),
}: BuildSessionArgs): QuizSession {
  let questions: CitizenshipQuestion[];
  let endsAt: number | undefined;

  if (mode === 'all') {
    questions = shuffle(generalQuestions, rng).slice(0, ALL_MODE_LIMIT);
  } else if (mode === 'state') {
    questions = shuffle(stateQuestions, rng).slice(0, STATE_MODE_LIMIT);
  } else {
    if (generalQuestions.length < REAL_GENERAL_COUNT) {
      throw new Error('Genel soru sayısı yetersiz.');
    }
    if (stateQuestions.length < REAL_STATE_COUNT) {
      throw new Error('Eyalet soru sayısı yetersiz.');
    }
    const general = shuffle(generalQuestions, rng).slice(0, REAL_GENERAL_COUNT);
    const stateOnes = shuffle(stateQuestions, rng).slice(0, REAL_STATE_COUNT);
    questions = shuffle([...general, ...stateOnes], rng);
    endsAt = now + REAL_DURATION_MS;
  }

  return {
    mode,
    state,
    questions,
    currentIndex: 0,
    correctCount: 0,
    answered: {},
    startedAt: now,
    endsAt,
  };
}

/** Records an answer immutably and updates the correct count. */
export function answerQuestion(
  session: QuizSession,
  questionId: number,
  choice: string
): QuizSession {
  if (session.answered[questionId] !== undefined) return session;
  const question = session.questions.find((q) => q.id === questionId);
  if (!question) return session;

  const isCorrect = choice === question.dogru_cevap;
  return {
    ...session,
    answered: { ...session.answered, [questionId]: choice },
    correctCount: session.correctCount + (isCorrect ? 1 : 0),
  };
}

/** Advances to the next question immutably. */
export function goToNext(session: QuizSession): QuizSession {
  return {
    ...session,
    currentIndex: Math.min(session.currentIndex + 1, session.questions.length),
  };
}

export function isFinished(session: QuizSession): boolean {
  return session.questions.length > 0 && session.currentIndex >= session.questions.length;
}

/** Remaining seconds for a timed (real) session, computed from endsAt. */
export function remainingSeconds(session: QuizSession, now: number = Date.now()): number {
  if (!session.endsAt) return 0;
  return Math.max(0, Math.ceil((session.endsAt - now) / 1000));
}

export function formatDuration(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

/** Real-exam pass check: at least 17 correct (plan §12.6). */
export function isPassing(correctCount: number): boolean {
  return correctCount >= REAL_PASS_THRESHOLD;
}
