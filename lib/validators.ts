import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Jméno musí mít alespoň 2 znaky"),
  email: z.string().email("Neplatný e-mail"),
  password: z.string().min(6, "Heslo musí mít alespoň 6 znaků"),
});

export const projectSchema = z.object({
  name: z.string().min(2, "Název stavby je povinný"),
  description: z.string().optional(),
  addressText: z.string().optional(),
  constructionType: z.string().optional(),
  budgetMode: z.enum(["limited", "open"]),
  budgetLimit: z.coerce.number().positive().optional().nullable(),
  startDate: z.string().optional(),
  expectedFinish: z.string().optional(),
  status: z
    .enum(["planning", "active", "paused", "finished", "archived"])
    .optional(),
});

export const expenseSchema = z.object({
  title: z.string().min(1, "Název je povinný"),
  amount: z.coerce.number().positive("Částka musí být kladná"),
  currency: z.string().default("CZK"),
  expenseDate: z.string().min(1, "Datum je povinné"),
  dueDate: z.string().optional(),
  paymentStatus: z.enum([
    "planned",
    "ordered",
    "paid",
    "partially_paid",
    "cancelled",
  ]),
  categoryId: z.string().optional(),
  stage: z.string().optional(),
  supplierId: z.string().optional(),
  supplierName: z.string().optional(),
  note: z.string().optional(),
  tags: z.string().optional(),
});

export const categorySchema = z.object({
  name: z.string().min(1),
  plannedAmount: z.coerce.number().min(0),
  note: z.string().optional(),
});

export const documentSchema = z.object({
  title: z.string().min(1),
  docType: z.string(),
  version: z.string().optional(),
  docDate: z.string().optional(),
  note: z.string().optional(),
  stage: z.string().optional(),
  supplierId: z.string().optional(),
  tags: z.string().optional(),
});

export const photoSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  photoDate: z.string().optional(),
  stage: z.string().optional(),
  room: z.string().optional(),
  tags: z.string().optional(),
  important: z.coerce.boolean().optional(),
  evidence: z.coerce.boolean().optional(),
});

export const taskSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  status: z.enum(["todo", "in_progress", "waiting", "done", "cancelled"]),
  priority: z.enum(["low", "medium", "high", "critical"]),
  dueDate: z.string().optional(),
  assigneeId: z.string().optional(),
  supplierId: z.string().optional(),
  stage: z.string().optional(),
});

export const supplierSchema = z.object({
  name: z.string().min(1),
  profession: z.string().optional(),
  companyName: z.string().optional(),
  ico: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  website: z.string().optional(),
  address: z.string().optional(),
  notes: z.string().optional(),
  rating: z.coerce.number().min(1).max(5).optional().nullable(),
});

export const diarySchema = z.object({
  entryDate: z.string().min(1),
  weather: z.string().optional(),
  siteCondition: z.string().optional(),
  title: z.string().min(1),
  workPerformed: z.string().optional(),
  peoplePresent: z.string().optional(),
  machinesEquipment: z.string().optional(),
  materialsDelivered: z.string().optional(),
  dustMeasures: z.string().optional(),
  accessibilityMeasures: z.string().optional(),
  problems: z.string().optional(),
  decisions: z.string().optional(),
  notes: z.string().optional(),
});

export const diaryMetadataSchema = z.object({
  permitName: z.string().optional(),
  permitNumber: z.string().optional(),
  permitDate: z.string().optional(),
  siteAddress: z.string().optional(),
  builderName: z.string().optional(),
  builderAddress: z.string().optional(),
  contractorName: z.string().optional(),
  contractorAddress: z.string().optional(),
  designerName: z.string().optional(),
  designerAddress: z.string().optional(),
  subcontractors: z.string().optional(),
  siteManagement: z.string().optional(),
  technicalSupervision: z.string().optional(),
  authorizedRecorders: z.string().optional(),
  projectDocumentation: z.string().optional(),
  buildingDocuments: z.string().optional(),
  personChanges: z.string().optional(),
});

export const defectSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  status: z.enum([
    "open",
    "in_progress",
    "waiting_for_supplier",
    "fixed",
    "rejected",
    "closed",
  ]),
  priority: z.enum(["low", "medium", "high", "critical"]),
  supplierId: z.string().optional(),
  dueDate: z.string().optional(),
  dateFound: z.string().optional(),
  dateFixed: z.string().optional(),
  location: z.string().optional(),
  stage: z.string().optional(),
  notes: z.string().optional(),
});

export const inviteSchema = z.object({
  email: z.string().email(),
  role: z.enum(["editor", "viewer"]),
});
