# Cursor Prompt — Vývoj aplikace pro stavebníky svépomocí

Tento dokument obsahuje kompletní zadání pro Cursor, aby podle projektového listu připravil a postupně naprogramoval MVP aplikace pro stavebníky svépomocí.

Doporučené umístění v repozitáři:

```text
/docs/CURSOR_PROMPT.md
```

Projektový list aplikace doporučuji mít v repozitáři jako:

```text
/docs/PROJECT_BRIEF.md
```

---

# 1. Master prompt pro Cursor

Níže uvedený prompt vlož do Cursoru jako hlavní zadání.

```text
You are a senior full-stack engineer, product architect, UX designer, and technical lead.

Your task is to build a production-ready MVP of a mobile-first web application for people building a house by self-construction.

The application must follow the product specification in:

/docs/PROJECT_BRIEF.md

If the project brief is available only as DOCX or PDF, first inspect it and create a normalized implementation summary in:

/docs/IMPLEMENTATION_PLAN.md

The app must be built as a real working application, not only a prototype. Use persistent database storage, real authentication, real CRUD flows, server-side authorization checks, responsive UI, and a clean maintainable architecture.

Main product goal:
Build a mobile-first construction management app for private self-builders. The user can create a building project, set a construction budget or leave it open, track expenses, upload invoices and receipts, manage project documentation, photos, tasks, suppliers, construction diary entries, defects, deadlines, and share access with other users using different permissions.

Use this tech stack unless the current repository already has a different stack:
- Next.js with App Router
- TypeScript, strict mode
- Tailwind CSS
- shadcn/ui or a clean component system
- Prisma ORM
- PostgreSQL
- Auth.js / NextAuth or equivalent authentication
- Zod for validation
- React Hook Form for forms
- date-fns for date handling
- CZK currency formatting
- Czech locale and Czech UI labels
- Mobile-first responsive design
- PWA-friendly structure

Use pnpm as the package manager unless the repo already uses npm or yarn.

Important UX principles:
- The app must be fast and usable on mobile.
- Adding an expense from a phone must be simple and quick.
- The central action should be “Přidat” with quick options:
  - Přidat výdaj
  - Přidat fakturu
  - Přidat fotku
  - Přidat úkol
  - Přidat dokument
  - Přidat záznam do deníku
  - Přidat vadu
- The UI language must be Czech.
- Dates should be displayed in Czech format, for example 14. 9. 2026.
- Currency should be displayed in CZK.
- The application must work well on mobile, tablet, and desktop.
- The user is often tired, on a construction site, and using a phone. Prefer quick entry, simple forms, sane defaults, and later detail editing.
- Avoid building a heavy ERP. Build a practical construction notebook and budget control system.

Core MVP modules to implement:

1. Authentication
- User registration
- Login
- Logout
- Protected routes
- Current user profile

2. Projects / Stavby
- User can create a construction project
- Project fields:
  - name
  - description
  - address or location text
  - construction type
  - budget mode: limited or open
  - total budget limit, optional
  - start date
  - expected finish date
  - status: planning, active, paused, finished, archived
- User can switch between projects
- All data must be scoped to the selected project

3. Dashboard
Show a project overview:
- total budget
- total spent
- remaining budget
- budget overrun warning
- number of unpaid expenses
- upcoming tasks/deadlines
- recent expenses
- recent documents
- recent diary entries
- defects open count

4. Budget Categories
Create default categories for a construction project:
- Pozemek
- Projekt
- Povolení a administrativa
- Přípojky
- Zemní práce
- Základy
- Hrubá stavba
- Střecha
- Okna a dveře
- Elektroinstalace
- Voda a kanalizace
- Topení
- Omítky
- Podlahy
- Koupelny
- Kuchyň
- Interiéry
- Fasáda
- Terénní úpravy
- Zahrada
- Rezerva
- Ostatní

Each category should have:
- planned amount
- actual spent amount, calculated from expenses
- difference
- percentage of budget used

5. Expenses / Výdaje
User can create, edit, delete, and view expenses.

Expense fields:
- title
- amount
- currency, default CZK
- date
- due date, optional
- payment status: planned, ordered, paid, partially_paid, cancelled
- category
- construction stage
- supplier, optional
- note
- invoice or receipt attachments
- related task, optional
- related document, optional
- tags

Expense list features:
- search
- filter by category
- filter by payment status
- filter by supplier
- filter by date range
- sort by date and amount
- show total sum for current filter

6. Attachments / Files
Implement file upload abstraction.
For local development, store files locally or use a simple storage adapter.
Structure must be ready for S3/Supabase Storage later.

Attachment fields:
- original filename
- stored path or URL
- MIME type
- file size
- attachment type: invoice, receipt, project_document, photo, revision, contract, offer, technical_sheet, warranty, other
- linked entity type
- linked entity ID
- uploaded by
- uploaded at

7. Documents / Dokumentace
User can upload and manage documents:
- project documentation
- permits
- contracts
- offers
- invoices
- revisions
- technical sheets
- manuals
- warranty documents
- as-built documentation
- other

Document fields:
- title
- type
- version
- date
- note
- attachment
- construction stage
- supplier, optional
- tags

Document features:
- list
- detail
- upload
- download/open
- filter by type
- filter by stage
- version label support

8. Photos / Fotky
User can upload construction photos and link them to:
- project
- stage
- room/location
- expense
- task
- diary entry
- defect

Photo fields:
- title
- description
- date taken
- stage
- room/location
- tags
- important flag
- evidence flag
- attachment

Photo tags should support:
- skryté rozvody
- důkaz
- před opravou
- po opravě
- převzetí
- reklamace

9. Tasks and Deadlines / Úkoly a termíny
User can create, edit, delete, and view tasks.

Task fields:
- title
- description
- status: todo, in_progress, waiting, done, cancelled
- priority: low, medium, high, critical
- due date
- assigned user, optional
- supplier, optional
- construction stage
- related expense, optional
- related document, optional
- related defect, optional

Views:
- task list
- upcoming deadlines
- overdue tasks
- completed tasks

10. Suppliers / Dodavatelé a kontakty
User can manage suppliers, workers, and contacts.

Supplier fields:
- name
- type/profession
- company name
- IČO
- phone
- email
- website
- address
- notes
- rating
- linked documents
- linked expenses
- linked tasks
- linked defects

11. Construction Diary / Stavební deník
Implement a practical construction diary module.

Diary entry fields:
- date
- weather
- title
- work performed
- people present
- machines/equipment
- materials delivered
- problems
- decisions
- notes
- linked photos
- linked documents
- created by

Do not claim legal compliance. UI text should say this is a helper for construction records and exports.

12. Defects and Claims / Vady a reklamace
User can track defects, claims, and unfinished work.

Defect fields:
- title
- description
- status: open, in_progress, waiting_for_supplier, fixed, rejected, closed
- priority: low, medium, high, critical
- supplier, optional
- due date
- date found
- date fixed, optional
- location/room
- construction stage
- photos
- notes

13. Sharing and Permissions
Implement a clear permission model.

Project roles:
- owner
- editor
- viewer

Prepare the database and service layer for future granular permissions:
- share whole project
- share specific module
- share specific item
- read-only or edit access

For MVP implement project-level sharing:
- Owner can invite a member by email
- Owner can assign role: editor or viewer
- Owner can remove member
- Viewer cannot modify data
- Editor can create/edit project data but cannot manage project owners
- Server-side permission checks are mandatory

14. Settings
Project settings:
- name
- description
- budget mode
- total budget
- status
- default currency
- construction stages
- delete/archive project

User settings:
- name
- email
- preferred locale, default cs-CZ

15. Exports
Implement at least basic CSV export for:
- expenses
- budget overview

Prepare code structure for future PDF export:
- construction diary export
- defects report
- financial summary

Security requirements:
- All project data must be tenant-isolated by projectId.
- Every server action/API handler must verify that the current user has access to the project.
- Do not rely only on client-side checks.
- File access must be protected.
- Never expose data from another project.
- Validate all inputs with Zod.
- Use strict TypeScript.
- Avoid unsafe any types unless justified.
- Do not commit secrets.
- Use environment variables.
- Implement authorization helper functions and use them consistently.

Database requirements:
Create a Prisma schema with models for:
- User
- Account / Session if using Auth.js
- Project
- ProjectMember
- BudgetCategory
- Expense
- Attachment
- Document
- Photo
- Task
- Supplier
- DiaryEntry
- Defect
- Comment
- ShareInvite or Invitation
- AuditLog if reasonable

Add useful indexes:
- projectId
- userId
- date fields
- status fields
- categoryId
- supplierId

Implementation process:
1. First inspect the existing repository.
2. If the repository is empty, scaffold the app.
3. Create or update:
   - /docs/IMPLEMENTATION_PLAN.md
   - /docs/DATA_MODEL.md
   - /docs/API_OR_SERVER_ACTIONS.md
   - /docs/MVP_SCOPE.md
   - /docs/ROADMAP.md
4. Implement database schema.
5. Add seed data for demo project.
6. Implement authentication.
7. Implement project creation and project switcher.
8. Implement dashboard.
9. Implement budget categories and expenses.
10. Implement attachments.
11. Implement documents.
12. Implement photos.
13. Implement tasks.
14. Implement suppliers.
15. Implement construction diary.
16. Implement defects.
17. Implement sharing and permissions.
18. Implement responsive navigation.
19. Add validation, loading states, empty states, error states.
20. Add README with setup instructions.

Quality requirements:
- Clean folder structure.
- Reusable components.
- Consistent naming.
- Czech UI text.
- Good empty states.
- Good mobile UI.
- Basic accessibility.
- No dead placeholder buttons.
- No fake-only flows.
- Forms must actually save to the database.
- Lists must actually read from the database.
- Edit and delete flows must work.
- Include confirmation dialogs for destructive actions.
- Include toast notifications for success/error.
- Include loading and error states.
- Use formatting helpers for CZK, dates, percentages, and status labels.
- Keep business logic out of UI components where possible.

Suggested folder structure:

/app
  /(auth)
  /(dashboard)
  /api
/components
  /ui
  /layout
  /forms
  /dashboard
  /expenses
  /documents
  /tasks
  /suppliers
  /diary
  /defects
/lib
  /auth
  /db
  /permissions
  /validators
  /storage
  /formatting
  /constants
/prisma
  schema.prisma
  seed.ts
/docs

Use server actions where appropriate. API routes are acceptable for file uploads and exports.

Before making large changes, create a short implementation plan. Then proceed to implement the application step by step.

When making decisions not explicitly specified in the project brief, choose the simplest production-sensible option and document it in /docs/IMPLEMENTATION_PLAN.md.

Do not stop after planning unless explicitly asked. Implement the working MVP.
```

