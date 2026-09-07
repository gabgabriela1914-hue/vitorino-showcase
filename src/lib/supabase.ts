import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_ANON_KEY, SUPABASE_URL, temSupabase } from "./supabase-config";

let cliente: SupabaseClient | null = null;

/** Cliente do banco da usuária. Retorna null enquanto a conexão não estiver preenchida. */
export function getSupabase(): SupabaseClient | null {
  if (!temSupabase) return null;
  cliente ??= createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cliente;
}
