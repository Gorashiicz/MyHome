"use client";

import { useMemo, useState } from "react";
import { createExpense, updateExpense } from "@/actions/expenses";
import {
  BudgetCategoryPicker,
  type BudgetCategoryOption,
} from "@/components/forms/budget-category-picker";
import { SaveButton } from "@/components/ui/save-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { isOtherBudgetCategory } from "@/lib/budget-other-category";
import { formatCzk } from "@/lib/formatting";
import { SupplierNamesField } from "@/components/forms/supplier-names-field";
import { ExpenseAttachments } from "@/components/expense/expense-attachments";
import type { ExpenseAttachmentItem } from "@/lib/expense-attachments";
import type { PaymentStatus } from "@prisma/client";

type SelectOption = { id: string; name: string };

export type ExpenseFormValues = {
  title: string;
  amount: number;
  expenseDate: string;
  paymentStatus: PaymentStatus;
  categoryId: string;
  supplierNames: string[];
  note: string;
};

function resolveInitialBudgetId(
  budgetOptions: BudgetCategoryOption[],
  categoryId?: string
): string {
  if (categoryId && budgetOptions.some((o) => o.id === categoryId)) {
    return categoryId;
  }
  const other = budgetOptions.find((o) => isOtherBudgetCategory(o.name));
  return other?.id ?? budgetOptions[0]?.id ?? "";
}

