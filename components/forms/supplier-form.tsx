"use client";

import { SaveButton } from "@/components/ui/save-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { SupplierLike } from "@/lib/supplier-display";

export type SupplierFormValues = SupplierLike;

export function SupplierForm({
  action,
  initial,
  submitLabel = "Uložit",
}: {
  action: (formData: FormData) => void | Promise<void>;
  initial?: SupplierFormValues;
  submitLabel?: string;
}) {
  return (
    <form action={action} className="space-y-3">
      <div>
        <Label htmlFor="name">Jméno / firma *</Label>
        <Input
          id="name"
          name="name"
          required
          defaultValue={initial?.name ?? ""}
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="profession">Profese / obor</Label>
        <Input
          id="profession"
          name="profession"
          defaultValue={initial?.profession ?? ""}
          className="mt-1"
          placeholder="Elektrikář, betonář…"
        />
      </div>
      <div>
        <Label htmlFor="companyName">Obchodní název</Label>
        <Input
          id="companyName"
          name="companyName"
          defaultValue={initial?.companyName ?? ""}
          className="mt-1"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="ico">IČO</Label>
          <Input
            id="ico"
            name="ico"
            defaultValue={initial?.ico ?? ""}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="phone">Telefon</Label>
          <Input
            id="phone"
            name="phone"
            defaultValue={initial?.phone ?? ""}
            className="mt-1"
          />
        </div>
      </div>
      <div>
        <Label htmlFor="email">E-mail</Label>
        <Input
          id="email"
          name="email"
          type="email"
          defaultValue={initial?.email ?? ""}
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="website">Web</Label>
        <Input
          id="website"
          name="website"
          defaultValue={initial?.website ?? ""}
          className="mt-1"
          placeholder="https://"
        />
      </div>
      <div>
        <Label htmlFor="address">Adresa</Label>
        <Input
          id="address"
          name="address"
          defaultValue={initial?.address ?? ""}
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="rating">Hodnocení (1–5)</Label>
        <Input
          id="rating"
          name="rating"
          type="number"
          min={1}
          max={5}
          defaultValue={initial?.rating ?? ""}
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="notes">Poznámka</Label>
        <Textarea
          id="notes"
          name="notes"
          rows={3}
          defaultValue={initial?.notes ?? ""}
          className="mt-1"
        />
      </div>
      <SaveButton label={submitLabel} className="w-full" />
    </form>
  );
}
