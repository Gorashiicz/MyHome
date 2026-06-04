"use client";

import { useRouter } from "next/navigation";
import { Select } from "@/components/ui/select";

export function ProjectSwitcher({
  projects,
  currentId,
}: {
  projects: { id: string; name: string }[];
  currentId: string;
}) {
  const router = useRouter();

  return (
    <Select
      value={currentId}
      className="max-w-[160px] text-sm"
      onChange={(e) => {
        router.push(`/p/${e.target.value}`);
      }}
    >
      {projects.map((p) => (
        <option key={p.id} value={p.id}>
          {p.name}
        </option>
      ))}
    </Select>
  );
}
