import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'https://your-project-id.supabase.co' &&
  supabaseAnonKey !== 'your-anon-key'
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl as string, supabaseAnonKey as string, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

// Demo modu yalnızca açıkça istendiğinde veya backend hiç tanımlı değilken geçerlidir.
// Canlı backend'de hata alındığında demo veriye düşmek yasaktır.
export const isDemoMode =
  !isSupabaseConfigured || import.meta.env.VITE_DEMO_MODE === 'true';

export const isLiveBackend = Boolean(isSupabaseConfigured && supabase) && !isDemoMode;
