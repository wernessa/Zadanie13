import { createClient } from '@supabase/supabase-js';

export const createSupabase = () => {
  const SUPABASE_URL = 'https://ylolgqlltxgtemyjnogh.supabase.co';
  const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlsb2xncWxsdHhndGVteWpub2doIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxOTczMjMsImV4cCI6MjA2NTc3MzMyM30.2KD8rx2yPdNGSmqB2BLmiYrFb9T5pAPKZ14PGaErGy8';

  return createClient(SUPABASE_URL, SUPABASE_KEY);
};