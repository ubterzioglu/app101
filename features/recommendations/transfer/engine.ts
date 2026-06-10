import { EXCHANGE_RATE, TRANSFER_PROVIDERS, type TransferProvider } from './data';

export interface TransferResult extends TransferProvider {
  fee: number;
  exchangeRate: number;
  receivedAmount: number;
  effectiveRate: number;
}

// Ported 1:1 from web ParaTransferiClient.calculateTransfer.
export function calculateTransfer(provider: TransferProvider, amount: number): {
  fee: number;
  exchangeRate: number;
  receivedAmount: number;
  effectiveRate: number;
} {
  let fee = 0;
  if (provider.feeType === 'fixed') {
    fee = provider.fixedFee;
  } else if (provider.feeType === 'percentage') {
    fee = Math.max(amount * (provider.percentageFee / 100), provider.minFee);
  } else {
    fee = Math.max(provider.fixedFee + amount * (provider.percentageFee / 100), provider.minFee);
  }

  const exchangeRate = EXCHANGE_RATE * (1 - provider.exchangeRateMargin / 100);
  const receivedAmount = (amount - fee) * exchangeRate;

  return { fee, exchangeRate, receivedAmount, effectiveRate: receivedAmount / amount };
}

/** Ranks providers by net received amount (highest first). */
export function rankTransfers(amount: number): TransferResult[] {
  return TRANSFER_PROVIDERS.map((provider) => ({
    ...provider,
    ...calculateTransfer(provider, amount),
  })).sort((a, b) => b.receivedAmount - a.receivedAmount);
}
