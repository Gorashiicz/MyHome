import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/** Diagnostika env a DB na Vercelu (bez citlivých hodnot). */
export async function GET() {
  const hasEnv = Boolean(process.env.AUTH_SECRET && process.env.DATABASE_URL);
  let dbOk = false;
  let dbError: string | null = null;

  if (hasEnv) {
    try {
      await prisma.$queryRaw`SELECT 1`;
      dbOk = true;
    } catch (e) {
      dbError = e instanceof Error ? e.message : "DB connection failed";
    }
  }

  return NextResponse.json({
    ok: hasEnv && dbOk,
    message: !hasEnv
      ? "Chybí env proměnné ve Vercelu."
      : !dbOk
        ? `DB neodpovídá: ${dbError}`
        : "OK",
    authSecret: Boolean(process.env.AUTH_SECRET),
    authUrl: process.env.AUTH_URL ?? null,
    database: Boolean(process.env.DATABASE_URL),
    databaseLive: dbOk,
    supabase: Boolean(process.env.SUPABASE_URL),
    supabaseKey: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
  });
}