---

# 2. Doporučený postup použití v Cursoru

Nepouštěj celý projekt najednou bez kontroly. Lepší je postupovat po milnících.

## Milník 1 — Analýza a plán

Použij tento prompt jako první, pokud chceš, aby Cursor nejdřív připravil architekturu a nic zatím nekódoval:

```text
Read /docs/PROJECT_BRIEF.md and /docs/CURSOR_PROMPT.md.

Do not code yet.

Create the following planning documents:

1. /docs/IMPLEMENTATION_PLAN.md
   - proposed architecture
   - selected stack
   - module breakdown
   - development order
   - key technical decisions
   - assumptions
   - risks

2. /docs/DATA_MODEL.md
   - entities
   - fields
   - relations
   - enums
   - indexes
   - permission model

3. /docs/MVP_SCOPE.md
   - what will be implemented in MVP
   - what will be postponed
   - acceptance criteria

4. /docs/API_OR_SERVER_ACTIONS.md
   - server actions or API endpoints
   - inputs
   - outputs
   - permissions

5. /docs/ROADMAP.md
   - MVP 1
   - MVP 2
   - MVP 3
   - future features

After creating these documents, summarize the plan and wait for my confirmation.
```

---

## Milník 2 — Scaffold aplikace

```text
Now implement the initial application scaffold according to the approved implementation plan.

Create the Next.js TypeScript app if it does not already exist.

Set up:
- Next.js App Router
- TypeScript strict mode
- Tailwind CSS
- shadcn/ui or equivalent component system
- Prisma
- PostgreSQL connection
- Auth.js / NextAuth structure
- Zod
- React Hook Form
- date-fns
- Czech formatting helpers
- environment variables example
- base layout
- mobile-first responsive navigation
- protected dashboard layout
- README with setup instructions

Do not implement all modules yet. Focus on a clean foundation that compiles and runs.
```

