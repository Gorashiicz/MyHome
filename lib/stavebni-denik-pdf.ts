import path from "path";
import PDFDocument from "pdfkit";
import type PDFKit from "pdfkit";
import type { DiaryEntry, Project, User } from "@prisma/client";
import { formatDate } from "@/lib/formatting";
import { DiaryMetadata, parseDiaryMetadata } from "@/lib/diary-metadata";

const FONT_REGULAR = path.join(
  process.cwd(),
  "node_modules/dejavu-fonts-ttf/ttf/DejaVuSans.ttf"
);
const FONT_BOLD = path.join(
  process.cwd(),
  "node_modules/dejavu-fonts-ttf/ttf/DejaVuSans-Bold.ttf"
);

type EntryWithAuthor = DiaryEntry & {
  createdBy: Pick<User, "name" | "email">;
};

type ExportInput = {
  project: Project & { owner: Pick<User, "name" | "email"> };
  entries: EntryWithAuthor[];
  generatedAt: Date;
  generatedBy: string;
};

function line(doc: PDFKit.PDFDocument, y: number) {
  doc
    .moveTo(doc.page.margins.left, y)
    .lineTo(doc.page.width - doc.page.margins.right, y)
    .strokeColor("#cccccc")
    .stroke();
}

function ensureSpace(doc: PDFKit.PDFDocument, needed: number) {
  const bottom = doc.page.height - doc.page.margins.bottom;
  if (doc.y + needed > bottom) {
    doc.addPage();
  }
}

function writeField(
  doc: PDFKit.PDFDocument,
  label: string,
  value: string | undefined | null
) {
  ensureSpace(doc, 36);
  doc.font("Bold").fontSize(9).fillColor("#333333").text(label, {
    continued: false,
  });
  doc
    .font("Regular")
    .fontSize(10)
    .fillColor("#000000")
    .text(value?.trim() || "—", { lineGap: 2 });
  doc.moveDown(0.3);
}

function writeParagraph(doc: PDFKit.PDFDocument, title: string, body?: string | null) {
  if (!body?.trim()) return;
  ensureSpace(doc, 48);
  doc.font("Bold").fontSize(9).fillColor("#333333").text(title);
  doc.font("Regular").fontSize(10).fillColor("#000000").text(body.trim(), {
    lineGap: 2,
  });
  doc.moveDown(0.4);
}

function sectionTitle(doc: PDFKit.PDFDocument, title: string) {
  ensureSpace(doc, 40);
  doc.moveDown(0.5);
  doc.font("Bold").fontSize(13).fillColor("#111111").text(title);
  line(doc, doc.y + 2);
  doc.moveDown(0.6);
}

