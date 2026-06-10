import { calculateSalary } from '@/features/salary/calculator';
import type { SalaryInput } from '@/features/salary/types';
import fixtures from '../fixtures/salary-fixtures.json';

interface Fixture {
  input: SalaryInput;
  expected: {
    grossMonthly: number;
    netMonthly: number;
    deductionsMonthly: number;
    tax: { lohnsteuer: number; soli: number; source: string };
    social: { kv: number; pv: number; rv: number; av: number; total: number };
    kirchensteuer: number;
  };
}

const cases = fixtures as Fixture[];

describe('salary calculator web parity', () => {
  it('has at least 20 fixtures', () => {
    expect(cases.length).toBeGreaterThanOrEqual(20);
  });

  it.each(cases)(
    'reproduces fixture for %#: $input.amount $input.period $input.type (Stkl $input.taxClass)',
    (fixture) => {
      const r = calculateSalary(fixture.input);

      if (fixture.input.type === 'gross') {
        // Gross is the input; net is computed.
        expect(r.grossMonthly).toBeCloseTo(fixture.expected.grossMonthly, 2);
        expect(r.netMonthly).toBeCloseTo(fixture.expected.netMonthly, 2);
      } else {
        // Net is the target; gross is found via binary search (allow 1 cent).
        expect(r.netMonthly).toBeCloseTo(fixture.expected.netMonthly, 2);
        expect(r.grossMonthly).toBeCloseTo(fixture.expected.grossMonthly, 1);
      }

      expect(r.deductionsMonthly).toBeCloseTo(fixture.expected.deductionsMonthly, 1);
      expect(r.tax.lohnsteuer).toBeCloseTo(fixture.expected.tax.lohnsteuer, 1);
      expect(r.tax.soli).toBeCloseTo(fixture.expected.tax.soli, 2);
      expect(r.tax.source).toBe(fixture.expected.tax.source);
      expect(r.social.total).toBeCloseTo(fixture.expected.social.total, 1);
      expect(r.kirchensteuer).toBeCloseTo(fixture.expected.kirchensteuer, 2);
    }
  );
});

describe('salary calculator guards', () => {
  const base: SalaryInput = cases[0].input;

  it('handles zero gross without throwing', () => {
    const r = calculateSalary({ ...base, amount: 0, type: 'gross' });
    expect(r.grossMonthly).toBe(0);
    expect(r.netMonthly).toBeGreaterThanOrEqual(0);
  });

  it('tax source is legacy (beta) — not BMF-verified', () => {
    const r = calculateSalary({ ...base, amount: 3000, type: 'gross' });
    expect(r.tax.source).toBe('legacy');
  });
});
