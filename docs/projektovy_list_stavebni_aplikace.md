**Projektový list aplikace pro stavebníky svépomocí**

Produktový koncept, funkční specifikace, datový model, technický blueprint a roadmapa MVP

*Verze 1.0 - 4. 6. 2026*

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr class="header">
<th><p><strong>Účel dokumentu</strong></p>
<p>Tento projektový list slouží jako výchozí zadání pro návrh, vývoj, validaci a postupné rozšiřování jednoduché mobilně použitelné webové aplikace pro stavebníky, kteří staví svépomocí. Dokument popisuje produktovou logiku, hlavní moduly, datový model, oprávnění, MVP rozsah, technický blueprint, doporučené obrazovky, backlog a přílohy pro vývojáře.</p></th>
</tr>
</thead>
<tbody>
</tbody>
</table>

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr class="header">
<th><p><strong>Pracovní positioning produktu</strong></p>
<p>Mobilní stavební zápisník a rozpočtový kontrolní panel pro lidi, kteří staví nebo rekonstruují svépomocí. Aplikace má uživateli pomoci neztratit kontrolu nad penězi, dokumenty, fakturami, fotkami, termíny, dodavateli a rozhodnutími na stavbě.</p></th>
</tr>
</thead>
<tbody>
</tbody>
</table>

# Obsah

- 1\. Shrnutí produktu

- 2\. Cíloví uživatelé a hlavní problémy

- 3\. Principy návrhu

- 4\. Funkční moduly aplikace

- 5\. MVP rozsah a roadmapa

- 6\. Datový model

- 7\. Role, sdílení a oprávnění

- 8\. Uživatelské toky a obrazovky

- 9\. Technický blueprint

- 10\. API blueprint

- 11\. Bezpečnost, soukromí a provoz

- 12\. Exporty, importy a integrace

- 13\. Backlog, user stories a akceptační kritéria

- 14\. Monetizace a produktová strategie

- 15\. Rizika a doporučení

- 16\. Přílohy: šablony, kategorie, checklisty, reference

# 1. Shrnutí produktu

Aplikace má řešit praktický problém běžného stavebníka: informace o stavbě jsou roztříštěné v poznámkách, e-mailech, fotkách v telefonu, papírových účtenkách, PDF fakturách, výkresech, WhatsApp konverzacích a tabulkách. Výsledkem je ztráta přehledu o skutečných nákladech, termínech, odpovědnostech a důkazech o tom, co se na stavbě stalo.

Produkt nemá být složité ERP pro stavební firmy. Má to být jednoduchý, rychlý a mobilní nástroj, který stavebník používá přímo na stavbě, v obchodě se stavebninami i večer doma při kontrole rozpočtu.

| **Oblast**          | **Doporučený směr**                                                                                    |
|---------------------|--------------------------------------------------------------------------------------------------------|
| Primární hodnota    | Rozpočet, výdaje, faktury, fotky, dokumenty, denní záznamy a termíny v jednom projektu.                |
| Cílový uživatel     | Laik nebo poloprofesionál, který staví nebo rekonstruuje rodinný dům svépomocí.                        |
| Forma produktu      | Responzivní webová aplikace s mobile-first UX, ideálně PWA.                                            |
| První MVP           | Evidence výdajů, faktur, kategorií, rozpočtu, dokumentů, fotek a jednoduchého sdílení.                 |
| Hlavní diferenciace | Propojení položky rozpočtu s fakturou, fotkou, etapou, dodavatelem, denním záznamem a sdílením.        |
| Dlouhodobá vize     | Stavební deník, checklisty, vady/reklamace, revize, OCR, AI sumarizace a predikce překročení rozpočtu. |

## 1.1 Produktová věta

"Mějte celou stavbu pod kontrolou: kolik stojí, co se kdy koupilo, kde jsou faktury, co je hotové, co se řeší, kdo má co dodat a kde jsou důležité dokumenty a fotky."

## 1.2 Hlavní pilíře

- Peníze: plánovaný rozpočet, skutečné výdaje, zbývající rezerva, překročení a prognóza.

- Doklady: faktury, účtenky, nabídky, smlouvy, revize, technické listy a záruční listy.

- Čas: úkoly, termíny, milníky, připomínky a návaznosti.

- Důkazy: fotky skrytých konstrukcí, denní záznamy, vadné práce, opravy a předání.

- Lidé: dodavatelé, řemeslníci, projektant, stavební dozor, účetní, banka a členové rodiny.

- Sdílení: bezpečné zpřístupnění celé stavby, modulu, dokumentu nebo konkrétní položky.

# 2. Cíloví uživatelé a hlavní problémy

## 2.1 Primární persony

| **Persona**         | **Popis**                                                               | **Potřeby**                                                | **Rizika bez aplikace**                                 |
|---------------------|-------------------------------------------------------------------------|------------------------------------------------------------|---------------------------------------------------------|
| Stavebník svépomocí | Člověk staví rodinný dům po práci, část prací dělá sám, část objednává. | Rychlý zápis výdajů, faktur, fotek, úkolů a termínů.       | Ztráta faktur, překročení rozpočtu, chaos v komunikaci. |
| Partner/rodina      | Spolurozhoduje o rozpočtu, interiéru, harmonogramu nebo platbách.       | Sdílený přehled a možnost doplnit poznámky nebo dokumenty. | Nejasné domluvy, duplicitní nákupy, spory o priority.   |
| Stavební dozor      | Kontroluje postup, kvalitu a dokumentaci.                               | Přístup k vybraným fotkám, deníku, dokumentům a úkolům.    | Pozdní zjištění chyb, chybějící důkazní materiál.       |
| Řemeslník/dodavatel | Řeší konkrétní část stavby.                                             | Vidět jen své úkoly, dokumenty, vady nebo komentáře.       | Nepřesné zadání, zpoždění, spory o rozsah.              |
| Účetní/banka        | Potřebuje přehled financí nebo doklady.                                 | Read-only přístup k fakturám, exportům a rozpočtu.         | Ruční přeposílání souborů a tabulek.                    |

## 2.2 Nejčastější bolestivé situace

- Uživatel neví, kolik už ve skutečnosti utratil, protože část výdajů je v hotovosti, část kartou a část na fakturu.

- Faktura je někde v e-mailu, účtenka v autě, fotka v telefonu a informace o dodavateli ve WhatsAppu.

- Před zakrytím rozvodů nebylo dost fotek, takže se později obtížně řeší vrtání, opravy nebo reklamace.

- Dodavatel tvrdí, že změna byla domluvená, ale není jasné kdy, za kolik a s jakým dopadem.

- Částka za stavbu se navyšuje po malých položkách, ale nikdo včas nevidí celkové riziko překročení.

- Před dokončením se narychlo hledají revize, certifikáty, návody a dokumentace skutečného provedení.

# 3. Principy návrhu