export function buildStavebniDenikPdf(input: ExportInput): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: "A4",
      margin: 48,
      bufferPages: true,
      info: {
        Title: `Stavební deník — ${input.project.name}`,
        Author: input.generatedBy,
        Subject: "Stavební deník dle vyhlášky č. 131/2024 Sb., příloha č. 12",
      },
    });

    const chunks: Buffer[] = [];
    doc.on("data", (chunk) => chunks.push(chunk as Buffer));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    doc.registerFont("Regular", FONT_REGULAR);
    doc.registerFont("Bold", FONT_BOLD);

    const meta = parseDiaryMetadata(input.project.diaryMetadata, {
      ...input.project,
      owner: input.project.owner,
    });

    // Titulní strana
    doc.font("Bold").fontSize(20).text("STAVEBNÍ DENÍK", { align: "center" });
    doc.moveDown(0.3);
    doc
      .font("Regular")
      .fontSize(10)
      .fillColor("#444444")
      .text(
        "Podle vyhlášky č. 131/2024 Sb., o dokumentaci staveb, příloha č. 12\n" +
          "a § 166 zákona č. 283/2021 Sb., stavební zákon",
        { align: "center", lineGap: 2 }
      );
    doc.moveDown(1.2);
    doc.font("Bold").fontSize(14).fillColor("#000000").text(meta.permitName ?? input.project.name, {
      align: "center",
    });
    if (meta.siteAddress) {
      doc.moveDown(0.3);
      doc.font("Regular").fontSize(11).text(meta.siteAddress, { align: "center" });
    }
    doc.moveDown(1);
    writeField(doc, "Číslo jednací / stavebního povolení:", meta.permitNumber);
    writeField(doc, "Datum vydání povolení:", meta.permitDate);
    writeField(
      doc,
      "Období záznamů:",
      input.entries.length
        ? `${formatDate(input.entries[0]!.entryDate)} – ${formatDate(input.entries[input.entries.length - 1]!.entryDate)}`
        : "—"
    );
    writeField(doc, "Vygenerováno:", formatDate(input.generatedAt));
    doc.moveDown(1);
    doc
      .font("Regular")
      .fontSize(8)
      .fillColor("#666666")
      .text(
        "Tento dokument byl vygenerován z aplikace Stavba Pod Kontrolou. " +
          "Předložení stavebnímu úřadu doporučujeme konzultovat s odpovědnou osobou za vedení deníku. " +
          "Elektronický export je nutné doplnit o podpisy / razítka oprávněných osob dle platných předpisů.",
        { lineGap: 2 }
      );

    // Část A — identifikace
    doc.addPage();
    sectionTitle(doc, "A. Identifikační údaje stavby");
    writeField(doc, "Název stavby (dle povolení):", meta.permitName);
    writeField(doc, "Místo stavby:", meta.siteAddress);
    writeField(doc, "Stavebník (investor):", meta.builderName);
    writeField(doc, "Sídlo / adresa stavebníka:", meta.builderAddress);
    writeField(doc, "Zhotovitel:", meta.contractorName);
    writeField(doc, "Sídlo zhotovitele:", meta.contractorAddress);
    writeField(doc, "Projektant:", meta.designerName);
    writeField(doc, "Sídlo projektanta:", meta.designerAddress);
    writeField(doc, "Poddodavatelé:", meta.subcontractors);
    writeField(
      doc,
      "Odborné vedení provádění stavby (stavbyvedoucí apod.):",
      meta.siteManagement
    );
    writeField(
      doc,
      "Technický dozor stavebníka / autorský dozor:",
      meta.technicalSupervision
    );
    writeField(
      doc,
      "Osoby oprávněné k záznamům (§ 166 odst. 2 stavebního zákona):",
      meta.authorizedRecorders
    );
    writeField(doc, "Projektová a technická dokumentace:", meta.projectDocumentation);
    writeField(
      doc,
      "Dokumenty a doklady ke stavbě (povolení, smlouvy, protokoly…):",
      meta.buildingDocuments
    );
    writeField(doc, "Změny zhotovitelů / odpovědných osob:", meta.personChanges);

    // Část B — záznamy
    doc.addPage();
    sectionTitle(doc, "B. Záznamy ve stavebním deníku");

    if (input.entries.length === 0) {
      doc.font("Regular").fontSize(10).text("Dosud nejsou evidovány žádné denní záznamy.");
    }

    for (let i = 0; i < input.entries.length; i++) {
      const e = input.entries[i]!;
      if (i > 0) {
        ensureSpace(doc, 120);
        if (doc.y > doc.page.height - doc.page.margins.bottom - 120) {
          doc.addPage();
        }
        line(doc, doc.y);
        doc.moveDown(0.5);
      }

      doc
        .font("Bold")
        .fontSize(11)
        .fillColor("#111111")
        .text(`Záznam ze dne ${formatDate(e.entryDate)}`, { continued: false });

      if (e.title) {
        doc.font("Regular").fontSize(10).fillColor("#333333").text(e.title);
      }

      doc.moveDown(0.3);

      writeParagraph(
        doc,
        "a) Jména a příjmení osob pracujících na staveništi:",
        e.peoplePresent
      );
      writeParagraph(
        doc,
        "b) Klimatické podmínky a stav staveniště:",
        [e.weather, e.siteCondition].filter(Boolean).join("\n") || undefined
      );
      writeParagraph(
        doc,
        "c) Popis a množství provedených prací a montáží:",
        e.workPerformed
      );
      writeParagraph(
        doc,
        "d) Dodávky materiálů, výrobků a zabudování:",
        e.materialsDelivered
      );
      writeParagraph(
        doc,
        "e) Nasazení mechanizačních prostředků:",
        e.machinesEquipment
      );
      writeParagraph(doc, "f) Opatření proti prašnosti:", e.dustMeasures);
      writeParagraph(
        doc,
        "g) Opatření k zajištění přístupnosti:",
        e.accessibilityMeasures
      );

      if (e.problems?.trim()) {
        writeParagraph(
          doc,
          "Problémy, mimořádné události, škody, úrazy:",
          e.problems
        );
      }
      if (e.decisions?.trim()) {
        writeParagraph(doc, "Přijatá rozhodnutí, dohody:", e.decisions);
      }
      if (e.notes?.trim()) {
        writeParagraph(doc, "Další záznamy:", e.notes);
      }

      const author =
        e.createdBy.name?.trim() ||
        e.createdBy.email ||
        "Neuvedeno";
      doc.moveDown(0.2);
      doc
        .font("Regular")
        .fontSize(8)
        .fillColor("#666666")
        .text(`Zapsal: ${author}  |  Datum zápisu: ${formatDate(e.createdAt)}`);
      doc.moveDown(0.6);
    }

    // Část C — pravidla vedení
    doc.addPage();
    sectionTitle(doc, "C. Vedení stavebního deníku");
    doc.font("Regular").fontSize(9).fillColor("#000000");
    const rules = [
      "Stavební deník se vede ode dne předání staveniště do dokončení stavby, popř. odstranění vad zjištěných při kontrolní prohlídce.",
      "Deník musí být na stavbě přístupný oprávněným osobám po celou dobu prací na staveništi.",
      "Záznamy o postupu prací se zapisují tentýž den, nejpozději následující pracovní den.",
      "Strany deníku jsou číslovány; v tištěné podobě nesmí být vynechána nevyužitá místa.",
      "Oprávněné osoby vykonávající vybrané činnosti dle § 155 stavebního zákona prokazují oprávnění razítkem a podpisem v deníku.",
    ];
    rules.forEach((r, idx) => {
      doc.text(`${idx + 1}. ${r}`, { lineGap: 3 });
      doc.moveDown(0.2);
    });

    doc.moveDown(1.5);
    doc.font("Bold").fontSize(10).text("Podpisy oprávněných osob");
    doc.moveDown(0.8);
    const sigLabels = [
      "Stavebník / stavebník",
      "Stavbyvedoucí",
      "Technický dozor stavebníka",
      "Zhotovitel",
    ];
    for (const label of sigLabels) {
      ensureSpace(doc, 50);
      doc.font("Regular").fontSize(9).text(`${label}:`);
      doc.moveDown(1.2);
      line(doc, doc.y);
      doc.font("Regular").fontSize(8).fillColor("#888888").text("podpis, razítko, datum");
      doc.moveDown(0.8);
      doc.fillColor("#000000");
    }

    // Číslování stran
    const range = doc.bufferedPageRange();
    for (let i = range.start; i < range.start + range.count; i++) {
      doc.switchToPage(i);
      doc
        .font("Regular")
        .fontSize(8)
        .fillColor("#888888")
        .text(`Strana ${i + 1} / ${range.count}`, 0, doc.page.height - 36, {
          align: "center",
        });
    }

    doc.end();
  });
}

export async function loadStavebniDenikExportData(projectId: string) {
  const { prisma } = await import("@/lib/db");

  const project = await prisma.project.findUniqueOrThrow({
    where: { id: projectId },
    include: { owner: { select: { name: true, email: true } } },
  });

  const entries = await prisma.diaryEntry.findMany({
    where: { projectId },
    orderBy: [{ entryDate: "asc" }, { createdAt: "asc" }],
    include: { createdBy: { select: { name: true, email: true } } },
  });

  return { project, entries };
}
