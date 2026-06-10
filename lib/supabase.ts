import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

import { env } from './env';

// Public read client. Uses the publishable key + RLS only.
// The service_role key is NEVER present in the mobile bundle.
//
// SSR-safe: during web static rendering (Expo Router renders routes in Node),
// there is no `window` and AsyncStorage cannot run. In that case we disable
// session persistence and storage so the client can still read public data.
// On a real device/browser the full auth storage is used, so adding Supabase
// Auth later requires no architectural change.
const isBrowserOrNative = typeof window !== 'undefined';

export const supabase = createClient(
  env.EXPO_PUBLIC_SUPABASE_URL,
  env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  {
    auth: isBrowserOrNative
      ? {
          storage: AsyncStorage,
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: false,
        }
      : {
          autoRefreshToken: false,
          persistSession: false,
          detectSessionInUrl: false,
        },
  }
);