| **Princip**       | **Praktický dopad na návrh aplikace**                                                            |
|-------------------|--------------------------------------------------------------------------------------------------|
| Mobile-first      | Všechny klíčové akce musí jít udělat pohodlně jednou rukou na telefonu.                          |
| Rychlý záznam     | Přidání výdaje nebo fotky musí být možné za desítky sekund, bez povinného vyplňování všech polí. |
| Pozdější doplnění | Uživatel může nejdřív uložit minimum a detaily doplnit později.                                  |
| Jedna pravda      | Každá faktura, fotka, položka, úkol a dokument má jasnou vazbu na projekt a ideálně na etapu.    |
| Nezahlcovat       | Pokročilé moduly schovat do záložky Více; hlavní obrazovka má ukazovat jen to podstatné.         |
| Exportovatelnost  | Data musí jít vyexportovat do PDF/Excel/ZIP, aby uživatel nebyl uzamčený v aplikaci.             |
| Auditní stopa     | U sdíleného projektu má být jasné, kdo co vložil, upravil nebo smazal.                           |

## 3.1 Hlavní mobilní akce

Centrální akce aplikace by měla být tlačítko Přidat. Na mobilu by mělo být dostupné z dolní navigace a otevřít rychlou nabídku:

- Přidat výdaj

- Vyfotit účtenku

- Přidat fakturu/PDF

- Přidat fotku ze stavby

- Přidat úkol

- Přidat záznam do deníku

- Přidat vadu

- Přidat dokument

# 4. Funkční moduly aplikace

| **Modul**              | **Účel**                                                                       | **Priorita** |
|------------------------|--------------------------------------------------------------------------------|--------------|
| Dashboard              | Přehled rozpočtu, rizik, termínů, posledních aktivit a otevřených úkolů.       | MVP 1        |
| Rozpočet a výdaje      | Evidence rozpočtu, kategorií, výdajů, faktur, účtenek, stavu platby a rezervy. | MVP 1        |
| Dokumenty              | Projektová dokumentace, povolení, smlouvy, revize, technické listy, záruky.    | MVP 1        |
| Fotky                  | Fotoarchiv podle data, etapy, místnosti, konstrukce a vazby na položky.        | MVP 1        |
| Sdílení                | Pozvání uživatelů, role, read-only/edit, sdílení konkrétních položek.          | MVP 1-2      |
| Úkoly a harmonogram    | Termíny, připomínky, odpovědnosti, návaznosti, milníky.                        | MVP 2        |
| Stavební záznamy/deník | Denní záznamy prací, počasí, osoby, materiál, stroje, fotky, export PDF.       | MVP 2        |
| Dodavatelé             | Kontakty, profese, nabídky, smlouvy, faktury, hodnocení a historie spolupráce. | MVP 2        |
| Nabídky                | Porovnání cen, rozsahu, termínů, garancí a rozhodnutí.                         | MVP 2        |
| Změny a vícepráce      | Schvalování změn, dopad na cenu, termín a rozsah.                              | MVP 2-3      |
| Vady a reklamace       | Evidence vad, fotky, odpovědné osoby, termíny odstranění a stav.               | MVP 2        |
| Exporty a reporty      | PDF přehledy, Excel rozpočty, ZIP dokumentů, report pro banku nebo účetní.     | MVP 2        |
| OCR a AI asistence     | Čtení faktur, automatické tagování, sumarizace, predikce překročení.           | MVP 3        |

## 4.1 Dashboard

**Účel:** Rychlá odpověď na otázku: Jak si stavba stojí právě teď?

### Funkce

- Celkový rozpočet, utraceno, zbývá, rezerva a překročení.

- Graf nebo jednoduchý indikátor plán vs. skutečnost.

- Nejbližší termíny a úkoly.

- Poslední výdaje, dokumenty a fotky.

- Varování: blíží se termín, chybí faktura, kategorie překročila plán, neuhrazená záloha.

### Akceptační kritéria

- Dashboard se načte rychle na mobilu.

- Uživatel vidí alespoň 5 nejdůležitějších metrik bez scrollování.

- Kliknutí na metriku vede do detailu.

## 4.2 Rozpočet a výdaje

**Účel:** Jádro aplikace. Uživatel eviduje vše, za co utrácí, a sleduje dopad na rozpočet.

### Funkce

- Volitelný celkový limit stavby; aplikace musí umožnit i otevřený rozpočet bez limitu.

- Kategorie a podkategorie rozpočtu.

- Plánované, skutečné a očekávané budoucí náklady.

- Výdajová položka s datem, částkou, měnou, dodavatelem, fakturou, poznámkou, stavem platby a etapou.

- Rozlišení: faktura, účtenka, záloha, doplatek, hotovost, karta, převod, interní práce.

- Export do XLSX/CSV/PDF.

### Akceptační kritéria

- Výdaj lze uložit s minimem polí: název, částka, datum.

- K výdaji lze přidat soubor nebo fotku účtenky.

- Kategorie ukazují plán vs. realita.

## 4.3 Dokumenty

**Účel:** Archiv všeho, co se ke stavbě váže.

### Funkce

- Projektová dokumentace a její verze.

- Povolení, rozhodnutí, vyjádření, smlouvy a nabídky.

- Revize, certifikáty, technické listy, návody a záruční listy.

- Náhled PDF a obrázků přímo v aplikaci.

- Tagy: projekt, povolení, faktura, revize, smlouva, záruka, technický list.

- Vazba dokumentu na etapu, dodavatele, úkol, výdaj nebo vadu.

### Akceptační kritéria

- Dokument lze nahrát z mobilu.

- U dokumentu lze doplnit typ, etapu, popis a štítky.

- Uživatel dokáže rychle najít revize, záruky a projektovou dokumentaci.

## 4.4 Fotky a důkazní archiv

**Účel:** Zachytit stav stavby, hlavně skryté konstrukce a postup prací.

### Funkce

- Fotky podle data, etapy, místnosti, konstrukce a štítků.

- Možnost označit fotku jako důkaz, skrytý rozvod, reklamace, před opravou, po opravě.

- Vazba na výdaj, denní záznam, úkol nebo vadu.

- Hromadné nahrání fotek z telefonu.

- Volitelné uložení GPS/metadat, pokud to uživatel povolí.

### Akceptační kritéria

- Fotku lze pořídit přímo z aplikace.

- Fotka může být přiřazena etapě a popsána.

- Fotoarchiv jde filtrovat podle etapy a štítku.

## 4.5 Úkoly, termíny a harmonogram

**Účel:** Zjednodušené řízení stavby bez složitého projektového softwaru.

### Funkce

- Úkol, termín, priorita, odpovědná osoba, stav, poznámka.

- Milníky: základová deska, hrubá stavba, střecha, okna, rozvody, omítky, podlahy, dokončení.

- Připomínky e-mailem nebo push notifikací.

- Vazba úkolu na etapu, dodavatele, dokument nebo vadu.

- Jednoduchý kalendář a seznam dnes/tento týden/po termínu.

