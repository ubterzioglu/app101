import type { RecruitmentAgency } from '@/constants/recruitment-agencies';

export type { RecruitmentAgency };

export interface JobFilters {
  query: string;
  category: string; // 'all' or a category label
  subCategory: string; // 'all' or a subCategory label
}

export const JOBS_ALL = 'all';
