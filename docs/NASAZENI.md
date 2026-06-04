# Nasazení na web (Vercel + Neon + Supabase) — zdarma

Kompletní postup, aby aplikace běžela online a šla otevřít z mobilu.

**Čas:** cca 30–45 minut (jednorázově)  
**Náklady:** free tier (Vercel Hobby + Neon Free + Supabase Free)

---

## Přehled

```
GitHub  →  Vercel (Next.js)
              ↓
           Neon (PostgreSQL)
              ↓
           Supabase Storage (fotky, faktury)
```

Lokálně na notebooku app funguje dál stejně — bez Supabase proměnných ukládá soubory do složky `uploads/`.

---

## Krok 1 — GitHub repozitář

Projekt zatím není na GitHubu. Vytvořte **soukromý** repozitář:

1. Otevřete https://github.com/new
2. Název např. `stavba-pod-kontrolou`
3. **Private** ✓, bez README (projekt už existuje)
4. V terminálu v kořeni projektu (repozitář: [Gorashiicz/MyHome](https://github.com/Gorashiicz/MyHome)):

```powershell
cd "c:\Users\rober\Desktop\MyStavba"
git remote add origin https://github.com/Gorashiicz/MyHome.git
git push -u origin main
```

(Pokud už je `origin` nastavený, stačí `git push`.)

---

## Krok 2 — Neon (PostgreSQL zdarma)

1. Registrace: https://neon.tech
2. **New Project** → region **EU (Frankfurt)** → Create
3. V **Connection details** zkopírujte **Connection string** (Pooled)
4. Do `.env` na notebooku (dočasně) vložte:

```
DATABASE_URL="postgresql://...neon.tech/neondb?sslmode=require"
```

5. Aplikujte schéma a volitelně demo data:

```powershell
node scripts/setup-cloud-db.mjs --seed
```

Demo účet po seedu: `demo@stavba.cz` / `demo1234`

---

## Krok 3 — Supabase Storage (soubory zdarma)

1. Registrace: https://supabase.com
2. **New project** → region **Central EU** → heslo k DB (nemusíte ho používat, app používá Neon)
3. Po vytvoření: **Project Settings → API**
   - **Project URL** → `SUPABASE_URL`
   - **service_role** key (secret) → `SUPABASE_SERVICE_ROLE_KEY`  
     ⚠️ Nikdy nesdílejte veřejně, jen Vercel env vars!
4. Do `.env` přidejte:

```
SUPABASE_URL="https://xxxxx.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="eyJ..."
SUPABASE_STORAGE_BUCKET="stavba-uploads"
```

5. Vytvořte bucket:

```powershell
node scripts/setup-supabase-bucket.mjs
```

---

## Krok 4 — Vercel (hosting zdarma)

1. Registrace: https://vercel.com (přihlášení přes GitHub)
2. **Add New → Project** → Import repozitář [Gorashiicz/MyHome](https://github.com/Gorashiicz/MyHome)
3. Framework: **Next.js** (automaticky)
4. **Environment Variables** — přidejte všechny:

| Proměnná | Hodnota |
|----------|---------|
| `DATABASE_URL` | Connection string z Neon (pooled) |
| `AUTH_SECRET` | `node scripts/generate-auth-secret.mjs` |
| `AUTH_URL` | Nejdřív `https://VASE-APP.vercel.app` (upravíte po 1. deployi) |
| `SUPABASE_URL` | z Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | z Supabase (service_role) |
| `SUPABASE_STORAGE_BUCKET` | `stavba-uploads` |
| `NODE_ENV` | `production` |

5. **Deploy**

6. Po prvním deployi zkopírujte skutečnou URL (např. `https://stavba-pod-kontrolou.vercel.app`) a v Vercel **Settings → Environment Variables** upravte `AUTH_URL` na tuto adresu → **Redeploy**.

---

## Krok 5 — Ověření

1. Otevřete URL z Vercelu v mobilním prohlížeči
2. Přihlaste se (`demo@stavba.cz` / `demo1234` pokud jste spustili seed)
3. Zkuste přidat výdaj s fakturou nebo fotku — mělo by se nahrát do Supabase

---

## Příkazy v projektu

```powershell
node scripts/generate-auth-secret.mjs   # nový AUTH_SECRET
node scripts/setup-cloud-db.mjs         # prisma db push na Neon
node scripts/setup-cloud-db.mjs --seed  # + demo data
node scripts/setup-supabase-bucket.mjs  # bucket pro soubory
npm run build                         # lokální test produkčního buildu
```

---

## Lokální vývoj vs cloud

| | Lokálně | Cloud (Vercel) |
|---|---------|----------------|
| DB | localhost PostgreSQL | Neon |
| Soubory | složka `uploads/` | Supabase Storage |
| URL | localhost:3000 | *.vercel.app |

Pro lokální vývoj **nemusíte** mít Supabase — funguje disk. Pro test cloud storage lokálně doplňte Supabase proměnné do `.env`.

---

## Limity free tieru

- **Neon** — DB může po nečinnosti „usnout“, první načtení trvá pár sekund
- **Vercel** — hobby plán, dost pro osobní stavbu
- **Supabase** — 1 GB storage

---

## Řešení problémů

**Chyba při přihlášení / session**  
→ Zkontrolujte `AUTH_URL` (musí přesně odpovídat URL v prohlížeči, včetně `https://`)

**Upload souboru selže**  
→ Bucket vytvořen? `node scripts/setup-supabase-bucket.mjs`  
→ `SUPABASE_SERVICE_ROLE_KEY` je service_role, ne anon key

**Prisma / DB chyba**  
→ `DATABASE_URL` musí být Neon pooled string s `?sslmode=require`  
→ Spusťte znovu `node scripts/setup-cloud-db.mjs`

**Build na Vercelu padá**  
→ Logy v Vercel → Deployments → View Function Logs  
→ Lokálně ověřte: `npm run build`

---

## Vlastní doména (volitelně)

V Vercel → Project → Settings → Domains — přidejte doménu a upravte `AUTH_URL`.
