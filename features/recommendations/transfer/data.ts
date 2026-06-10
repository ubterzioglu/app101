// Para transferi sağlayıcı verisi + hesaplama. Web ParaTransferiClient.tsx'ten
// birebir kopyalanmıştır (plan §13.2, §13.4).

export interface TransferProvider {
  id: string;
  name: string;
  logo: string;
  feeType: 'fixed' | 'percentage' | 'hybrid';
  fixedFee: number;
  percentageFee: number;
  minFee: number;
  exchangeRateMargin: number;
  transferTime: string;
  rating: number;
  features: string[];
}

// Örnek referans kur (web ile aynı sabit). Sonuçlar bilgilendirme amaçlıdır.
export const EXCHANGE_RATE = 0.032;

export const TRANSFER_PROVIDERS: TransferProvider[] = [
  {
    id: 'wise',
    name: 'Wise',
    logo: '💰',
    feeType: 'percentage',
    fixedFee: 0.5,
    percentageFee: 0.5,
    minFee: 0.5,
    exchangeRateMargin: 0.5,
    transferTime: '1-2 iş günü',
    rating: 4.8,
    features: ['Düşük ücretler', 'Şeffaf kur', 'Hızlı transfer', 'Mobil uygulama'],
  },
  {
    id: 'remitly',
    name: 'Remitly',
    logo: '🌍',
    feeType: 'hybrid',
    fixedFee: 1.99,
    percentageFee: 1.5,
    minFee: 1.99,
    exchangeRateMargin: 1.0,
    transferTime: '1-3 iş günü',
    rating: 4.7,
    features: ['Hızlı transfer', 'Promosyonlar', 'Mobil uygulama', '7/24 destek'],
  },
  {
    id: 'western-union',
    name: 'Western Union',
    logo: '🔗',
    feeType: 'hybrid',
    fixedFee: 2.99,
    percentageFee: 2.0,
    minFee: 2.99,
    exchangeRateMargin: 1.5,
    transferTime: '1-3 iş günü',
    rating: 4.5,
    features: ['Geniş ağ', 'Nakit teslimat', 'Anında transfer', 'Global'],
  },
  {
    id: 'moneygram',
    name: 'MoneyGram',
    logo: '💵',
    feeType: 'hybrid',
    fixedFee: 2.99,
    percentageFee: 2.0,
    minFee: 2.99,
    exchangeRateMargin: 1.5,
    transferTime: '1-3 iş günü',
    rating: 4.4,
    features: ['Nakit teslimat', 'Hızlı transfer', 'Global ağ', 'Mobil uygulama'],
  },
  {
    id: 'xe',
    name: 'XE Money Transfer',
    logo: '📊',
    feeType: 'percentage',
    fixedFee: 0,
    percentageFee: 0.5,
    minFee: 0,
    exchangeRateMargin: 0.5,
    transferTime: '1-2 iş günü',
    rating: 4.6,
    features: ['Şeffaf kur', 'Düşük ücretler', 'Kur takibi', 'Mobil uygulama'],
  },
  {
    id: 'revolut',
    name: 'Revolut',
    logo: '🏦',
    feeType: 'percentage',
    fixedFee: 0,
    percentageFee: 0.5,
    minFee: 0,
    exchangeRateMargin: 0.5,
    transferTime: '1-2 iş günü',
    rating: 4.7,
    features: ['Şeffaf kur', 'Düşük ücretler', 'Mobil uygulama', 'Kart'],
  },
];
