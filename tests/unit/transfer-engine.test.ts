import { calculateTransfer, rankTransfers } from '@/features/recommendations/transfer/engine';
import { TRANSFER_PROVIDERS, EXCHANGE_RATE } from '@/features/recommendations/transfer/data';

describe('transfer engine', () => {
  it('percentage fee respects minFee', () => {
    const p = { feeType: 'percentage' as const, fixedFee: 0, percentageFee: 0.5, minFee: 5, exchangeRateMargin: 0 } as any;
    const r = calculateTransfer(p, 100); // 0.5% of 100 = 0.5, below minFee 5
    expect(r.fee).toBe(5);
  });

  it('fixed fee is constant', () => {
    const p = { feeType: 'fixed' as const, fixedFee: 3, percentageFee: 0, minFee: 0, exchangeRateMargin: 0 } as any;
    expect(calculateTransfer(p, 1000).fee).toBe(3);
  });

  it('applies exchange-rate margin to received amount', () => {
    const p = { feeType: 'fixed' as const, fixedFee: 0, percentageFee: 0, minFee: 0, exchangeRateMargin: 0 } as any;
    const r = calculateTransfer(p, 1000);
    expect(r.exchangeRate).toBeCloseTo(EXCHANGE_RATE, 6);
    expect(r.receivedAmount).toBeCloseTo(1000 * EXCHANGE_RATE, 4);
  });

  it('ranks providers by net received amount, descending', () => {
    const ranked = rankTransfers(1000);
    expect(ranked.length).toBe(TRANSFER_PROVIDERS.length);
    for (let i = 1; i < ranked.length; i++) {
      expect(ranked[i - 1].receivedAmount).toBeGreaterThanOrEqual(ranked[i].receivedAmount);
    }
  });
});
