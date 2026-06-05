"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCzk, formatDate, labelMilestoneStatus } from "@/lib/formatting";
import { Badge } from "@/components/ui/badge";
import type { MilestoneStatus } from "@prisma/client";

type MilestoneDetail = {
  milestone: {
    id: string;
    title: string;
    description: string | null;
    status: MilestoneStatus;
    targetDate: string | null;
    stage: string | null;
    category: { id: string; name: string } | null;
  };
  spentFormatted: string;
  plannedFormatted: string | null;
  expenses: {
    id: string;
    title: string;
    amount: { toString(): string };
    expenseDate: string;
  }[];
  photos: {
    id: string;
    title: string | null;
    storagePath: string;
  }[];
  tasks: {
    id: string;
    title: string;
    dueDate: string | null;
  }[];
};

export function MilestoneDetailPanel({
  projectId,
  detail,
}: {
  projectId: string;
  detail: MilestoneDetail;
}) {
  const [open, setOpen] = useState(false);
  const m = detail.milestone;

  return (
    <div className="rounded-xl border border-border bg-surface overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-surface-muted/50"
      >
        <div className="min-w-0 flex-1">
          <p className="font-medium">{m.title}</p>
          <p className="text-xs text-muted">
            {labelMilestoneStatus(m.status)}
            {m.targetDate && ` · ${formatDate(m.targetDate)}`}
            {m.stage && ` · ${m.stage}`}
          </p>
        </div>
        <Badge
          variant={
            m.status === "done"
              ? "success"
              : m.status === "in_progress"
                ? "warning"
                : "default"
          }
        >
          {labelMilestoneStatus(m.status)}
        </Badge>
        <ChevronDown
          className={cn(
            "h-5 w-5 text-muted transition-transform",
            open && "rotate-180"
          )}
        />
      </button>

      {open && (
        <div className="border-t border-border px-4 py-3 text-sm space-y-4">
          {m.description && (
            <p className="text-muted whitespace-pre-wrap">{m.description}</p>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-surface-muted p-3">
              <p className="text-xs text-muted">Utraceno (etapa/kategorie)</p>
              <p className="text-lg font-bold">{detail.spentFormatted}</p>
            </div>
            {detail.plannedFormatted && (
              <div className="rounded-lg bg-surface-muted p-3">
                <p className="text-xs text-muted">Plán rozpočtu</p>
                <p className="text-lg font-bold">{detail.plannedFormatted}</p>
              </div>
            )}
          </div>

          {detail.expenses.length > 0 && (
            <div>
              <p className="mb-2 font-medium">Související výdaje</p>
              <ul className="space-y-1">
                {detail.expenses.map((e) => (
                  <li key={e.id}>
                    <Link
                      href={`/p/${projectId}/rozpocet/vydaje/${e.id}`}
                      className="app-link flex justify-between gap-2"
                    >
                      <span className="truncate">{e.title}</span>
                      <span className="shrink-0">
                        {formatCzk(e.amount)} · {formatDate(e.expenseDate)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {detail.photos.length > 0 && (
            <div>
              <p className="mb-2 font-medium">Fotky z etapy</p>
              <div className="grid grid-cols-3 gap-2">
                {detail.photos.map((p) => (
                  <a
                    key={p.id}
                    href={`/api/soubory/${p.storagePath}`}
                    target="_blank"
                    rel="noreferrer"
                    className="overflow-hidden rounded-lg border border-border"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`/api/soubory/${p.storagePath}`}
                      alt={p.title ?? "Fotka"}
                      className="aspect-square w-full object-cover"
                    />
                  </a>
                ))}
              </div>
              <Link
                href={`/p/${projectId}/fotky`}
                className="mt-2 inline-block text-xs app-link"
              >
                Všechny fotky →
              </Link>
            </div>
          )}

          {detail.tasks.length > 0 && (
            <div>
              <p className="mb-2 font-medium">Otevřené úkoly</p>
              <ul className="space-y-1">
                {detail.tasks.map((t) => (
                  <li key={t.id} className="flex justify-between gap-2">
                    <span>{t.title}</span>
                    {t.dueDate && (
                      <span className="text-muted">{formatDate(t.dueDate)}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