export function ExpenseForm({
  projectId,
  suppliers,
  budgetOptions,
  initialCategoryId,
  defaultTitle,
  expenseId,
  initialValues,
  attachments = [],
  canEditAttachments = true,
}: {
  projectId: string;
  suppliers: SelectOption[];
  budgetOptions: BudgetCategoryOption[];
  initialCategoryId?: string;
  defaultTitle?: string;
  expenseId?: string;
  initialValues?: ExpenseFormValues;
  attachments?: ExpenseAttachmentItem[];
  canEditAttachments?: boolean;
}) {
  const isEdit = !!expenseId && !!initialValues;
  const today = new Date().toISOString().slice(0, 10);

  const initialBudgetId = resolveInitialBudgetId(
    budgetOptions,
    initialValues?.categoryId ?? initialCategoryId
  );
  const initialOption = budgetOptions.find((o) => o.id === initialBudgetId);

  const [selectedBudgetId, setSelectedBudgetId] = useState(initialBudgetId);
  const [title, setTitle] = useState(
    initialValues?.title ?? defaultTitle ?? ""
  );
  const [amount, setAmount] = useState(
    initialValues ? String(initialValues.amount) : ""
  );
  const [expenseDate, setExpenseDate] = useState(
    initialValues?.expenseDate ?? today
  );
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(
    initialValues?.paymentStatus ?? "paid"
  );
  const [stage, setStage] = useState(initialOption?.name ?? "");
  const [note, setNote] = useState(initialValues?.note ?? "");
  const [supplierNames, setSupplierNames] = useState<string[]>(
    initialValues?.supplierNames?.length
      ? initialValues.supplierNames
      : [""]
  );

  const selectedOption = useMemo(
    () => budgetOptions.find((o) => o.id === selectedBudgetId) ?? null,
    [budgetOptions, selectedBudgetId]
  );

  const isOther = selectedOption
    ? isOtherBudgetCategory(selectedOption.name)
    : false;

  const formAction = isEdit
    ? updateExpense.bind(null, projectId, expenseId!)
    : createExpense.bind(null, projectId);

  function handleBudgetSelect(id: string) {
    setSelectedBudgetId(id);
    if (!isEdit) {
      setTitle("");
      setNote("");
    }
    const opt = budgetOptions.find((o) => o.id === id);
    if (opt) setStage(opt.name);
  }

  return (
    <form action={formAction} className="space-y-4">
      <BudgetCategoryPicker
        options={budgetOptions}
        selectedId={selectedBudgetId}
        onSelect={handleBudgetSelect}
      />

      {selectedOption && (
        <div className="rounded-md app-info-box">
          {isOther ? (
            <p>
              Výdaj se započítá do položky <strong>{selectedOption.name}</strong>
              . Použijte ji pro náklady, které nepatří do konkrétní položky
              rozpočtu.
            </p>
          ) : (
            <>
              <p>
                Výdaj se započítá do položky rozpočtu:{" "}
                <strong>{selectedOption.name}</strong>
                {selectedOption.remaining > 0 && (
                  <>
                    {" "}
                    (v referenci zbývá {formatCzk(selectedOption.remaining)})
                  </>
                )}
              </p>
              <p className="mt-1 text-primary">
                Níže doplňte popis této části — např. krytina, krov nebo
                klempířské práce. Všechny výdaje se sečtou proti této položce
                rozpočtu.
              </p>
            </>
          )}
        </div>
      )}

      <div>
        <Label htmlFor="title">
          {isOther ? "Název výdaje *" : "Popis výdaje *"}
        </Label>
        <Input
          id="title"
          name="title"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1"
          placeholder={
            isOther
              ? "Beton C25/30, poplatek, materiál…"
              : "Krytina, krov, klempířské práce…"
          }
        />
        {!isOther && (
          <p className="mt-1 text-xs text-slate-500">
            Druhotný název — rozlišuje jednotlivé části u stejné položky rozpočtu.
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="amount">Částka (Kč) *</Label>
          <Input
            id="amount"
            name="amount"
            type="number"
            step="0.01"
            min="0"
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-1"
            placeholder={
              selectedOption &&
              !isOther &&
              selectedOption.remaining > 0
                ? `např. ${Math.round(selectedOption.remaining)}`
                : undefined
            }
          />
        </div>
        <div>
          <Label htmlFor="expenseDate">Datum *</Label>
          <Input
            id="expenseDate"
            name="expenseDate"
            type="date"
            required
            value={expenseDate}
            onChange={(e) => setExpenseDate(e.target.value)}
            className="mt-1"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="paymentStatus">Stav platby</Label>
        <Select
          id="paymentStatus"
          name="paymentStatus"
          value={paymentStatus}
          onChange={(e) =>
            setPaymentStatus(e.target.value as PaymentStatus)
          }
          className="mt-1"
        >
          <option value="planned">Plánováno</option>
          <option value="ordered">Objednáno</option>
          <option value="paid">Zaplaceno</option>
          <option value="partially_paid">Částečně zaplaceno</option>
          <option value="cancelled">Zrušeno</option>
        </Select>
      </div>

      <input type="hidden" name="categoryId" value={selectedBudgetId} />
      {stage && <input type="hidden" name="stage" value={stage} />}

      <SupplierNamesField
        suppliers={suppliers}
        values={supplierNames}
        onChange={setSupplierNames}
      />

      {!isEdit ? (
        <div>
          <Label htmlFor="attachment">Faktura / účtenka</Label>
          <Input
            id="attachment"
            name="attachment"
            type="file"
            accept="image/*,application/pdf"
            className="mt-1"
          />
          <p className="mt-1 text-xs text-muted">
            Volitelné — můžete doplnit i později na detailu výdaje.
          </p>
        </div>
      ) : (
        expenseId && (
          <ExpenseAttachments
            projectId={projectId}
            expenseId={expenseId}
            attachments={attachments}
            canEdit={canEditAttachments}
          />
        )
      )}

      <div>
        <Label htmlFor="note">Poznámka</Label>
        <Textarea
          id="note"
          name="note"
          rows={2}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="mt-1"
          placeholder={
            isOther ? undefined : "Detail faktury, materiál, číslo dokladu…"
          }
        />
      </div>

      <input type="hidden" name="currency" value="CZK" />
      <SaveButton
        label={isEdit ? "Uložit změny" : "Uložit výdaj"}
        className="w-full"
      />
    </form>
  );
}
