// Para transferi sistem verisi + skor yapısı.
// Kaynak: referans/constants/para-transferi/systems.ts

export interface TransferSystem {
  id: string;
  name: string;
  tags: string[];
  color: 'purple' | 'red' | '';
  scores: {
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
  };
}

export const TRANSFER_SYSTEMS: TransferSystem[] = [
  // Fintech / Transfer services
  {
    id: 'wise',
    name: 'Wise',
    tags: ['Fintech', 'Düşük maliyet', 'Online'],
    color: 'purple',
    scores: { cost: 5, speed: 4, online: 5, cash: 1, multi: 5, official: 3, business: 4, simple: 4, weekend: 4, limits: 4, promos: 2 },
  },
  {
    id: 'remitly',
    name: 'Remitly',
    tags: ['Fintech', 'Hızlı', 'TR↔DE'],
    color: '',
    scores: { cost: 4, speed: 4, online: 4, cash: 3, multi: 2, official: 2, business: 2, simple: 4, weekend: 4, limits: 3, promos: 3 },
  },
  {
    id: 'transfergo',
    name: 'TransferGo',
    tags: ['Fintech', 'Hızlı', 'Online'],
    color: '',
    scores: { cost: 4, speed: 4, online: 4, cash: 1, multi: 2, official: 2, business: 2, simple: 4, weekend: 3, limits: 3, promos: 3 },
  },
  {
    id: 'paysend',
    name: 'Paysend',
    tags: ['Fintech', 'Kart/IBAN', 'Online'],
    color: '',
    scores: { cost: 3, speed: 4, online: 4, cash: 1, multi: 2, official: 2, business: 2, simple: 4, weekend: 3, limits: 3, promos: 2 },
  },
  {
    id: 'worldremit',
    name: 'WorldRemit',
    tags: ['Fintech', 'Nakit opsiyon', 'Online'],
    color: '',
    scores: { cost: 3, speed: 3, online: 4, cash: 4, multi: 1, official: 2, business: 2, simple: 4, weekend: 3, limits: 3, promos: 2 },
  },
  {
    id: 'ria',
    name: 'RIA Money Transfer',
    tags: ['Ağ', 'Nakit opsiyon', 'TR'],
    color: 'red',
    scores: { cost: 3, speed: 3, online: 3, cash: 5, multi: 1, official: 2, business: 2, simple: 3, weekend: 3, limits: 3, promos: 2 },
  },
  {
    id: 'xoom',
    name: 'Xoom (PayPal)',
    tags: ['PayPal', 'Hızlı', 'Online'],
    color: '',
    scores: { cost: 2, speed: 4, online: 4, cash: 2, multi: 1, official: 2, business: 2, simple: 4, weekend: 4, limits: 2, promos: 1 },
  },
  {
    id: 'skrill',
    name: 'Skrill Money Transfer',
    tags: ['Cüzdan', 'Online', 'Kart'],
    color: '',
    scores: { cost: 2, speed: 3, online: 4, cash: 1, multi: 2, official: 2, business: 1, simple: 3, weekend: 3, limits: 2, promos: 2 },
  },
  {
    id: 'smallworld',
    name: 'Small World FS',
    tags: ['Ağ', 'Nakit opsiyon', 'Online'],
    color: 'red',
    scores: { cost: 3, speed: 3, online: 3, cash: 4, multi: 1, official: 2, business: 2, simple: 3, weekend: 3, limits: 3, promos: 2 },
  },
  {
    id: 'taptap',
    name: 'Taptap Send',
    tags: ['Hızlı', 'Mobil', 'Online'],
    color: '',
    scores: { cost: 3, speed: 4, online: 4, cash: 1, multi: 1, official: 2, business: 1, simple: 4, weekend: 4, limits: 2, promos: 3 },
  },

  // Cash pickup networks
  {
    id: 'western_union',
    name: 'Western Union',
    tags: ['Nakit teslim', 'Şube ağı', 'Global'],
    color: 'red',
    scores: { cost: 2, speed: 4, online: 3, cash: 5, multi: 0, official: 2, business: 1, simple: 3, weekend: 4, limits: 4, promos: 1 },
  },
  {
    id: 'moneygram',
    name: 'MoneyGram',
    tags: ['Nakit teslim', 'Şube ağı', 'Global'],
    color: 'red',
    scores: { cost: 2, speed: 3, online: 3, cash: 5, multi: 0, official: 2, business: 1, simple: 3, weekend: 3, limits: 3, promos: 1 },
  },
  {
    id: 'ptt',
    name: 'PTT Uluslararası Para Transferi',
    tags: ['TR', 'Nakit/hesap', 'Şube'],
    color: 'red',
    scores: { cost: 2, speed: 2, online: 1, cash: 4, multi: 0, official: 3, business: 1, simple: 2, weekend: 1, limits: 2, promos: 0 },
  },
  {
    id: 'upt',
    name: 'UPT (Ulaşım Para Transferi)',
    tags: ['TR', 'Nakit ağ', 'Hızlı'],
    color: 'red',
    scores: { cost: 2, speed: 3, online: 2, cash: 4, multi: 0, official: 2, business: 1, simple: 3, weekend: 2, limits: 2, promos: 1 },
  },
  {
    id: 'euronet',
    name: 'Euronet / Ria Network',
    tags: ['Nokta ağı', 'Nakit', 'Erişim'],
    color: 'red',
    scores: { cost: 2, speed: 2, online: 1, cash: 4, multi: 0, official: 2, business: 1, simple: 2, weekend: 2, limits: 2, promos: 0 },
  },

  // Multi-currency / digital banks
  {
    id: 'revolut',
    name: 'Revolut',
    tags: ['Dijital banka', 'Çoklu döviz', 'Kart'],
    color: 'purple',
    scores: { cost: 4, speed: 3, online: 5, cash: 0, multi: 5, official: 3, business: 2, simple: 4, weekend: 4, limits: 3, promos: 2 },
  },
  {
    id: 'n26',
    name: 'N26',
    tags: ['Dijital banka', 'DE IBAN', 'Basit'],
    color: 'purple',
    scores: { cost: 3, speed: 3, online: 5, cash: 0, multi: 3, official: 4, business: 2, simple: 5, weekend: 3, limits: 3, promos: 1 },
  },
  {
    id: 'bunq',
    name: 'bunq',
    tags: ['Dijital banka', 'IBAN', 'Uygulama'],
    color: 'purple',
    scores: { cost: 3, speed: 3, online: 5, cash: 0, multi: 3, official: 4, business: 2, simple: 4, weekend: 3, limits: 3, promos: 1 },
  },
  {
    id: 'vivid',
    name: 'Vivid Money',
    tags: ['Dijital banka', 'Kart', 'Uygulama'],
    color: 'purple',
    scores: { cost: 3, speed: 3, online: 5, cash: 0, multi: 3, official: 3, business: 1, simple: 4, weekend: 3, limits: 2, promos: 2 },
  },
  {
    id: 'paysera',
    name: 'Paysera',
    tags: ['Hesap', 'Transfer', 'Çoklu döviz'],
    color: 'purple',
    scores: { cost: 3, speed: 3, online: 4, cash: 1, multi: 4, official: 3, business: 3, simple: 3, weekend: 2, limits: 3, promos: 1 },
  },

  // Banks (TR + DE)
  {
    id: 'ziraat',
    name: 'Ziraat Bankası',
    tags: ['Banka', 'TR/DE', 'Resmi'],
    color: 'red',
    scores: { cost: 2, speed: 2, online: 3, cash: 1, multi: 1, official: 5, business: 4, simple: 3, weekend: 1, limits: 5, promos: 0 },
  },
  {
    id: 'isbank',
    name: 'İş Bankası',
    tags: ['Banka', 'SWIFT', 'Resmi'],
    color: 'red',
    scores: { cost: 2, speed: 2, online: 3, cash: 1, multi: 1, official: 5, business: 4, simple: 3, weekend: 1, limits: 5, promos: 0 },
  },
  {
    id: 'garanti',
    name: 'Garanti BBVA',
    tags: ['Banka', 'SWIFT', 'Resmi'],
    color: 'red',
    scores: { cost: 2, speed: 2, online: 3, cash: 1, multi: 1, official: 5, business: 4, simple: 3, weekend: 1, limits: 5, promos: 0 },
  },
  {
    id: 'akbank',
    name: 'Akbank',
    tags: ['Banka', 'SWIFT', 'Resmi'],
    color: 'red',
    scores: { cost: 2, speed: 2, online: 3, cash: 1, multi: 1, official: 5, business: 4, simple: 3, weekend: 1, limits: 5, promos: 0 },
  },
  {
    id: 'halkbank',
    name: 'Halkbank',
    tags: ['Banka', 'SWIFT', 'Resmi'],
    color: 'red',
    scores: { cost: 2, speed: 2, online: 3, cash: 1, multi: 1, official: 5, business: 4, simple: 3, weekend: 1, limits: 5, promos: 0 },
  },
  {
    id: 'vakif',
    name: 'VakıfBank',
    tags: ['Banka', 'SWIFT', 'Resmi'],
    color: 'red',
    scores: { cost: 2, speed: 2, online: 3, cash: 1, multi: 1, official: 5, business: 4, simple: 3, weekend: 1, limits: 5, promos: 0 },
  },
  {
    id: 'deutsche',
    name: 'Deutsche Bank',
    tags: ['Banka', 'DE', 'Resmi'],
    color: 'red',
    scores: { cost: 2, speed: 2, online: 3, cash: 0, multi: 1, official: 5, business: 4, simple: 2, weekend: 1, limits: 5, promos: 0 },
  },
  {
    id: 'commerz',
    name: 'Commerzbank',
    tags: ['Banka', 'DE', 'Resmi'],
    color: 'red',
    scores: { cost: 2, speed: 2, online: 3, cash: 0, multi: 1, official: 5, business: 4, simple: 2, weekend: 1, limits: 5, promos: 0 },
  },
  {
    id: 'sparkasse',
    name: 'Sparkasse',
    tags: ['Banka', 'DE', 'Yerel'],
    color: 'red',
    scores: { cost: 2, speed: 2, online: 3, cash: 0, multi: 0, official: 5, business: 4, simple: 2, weekend: 1, limits: 5, promos: 0 },
  },
  {
    id: 'volksbank',
    name: 'Volksbank / Raiffeisenbank',
    tags: ['Banka', 'DE', 'Yerel'],
    color: 'red',
    scores: { cost: 2, speed: 2, online: 3, cash: 0, multi: 0, official: 5, business: 4, simple: 2, weekend: 1, limits: 5, promos: 0 },
  },

  // Business variants
  {
    id: 'wise_business',
    name: 'Wise Business',
    tags: ['Business', 'Fintech', 'Uyum'],
    color: 'purple',
    scores: { cost: 4, speed: 3, online: 5, cash: 0, multi: 4, official: 4, business: 5, simple: 3, weekend: 3, limits: 4, promos: 1 },
  },
  {
    id: 'paysera_business',
    name: 'Paysera Business',
    tags: ['Business', 'Hesap', 'Uyum'],
    color: 'purple',
    scores: { cost: 3, speed: 3, online: 4, cash: 0, multi: 4, official: 4, business: 5, simple: 3, weekend: 2, limits: 4, promos: 1 },
  },
  {
    id: 'db_business',
    name: 'Deutsche Bank Business',
    tags: ['Business', 'Banka', 'Resmi'],
    color: 'red',
    scores: { cost: 2, speed: 2, online: 3, cash: 0, multi: 1, official: 5, business: 5, simple: 2, weekend: 1, limits: 5, promos: 0 },
  },
  {
    id: 'commerz_business',
    name: 'Commerzbank Business',
    tags: ['Business', 'Banka', 'Resmi'],
    color: 'red',
    scores: { cost: 2, speed: 2, online: 3, cash: 0, multi: 1, official: 5, business: 5, simple: 2, weekend: 1, limits: 5, promos: 0 },
  },
  {
    id: 'sparkasse_business',
    name: 'Sparkasse Business',
    tags: ['Business', 'Banka', 'Resmi'],
    color: 'red',
    scores: { cost: 2, speed: 2, online: 3, cash: 0, multi: 0, official: 5, business: 5, simple: 2, weekend: 1, limits: 5, promos: 0 },
  },

  // Crypto (opsiyonel — düşük öncelik)
  {
    id: 'binance',
    name: 'Binance',
    tags: ['Kripto', 'Risk', 'Hızlı'],
    color: 'red',
    scores: { cost: 3, speed: 3, online: 5, cash: 0, multi: 2, official: 0, business: 0, simple: 1, weekend: 5, limits: 4, promos: 0 },
  },
  {
    id: 'coinbase',
    name: 'Coinbase',
    tags: ['Kripto', 'Risk', 'Platform'],
    color: 'red',
    scores: { cost: 2, speed: 2, online: 5, cash: 0, multi: 1, official: 0, business: 0, simple: 1, weekend: 5, limits: 3, promos: 0 },
  },
  {
    id: 'kraken',
    name: 'Kraken',
    tags: ['Kripto', 'Risk', 'Platform'],
    color: 'red',
    scores: { cost: 2, speed: 2, online: 5, cash: 0, multi: 1, official: 0, business: 0, simple: 1, weekend: 5, limits: 3, promos: 0 },
  },
];