---

## Milník 3 — Databáze a seed data

```text
Implement the full Prisma database schema according to /docs/DATA_MODEL.md and /docs/PROJECT_BRIEF.md.

Include all MVP entities:
- User
- Account
- Session
- VerificationToken if needed by Auth.js
- Project
- ProjectMember
- BudgetCategory
- Expense
- Attachment
- Document
- Photo
- Task
- Supplier
- DiaryEntry
- Defect
- Comment
- Invitation
- AuditLog if appropriate

Add:
- enums
- relations
- indexes
- createdAt and updatedAt fields
- archivedAt or deletedAt where useful
- projectId scoping on all project data
- user ownership and membership relations
- strict referential integrity where appropriate

Create seed data for one demo construction project:
- one owner user
- one active project
- default budget categories
- sample expenses
- sample documents
- sample tasks
- sample supplier
- sample diary entry
- sample defect

Run Prisma generate and create the initial migration.

Make sure the app still builds.
```

---

## Milník 4 — Autentizace, projekty, oprávnění

```text
Implement authentication, project creation, project selection, and project-level permissions.

Requirements:
- user registration
- login
- logout
- protected routes
- current user profile
- project creation
- project list
- project switcher
- selected project context
- project-level roles: owner, editor, viewer
- authorization helper functions:
  - requireUser()
  - requireProjectAccess(projectId)
  - requireProjectEditor(projectId)
  - requireProjectOwner(projectId)
- every server action/API handler must use permission checks
- viewer cannot mutate data
- editor can mutate project data
- only owner can manage members/settings

Add Czech UI labels and clear error messages.
```

