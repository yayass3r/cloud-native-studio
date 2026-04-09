import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

let _supabase: SupabaseClient | null = null;
let _supabaseAdmin: SupabaseClient | null = null;

// Lazy-init client-side Supabase (anon key - restricted permissions)
export function getSupabase(): SupabaseClient | null {
  if (_supabase) return _supabase;
  if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'https://placeholder.supabase.co') return null;
  _supabase = createClient(supabaseUrl, supabaseAnonKey);
  return _supabase;
}

// Lazy-init server-side Supabase (service role - full access)
export function getSupabaseAdmin(): SupabaseClient | null {
  if (_supabaseAdmin) return _supabaseAdmin;
  const key = supabaseServiceKey || supabaseAnonKey;
  if (!supabaseUrl || !key || supabaseUrl === 'https://placeholder.supabase.co') return null;
  _supabaseAdmin = createClient(supabaseUrl, key);
  return _supabaseAdmin;
}

// Check if Supabase is configured
export function isSupabaseConfigured(): boolean {
  return !!(supabaseUrl && supabaseAnonKey && supabaseUrl !== 'https://placeholder.supabase.co');
}