export const SYSTEMS_MAP = new Map(TRANSFER_SYSTEMS.map((s) => [s.id, s]));

// 20 soruluk transfer tercihi anketi
export interface TransferQuestionOption {
  key: string;
  label: string;
  desc?: string;
}

export interface TransferQuestion {
  id: string;
  title: string;
  desc?: string;
  type: 'single' | 'yesno';
  options?: TransferQuestionOption[];
}

export const TRANSFER_QUESTIONS: TransferQuestion[] = [
  {
    id: 'q1',
    title: 'Gönderim yönü hangisi?',
    desc: 'Yöntem seçimi iki yönde de benzer olsa da bazı servisler tek yönde daha iyi olabilir.',
    type: 'single',
    options: [
      { key: 'tr_to_de', label: 'Türkiye → Almanya' },
      { key: 'de_to_tr', label: 'Almanya → Türkiye' },
      { key: 'both', label: 'İkisi de (düzenli)' },
    ],
  },
  {
    id: 'q2',
    title: 'Transfer sıklığın nasıl?',
    desc: 'Sık transferlerde "kur farkı + düşük ücret" toplam maliyette daha belirleyici olur.',
    type: 'single',
    options: [
      { key: 'weekly', label: 'Haftalık / çok sık' },
      { key: 'monthly', label: 'Aylık' },
      { key: 'rare', label: 'Nadiren' },
    ],
  },
  {
    id: 'q3',
    title: 'Tutarlar genelde ne seviyede?',
    desc: 'Yüksek tutarda bankalar/uyum süreçleri ve limitler daha kritik olabilir.',
    type: 'single',
    options: [
      { key: 'small', label: 'Küçük (örn. < 500€)' },
      { key: 'mid', label: 'Orta (örn. 500€–3.000€)' },
      { key: 'large', label: 'Yüksek (örn. > 3.000€)' },
    ],
  },
  {
    id: 'q4',
    title: 'En kritik şey hangisi?',
    desc: 'Birincil hedefini seç: maliyet mi hız mı basitlik mi?',
    type: 'single',
    options: [
      { key: 'cost', label: 'En düşük toplam maliyet' },
      { key: 'speed', label: 'Hız (aynı gün/ertesi gün)' },
      { key: 'simplicity', label: 'En basit süreç' },
    ],
  },
  {
    id: 'q5',
    title: 'Tamamen online olsun istiyor musun?',
    desc: 'Tam online kullanım genelde transfer servisleri / çoklu döviz hesaplarda daha rahattır.',
    type: 'yesno',
  },
  {
    id: 'q6',
    title: 'Alıcının banka hesabı var mı (IBAN)?',
    desc: 'IBAN yoksa nakit teslim/ağ çözümleri devreye girebilir.',
    type: 'single',
    options: [
      { key: 'yes_iban', label: 'Evet, IBAN var' },
      { key: 'no_iban', label: 'Hayır, IBAN yok / kullanmak istemiyor' },
      { key: 'sometimes', label: 'Bazen var bazen yok' },
    ],
  },
  {
    id: 'q7',
    title: 'Alıcı nakit teslim almak istiyor mu?',
    desc: 'Nakit teslim opsiyonu isteyenlerde transfer ağı kritik olur.',
    type: 'yesno',
  },
  {
    id: 'q8',
    title: 'Kur farkı (spread) senin için çok önemli mi?',
    desc: 'Bazı yöntemlerde "gizli maliyet" kur farkında saklı olabilir.',
    type: 'yesno',
  },
  {
    id: 'q9',
    title: 'Belgeler/uyum göstermen gerekebilir mi?',
    desc: 'Yüksek tutar ve iş transferlerinde bu daha sık görülür.',
    type: 'yesno',
  },
  {
    id: 'q10',
    title: 'Açıklama/fatura/referans alanları kritik mi?',
    desc: 'İş, kira, eğitim, kurumsal süreçlerde açıklama alanı önemli olabilir.',
    type: 'yesno',
  },
  {
    id: 'q11',
    title: 'Aynı gün içinde kesin teslim istiyor musun?',
    desc: 'Kesin süre beklentisi varsa hızlı kanallar öne çıkar.',
    type: 'yesno',
  },
  {
    id: 'q12',
    title: 'Hafta sonu/mesai dışı gönderim yapıyor musun?',
    desc: 'Bazı bankalar mesai dışı daha sınırlı çalışabilir.',
    type: 'yesno',
  },
  {
    id: 'q13',
    title: 'Sık sık TRY ve EUR bakiyesi tutuyor musun?',
    desc: 'Çoklu döviz hesapları bu senaryoda avantajlı olabilir.',
    type: 'yesno',
  },
  {
    id: 'q14',
    title: "'Tek uygulama' (hesap + kart + transfer) ister misin?",
    desc: 'Bazı çözümler kart+hesap+transferi tek yerde toplar.',
    type: 'yesno',
  },
  {
    id: 'q15',
    title: 'Kripto kullanmayı düşünüyor musun?',
    desc: 'Bu yol daha riskli/karmaşık olabilir; sadece bilinçli kullanıcılar için.',
    type: 'single',
    options: [
      { key: 'no', label: 'Hayır' },
      { key: 'maybe', label: 'Belki / emin değilim' },
      { key: 'yes', label: 'Evet (riskleri biliyorum)' },
    ],
  },
  {
    id: 'q16',
    title: 'Senin için önemli olan hangisi?',
    desc: 'Bazı servisler düşük ücret gösterip kurdan kazanır.',
    type: 'single',
    options: [
      { key: 'total_cost', label: 'Toplam maliyet (kur + ücret)' },
      { key: 'visible_fee', label: 'Görünen düşük ücret' },
      { key: 'dont_know', label: 'Fikrim yok / kararsızım' },
    ],
  },
  {
    id: 'q17',
    title: 'Transfer limitleri sorun oluyor mu?',
    desc: 'Günlük/aylık limitler bazı yöntemlerde kısıtlayıcı olabilir.',
    type: 'yesno',
  },
  {
    id: 'q18',
    title: 'Transferin resmi kayıtlarda görünmesi önemli mi?',
    desc: 'Kira, eğitim, iş ödemeleri gibi senaryolarda resmi kayıt kritik.',
    type: 'single',
    options: [
      { key: 'important', label: 'Evet, resmi olmalı' },
      { key: 'neutral', label: 'Fark etmez' },
      { key: 'not_important', label: 'Çok umurumda değil' },
    ],
  },
  {
    id: 'q19',
    title: 'Kampanya/bonus/indirim senin için önemli mi?',
    desc: 'Bazı servisler dönemsel olarak sıfır ücret veya daha iyi kur kampanyaları yapabilir.',
    type: 'yesno',
  },
  {
    id: 'q20',
    title: 'Teknoloji/dijital uygulama kullanımı konusunda nasılsın?',
    desc: 'Uygulama ağırlıklı çözümler herkese uygun olmayabilir.',
    type: 'single',
    options: [
      { key: 'advanced', label: 'İyiyim, teknolojiyle aram iyi' },
      { key: 'normal', label: 'Normal kullanıcıyım' },
      { key: 'low', label: 'Basit olsun isterim' },
    ],
  },
];