---

## Milník 5 — Dashboard, rozpočet, výdaje

```text
Implement the core MVP financial flow.

Modules:
1. Dashboard
2. Budget categories
3. Expenses
4. Invoice/receipt attachments

Requirements:
- dashboard shows total budget, total spent, remaining budget, budget warning, recent expenses, upcoming tasks, open defects
- budget categories can be listed, created, edited, deleted where safe
- default categories are created for every new project
- category actual spending is calculated from expenses
- expenses support full CRUD
- expense fields match /docs/PROJECT_BRIEF.md
- expense list supports search, filters, sorting, and current filter total
- expense form is mobile-friendly and fast
- invoice/receipt upload works through the storage abstraction
- all writes are validated with Zod
- all reads and writes are scoped by projectId
- viewer cannot create/edit/delete
- editor and owner can create/edit/delete

Make sure this milestone is fully functional before moving on.
```

---

## Milník 6 — Dokumenty a fotky

```text
Implement documents and construction photos.

Documents:
- list
- detail
- create/edit/delete
- upload attachment
- type
- version
- date
- stage
- supplier
- tags
- filters by type and stage

Photos:
- upload
- list/gallery
- detail
- title
- description
- date taken
- stage
- room/location
- tags
- important flag
- evidence flag
- links to expense, task, diary entry, or defect where possible

The UI must be mobile-first and optimized for quick upload from a phone.
Use server-side authorization checks and Zod validation.
```

---

## Milník 7 — Úkoly, dodavatelé, stavební deník, vady

```text
Implement the remaining MVP operational modules.

Tasks:
- CRUD
- status
- priority
- due date
- assigned user
- supplier
- construction stage
- related entities
- views for overdue and upcoming tasks

Suppliers:
- CRUD
- name
- profession/type
- company
- IČO
- phone
- email
- website
- address
- notes
- rating
- linked expenses/tasks/documents/defects

Construction diary:
- CRUD
- date
- weather
- title
- work performed
- people present
- machines/equipment
- materials delivered
- problems
- decisions
- notes
- linked photos/documents
- UI text must say this is a helper for construction records and exports, not a legal compliance guarantee

Defects and claims:
- CRUD
- status
- priority
- supplier
- due date
- date found
- date fixed
- location/room
- construction stage
- photos
- notes

All modules must respect projectId scoping and project permissions.
```

---

## Milník 8 — Sdílení, exporty, polish

```text
Implement project-level sharing, exports, and final UX polish.

Sharing:
- owner can invite a member by email
- owner can assign role editor or viewer
- owner can remove member
- invited user can access the project after login
- viewer is read-only
- editor can modify project data but cannot manage owners/members
- prepare database/service layer for future granular permissions

Exports:
- CSV export for expenses
- CSV export for budget overview
- code structure prepared for future PDF exports:
  - construction diary PDF
  - defects report PDF
  - financial summary PDF

Polish:
- mobile navigation
- quick Add menu
- empty states
- loading states
- error states
- confirmation dialogs
- toast notifications
- responsive desktop layout
- accessibility basics
- Czech labels everywhere
- README update
- final build check
```

