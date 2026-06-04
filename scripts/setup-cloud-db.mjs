/**
 * Aplikuje Prisma schéma na cloud PostgreSQL (Neon).
 * Nastavte DATABASE_URL v .env na Neon connection string, pak:
 *
 *   node scripts/setup-cloud-db.mjs
 */
import { execSync } from "node:child_process";
import { config } from "dotenv";

config();

if (!process.env.DATABASE_URL) {
  console.error("Chybí DATABASE_URL v .env");
  process.exit(1);
}

if (process.env.DATABASE_URL.includes("localhost")) {
  console.warn(
    "VAROVÁNÍ: DATABASE_URL ukazuje na localhost. Pro cloud nasazení nastavte Neon URL."
  );
}

console.log("Aplikuji schéma (prisma db push)...");
execSync("npx prisma db push", { stdio: "inherit" });

const seed = process.argv.includes("--seed");
if (seed) {
  console.log("Spouštím seed (demo data)...");
  execSync("npx prisma db seed", { stdio: "inherit" });
}

console.log("Hotovo.");
