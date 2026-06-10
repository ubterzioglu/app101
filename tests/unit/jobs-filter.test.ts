import {
  filterAgencies,
  getActiveAgencies,
  getCategories,
  getJobStats,
  getSubCategories,
} from '@/features/jobs/filter';
import { JOBS_ALL } from '@/features/jobs/types';

describe('jobs static data', () => {
  const agencies = getActiveAgencies();

  it('loads a non-trivial number of active agencies', () => {
    expect(agencies.length).toBeGreaterThan(100);
    expect(agencies.every((a) => a.status === 'active')).toBe(true);
  });

  it('exposes both main categories', () => {
    const cats = getCategories(agencies);
    expect(cats).toContain('İş Bulma Ajansları');
    expect(cats).toContain('İngilizce İşe Alan Şirketler');
  });

  it('counts english-recruiting companies separately', () => {
    const stats = getJobStats(agencies);
    expect(stats.total).toBe(agencies.length);
    expect(stats.englishCompanies).toBeGreaterThan(0);
    expect(stats.englishCompanies).toBeLessThanOrEqual(stats.total);
  });

  it('subcategories scope to the selected category', () => {
    const all = getSubCategories(agencies, JOBS_ALL);
    const scoped = getSubCategories(agencies, 'İş Bulma Ajansları');
    expect(all.length).toBeGreaterThanOrEqual(scoped.length);
  });
});

describe('filterAgencies (offline)', () => {
  const agencies = getActiveAgencies();

  it('filters by category', () => {
    const res = filterAgencies(agencies, {
      query: '',
      category: 'İş Bulma Ajansları',
      subCategory: JOBS_ALL,
    });
    expect(res.every((a) => a.category === 'İş Bulma Ajansları')).toBe(true);
  });

  it('filters by free-text query (Turkish-aware)', () => {
    const res = filterAgencies(agencies, { query: 'randstad', category: JOBS_ALL, subCategory: JOBS_ALL });
    expect(res.some((a) => a.name.toLowerCase().includes('randstad'))).toBe(true);
  });

  it('returns all active for empty filters', () => {
    const res = filterAgencies(agencies, { query: '', category: JOBS_ALL, subCategory: JOBS_ALL });
    expect(res).toHaveLength(agencies.length);
  });
});
