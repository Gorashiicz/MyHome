# Plán implementace — Stavba Pod Kontrolou

## Architektura

- **Frontend + API:** Next.js App Router, server components + server actions
- **DB:** PostgreSQL, Prisma ORM, všechna projektová data scoped `projectId`
- **Auth:** Auth.js credentials, JWT session, Prisma adapter pro uživatele
- **Soubory:** lokální `uploads/{projectId}/…`, chráněný download přes `/api/soubory/…`
- **Oprávnění:** `lib/permissions.ts` — `requireProjectAccess`, `requireProjectEditor`, `requireProjectOwner`

## Klíčová rozhodnutí

| Oblast | Rozhodnutí |
|--------|------------|
| Package manager | npm (pnpm nedostupný v prostředí) |
| Prisma | v6 (stabilní `url` v schema) |
| Sdílení MVP | Pouze na úrovni projektu (owner/editor/viewer) |
| Granulární sdílení | Připraveno v DB (`Invitation`, budoucí rozšíření) |
| PDF exporty | Pouze struktura API CSV; PDF v roadmapě |
| UI | Vlastní komponenty inspirované shadcn + Tailwind 4 |

## Pořadí modulů (implementováno)

1. Scaffold, Prisma schema, seed  
2. Auth, projekty, oprávnění  
3. Dashboard, kategorie, výdaje, přílohy  
4. Dokumenty, fotky  
5. Úkoly, dodavatelé, deník, vady  
6. Sdílení, CSV exporty, mobilní navigace  

## První funkční milník

Uživatel se přihlásí → vytvoří stavbu → vidí kategorie → přidá výdaj s fakturou → dashboard a rozpočet se přepočítají.

## Rizika a mitigace

- **PostgreSQL nutný** — `docker-compose.yml` pro lokální vývoj  
- **Právní deník** — disclaimer v UI, viz `DIARY_DISCLAIMER`  
- **Soubory na disku** — `.gitignore` uploads; produkce → S3 adapter v `lib/storage.ts`  

## Assumptions

- Jedna měna CZK na projekt  
- Credentials auth stačí pro MVP (OAuth později)  
- Demo seed pro rychlé ověření UX  
