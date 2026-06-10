import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

import { env } from './env';

// Public read client. Uses the publishable key + RLS only.
// The service_role key is NEVER present in the mobile bundle.
//
// Auth is configured up-front so adding Supabase Auth later requires no
// architectural change, even though the MVP performs read-only public access.
export const supabase = createClient(
  env.EXPO_PUBLIC_SUPABASE_URL,
  env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);
