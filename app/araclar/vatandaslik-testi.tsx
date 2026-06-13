import { Image } from 'expo-image';
import { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppHeader } from '@/components/layout/AppHeader';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { AppButton, AppCard, AppSelect, ErrorState, LoadingCard } from '@/components/ui';
import { ProgressBar } from '@/components/tools/ProgressBar';
import { QuizOption } from '@/components/tools/QuizOption';
import { ResultCard } from '@/components/tools/ResultCard';
import { useGeneralQuestions, useStateQuestions } from '@/features/citizenship/hooks';
import {
  answerQuestion,
  buildQuizSession,
  formatDuration,
  goToNext,
  isFinished,
  isPassing,
  remainingSeconds,
} from '@/features/citizenship/quiz-engine';
import { GERMAN_STATES, type QuizMode, type QuizSession } from '@/features/citizenship/types';
import { colors, fontSize, fontWeight, spacing } from '@/theme';

type Pending = { mode: QuizMode; state?: string } | null;

const STATE_OPTIONS = GERMAN_STATES.map((s) => ({ label: s, value: s }));

export default function CitizenshipQuizScreen() {
  const [pending, setPending] = useState<Pending>(null);
  const [session, setSession] = useState<QuizSession | null>(null);
  const [selectedState, setSelectedState] = useState('');
  const [buildError, setBuildError] = useState('');
  const [now, setNow] = useState<number>(() => Date.now());

  const needsGeneral = pending?.mode === 'all' || pending?.mode === 'real';
  const needsState = pending?.mode === 'state' || pending?.mode === 'real';

  const general = useGeneralQuestions(Boolean(needsGeneral));
  const state = useStateQuestions(pending?.state ?? '', Boolean(needsState));

  // Build the session once required pools are loaded.
  useEffect(() => {
    if (!pending || session) return;
    const generalReady = !needsGeneral || general.data;
    const stateReady = !needsState || state.data;
    if (!generalReady || !stateReady) return;

    try {
      const built = buildQuizSession({
        mode: pending.mode,
        state: pending.state,
        generalQuestions: general.data ?? [],
        stateQuestions: state.data ?? [],
      });
      setSession(built);
      setBuildError('');
    } catch (err) {
      setBuildError(err instanceof Error ? err.message : 'Test başlatılamadı.');
      setPending(null);
    }
  }, [pending, session, needsGeneral, needsState, general.data, state.data]);

  // 1s tick only to drive re-render; remaining time is derived from endsAt
  // so backgrounding does not corrupt the countdown (plan §12.6).
  useEffect(() => {
    if (!session?.endsAt) return;
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [session?.endsAt]);

  const finished = session ? isFinished(session) : false;
  const timedOut = useMemo(() => {
    if (!session?.endsAt) return false;
    return remainingSeconds(session, now) <= 0;
  }, [session, now]);

  const loading =
    pending && ((needsGeneral && general.isLoading) || (needsState && state.isLoading));
  const loadError = (needsGeneral && general.isError) || (needsState && state.isError);

  function reset() {
    setPending(null);
    setSession(null);
    setSelectedState('');
    setBuildError('');
  }

  // ---- Mode selection ----
  if (!pending && !session) {
    return (
      <ScreenContainer padded={false}>
        <AppHeader title="Vatandaşlık Testi" showBack />
        <ScrollView contentContainerStyle={styles.content}>
          {buildError ? <ErrorState message={buildError} /> : null}

          <AppCard accentColor={colors.error} style={styles.modeCard}>
            <Text style={styles.modeTitle}>Tüm Sorular (300)</Text>
            <Text style={styles.modeDesc}>Genel soru havuzundan 300 soruluk tam test.</Text>
            <AppButton label="Sınava Başla" variant="danger" onPress={() => setPending({ mode: 'all' })} />
          </AppCard>

          <AppCard accentColor={colors.error} style={styles.modeCard}>
            <Text style={styles.modeTitle}>Gerçek Deneme Sınavı</Text>
            <Text style={styles.modeDesc}>30 genel + 3 eyalet sorusu, 60 dakika, 33 soru.</Text>
            <AppSelect
              placeholder="Eyalet seçin"
              value={selectedState}
              options={STATE_OPTIONS}
              onChange={setSelectedState}
            />
            <AppButton
              label="Sınava Başla"
              variant="danger"
              disabled={!selectedState}
              onPress={() => setPending({ mode: 'real', state: selectedState })}
            />
          </AppCard>

          <AppCard accentColor={colors.error} style={styles.modeCard}>
            <Text style={styles.modeTitle}>Eyalet Soruları (10)</Text>
            <Text style={styles.modeDesc}>Seçtiğiniz eyalete özel 10 soru.</Text>
            <AppSelect
              placeholder="Eyalet seçin"
              value={selectedState}
              options={STATE_OPTIONS}
              onChange={setSelectedState}
            />
            <AppButton
              label="Sınava Başla"
              variant="danger"
              disabled={!selectedState}
              onPress={() => setPending({ mode: 'state', state: selectedState })}
            />
          </AppCard>
        </ScrollView>
      </ScreenContainer>
    );
  }

  // ---- Loading / error while fetching pools ----
  if (loading || loadError || !session) {
    return (
      <ScreenContainer padded={false}>
        <AppHeader title="Vatandaşlık Testi" showBack />
        {loadError ? (
          <ErrorState message="Sorular yüklenemedi." onRetry={reset} />
        ) : (
          <View style={styles.content}>
            <Text style={styles.loadingText}>Sorular yükleniyor...</Text>
            <LoadingCard />
          </View>
        )}
      </ScreenContainer>
    );
  }

  // ---- Result ----
  if (finished || timedOut) {
    return (
      <ScreenContainer padded={false}>
        <AppHeader title="Vatandaşlık Testi" showBack />
        <ScrollView contentContainerStyle={styles.content}>
          {timedOut && !finished ? <Text style={styles.timeUp}>Süre doldu.</Text> : null}
          <ResultCard
            total={session.questions.length}
            correct={session.correctCount}
            showPassFail={session.mode === 'real'}
            passed={isPassing(session.correctCount)}
          />
          <View style={styles.resultActions}>
            <AppButton label="Sınav Modunu Değiştir" onPress={reset} />
          </View>
        </ScrollView>
      </ScreenContainer>
    );
  }

  // ---- Question ----
  const question = session.questions[session.currentIndex];
  const answered = session.answered[question.id] !== undefined;
  const selected = session.answered[question.id];
  const progress = (session.currentIndex + 1) / session.questions.length;
  const remaining = session.endsAt ? remainingSeconds(session, now) : null;

  return (
    <ScreenContainer padded={false}>
      <AppHeader title="Vatandaşlık Testi" showBack />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.progressRow}>
          <Text style={styles.progressText}>
            Soru {session.currentIndex + 1} / {session.questions.length}
          </Text>
          {remaining !== null ? (
            <Text style={styles.timer}>⏱ {formatDuration(remaining)}</Text>
          ) : null}
        </View>
        <ProgressBar value={progress} />

        <AppCard accentColor={colors.yellow} style={styles.questionCard}>
          {question.image_url ? (
            <Image source={{ uri: question.image_url }} style={styles.image} contentFit="contain" />
          ) : null}
          <Text style={styles.questionDe}>{question.soru_almanca}</Text>
          <Text style={styles.questionTr}>{question.soru_turkce}</Text>

          {Object.entries(question.secenekler).map(([key, value]) => (
            <QuizOption
              key={key}
              optionKey={key}
              label={value}
              answered={answered}
              isSelected={selected === key}
              isCorrect={question.dogru_cevap === key}
              onPress={() => setSession((s) => (s ? answerQuestion(s, question.id, key) : s))}
            />
          ))}

          <View style={styles.nextRow}>
            <AppButton
              label={
                session.currentIndex < session.questions.length - 1 ? 'Sonraki Soru' : 'Testi Bitir'
              }
              variant="primary"
              disabled={!answered}
              onPress={() => setSession((s) => (s ? goToNext(s) : s))}
            />
            <AppButton label="Sınav Modunu Değiştir" variant="outline" onPress={reset} />
          </View>
        </AppCard>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxl },
  modeCard: { gap: spacing.sm },
  modeTitle: { fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: colors.textPrimary },
  modeDesc: { fontSize: fontSize.sm, color: colors.textSecondary },
  loadingText: { fontSize: fontSize.md, color: colors.textSecondary, marginBottom: spacing.md },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  progressText: { fontSize: fontSize.sm, fontWeight: fontWeight.medium, color: colors.error },
  timer: { fontSize: fontSize.sm, fontWeight: fontWeight.bold, color: colors.error },
  questionCard: { gap: spacing.sm },
  image: { width: '100%', height: 180, borderRadius: 12, marginBottom: spacing.sm },
  questionDe: { fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: colors.textPrimary },
  questionTr: { fontSize: fontSize.sm, color: colors.textSecondary, marginBottom: spacing.sm },
  nextRow: { gap: spacing.sm, marginTop: spacing.md },
  resultActions: { marginTop: spacing.lg },
  timeUp: { fontSize: fontSize.md, fontWeight: fontWeight.bold, color: colors.error, textAlign: 'center' },
});
