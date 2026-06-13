import { TRANSFER_SYSTEMS, TRANSFER_QUESTIONS, type TransferSystem, type TransferQuestion } from './data';

export type TransferAnswers = Record<string, string>;

export interface TransferPrefs {
  cost: number;
  speed: number;
  online: number;
  cash: number;
  multi: number;
  official: number;
  business: number;
  simple: number;
  weekend: number;
  limits: number;
  promos: number;
}

export interface RankedTransferSystem extends TransferSystem {
  totalScore: number;
  rank: number;
}

/** Türetilmiş tercihler: cevaplardan boyut ağırlıkları oluştur. */
export function derivePrefs(answers: TransferAnswers): TransferPrefs {
  const p: TransferPrefs = {
    cost: 1, speed: 1, online: 1, cash: 0,
    multi: 0, official: 0, business: 0, simple: 1,
    weekend: 0, limits: 0, promos: 0,
  };

  // q4: En kritik şey
  if (answers.q4 === 'cost') { p.cost += 3; }
  else if (answers.q4 === 'speed') { p.speed += 3; }
  else if (answers.q4 === 'simplicity') { p.simple += 3; }

  // q5: Tamamen online
  if (answers.q5 === 'yes') p.online += 2;

  // q6: IBAN durumu
  if (answers.q6 === 'no_iban') { p.cash += 2; p.online -= 1; }
  else if (answers.q6 === 'sometimes') p.cash += 1;

  // q7: Nakit teslim
  if (answers.q7 === 'yes') p.cash += 3;

  // q8: Kur farkı
  if (answers.q8 === 'yes') p.cost += 2;

  // q9: Belgeler/uyum
  if (answers.q9 === 'yes') { p.official += 2; p.limits += 1; }

  // q10: Açıklama/fatura
  if (answers.q10 === 'yes') { p.official += 1; p.business += 1; }

  // q11: Aynı gün teslim
  if (answers.q11 === 'yes') p.speed += 2;

  // q12: Hafta sonu
  if (answers.q12 === 'yes') p.weekend += 2;

  // q13: Çoklu döviz bakiyesi
  if (answers.q13 === 'yes') p.multi += 2;

  // q14: Tek uygulama
  if (answers.q14 === 'yes') { p.multi += 1; p.online += 1; }

  // q15: Kripto
  if (answers.q15 === 'yes') { p.multi += 1; }

  // q16: Toplam maliyet hassasiyeti
  if (answers.q16 === 'total_cost') p.cost += 2;
  else if (answers.q16 === 'visible_fee') p.cost += 1;

  // q17: Limit sorunu
  if (answers.q17 === 'yes') p.limits += 2;

  // q18: Resmi kayıt
  if (answers.q18 === 'important') { p.official += 2; p.business += 1; }

  // q19: Kampanya
  if (answers.q19 === 'yes') p.promos += 2;

  // q20: Teknoloji konforu
  if (answers.q20 === 'low') { p.simple += 2; p.online -= 1; }
  else if (answers.q20 === 'advanced') p.online += 1;

  // q3: Tutar seviyesi
  if (answers.q3 === 'large') { p.limits += 2; p.official += 1; }
  else if (answers.q3 === 'small') p.cost += 1;

  // q2: Sıklık
  if (answers.q2 === 'weekly') p.cost += 1;

  return p;
}

/** Tercih vektörüyle sistem skorunu hesapla (nokta çarpım). */
export function scoreSystem(system: TransferSystem, prefs: TransferPrefs): number {
  const s = system.scores;
  return (
    s.cost * prefs.cost +
    s.speed * prefs.speed +
    s.online * prefs.online +
    s.cash * prefs.cash +
    s.multi * prefs.multi +
    s.official * prefs.official +
    s.business * prefs.business +
    s.simple * prefs.simple +
    s.weekend * prefs.weekend +
    s.limits * prefs.limits +
    s.promos * prefs.promos
  );
}

/** Sıralı sistemler döndür (en iyi ilk, topN adet). */
export function rankTransferSystems(
  answers: TransferAnswers,
  topN = 5
): RankedTransferSystem[] {
  const prefs = derivePrefs(answers);
  return TRANSFER_SYSTEMS
    .map((s) => ({ ...s, totalScore: scoreSystem(s, prefs) }))
    .sort((a, b) => b.totalScore - a.totalScore)
    .slice(0, topN)
    .map((s, idx) => ({ ...s, rank: idx + 1 }));
}

export { TRANSFER_QUESTIONS };
export type { TransferQuestion };
