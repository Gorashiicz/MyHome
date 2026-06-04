# Oprava 404 DEPLOYMENT_NOT_FOUND na Vercel

## 1. Ověřte správnou URL

Ve Vercelu: **my-home → Settings → Domains**

Používejte URL uvedenou u **Production** (např. `my-home-xxxx.vercel.app`).
Staré odkazy z e-mailu nebo preview deploymentů často vrací `DEPLOYMENT_NOT_FOUND`.

## 2. Zkontrolujte poslední deployment

**Deployments** → nejnovější řádek:

| Stav | Co dělat |
|------|----------|
| **Ready** (zelená) | Otevřete URL z Domains, ne starý odkaz |
| **Error** (červená) | Klikněte → **Building** log, pošlete chybu |
| **Žádný deployment** | **Deploy** znovu (viz krok 3) |

## 3. Environment Variables (povinné)

**Settings → Environment Variables** — všechny pro **Production**:

Viz soubor `.env.vercel` v projektu nebo tabulka v `docs/NASAZENI.md`.

Minimálně:
- `DATABASE_URL` (Neon **pooler**)
- `AUTH_SECRET`
- `AUTH_URL` = přesná production URL z Domains
- `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_STORAGE_BUCKET`
- `NODE_ENV` = `production`

## 4. Redeploy

**Deployments → … u posledního → Redeploy**

Nebo push na GitHub (automatický deploy):

```powershell
git add .
git commit -m "Fix Vercel Prisma binary targets"
git push
```

## 5. Test

Po **Ready** otevřete production URL → `/prihlaseni`  
Demo: `demo@stavba.cz` / `demo1234`
