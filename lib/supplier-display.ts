export type SupplierLike = {
  name: string;
  profession?: string | null;
  companyName?: string | null;
  ico?: string | null;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  address?: string | null;
  notes?: string | null;
  rating?: number | null;
};

export function supplierNeedsDetails(s: SupplierLike): boolean {
  return (
    !s.profession &&
    !s.companyName &&
    !s.ico &&
    !s.phone &&
    !s.email &&
    !s.website &&
    !s.address &&
    !s.notes &&
    !s.rating
  );
}
