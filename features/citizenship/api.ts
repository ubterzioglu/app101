import { supabase } from '@/lib/supabase';
import { GENERAL_POOL, type CitizenshipQuestion } from './types';

// Fetches the full question pool for a given "eyalet" value. The web app
// selects '*' and filters by eyalet; we keep that contract so RLS behavior
// matches. 'Genel' is the general pool.
export async function fetchQuestionsByPool(eyalet: string): Promise<CitizenshipQuestion[]> {
  const { data, error } = await supabase
    .from('vatandaslik_sorulari')
    .select('*')
    .eq('eyalet', eyalet);

  if (error) throw new Error('Sorular yüklenemedi.');
  return (data ?? []) as CitizenshipQuestion[];
}

export function fetchGeneralQuestions(): Promise<CitizenshipQuestion[]> {
  return fetchQuestionsByPool(GENERAL_POOL);
}

export function fetchStateQuestions(state: string): Promise<CitizenshipQuestion[]> {
  return fetchQuestionsByPool(state);
}
