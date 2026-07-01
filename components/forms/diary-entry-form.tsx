import { SaveButton } from "@/components/ui/save-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export type DiaryEntryFormValues = {
  entryDate: string;
  title: string;
  weather: string;
  siteCondition: string;
  peoplePresent: string;
  workPerformed: string;
  materialsDelivered: string;
  machinesEquipment: string;
  dustMeasures: string;
  accessibilityMeasures: string;
  problems: string;
  decisions: string;
  notes: string;
};

export function diaryEntryToFormValues(entry: {
  entryDate: Date;
  title: string;
  weather: string | null;
  siteCondition: string | null;
  peoplePresent: string | null;
  workPerformed: string | null;
  machinesEquipment: string | null;
  materialsDelivered: string | null;
  dustMeasures: string | null;
  accessibilityMeasures: string | null;
  problems: string | null;
  decisions: string | null;
  notes: string | null;
}): DiaryEntryFormValues {
  return {
    entryDate: entry.entryDate.toISOString().slice(0, 10),
    title: entry.title,
    weather: entry.weather ?? "",
    siteCondition: entry.siteCondition ?? "",
    peoplePresent: entry.peoplePresent ?? "",
    workPerformed: entry.workPerformed ?? "",
    materialsDelivered: entry.materialsDelivered ?? "",
    machinesEquipment: entry.machinesEquipment ?? "",
    dustMeasures: entry.dustMeasures ?? "",
    accessibilityMeasures: entry.accessibilityMeasures ?? "",
    problems: entry.problems ?? "",
    decisions: entry.decisions ?? "",
    notes: entry.notes ?? "",
  };
}

export function DiaryEntryForm({
  formAction,
  defaultValues,
  submitLabel = "Uložit záznam",
}: {
  formAction: (formData: FormData) => void | Promise<void>;
  defaultValues?: Partial<DiaryEntryFormValues>;
  submitLabel?: string;
}) {
  const v = defaultValues ?? {};

  return (
    <form action={formAction} className="grid gap-3 sm:grid-cols-2">
      <div>
        <Label htmlFor="entryDate">Datum *</Label>
        <Input
          id="entryDate"
          name="entryDate"
          type="date"
          required
          defaultValue={v.entryDate}
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="title">Nadpis záznamu *</Label>
        <Input
          id="title"
          name="title"
          required
          placeholder="Denní záznam"
          defaultValue={v.title ?? "Denní záznam"}
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="weather">Počasí / teplota</Label>
        <Input
          id="weather"
          name="weather"
          placeholder="Slunečno, +12 °C"
          defaultValue={v.weather}
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="siteCondition">Stav staveniště</Label>
        <Input
          id="siteCondition"
          name="siteCondition"
          placeholder="Sucho, přístupné…"
          defaultValue={v.siteCondition}
          className="mt-1"
        />
      </div>
      <div className="sm:col-span-2">
        <Label htmlFor="peoplePresent">Osoby na staveništi</Label>
        <Input
          id="peoplePresent"
          name="peoplePresent"
          defaultValue={v.peoplePresent}
          className="mt-1"
        />
      </div>
      <div className="sm:col-span-2">
        <Label htmlFor="workPerformed">Prováděné práce</Label>
        <Textarea
          id="workPerformed"
          name="workPerformed"
          rows={3}
          defaultValue={v.workPerformed}
          className="mt-1"
        />
      </div>
      <div className="sm:col-span-2">
        <Label htmlFor="materialsDelivered">Dodávky materiálu / zabudování</Label>
        <Textarea
          id="materialsDelivered"
          name="materialsDelivered"
          rows={2}
          defaultValue={v.materialsDelivered}
          className="mt-1"
        />
      </div>
      <div className="sm:col-span-2">
        <Label htmlFor="machinesEquipment">Mechanizace</Label>
        <Textarea
          id="machinesEquipment"
          name="machinesEquipment"
          rows={2}
          defaultValue={v.machinesEquipment}
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="dustMeasures">Opatření proti prašnosti</Label>
        <Input
          id="dustMeasures"
          name="dustMeasures"
          defaultValue={v.dustMeasures}
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="accessibilityMeasures">Přístupnost staveniště</Label>
        <Input
          id="accessibilityMeasures"
          name="accessibilityMeasures"
          defaultValue={v.accessibilityMeasures}
          className="mt-1"
        />
      </div>
      <div className="sm:col-span-2">
        <Label htmlFor="problems">Problémy / mimořádné události</Label>
        <Textarea
          id="problems"
          name="problems"
          rows={2}
          defaultValue={v.problems}
          className="mt-1"
        />
      </div>
      <div className="sm:col-span-2">
        <Label htmlFor="decisions">Rozhodnutí / dohody</Label>
        <Textarea
          id="decisions"
          name="decisions"
          rows={2}
          defaultValue={v.decisions}
          className="mt-1"
        />
      </div>
      <div className="sm:col-span-2">
        <Label htmlFor="notes">Další poznámky</Label>
        <Textarea
          id="notes"
          name="notes"
          rows={2}
          defaultValue={v.notes}
          className="mt-1"
        />
      </div>
      <div className="sm:col-span-2">
        <SaveButton label={submitLabel} className="w-full sm:w-auto" />
      </div>
    </form>
  );
}
