/**
 * Ověří připojení k Supabase Storage (stejné env jako na Vercelu).
 *
 *   node scripts/verify-supabase-storage.mjs
 */
import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

config();

const url = process.env.SUPABASE_URL?.trim().replace(/\/+$/, "");
const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim().replace(
  /^["']|["']$/g,
  ""
);
const bucket = process.env.SUPABASE_STORAGE_BUCKET ?? "stavba-uploads";

if (!url || !key) {
  console.error(
    "Chybí SUPABASE_URL nebo SUPABASE_SERVICE_ROLE_KEY v .env (nebo ve Vercel env)."
  );
  process.exit(1);
}

console.log("Supabase URL:", url);
console.log("Bucket:", bucket);
console.log("Klíč:", key.startsWith("eyJ") ? "legacy service_role (OK)" : key.slice(0, 8) + "…");

const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const { data: buckets, error: listError } = await supabase.storage.listBuckets();
if (listError) {
  console.error("\n❌ Nepodařilo se spojit se Supabase:", listError.message);
  if (/fetch failed/i.test(listError.message)) {
    console.error(
      "\nTip: URL neexistuje nebo je projekt smazaný/pozastavený.\n" +
        "Supabase Dashboard → obnovte projekt nebo vytvořte nový a aktualizujte env na Vercelu."
    );
  }
  if (listError.message.includes("Invalid Compact JWS") && key.startsWith("sb_")) {
    console.error(
      "\nTip: Použijte legacy service_role klíč (eyJ…) z API → Legacy keys."
    );
  }
  process.exit(1);
}

const bucketExists = buckets?.some((b) => b.name === bucket);
if (!bucketExists) {
  console.error(`\n❌ Bucket "${bucket}" neexistuje. Spusťte: node scripts/setup-supabase-bucket.mjs`);
  process.exit(1);
}

const testPath = `_healthcheck/${Date.now()}.txt`;
const { error: uploadError } = await supabase.storage
  .from(bucket)
  .upload(testPath, Buffer.from("ok"), { contentType: "text/plain", upsert: true });

if (uploadError) {
  console.error("\n❌ Testovací upload selhal:", uploadError.message);
  process.exit(1);
}

await supabase.storage.from(bucket).remove([testPath]);

console.log("\n✅ Supabase Storage funguje — upload by měl na Vercelu projít.");
