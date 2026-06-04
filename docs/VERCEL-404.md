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

## 3. Environment Variables (povinné — bez nich app spadne)

**Settings → Environment Variables**

U každé proměnné zaškrtněte **Production** (ideálně i Preview).

| Key | Value |
|-----|-------|
| `AUTH_SECRET` | `wVg2JAbGEFdQy6lF/ohq8kheuVov7X0KhRGOPpKJNhI=` |
| `AUTH_URL` | `https://my-home-one-pi.vercel.app` |
| `DATABASE_URL` | Neon pooler connection string |
| `SUPABASE_URL` | `https://jeafghsjowwquymjleut.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | legacy service_role (eyJ…) |
| `SUPABASE_STORAGE_BUCKET` | `stavba-uploads` |
| `NODE_ENV` | `production` |

⚠️ Chyba `MissingSecret` = chybí `AUTH_SECRET` nebo nebyl **Redeploy** po přidání env.

## 4. Redeploy (povinné po env!)

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