### Akceptační kritéria

- Uživatel vidí úkoly po termínu.

- Úkol lze přiřadit jiné osobě.

- Sdílený uživatel vidí jen úkoly, ke kterým má oprávnění.

## 4.6 Stavební záznamy / deník

**Účel:** Praktický denní záznam stavby s možností exportu.

### Funkce

- Datum, počasí, prováděné práce, přítomné osoby, firmy, stroje a materiál.

- Problémy, rozhodnutí, kontrolní návštěvy a poznámky.

- Připojené fotky, dokumenty a úkoly.

- Export denních záznamů do PDF.

- Možnost rozlišit interní stavební zápisník a formální stavební deník.

### Akceptační kritéria

- Denní záznam lze vytvořit za méně než minutu.

- Záznam lze filtrovat podle data a etapy.

- Export do PDF obsahuje datum, práce, osoby, poznámky a fotky.

## 4.7 Dodavatelé a kontakty

**Účel:** Přehled lidí a firem, se kterými stavebník pracuje.

### Funkce

- Jméno, firma, profese, telefon, e-mail, IČO, poznámky.

- Vazba na nabídky, smlouvy, faktury, úkoly a vady.

- Hodnocení spolupráce a interní poznámky.

- Historie komunikace jako poznámky nebo přiložené dokumenty.

### Akceptační kritéria

- Dodavatele lze přiřadit k výdaji, úkolu a vadě.

- U dodavatele se zobrazí související faktury a dokumenty.

- Kontakty lze exportovat.

## 4.8 Nabídky a porovnání cen

**Účel:** Podpora rozhodování před výdajem.

### Funkce

- Poptávka, nabídky, cena, rozsah, termín, záruka, poznámky.

- Přiložené PDF nabídky a komunikace.

- Vybraná varianta a důvod výběru.

- Převod vybrané nabídky na výdaj, úkol nebo smlouvu.

### Akceptační kritéria

- Uživatel dokáže porovnat minimálně dvě nabídky.

- Vybraná nabídka se označí jako schválená.

- Nabídka může být navázána na dodavatele a kategorii rozpočtu.

## 4.9 Změny a vícepráce

**Účel:** Kontrola změn, které jinak nenápadně navyšují cenu a prodlužují stavbu.

### Funkce

- Popis změny, důvod, kdo ji navrhl, stav, dopad na cenu a termín.

- Schválení nebo zamítnutí změny.

- Přílohy: fotky, dokumenty, nabídky.

- Promítnutí schválené změny do rozpočtu a harmonogramu.

### Akceptační kritéria

- Změna má stav: navrženo, schváleno, provedeno, zamítnuto.

- Schválená změna může vytvořit výdaj nebo navýšit rozpočet.

- Historie změn je auditovatelná.

## 4.10 Vady, reklamace a nedodělky

**Účel:** Evidence problémů a jejich řešení.

### Funkce

- Popis vady, fotka, odpovědný dodavatel, priorita, termín odstranění.

- Stavy: otevřeno, řeší se, čeká na kontrolu, uzavřeno.

- Komentáře a přílohy.

- Export seznamu vad pro předání nebo reklamaci.

### Akceptační kritéria

- Vada jde sdílet konkrétnímu dodavateli.

- U vady lze přidat fotku před opravou a po opravě.

- Uzavření vady vyžaduje poznámku nebo fotku.

## 4.11 Sdílení a oprávnění

**Účel:** Bezpečné pozvání dalších lidí bez zbytečného odhalení celé stavby.

### Funkce

- Sdílení celého projektu, modulu, etapy nebo konkrétní položky.

- Role: vlastník, editor, čtenář, dodavatel, stavební dozor, účetní, host.

- Časově omezené odkazy a pozvánky.

- Audit: kdo co viděl, vložil, upravil nebo smazal.

### Akceptační kritéria

- Vlastník může pozvat člověka e-mailem.

- Host může mít přístup jen ke konkrétní vadě nebo dokumentu.

- Oprávnění lze odebrat.

# 5. MVP rozsah a roadmapa

## 5.1 MVP 1 - nejmenší hodnotný produkt

Cílem MVP 1 je dodat funkční nástroj, který stavebník může reálně používat pro rozpočet, výdaje, faktury, dokumenty a fotky. Bez tohoto jádra nemá smysl stavět pokročilé moduly.

| **Funkce**        | **Rozsah MVP 1**                                              | **Poznámka**                         |
|-------------------|---------------------------------------------------------------|--------------------------------------|
| Účet a přihlášení | E-mail/heslo, případně Google login.                          | Nutné pro sdílení a bezpečnost.      |
| Projekt stavby    | Název, typ stavby, adresa volitelně, začátek, limit rozpočtu. | Adresa nemusí být povinná.           |
| Rozpočet          | Celkový limit, kategorie, plánované částky.                   | Možnost bez limitu.                  |
| Výdaje            | Název, částka, datum, kategorie, etapa, dodavatel, poznámka.  | Rychlé zadání z mobilu.              |
| Faktury/účtenky   | Nahrání PDF/JPG/PNG k výdaji.                                 | OCR až později.                      |
| Dokumenty         | Nahrání dokumentu, typ, tagy, popis.                          | Základní náhled PDF/obrázku.         |
| Fotky             | Nahrání nebo vyfocení, popis, etapa.                          | Bez pokročilé galerie v první verzi. |
| Dashboard         | Utraceno, zbývá, poslední výdaje, rozpad kategorií.           | Jednoduché metriky.                  |
| Sdílení           | Projekt read-only nebo editor.                                | Granulární sdílení až v MVP 2.       |

## 5.2 MVP 2 - funkce pro každodenní řízení stavby

- Úkoly a termíny

- Stavební záznamy/deník

- Dodavatelé

- Checklisty

- Vady a reklamace

- Granulární sdílení

- Export PDF/Excel

- Notifikace

## 5.3 MVP 3 - automatizace a prémiové funkce

- OCR faktur a účtenek

- Automatické rozpoznání dodavatele, částky a data

- AI sumarizace stavby

- Predikce překročení rozpočtu

- Porovnání nabídek s doporučením

- Šablony rozpočtů podle typu stavby

- Offline režim

- Auditní log na úrovni položek

- Elektronické potvrzení/podpis vybraných záznamů

## 5.4 Doporučený vývojový plán

| **Fáze**    | **Cíl**                                                                 | **Výstup**                                        |
|-------------|-------------------------------------------------------------------------|---------------------------------------------------|
| Discovery   | Ověřit problém a hlavní hodnotu s 5-10 stavebníky.                      | Seznam top use cases, priorit a reálných scénářů. |
| UX prototyp | Navrhnout mobilní tok přidání výdaje, faktury a fotky.                  | Klikatelný prototyp hlavních obrazovek.           |
| MVP 1       | Postavit jádro: projekt, rozpočet, výdaje, dokumenty, fotky, dashboard. | Použitelná beta verze pro první uživatele.        |
| Pilot       | Nasadit u prvních stavebníků a sledovat reálné používání.               | Zpětná vazba, opravy UX, validace cenotvorby.     |
| MVP 2       | Doplnit úkoly, deník, vady, dodavatele, exporty a lepší sdílení.        | Produkt vhodný pro placené používání.             |
| MVP 3       | Přidat OCR, AI, predikce, šablony a offline režim.                      | Prémiový produkt s vyšší retencí.                 |

