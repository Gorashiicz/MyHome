# Stavba Pod Kontrolou

Mobilně použitelná webová aplikace pro stavebníky svépomocí.

## Spuštění (vše je už nainstalované)

**Dvojklik na `SPUSTIT.bat`** v kořeni projektu — nebo v terminálu:

```bash
npm run dev
```

Otevřete **http://localhost:3000**

### Demo přihlášení

| E-mail | Heslo |
|--------|-------|
| demo@stavba.cz | demo1234 |

---

## Co je na tomto počítači připraveno

- Node.js závislosti (`npm install` ✓)
- PostgreSQL 17 (služba `postgresql-x64-17`, běží automaticky)
- Databáze `stavba_pod_kontrolou`, uživatel `stavba` / `stavba`
- Tabulky + demo data (seed ✓)
- Soubor `.env` s `AUTH_SECRET`

## Po reinstalaci / novém PC

1. Nainstalovat [Node.js](https://nodejs.org) a PostgreSQL 17 (`winget install PostgreSQL.PostgreSQL.17`)
2. V kořeni projektu:
   ```bash
   npm install
   npm run setup
   ```
3. Spustit `SPUSTIT.bat` nebo `npm run dev`

---

## Nasazení na web (mobil, zdarma)

Kompletní návod: **[docs/NASAZENI.md](docs/NASAZENI.md)** — Vercel + Neon + Supabase Storage.

---

## Technologie

- Next.js 15 (App Router), TypeScript, Tailwind CSS
- Prisma 6 + PostgreSQL
- Auth.js (NextAuth v5) — e-mail a heslo
- Zod, React Hook Form, date-fns
- Lokální úložiště souborů (dev) / Supabase Storage (cloud)

## Rychlý start (nová instalace)

### 1. Databáze

PostgreSQL 17 je nainstalovaný lokálně. Služba musí běžet (`postgresql-x64-17`).

### 2. Proměnné prostředí

Soubor `.env` je v repozitáři připravený (necommitovat do gitu).

### 3. Instalace a migrace

```bash
npm install
npm run setup
```

### 4. Spuštění

```bash
npm run dev
```

Nebo **`SPUSTIT.bat`**.

### Demo účet (po seed)

| Pole   | Hodnota        |
|--------|----------------|
| E-mail | demo@stavba.cz |
| Heslo  | demo1234       |

---

## Původní manuální postup (Docker)

## Hlavní funkce MVP

- Registrace, přihlášení, více staveb (projektů)
- Rozpočet s kategoriemi, výdaje, přílohy faktur/účtenek
- Dashboard s přehledem financí a aktivit
- Dokumenty, fotky, úkoly, dodavatelé
- Stavební deník (evidenční pomůcka, ne právní garance)
- Vady a reklamace
- Sdílení projektu (vlastník / editor / čtenář)
- Export CSV — výdaje a rozpočet

## Dokumentace

- [docs/projektovy_list_stavebni_aplikace.md](docs/projektovy_list_stavebni_aplikace.md) — produktová specifikace
- [docs/CURSOR_PROMPT_stavebni_aplikace.md](docs/CURSOR_PROMPT_stavebni_aplikace.md) — vývojové zadání
- [docs/IMPLEMENTATION_PLAN.md](docs/IMPLEMENTATION_PLAN.md) — architektura a rozhodnutí

## Příkazy

```bash
npm run dev          # vývoj
npm run build        # produkční build
npm run typecheck    # TypeScript
npm run lint         # ESLint
npm run db:studio    # Prisma Studio
```

## Struktura

```
app/           # stránky a API routes
actions/       # server actions
components/    # UI a layout
lib/           # auth, DB, oprávnění, formátování
prisma/        # schéma a seed
uploads/       # nahrané soubory (lokálně)
docs/          # specifikace
```

## Licence

Soukromý projekt — upravte dle potřeby.