---

# 3. Krátká varianta promptu

Tuto variantu můžeš použít, pokud chceš Cursoru zadat rychlé shrnutí.

```text
Build a production-ready MVP of a Czech mobile-first PWA for private self-builders based on /docs/PROJECT_BRIEF.md.

Use Next.js App Router, TypeScript, Tailwind, shadcn/ui, Prisma, PostgreSQL, Auth.js, Zod, React Hook Form.

The app must include:
- authentication
- project/stavba management
- budget limit or open budget
- budget categories
- expense tracking with invoices/receipts
- documents/project documentation
- construction photos
- tasks and deadlines
- suppliers/contacts
- construction diary
- defects and claims
- project sharing with owner/editor/viewer roles
- dashboard
- CSV exports
- Czech UI
- mobile-first responsive layout

Use real database persistence, real CRUD, real server-side permission checks, file upload abstraction, strict TypeScript, clean architecture, and clear documentation.

First create /docs/IMPLEMENTATION_PLAN.md and /docs/DATA_MODEL.md. Then implement the working MVP step by step.
```

---

# 4. První praktický vývojový cíl

První funkční milestone má být:

```text
User can register, log in, create a construction project, set a budget, view default budget categories, add an expense, upload an invoice or receipt, see the expense on the dashboard, and see the budget recalculated automatically.
```

Česky:

```text
Uživatel se přihlásí, vytvoří stavbu, nastaví rozpočet, uvidí výchozí kategorie, přidá výdaj, nahraje fakturu nebo účtenku, výdaj se zobrazí v dashboardu a rozpočet se automaticky přepočítá.
```

---

# 5. Kontrolní checklist před dokončením MVP

Cursor by měl před dokončením ověřit:

```text
Check the implementation against /docs/PROJECT_BRIEF.md and /docs/CURSOR_PROMPT.md.

Verify:
- app builds successfully
- TypeScript has no errors
- authentication works
- project creation works
- project switching works
- all data is scoped by projectId
- viewer cannot mutate data
- editor can mutate project data
- only owner can manage members/settings
- dashboard shows real calculated data
- budget categories calculate actual spent amounts
- expenses CRUD works
- attachments upload works
- documents CRUD works
- photos upload/list works
- tasks CRUD works
- suppliers CRUD works
- construction diary CRUD works
- defects CRUD works
- CSV exports work
- mobile navigation works
- quick Add menu works
- forms have validation
- Czech UI labels are used
- README contains setup instructions

If something is missing, implement it.
```

---

# 6. Doporučení pro práci s Cursorem

Doporučený postup:

1. Dej do repozitáře `/docs/PROJECT_BRIEF.md`.
2. Dej do repozitáře `/docs/CURSOR_PROMPT.md`.
3. V Cursoru otevři oba dokumenty.
4. Nejdřív spusť Milník 1.
5. Zkontroluj vytvořené plánovací dokumenty.
6. Potom pokračuj Milníky 2 až 8.
7. Po každém milníku spusť build a opravu chyb.
8. Nepouštěj vše najednou bez kontroly, jinak hrozí chaos v architektuře.

Doporučený příkaz po každém větším kroku:

```bash
pnpm lint
pnpm typecheck
pnpm build
```

Pokud `typecheck` není nastavený, Cursor má doplnit skript do `package.json`.

---

# 7. Poznámka k právní části stavebního deníku

Aplikace má modul „Stavební deník“ pojmout jako praktickou evidenční pomůcku.

V UI nepoužívat formulace typu:

```text
Tento modul zaručuje splnění zákonných požadavků na stavební deník.
```

Použít bezpečnější formulaci:

```text
Tento modul slouží jako pomůcka pro vedení stavebních záznamů a přípravu podkladů pro export. Právní náležitosti stavebního deníku je nutné ověřit podle aktuálních požadavků a konkrétní stavby.
```

---

# 8. Doporučený název aplikace pro interní vývoj

Pracovní název:

```text
Stavba Pod Kontrolou
```

Technický název repozitáře:

```text
stavba-pod-kontrolou
```

Alternativy:

```text
moje-stavba
stavebni-denik-app
svepomoci-app
```