# 6. Datový model

Datový model musí být víceprojektový a víceuživatelský. Uživatel může mít více staveb a každá stavba může mít více členů s různými právy. Všechny hlavní entity musí nést project_id, created_by, created_at, updated_at a případně deleted_at pro soft delete.

## 6.1 Základní entity

| **Tabulka**       | **Účel**                       | **Důležitá pole**                                                                                                            |
|-------------------|--------------------------------|------------------------------------------------------------------------------------------------------------------------------|
| users             | Uživatelé systému.             | id, email, name, locale, timezone, created_at                                                                                |
| projects          | Jednotlivé stavby/projekty.    | id, owner_id, name, type, budget_limit, budget_mode, currency, address_text, start_date, status                              |
| project_members   | Členství uživatelů v projektu. | id, project_id, user_id, role, permissions_json, invited_by, status                                                          |
| budget_categories | Kategorie rozpočtu.            | id, project_id, parent_id, name, planned_amount, sort_order                                                                  |
| expenses          | Výdajové položky.              | id, project_id, category_id, supplier_id, title, amount, currency, expense_date, payment_status, payment_method, stage, note |
| attachments       | Soubory k položkám.            | id, project_id, entity_type, entity_id, file_name, file_type, storage_path, size, uploaded_by                                |
| documents         | Samostatná dokumentace.        | id, project_id, title, doc_type, version, stage, tags, description, storage_path                                             |
| photos            | Fotky stavby.                  | id, project_id, title, photo_date, stage, room, tags, storage_path, description                                              |
| tasks             | Úkoly a termíny.               | id, project_id, title, due_date, status, priority, assignee_id, stage, description                                           |
| diary_entries     | Denní stavební záznamy.        | id, project_id, entry_date, weather, works_done, people_present, machines, materials, issues, decisions                      |
| suppliers         | Dodavatelé a kontakty.         | id, project_id, name, profession, company_name, ico, phone, email, rating, notes                                             |
| quotes            | Nabídky a poptávky.            | id, project_id, supplier_id, title, amount, scope, valid_until, status, selected_reason                                      |
| change_requests   | Změny a vícepráce.             | id, project_id, title, description, status, cost_impact, time_impact_days, requested_by, approved_by                         |
| defects           | Vady a reklamace.              | id, project_id, supplier_id, title, description, priority, status, due_date, closed_at                                       |
| comments          | Komentáře k entitám.           | id, project_id, entity_type, entity_id, author_id, body, created_at                                                          |
| audit_events      | Auditní historie.              | id, project_id, actor_id, action, entity_type, entity_id, before_json, after_json, created_at                                |

## 6.2 Vazby mezi entitami

Project 1 - N Expense

Project 1 - N Document

Project 1 - N Photo

Project 1 - N Task

Project 1 - N DiaryEntry

Project 1 - N Supplier

Project 1 - N Defect

Expense N - 1 BudgetCategory

Expense N - 1 Supplier

Expense 1 - N Attachment

Task N - 1 Supplier optional

Photo N - 1 DiaryEntry optional

Photo N - 1 Expense optional

Document N - 1 Supplier optional

Defect N - 1 Supplier optional

Comment N - 1 any entity via entity_type/entity_id

AuditEvent N - 1 any entity via entity_type/entity_id

## 6.3 Doporučený enum model

| **Enum**       | **Hodnoty**                                                                                                |
|----------------|------------------------------------------------------------------------------------------------------------|
| budget_mode    | limited, open                                                                                              |
| project_status | planning, active, paused, finished, archived                                                               |
| expense_type   | invoice, receipt, advance, final_payment, cash_purchase, internal_work, other                              |
| payment_status | planned, ordered, unpaid, partially_paid, paid, cancelled                                                  |
| payment_method | cash, card, bank_transfer, loan_drawdown, other                                                            |
| document_type  | project, permit, contract, quote, invoice, revision, certificate, warranty, manual, technical_sheet, other |
| task_status    | todo, in_progress, waiting, done, cancelled                                                                |
| defect_status  | open, in_progress, waiting_for_check, closed, rejected                                                     |
| change_status  | proposed, approved, rejected, implemented, cancelled                                                       |
| member_role    | owner, admin, editor, read_only, contractor, supervisor, accountant, guest                                 |

## 6.4 Příklad objektu výdaje

{

"id": "exp_123",

"project_id": "proj_001",

"title": "Beton C25/30 - základová deska",

"amount": 84500,

"currency": "CZK",

"expense_date": "2026-06-10",

"category_id": "cat_foundations",

"stage": "Zaklady",

"supplier_id": "sup_betonarka_xyz",

"payment_status": "paid",

"payment_method": "bank_transfer",

"note": "Vcetne dopravy a cerpadla.",

"attachments": \["invoice_2026_0610.pdf"\],

"created_by": "user_001"

}

# 7. Role, sdílení a oprávnění

Sdílení je klíčová funkce. Uživateli musí umožnit dát přístup rodině, dozoru, dodavateli nebo účetní, aniž by musel odhalit vše. Doporučený model je kombinace rolí a granularních oprávnění na úrovni projektu, modulu, etapy nebo konkrétní entity.

| **Role**       | **Typický uživatel**   | **Výchozí oprávnění**                                                          |
|----------------|------------------------|--------------------------------------------------------------------------------|
| Vlastník       | Majitel stavby         | Vše, včetně fakturace, smazání projektu a správy členů.                        |
| Admin          | Partner/spolustavebník | Vše kromě převodu vlastnictví a odstranění projektu.                           |
| Editor         | Aktivní spolupracovník | Může vkládat a upravovat položky v povolených modulech.                        |
| Pouze čtení    | Rodina, banka, poradce | Vidí povolené části bez možnosti úprav.                                        |
| Dodavatel      | Řemeslník/firma        | Vidí jen přiřazené úkoly, vady, dokumenty a komentáře.                         |
| Stavební dozor | Kontrola kvality       | Vidí deník, fotky, dokumentaci, vady, může komentovat.                         |
| Účetní         | Účetní/banka           | Vidí výdaje, faktury a exporty; nevidí osobní poznámky, pokud nejsou povoleny. |
| Host           | Jednorázový přístup    | Časově omezený přístup ke konkrétní položce nebo dokumentu.                    |

## 7.1 Matice oprávnění

