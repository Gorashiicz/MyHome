import { updateDiaryMetadata } from "@/actions/diary";
import { diaryMetadataToFormDefaults } from "@/lib/diary-metadata";
import { SaveButton } from "@/components/ui/save-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown } from "lucide-react";

const META_FIELDS: {
  name: keyof ReturnType<typeof diaryMetadataToFormDefaults>;
  label: string;
  rows?: number;
}[] = [
  { name: "permitName", label: "Název stavby dle povolení" },
  { name: "permitNumber", label: "Číslo jednací / stavebního povolení" },
  { name: "permitDate", label: "Datum vydání povolení" },
  { name: "siteAddress", label: "Místo stavby" },
  { name: "builderName", label: "Stavebník (investor)" },
  { name: "builderAddress", label: "Adresa stavebníka" },
  { name: "contractorName", label: "Zhotovitel" },
  { name: "contractorAddress", label: "Adresa zhotovitele" },
  { name: "designerName", label: "Projektant" },
  { name: "designerAddress", label: "Adresa projektanta" },
  { name: "subcontractors", label: "Poddodavatelé", rows: 2 },
  { name: "siteManagement", label: "Stavbyvedoucí / odborné vedení", rows: 2 },
  { name: "technicalSupervision", label: "Technický a autorský dozor", rows: 2 },
  { name: "authorizedRecorders", label: "Osoby oprávněné k záznamům", rows: 2 },
  { name: "projectDocumentation", label: "Projektová dokumentace", rows: 2 },
  { name: "buildingDocuments", label: "Dokumenty ke stavbě (povolení, smlouvy…)", rows: 2 },
  { name: "personChanges", label: "Změny odpovědných osob", rows: 2 },
];

function metadataSummary(defaults: Record<string, string>) {
  const parts = [
    defaults.permitName,
    defaults.permitNumber && `č. j. ${defaults.permitNumber}`,
    defaults.designerName && `projektant: ${defaults.designerName}`,
  ].filter(Boolean);
  return parts.length > 0 ? parts.join(" · ") : "Zatím nevyplněno — rozbalte a doplňte před exportem PDF";
}

export function DiaryMetadataPanel({
  projectId,
  defaults,
}: {
  projectId: string;
  defaults: Record<string, string>;
}) {
  return (
    <Card>
      <details className="group">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-4 py-3 marker:content-none [&::-webkit-details-marker]:hidden">
          <div className="min-w-0">
            <p className="text-base font-semibold text-slate-900">
              Identifikační údaje pro export (příloha č. 12)
            </p>
            <p className="mt-0.5 truncate text-xs text-slate-500 group-open:hidden">
              {metadataSummary(defaults)}
            </p>
          </div>
          <ChevronDown className="h-5 w-5 shrink-0 text-slate-400 transition-transform group-open:rotate-180" />
        </summary>
        <CardContent className="border-t border-slate-100 pt-4">
          <p className="mb-3 text-xs text-slate-500">
            Vyplníte jednou — použije se v PDF výpisu. Při denním zapisování můžete
            nechat sbalené.
          </p>
          <form
            action={updateDiaryMetadata.bind(null, projectId)}
            className="grid gap-3 sm:grid-cols-2"
          >
            {META_FIELDS.map((f) => (
              <div
                key={f.name}
                className={f.rows ? "sm:col-span-2" : undefined}
              >
                <Label htmlFor={f.name}>{f.label}</Label>
                {f.rows ? (
                  <Textarea
                    id={f.name}
                    name={f.name}
                    rows={f.rows}
                    defaultValue={defaults[f.name]}
                    className="mt-1"
                  />
                ) : (
                  <Input
                    id={f.name}
                    name={f.name}
                    defaultValue={defaults[f.name]}
                    className="mt-1"
                  />
                )}
              </div>
            ))}
            <div className="sm:col-span-2">
              <SaveButton
                size="default"
                label="Uložit údaje pro export"
                className="w-full sm:w-auto"
              />
            </div>
          </form>
        </CardContent>
      </details>
    </Card>
  );
}
