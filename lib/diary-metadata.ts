export type DiaryMetadata = {
  permitName?: string;
  permitNumber?: string;
  permitDate?: string;
  siteAddress?: string;
  builderName?: string;
  builderAddress?: string;
  contractorName?: string;
  contractorAddress?: string;
  designerName?: string;
  designerAddress?: string;
  subcontractors?: string;
  siteManagement?: string;
  technicalSupervision?: string;
  authorizedRecorders?: string;
  projectDocumentation?: string;
  buildingDocuments?: string;
  personChanges?: string;
};

type ProjectLike = {
  name: string;
  addressText?: string | null;
  description?: string | null;
  owner?: { name?: string | null; email?: string | null } | null;
};

export function parseDiaryMetadata(
  raw: unknown,
  project: ProjectLike
): DiaryMetadata {
  const base =
    raw && typeof raw === "object" && !Array.isArray(raw)
      ? (raw as Record<string, unknown>)
      : {};

  const str = (key: keyof DiaryMetadata) => {
    const v = base[key];
    return typeof v === "string" && v.trim() ? v.trim() : undefined;
  };

  return {
    permitName: str("permitName") ?? project.name,
    permitNumber: str("permitNumber"),
    permitDate: str("permitDate"),
    siteAddress: str("siteAddress") ?? project.addressText ?? undefined,
    builderName: str("builderName") ?? project.owner?.name ?? undefined,
    builderAddress: str("builderAddress"),
    contractorName: str("contractorName"),
    contractorAddress: str("contractorAddress"),
    designerName: str("designerName"),
    designerAddress: str("designerAddress"),
    subcontractors: str("subcontractors"),
    siteManagement: str("siteManagement"),
    technicalSupervision: str("technicalSupervision"),
    authorizedRecorders: str("authorizedRecorders"),
    projectDocumentation: str("projectDocumentation"),
    buildingDocuments: str("buildingDocuments"),
    personChanges: str("personChanges"),
  };
}

export function diaryMetadataToFormDefaults(
  meta: DiaryMetadata
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(meta).map(([k, v]) => [k, v ?? ""])
  );
}