| **Akce**           | **Owner** | **Admin** | **Editor** | **Read-only** | **Contractor** | **Supervisor** | **Accountant** | **Guest** |
|--------------------|-----------|-----------|------------|---------------|----------------|----------------|----------------|-----------|
| Zobrazit dashboard | Ano       | Ano       | Ano        | Ano           | Omezeně        | Ano            | Finance        | Omezeně   |
| Upravit rozpočet   | Ano       | Ano       | Volitelně  | Ne            | Ne             | Ne             | Ne             | Ne        |
| Přidat výdaj       | Ano       | Ano       | Ano        | Ne            | Volitelně      | Ne             | Ne             | Ne        |
| Zobrazit faktury   | Ano       | Ano       | Ano        | Volitelně     | Jen své        | Volitelně      | Ano            | Volitelně |
| Nahrát fotky       | Ano       | Ano       | Ano        | Ne            | Volitelně      | Ano            | Ne             | Volitelně |
| Komentovat         | Ano       | Ano       | Ano        | Volitelně     | Ano            | Ano            | Volitelně      | Volitelně |
| Spravovat členy    | Ano       | Ano       | Ne         | Ne            | Ne             | Ne             | Ne             | Ne        |
| Smazat projekt     | Ano       | Ne        | Ne         | Ne            | Ne             | Ne             | Ne             | Ne        |

## 7.2 Úrovně sdílení

- Celý projekt

- Konkrétní modul

- Konkrétní etapa

- Konkrétní dokument

- Konkrétní výdaj

- Konkrétní vada

- Konkrétní úkol

- Časově omezený odkaz

# 8. Uživatelské toky a obrazovky

## 8.1 Navigace na mobilu

Doporučená dolní navigace na mobilu:

Prehled \| Pridat \| Rozpocet \| Dokumenty \| Vice

Sekce Více obsahuje: Fotky, Úkoly, Deník, Dodavatelé, Vady, Sdílení, Nastavení.

## 8.2 Hlavní obrazovky

| **Obrazovka** | **Obsah**                                                         | **Důležitá CTA**                          |
|---------------|-------------------------------------------------------------------|-------------------------------------------|
| Přehled       | Metriky rozpočtu, nejbližší termíny, poslední aktivita, varování. | Přidat výdaj, zobrazit rizika.            |
| Přidat        | Rychlá nabídka typů záznamu.                                      | Výdaj, faktura, fotka, úkol, deník, vada. |
| Rozpočet      | Kategorie, plán vs. skutečnost, výdaje, filtry.                   | Přidat výdaj, exportovat.                 |
| Detail výdaje | Částka, datum, kategorie, dodavatel, faktura, fotky, komentáře.   | Upravit, přidat fakturu, sdílet.          |
| Dokumenty     | Seznam, tagy, typy, náhledy, vyhledávání.                         | Nahrát dokument.                          |
| Fotky         | Galerie podle data/etapy/místnosti.                               | Vyfotit, přidat štítek.                   |
| Úkoly         | Dnes, tento týden, po termínu, přiřazené osoby.                   | Přidat úkol.                              |
| Deník         | Denní záznamy, export, fotky.                                     | Přidat dnešní záznam.                     |
| Vady          | Seznam vad a stavů.                                               | Přidat vadu, exportovat seznam.           |
| Sdílení       | Členové, pozvánky, role, granularita.                             | Pozvat osobu.                             |

## 8.3 Tok: rychlé přidání výdaje

1.  Klik na Přidat -\> Výdaj.

2.  Zadání částky, názvu a data; datum předvyplnit dneškem.

3.  Volitelně vybrat kategorii, etapu a dodavatele.

4.  Vyfotit účtenku nebo nahrát fakturu.

5.  Uložit.

6.  Aplikace nabídne pozdější doplnění chybějících údajů.

## 8.4 Tok: sdílení vady s dodavatelem

7.  Uživatel otevře vadu.

8.  Klikne na Sdílet.

9.  Zadá e-mail nebo vybere dodavatele.

10. Zvolí oprávnění: zobrazit a komentovat.

11. Nastaví volitelnou expiraci odkazu.

12. Dodavatel vidí jen danou vadu, fotky a komentáře, nikoliv celou stavbu.

## 8.5 Wireframe slovně

\[Dashboard\]

------------------------------------------------

Rozpocet: 5 500 000 Kc Riziko: +280 000 Kc

Utraceno: 2 180 000 Kc Zbyva: 3 320 000 Kc

------------------------------------------------

Nejblizsi terminy:

\- 12. 6. betonaz desky

\- 18. 6. kontrola rozvodu odpadu

------------------------------------------------

Posledni vydaje:

\- Beton C25/30 84 500 Kc

\- Kari site 26 200 Kc

------------------------------------------------

\[+ Pridat\]

# 9. Technický blueprint

## 9.1 Doporučená architektura pro MVP

Pro první verzi je vhodné držet architekturu jednoduchou, rychle vyvíjitelnou a bezpečnou. Doporučená varianta pro MVP je:

| **Vrstva**  | **Doporučení**                                       | **Proč**                                                                     |
|-------------|------------------------------------------------------|------------------------------------------------------------------------------|
| Frontend    | Next.js nebo React + TypeScript                      | Rychlý vývoj, dobré PWA možnosti, silný ekosystém.                           |
| UI          | Tailwind CSS nebo komponentová knihovna              | Rychlé prototypování responzivního UI.                                       |
| Backend     | Supabase nebo vlastní API v NestJS/Node.js           | Supabase zrychlí auth, Postgres, storage a RLS; vlastní API dá víc kontroly. |
| Databáze    | PostgreSQL                                           | Vhodné pro relační data, reporting, transakce a oprávnění.                   |
| Soubory     | S3-compatible storage nebo Supabase Storage          | Faktury, fotky, dokumentace, náhledy.                                        |
| Autentizace | E-mail/heslo + OAuth                                 | Jednoduché přihlášení a pozvánky.                                            |
| PWA         | Service worker, app manifest, základní offline cache | Funkčnost na mobilu bez nutnosti nativní aplikace.                           |
| Notifikace  | E-mail v MVP, push později                           | Nejprve jednodušší a spolehlivější.                                          |

## 9.2 Alternativy technického stacku

| **Varianta**                       | **Vhodné pro**            | **Výhody**                                        | **Nevýhody**                                |
|------------------------------------|---------------------------|---------------------------------------------------|---------------------------------------------|
| Next.js + Supabase                 | Rychlé MVP a malý tým.    | Nejrychlejší cesta, Postgres, auth, storage, RLS. | Později může být potřeba custom backend.    |
| React + Firebase                   | Velmi rychlý prototyp.    | Realtime, auth a storage velmi snadno.            | Složitější relační reporting a práva.       |
| Next.js + NestJS + PostgreSQL + S3 | Dlouhodobý SaaS produkt.  | Plná kontrola, čistá architektura.                | Vyšší počáteční náklady.                    |
| Flutter/React Native + backend     | Nativní mobilní aplikace. | Lepší práce s mobilem a offline režimem.          | Delší vývoj, nutnost App Store/Google Play. |

