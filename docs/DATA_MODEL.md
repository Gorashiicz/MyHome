# Datový model — shrnutí

Kompletní schéma: `prisma/schema.prisma`.

## Hlavní entity

| Entita | Scope | Poznámka |
|--------|-------|----------|
| User | globální | Auth.js + credentials |
| Project | owner + members | budgetMode, budgetLimit, stages[] |
| ProjectMember | projectId + userId | role: owner \| editor \| viewer |
| BudgetCategory | projectId | plannedAmount, sortOrder |
| Expense | projectId | paymentStatus, category, supplier |
| Attachment | projectId | entityType + entityId (polymorfní) |
| Document, Photo, Task, Supplier, DiaryEntry, Defect | projectId | |
| Invitation | projectId | e-mail pozvánka |
| Comment, AuditLog | projectId | připraveno pro rozšíření |

## Oprávnění MVP

- **owner** — vše včetně členů a nastavení
- **editor** — CRUD dat projektu
- **viewer** — pouze čtení (server actions vyžadují editor)

Granulární sdílení (modul/položka) — struktura DB připravena, UI v MVP 2.
