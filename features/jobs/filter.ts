import { RECRUITMENT_AGENCIES, type RecruitmentAgency } from '@/constants/recruitment-agencies';
import { JOBS_ALL, type JobFilters } from './types';

const ENGLISH_CATEGORY = 'İngilizce İşe Alan Şirketler';

export function getActiveAgencies(): RecruitmentAgency[] {
  return RECRUITMENT_AGENCIES.filter((a) => a.status === 'active');
}

export function getCategories(agencies: RecruitmentAgency[]): string[] {
  return [...new Set(agencies.map((a) => a.category))].filter(Boolean).sort();
}

export function getSubCategories(agencies: RecruitmentAgency[], category: string): string[] {
  const pool = category === JOBS_ALL ? agencies : agencies.filter((a) => a.category === category);
  return [...new Set(pool.map((a) => a.subCategory))].filter(Boolean).sort();
}

/** Counts of agencies and English-recruiting companies (plan §12.8 UI). */
export function getJobStats(agencies: RecruitmentAgency[]): {
  total: number;
  englishCompanies: number;
} {
  return {
    total: agencies.length,
    englishCompanies: agencies.filter((a) => a.category === ENGLISH_CATEGORY).length,
  };
}

/** Pure, offline-capable filtering over the static agency list (plan §12.8). */
export function filterAgencies(
  agencies: RecruitmentAgency[],
  filters: JobFilters
): RecruitmentAgency[] {
  const q = filters.query.trim().toLocaleLowerCase('tr-TR');
  return agencies.filter((a) => {
    if (filters.category !== JOBS_ALL && a.category !== filters.category) return false;
    if (filters.subCategory !== JOBS_ALL && a.subCategory !== filters.subCategory) return false;
    if (!q) return true;
    return [a.name, a.description, a.subCategory]
      .filter(Boolean)
      .some((field) => String(field).toLocaleLowerCase('tr-TR').includes(q));
  });
}