## 9.3 Doporučené komponenty systému

Browser/PWA

-\> Frontend App (Next.js)

-\> Auth Provider

-\> API Layer / Server Actions

-\> PostgreSQL Database

-\> Object Storage for files

-\> Background Jobs (thumbnails, OCR, exports)

-\> Email/Notification Service

-\> Audit Log

## 9.4 Offline režim - pozdější fáze

Offline režim je užitečný na stavbě se špatným signálem, ale pro MVP nemusí být plně hotový. Doporučený postup:

- MVP 1: pouze PWA instalace a cache statických částí aplikace.

- MVP 2: lokální fronta pro nově pořízené fotky a výdaje, která se odešle po návratu internetu.

- MVP 3: IndexedDB cache posledního projektu, conflict resolution a stav synchronizace.

# 10. API blueprint

## 10.1 Základní endpointy

| **Metoda** | **Endpoint**                           | **Účel**                                 |
|------------|----------------------------------------|------------------------------------------|
| GET        | /api/projects                          | Seznam projektů uživatele.               |
| POST       | /api/projects                          | Vytvoření projektu.                      |
| GET        | /api/projects/{id}/dashboard           | Dashboard metriky.                       |
| GET        | /api/projects/{id}/expenses            | Výdaje s filtry.                         |
| POST       | /api/projects/{id}/expenses            | Vytvoření výdaje.                        |
| PATCH      | /api/expenses/{id}                     | Úprava výdaje.                           |
| POST       | /api/expenses/{id}/attachments         | Nahrání faktury/účtenky.                 |
| GET        | /api/projects/{id}/documents           | Dokumenty projektu.                      |
| POST       | /api/projects/{id}/documents           | Nahrání dokumentu.                       |
| GET        | /api/projects/{id}/photos              | Fotky projektu.                          |
| POST       | /api/projects/{id}/photos              | Nahrání fotky.                           |
| GET        | /api/projects/{id}/tasks               | Úkoly projektu.                          |
| POST       | /api/projects/{id}/tasks               | Vytvoření úkolu.                         |
| POST       | /api/projects/{id}/members/invite      | Pozvání člena.                           |
| PATCH      | /api/project-members/{id}              | Změna role/oprávnění.                    |
| POST       | /api/share-links                       | Vytvoření granularního sdíleného odkazu. |
| GET        | /api/projects/{id}/exports/budget.xlsx | Export rozpočtu.                         |
| GET        | /api/projects/{id}/exports/diary.pdf   | Export deníku.                           |

## 10.2 Příklad requestu pro vytvoření výdaje

POST /api/projects/proj_001/expenses

Content-Type: application/json

{

"title": "Kari site 150x150x6",

"amount": 26200,

"currency": "CZK",

"expense_date": "2026-06-08",

"category_id": "cat_foundations",

"stage": "Zaklady",

"payment_status": "paid",

"note": "Nakup ve stavebninach, doprava zvlast."

}

## 10.3 Dashboard agregace

Dashboard by neměl být skládán na frontendu z desítek dotazů. Doporučený je jeden agregovaný endpoint nebo materializovaný view.

GET /api/projects/{id}/dashboard

Response:

{

"budget_limit": 5500000,

"total_spent": 2180000,

"remaining": 3320000,

"planned_future": 1450000,

"risk_overrun": 280000,

"open_tasks": 14,

"overdue_tasks": 3,

"missing_invoices": 5,

"recent_expenses": \[...\],

"upcoming_deadlines": \[...\]

}

# 11. Bezpečnost, soukromí a provoz

Aplikace bude zpracovávat citlivá finanční data, osobní kontakty, adresy staveb, faktury a dokumenty. Bezpečnost proto není doplněk, ale základní požadavek produktu.

## 11.1 Bezpečnostní požadavky

- Všechna data musí být oddělena podle project_id a uživatelských oprávnění.

- Soubory nesmí být veřejné; přístup jen přes autorizované nebo časově omezené URL.

- Každá write akce musí být zapsána do audit logu.

- Mazání důležitých entit má být soft delete s možností obnovy alespoň v administračním procesu.

- Vlastník projektu musí mít možnost exportovat data a odstranit projekt.

- Při granularním sdílení musí aplikace ověřovat oprávnění na úrovni konkrétní entity, ne jen projektu.

- U faktur a dokumentů použít antivirovou kontrolu nebo alespoň omezení typů a velikostí souborů.

- Povinné zálohy databáze a storage, včetně pravidelné obnovovací zkoušky.

## 11.2 GDPR a data

- Zpracovat zásady ochrany osobních údajů.

- Minimalizovat povinná osobní data.

- Umožnit export dat uživatele.

- Umožnit smazání účtu a projektu.

- Ujasnit retenční politiku pro smazané soubory a zálohy.

- U logů a analytiky nepoužívat zbytečně citlivý obsah dokumentů.

## 11.3 Provozní požadavky

| **Oblast** | **Doporučení**                                                                    |
|------------|-----------------------------------------------------------------------------------|
| Monitoring | Sledovat chyby aplikace, neúspěšná nahrávání souborů, výkon API a fronty exportů. |
| Backups    | Denní zálohy databáze, verzované storage nebo pravidelný snapshot.                |
| Limity     | Nastavit limity velikosti souborů podle tarifu.                                   |
| Audit      | Logovat pozvánky, změny oprávnění, smazání souborů, změny výdajů a exporty.       |
| Support    | Možnost stáhnout diagnostický export metadat bez citlivých souborů.               |

# 12. Exporty, importy a integrace

## 12.1 Exporty

| **Export**                | **Obsah**                                     | **Formát**      | **Priorita** |
|---------------------------|-----------------------------------------------|-----------------|--------------|
| Rozpočet                  | Kategorie, plán, skutečnost, rozdíl, výdaje.  | XLSX, CSV, PDF  | MVP 2        |
| Faktury                   | Soubory faktur a metadata.                    | ZIP + CSV index | MVP 2        |
| Stavební záznamy          | Denní záznamy, fotky, osoby, práce, poznámky. | PDF             | MVP 2        |
| Seznam vad                | Vady, fotky, odpovědnost, stav, termíny.      | PDF, XLSX       | MVP 2        |
| Kompletní archiv projektu | Dokumenty, fotky, faktury, metadata.          | ZIP             | MVP 3        |

## 12.2 Importy

- Import výdajů z CSV/XLSX.

- Import kategorií rozpočtu ze šablony.

- Hromadné nahrání dokumentů a fotek.

- Později import z e-mailu přeposláním faktury na unikátní adresu projektu.

## 12.3 Možné integrace

- Kalendář: export termínů do Google/Apple kalendáře přes ICS.

- E-mail: notifikace pozvánek, termínů a změn.

