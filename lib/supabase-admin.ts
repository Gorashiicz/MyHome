import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

function normalizeSupabaseUrl(url: string) {
  return url.trim().replace(/\/+$/, "");
}

function normalizeSupabaseKey(key: string) {
  return key.trim().replace(/^["']|["']$/g, "");
}

export function isCloudStorageEnabled() {
  return Boolean(
    process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

/** Na Vercelu musí být Supabase — lokální disk se neukládá mezi požadavky. */
export function requirePersistentStorage() {
  if (process.env.VERCEL && !isCloudStorageEnabled()) {
    throw new Error(
      "Na serveru chybí Supabase úložiště. Nastavte SUPABASE_URL a SUPABASE_SERVICE_ROLE_KEY ve Vercel (Production i Preview)."
    );
  }
}

export function getStorageBucketName() {
  return process.env.SUPABASE_STORAGE_BUCKET ?? "stavba-uploads";
}

export function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL
    ? normalizeSupabaseUrl(process.env.SUPABASE_URL)
    : "";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    ? normalizeSupabaseKey(process.env.SUPABASE_SERVICE_ROLE_KEY)
    : "";
  if (!url || !key) {
    throw new Error(
      "Supabase není nakonfigurován (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)."
    );
  }
  if (!client) {
    client = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return client;
}
