import { createClient } from '@supabase/supabase-js';

export const createSupabase = () => {
  const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
  const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY;

  return createClient(SUPABASE_URL, SUPABASE_KEY);
};