- OCR: Google Document AI, Azure Form Recognizer, Tesseract nebo jiná služba podle rozpočtu.

- Mapy: adresa stavby a volitelné přiřazení fotek k místu.

- Portál stavební správy: neintegrovat přímo bez oficiálního API; spíše uchovávat vlastní osobní archiv dokumentů.

# 13. Backlog, user stories a akceptační kritéria

## 13.1 Prioritizovaný backlog

| **Priorita** | **Funkce**              | **Akceptační výstup**                                  |
|--------------|-------------------------|--------------------------------------------------------|
| P0           | Registrace a přihlášení | Uživatel se přihlásí a vidí své projekty.              |
| P0           | Vytvoření projektu      | Uživatel založí stavbu a nastaví měnu/rozpočet.        |
| P0           | Kategorie rozpočtu      | Uživatel vytvoří/edituje kategorie a plánované částky. |
| P0           | Přidání výdaje          | Uživatel uloží výdaj s částkou, datem a kategorií.     |
| P0           | Příloha k výdaji        | Uživatel nahraje fakturu/účtenku.                      |
| P0           | Dashboard financí       | Uživatel vidí utraceno, zbývá a rozpad kategorií.      |
| P0           | Dokumenty               | Uživatel nahraje a zatřídí dokument.                   |
| P0           | Fotky                   | Uživatel nahraje fotku a přiřadí etapu.                |
| P1           | Sdílení projektu        | Vlastník pozve člena jako read-only nebo editor.       |
| P1           | Úkoly                   | Uživatel vytvoří úkol s termínem.                      |
| P1           | Dodavatelé              | Uživatel eviduje kontakt a propojí ho s výdajem.       |
| P1           | Stavební záznam         | Uživatel vytvoří denní zápis s fotkami.                |
| P1           | Vady                    | Uživatel vytvoří vadu a přiřadí dodavatele.            |
| P1           | Export rozpočtu         | Uživatel stáhne XLSX/PDF.                              |
| P2           | Granulární sdílení      | Vlastník sdílí konkrétní vadu/dokument.                |
| P2           | OCR faktur              | Aplikace předvyplní částku, datum a dodavatele.        |
| P2           | AI souhrny              | Aplikace shrne stav rozpočtu, rizika a otevřené body.  |

## 13.2 Vybrané user stories

| **ID** | **User story**                                                                          | **Akceptační kritérium**                           |
|--------|-----------------------------------------------------------------------------------------|----------------------------------------------------|
| US-001 | Jako stavebník chci založit stavbu s rozpočtem, abych mohl sledovat plán vs. realitu.   | Projekt má název, měnu, volitelný limit a stav.    |
| US-002 | Jako stavebník chci rychle zadat výdaj z mobilu, abych nezapomněl žádnou položku.       | Výdaj lze uložit s názvem, částkou a datem.        |
| US-003 | Jako stavebník chci k výdaji přiložit fakturu, abych ji později dohledal.               | Podporované PDF/JPG/PNG, náhled a stažení.         |
| US-004 | Jako stavebník chci vidět překročené kategorie, abych mohl včas reagovat.               | Kategorie ukazuje plán, skutečnost a rozdíl.       |
| US-005 | Jako stavebník chci vyfotit skryté rozvody, abych měl důkaz pro budoucí opravy.         | Fotka má etapu, tag a popis.                       |
| US-006 | Jako vlastník chci pozvat stavební dozor, aby mohl komentovat dokumenty a fotky.        | Pozvánka e-mailem, role supervisor, omezená práva. |
| US-007 | Jako stavebník chci evidovat vadu s fotkou a termínem, aby se na ni nezapomnělo.        | Vada má stav, prioritu, odpovědnou osobu a fotky.  |
| US-008 | Jako účetní chci stáhnout faktury a rozpočet, abych nemusel žádat o jednotlivé soubory. | Export XLSX a ZIP faktur.                          |

# 14. Monetizace a produktová strategie

## 14.1 Doporučený obchodní model

U stavebníků může lépe fungovat platba za projekt/stavbu než nekonečné měsíční předplatné. Stavba má časově omezený životní cyklus a uživatel řeší vysoké náklady; psychologicky je srozumitelnější koupit si nástroj pro jednu stavbu nebo rekonstrukci.

| **Tarif** | **Obsah**                                             | **Možná cenová logika**            |
|-----------|-------------------------------------------------------|------------------------------------|
| Free      | 1 projekt, omezený počet výdajů, dokumentů a fotek.   | Validace trhu a lead magnet.       |
| Basic     | Neomezené výdaje, dokumenty, fotky, základní export.  | Nízká jednorázová nebo roční cena. |
| Pro       | Sdílení, deník, úkoly, vady, exporty, checklisty.     | Hlavní placený tarif.              |
| Stavba+   | Více členů, pokročilá oprávnění, větší úložiště, OCR. | Prémiová verze pro náročné stavby. |
| Expert    | Více projektů pro stavební dozor/projektanta.         | B2B tarif za počet projektů.       |

## 14.2 Metriky úspěchu

- Aktivované projekty: uživatel vytvořil projekt a přidal alespoň 3 výdaje.

- Retence: uživatel se vrací alespoň jednou týdně během aktivní stavby.

- Hloubka používání: výdaje s fakturou, výdaje s kategorií, fotky s etapou.

- Konverze: přechod z Free do placené verze po dosažení limitu.

- Hodnota: počet exportů, pozvaných členů a vyřešených vad.

# 15. Rizika a doporučení

| **Riziko**                           | **Dopad**                      | **Mitigace**                                                                              |
|--------------------------------------|--------------------------------|-------------------------------------------------------------------------------------------|
| Příliš složitá aplikace              | Uživatel přestane zapisovat.   | Mobile-first, rychlé přidání, postupné doplnění detailů.                                  |
| Právní očekávání u stavebního deníku | Riziko nesprávného marketingu. | Prezentovat jako pomůcku a export podkladů; formální soulad řešit samostatně s právníkem. |
| Velké soubory a fotky                | Náklady na storage a pomalost. | Komprese náhledů, limity podle tarifu, S3 lifecycle.                                      |
| Chyby oprávnění                      | Únik citlivých dat.            | RLS/ABAC, testy oprávnění, audit log.                                                     |
| Nejasná cenotvorba                   | Nízká konverze.                | Testovat jednorázovou platbu za stavbu vs. roční tarif.                                   |
| Nízká kvalita dat                    | Nepřesné reporty.              | Rychlé zadání + pozdější doplnění + upozornění na chybějící faktury/kategorie.            |

## 15.1 Doporučení pro první validaci

- Mluvit s lidmi, kteří právě staví nebo dokončili stavbu v posledních 12 měsících.

- Ověřit, zda by si platili spíše za rozpočet, deník, dokumenty, checklisty nebo sdílení.

- Ukázat prototyp toku Přidat výdaj + faktura + fotka a měřit, zda je pochopitelný bez vysvětlení.

