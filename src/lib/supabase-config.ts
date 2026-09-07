/**
 * Conexão com o SEU banco de dados (Supabase próprio).
 *
 * Preencha os dois valores abaixo com os dados do seu projeto:
 *   Supabase → Project Settings → API
 *   - Project URL        →  SUPABASE_URL
 *   - anon public key    →  SUPABASE_ANON_KEY
 *
 * Esses dois valores são públicos por natureza (ficam no navegador),
 * por isso podem ficar aqui no código. Nunca coloque a chave "service_role".
 *
 * Enquanto estiverem vazios, a vitrine continua salvando no próprio celular.
 */
export const SUPABASE_URL = "";
export const SUPABASE_ANON_KEY = "";

export const BUCKET = "product-media";

export const temSupabase = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
