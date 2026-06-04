import { format } from "date-fns";
import { cs } from "date-fns/locale";
import type {
  BudgetMode,
  DefectStatus,
  PaymentStatus,
  ProjectStatus,
  ProjectRole,
  TaskPriority,
  TaskStatus,
} from "@prisma/client";

export function formatCzk(amount: number | string | { toString(): string }) {
  const value = typeof amount === "number" ? amount : Number(amount.toString());
  return new Intl.NumberFormat("cs-CZ", {
    style: "currency",
    currency: "CZK",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(date: Date | string | null | undefined) {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  return format(d, "d. M. yyyy", { locale: cs });
}

export function formatPercent(value: number) {
  return new Intl.NumberFormat("cs-CZ", {
    style: "percent",
    maximumFractionDigits: 0,
  }).format(value / 100);
}

const paymentStatusLabels: Record<PaymentStatus, string> = {
  planned: "Plánováno",
  ordered: "Objednáno",
  paid: "Zaplaceno",
  partially_paid: "Částečně zaplaceno",
  cancelled: "Zrušeno",
};

const projectStatusLabels: Record<ProjectStatus, string> = {
  planning: "Plánování",
  active: "Aktivní",
  paused: "Pozastaveno",
  finished: "Dokončeno",
  archived: "Archivováno",
};

const budgetModeLabels: Record<BudgetMode, string> = {
  limited: "S limitem",
  open: "Otevřený",
};

const taskStatusLabels: Record<TaskStatus, string> = {
  todo: "K udělání",
  in_progress: "Probíhá",
  waiting: "Čeká",
  done: "Hotovo",
  cancelled: "Zrušeno",
};

const taskPriorityLabels: Record<TaskPriority, string> = {
  low: "Nízká",
  medium: "Střední",
  high: "Vysoká",
  critical: "Kritická",
};

const defectStatusLabels: Record<DefectStatus, string> = {
  open: "Otevřeno",
  in_progress: "Řeší se",
  waiting_for_supplier: "Čeká na dodavatele",
  fixed: "Opraveno",
  rejected: "Zamítnuto",
  closed: "Uzavřeno",
};

const roleLabels: Record<ProjectRole, string> = {
  owner: "Vlastník",
  editor: "Editor",
  viewer: "Pouze čtení",
};

export function labelPaymentStatus(s: PaymentStatus) {
  return paymentStatusLabels[s];
}

export function labelProjectStatus(s: ProjectStatus) {
  return projectStatusLabels[s];
}

export function labelBudgetMode(s: BudgetMode) {
  return budgetModeLabels[s];
}

export function labelTaskStatus(s: TaskStatus) {
  return taskStatusLabels[s];
}

export function labelTaskPriority(s: TaskPriority) {
  return taskPriorityLabels[s];
}

export function labelDefectStatus(s: DefectStatus) {
  return defectStatusLabels[s];
}

export function labelRole(s: ProjectRole) {
  return roleLabels[s];
}

export function toNumber(value: { toString(): string } | number | null | undefined) {
  if (value == null) return 0;
  return typeof value === "number" ? value : Number(value.toString());
}