- Záměrně nezačínat AI funkcemi; nejprve ověřit každodenní ruční používání.

- MVP testovat na reálné stavbě, ne jen na demo datech.

# 16. Přílohy

## 16.1 Doporučené etapy stavby

- Pozemek

- Projekt

- Povolení

- Financování

- Přípojky

- Zemní práce

- Základy

- Základová deska

- Hrubá stavba

- Stropy

- Krov

- Střecha

- Okna a dveře

- Elektroinstalace

- Voda a kanalizace

- Topení

- Vzduchotechnika

- Omítky

- Podlahy

- Obklady a koupelny

- Interiéry

- Fasáda

- Terénní úpravy

- Zahrada

- Dokončení a užívání

## 16.2 Doporučené kategorie rozpočtu

| **Kategorie**       | **Typické položky**                                               |
|---------------------|-------------------------------------------------------------------|
| Pozemek a příprava  | Geodet, přípojky, skrývka, dočasné oplocení, zařízení staveniště. |
| Projekt a povolení  | Projektant, statik, PENB, poplatky, vyjádření, dokumentace.       |
| Zemní práce         | Bagrování, odvoz zeminy, drenáže, kanalizace.                     |
| Základy             | Beton, výztuž, bednění, hydroizolace, základová deska.            |
| Hrubá stavba        | Zdivo, překlady, stropy, schodiště, komín.                        |
| Střecha             | Krov, krytina, klempířina, izolace, okapy.                        |
| Výplně otvorů       | Okna, dveře, vrata, montáž, parapety.                             |
| Technické instalace | Elektro, voda, odpady, topení, VZT, chytrá domácnost.             |
| Vnitřní práce       | Omítky, sádrokarton, podlahy, obklady, malby.                     |
| Exteriér            | Fasáda, sokl, terasy, chodníky, oplocení, zahrada.                |
| Revize a dokončení  | Revize, certifikáty, návody, kolaudační/dokončovací dokumentace.  |
| Rezerva             | Nepředvídané výdaje, změny a vícepráce.                           |

## 16.3 Šablona výdajové položky

| **Pole**    | **Typ**     | **Povinné**         | **Poznámka**                                  |
|-------------|-------------|---------------------|-----------------------------------------------|
| Název       | text        | Ano                 | Krátký popis položky.                         |
| Částka      | number      | Ano                 | Včetně nebo bez DPH podle nastavení projektu. |
| Měna        | enum        | Ano                 | Výchozí CZK.                                  |
| Datum       | date        | Ano                 | Datum nákupu nebo faktury.                    |
| Kategorie   | select      | Ne v rychlém režimu | Doporučené pro reporty.                       |
| Etapa       | select      | Ne                  | Pomáhá filtrovat.                             |
| Dodavatel   | select/text | Ne                  | Lze vytvořit za běhu.                         |
| Stav platby | enum        | Ano                 | Planned/unpaid/paid.                          |
| Příloha     | file        | Ne                  | Faktura, účtenka, foto.                       |
| Poznámka    | text        | Ne                  | Volný komentář.                               |

## 16.4 Checklisty pro budoucí knihovnu

### Před koupí pozemku

- \[ \] Přístupová cesta

- \[ \] Sítě a přípojky

- \[ \] Územní plán

- \[ \] Radon

- \[ \] Geologie

- \[ \] Omezení ochranných pásem

### Před zahájením stavby

- \[ \] Projektová dokumentace

- \[ \] Povolení/oznámení dle situace

- \[ \] Stavební dozor

- \[ \] Zařízení staveniště

- \[ \] Smlouvy a nabídky

- \[ \] Pojištění

### Před betonáží

- \[ \] Kontrola výztuže

- \[ \] Prostupy

- \[ \] Kanalizace

- \[ \] Bednění

- \[ \] Fotodokumentace

- \[ \] Objednávka betonu a pumpy

### Před zaklopením rozvodů

- \[ \] Fotky rozvodů

- \[ \] Tlakové zkoušky

- \[ \] Kontrola tras

- \[ \] Popisky okruhů

- \[ \] Souhlas dozoru

### Před platbou dodavateli

- \[ \] Faktura odpovídá nabídce

- \[ \] Práce převzata

- \[ \] Vady zapsány

- \[ \] Záruky a dokumenty předány

- \[ \] Fotky uloženy

### Před dokončením

- \[ \] Revize

- \[ \] Návody

- \[ \] Záruční listy

- \[ \] Dokumentace skutečného provedení

- \[ \] Seznam vad

- \[ \] Export archivu

## 16.5 Právní a procesní poznámka

Aplikace může obsahovat modul stavebních záznamů nebo deníku, ale před marketingovým tvrzením, že jde o plně legislativně vyhovující stavební deník, je nutné provést právní a odbornou kontrolu. Bezpečnější produktové označení pro první verzi je: Pomůcka pro vedení stavebních záznamů a export podkladů pro stavební deník.

Relevantní veřejné zdroje k ověření:

- Ministerstvo pro místní rozvoj: Vyhláška č. 131/2024 Sb., o dokumentaci staveb - stanoví mimo jiné náležitosti stavebního deníku a jednoduchého záznamu o stavbě. URL: https://mmr.gov.cz/cs/ministerstvo/stavebni-pravo/pravo-a-legislativa/novy-stavebni-zakon/vyhlasky/navrh-vyhlasky-o-dokumentaci-staveb

- Zákony pro lidi: Vyhláška č. 131/2024 Sb., § 10 a příloha č. 12. URL: https://www.zakonyprolidi.cz/cs/2024-131

- Portál stavební správy: veřejný portál pro online agendu stavební správy. URL: https://portal.stavebnisprava.gov.cz/

## 16.6 Definice hotovo pro MVP 1

- Uživatel může založit projekt, nastavit rozpočet a měnu.

- Uživatel může vytvořit kategorie rozpočtu.

- Uživatel může přidat, upravit a smazat výdaj.

- Uživatel může nahrát fakturu/účtenku k výdaji.

- Uživatel může nahrát dokument a fotku.

- Dashboard počítá utraceno, zbývá a rozdíl proti plánovaným kategoriím.

- Vlastník může pozvat dalšího uživatele jako read-only nebo editor.

- Oprávnění jsou vynucena na backendu, nikoliv jen ve frontendu.

- Data lze exportovat alespoň v CSV/XLSX pro výdaje.

- Aplikace je použitelná na mobilu bez horizontálního scrollu u hlavních obrazovek.

## 16.7 Shrnutí pro vývojáře

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr class="header">
<th><p><strong>Začít zde</strong></p>
<p>Nejprve postavit jádro: users, projects, project_members, budget_categories, expenses, attachments, documents, photos a dashboard agregace. Vše ostatní navázat až po ověření, že uživatelé opravdu pravidelně zapisují výdaje a přikládají faktury/fotky.</p></th>
</tr>
</thead>
<tbody>
</tbody>
</table>
