import { NextResponse } from "next/server";

/** Diagnostika env na Vercelu (bez citlivých hodnot). */
export async function GET() {
  return NextResponse.json({
    ok: Boolean(process.env.AUTH_SECRET && process.env.DATABASE_URL),
    authSecret: Boolean(process.env.AUTH_SECRET),
    authUrl: process.env.AUTH_URL ?? null,
    database: Boolean(process.env.DATABASE_URL),
    supabase: Boolean(process.env.SUPABASE_URL),
    supabaseKey: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
  });
}
