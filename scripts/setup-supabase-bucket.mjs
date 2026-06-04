/**
 * Vytvoří bucket pro uploady v Supabase (pokud ještě neexistuje).
 * Spusťte po nastavení SUPABASE_URL a SUPABASE_SERVICE_ROLE_KEY v .env:
 *
 *   node scripts/setup-supabase-bucket.mjs
 */
import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

config();

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const bucket = process.env.SUPABASE_STORAGE_BUCKET ?? "stavba-uploads";

if (!url || !key) {
  console.error(
    "Chybí SUPABASE_URL nebo SUPABASE_SERVICE_ROLE_KEY v .env souboru."
  );
  process.exit(1);
}

const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const { data: existing, error: listError } =
  await supabase.storage.listBuckets();
if (listError) {
  console.error("Nepodařilo se načíst buckety:", listError.message);
  process.exit(1);
}

if (existing?.some((b) => b.name === bucket)) {
  console.log(`Bucket "${bucket}" už existuje.`);
  process.exit(0);
}

const { error: createError } = await supabase.storage.createBucket(bucket, {
  public: false,
  fileSizeLimit: 15 * 1024 * 1024,
  allowedMimeTypes: [
    "image/jpeg",
    "image/png",
    "image/webp",
    "application/pdf",
  ],
});

if (createError) {
  console.error("Nepodařilo se vytvořit bucket:", createError.message);
  process.exit(1);
}

console.log(`Bucket "${bucket}" byl vytvořen.`);
