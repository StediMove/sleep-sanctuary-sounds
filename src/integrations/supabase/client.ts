
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://sbczhprnlejjmdoqbkwz.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNiY3pocHJubGVqam1kb3Fia3d6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3Mzk0MTYsImV4cCI6MjA2NTMxNTQxNn0.MAFEvZO4P4nBzrVCGkGErm2UoP6H3vUIMCtipp0g4ig";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: {
      getItem: (key) => {
        if (typeof window === 'undefined') {
          return null;
        }
        return window.localStorage.getItem(key);
      },
      setItem: (key, value) => {
        if (typeof window === 'undefined') {
          return;
        }
        window.localStorage.setItem(key, value);
      },
      removeItem: (key) => {
        if (typeof window === 'undefined') {
          return;
        }
        window.localStorage.removeItem(key);
      },
    },
  },
});
