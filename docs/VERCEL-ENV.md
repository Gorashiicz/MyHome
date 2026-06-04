# Proměnné pro Vercel (MyHome)

V projektu **my-home** → Settings → Environment Variables → vložte všechny řádky níže.
Po prvním deployi upravte `AUTH_URL` na skutečnou URL a redeploy.

| Key | Value |
|-----|-------|
| `DATABASE_URL` | viz `.env` (pooler host s `-pooler`) |
| `AUTH_SECRET` | viz `.env` |
| `AUTH_URL` | `https://my-home-one-pi.vercel.app` |
| `SUPABASE_URL` | viz `.env` |
| `SUPABASE_SERVICE_ROLE_KEY` | viz `.env` |
| `SUPABASE_STORAGE_BUCKET` | `stavba-uploads` |
| `NODE_ENV` | `production` |

**Poznámka:** Soubor `.env` není na GitHubu — hodnoty kopírujte z lokálního `.env` na notebooku.
