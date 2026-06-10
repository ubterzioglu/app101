import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { calculateSalary } from '@/features/salary/calculator';
import type { SalaryInput } from '@/features/salary/types';

// Run with: GENERATE_FIXTURES=1 npx jest tests/fixtures/generate-salary-fixtures
// Regenerates salary-fixtures.json from the current calculator. Skipped in
// normal CI runs so it never overwrites the committed golden file silently.
const baseInput: SalaryInput = {
  amount: 0,
  period: 'monthly',
  type: 'gross',
  taxClass: '1',
  state: 'NRW',
  hasChildren: false,
  childrenCount: 0,
  childrenUnder25Count: 0,
  age23Plus: true,
  churchTax: false,
  childAllowance: 0,
  insuranceType: 'gkv',
  kvBase: 14.6,
  kvZusatz: 2.5,
  pkvPremium: 0,
  ppvPremium: 0,
};

const cases: Partial<SalaryInput>[] = [
  { amount: 2000, taxClass: '1' },
  { amount: 3000, taxClass: '1' },
  { amount: 3500, taxClass: '1', state: 'BY', churchTax: true },
  { amount: 4000, taxClass: '3' },
  { amount: 4500, taxClass: '4', hasChildren: true, childrenUnder25Count: 2 },
  { amount: 5000, taxClass: '1' },
  { amount: 5500, taxClass: '5' },
  { amount: 6000, taxClass: '6' },
  { amount: 2500, taxClass: '2', hasChildren: true, childrenUnder25Count: 1 },
  { amount: 7000, taxClass: '1', state: 'SN' },
  { amount: 8000, taxClass: '3', churchTax: true, state: 'BW' },
  { amount: 10000, taxClass: '1' },
  { amount: 3200, taxClass: '1', age23Plus: false },
  { amount: 4800, taxClass: '4', hasChildren: true, childrenUnder25Count: 3 },
  { amount: 60000, period: 'yearly', taxClass: '1' },
  { amount: 90000, period: 'yearly', taxClass: '3' },
  { amount: 2800, type: 'net', taxClass: '1' },
  { amount: 2000, type: 'net', taxClass: '1' },
  { amount: 3500, type: 'net', taxClass: '3' },
  { amount: 1500, taxClass: '1' },
  { amount: 12000, taxClass: '1' },
  { amount: 4200, taxClass: '1', insuranceType: 'pkv', pkvPremium: 450, ppvPremium: 60 },
];

(process.env.GENERATE_FIXTURES ? describe : describe.skip)('generate salary fixtures', () => {
  it('writes salary-fixtures.json', () => {
    const fixtures = cases.map((c) => {
      const input: SalaryInput = { ...baseInput, ...c };
      const r = calculateSalary(input);
      return {
        input,
        expected: {
          grossMonthly: r.grossMonthly,
          netMonthly: r.netMonthly,
          deductionsMonthly: r.deductionsMonthly,
          tax: { lohnsteuer: r.tax.lohnsteuer, soli: r.tax.soli, source: r.tax.source },
          social: r.social,
          kirchensteuer: r.kirchensteuer,
        },
      };
    });
    writeFileSync(
      resolve(__dirname, 'salary-fixtures.json'),
      JSON.stringify(fixtures, null, 2),
      'utf8'
    );
    expect(fixtures.length).toBeGreaterThanOrEqual(20);
  });
});
