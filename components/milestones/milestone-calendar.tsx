"use client";

import { useMemo, useState } from "react";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  endOfWeek,
} from "date-fns";
import { cs } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type CalendarMilestone = {
  id: string;
  title: string;
  targetDate: string;
  status: string;
};

type CalendarTask = {
  id: string;
  title: string;
  dueDate: string;
};

export function MilestoneCalendar({
  milestones,
  tasks,
}: {
  milestones: CalendarMilestone[];
  tasks: CalendarTask[];
}) {
  const [cursor, setCursor] = useState(() => new Date());
  const [selected, setSelected] = useState<Date | null>(null);

  const monthStart = startOfMonth(cursor);
  const monthEnd = endOfMonth(cursor);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: gridStart, end: gridEnd });

  const eventsByDay = useMemo(() => {
    const map = new Map<string, { milestones: CalendarMilestone[]; tasks: CalendarTask[] }>();
    for (const m of milestones) {
      if (!m.targetDate) continue;
      const key = format(new Date(m.targetDate), "yyyy-MM-dd");
      const entry = map.get(key) ?? { milestones: [], tasks: [] };
      entry.milestones.push(m);
      map.set(key, entry);
    }
    for (const t of tasks) {
      if (!t.dueDate) continue;
      const key = format(new Date(t.dueDate), "yyyy-MM-dd");
      const entry = map.get(key) ?? { milestones: [], tasks: [] };
      entry.tasks.push(t);
      map.set(key, entry);
    }
    return map;
  }, [milestones, tasks]);

  const selectedKey = selected ? format(selected, "yyyy-MM-dd") : null;
  const selectedEvents = selectedKey ? eventsByDay.get(selectedKey) : null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setCursor((d) => addMonths(d, -1))}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <p className="font-semibold capitalize">
          {format(cursor, "LLLL yyyy", { locale: cs })}
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setCursor((d) => addMonths(d, 1))}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-muted">
        {["Po", "Út", "St", "Čt", "Pá", "So", "Ne"].map((d) => (
          <div key={d} className="py-1">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const key = format(day, "yyyy-MM-dd");
          const events = eventsByDay.get(key);
          const hasEvents =
            (events?.milestones.length ?? 0) + (events?.tasks.length ?? 0) > 0;
          const isSelected = selected && isSameDay(day, selected);
          const inMonth = isSameMonth(day, cursor);

          return (
            <button
              key={key}
              type="button"
              onClick={() => setSelected(day)}
              className={cn(
                "relative flex aspect-square flex-col items-center justify-center rounded-lg text-sm transition",
                inMonth ? "text-foreground" : "text-muted/50",
                isSelected && "bg-primary text-white",
                !isSelected && hasEvents && "bg-primary-soft font-semibold",
                !isSelected && !hasEvents && "hover:bg-surface-muted"
              )}
            >
              {format(day, "d")}
              {hasEvents && !isSelected && (
                <span className="absolute bottom-1 flex gap-0.5">
                  {(events?.milestones.length ?? 0) > 0 && (
                    <span className="h-1 w-1 rounded-full bg-primary" />
                  )}
                  {(events?.tasks.length ?? 0) > 0 && (
                    <span className="h-1 w-1 rounded-full bg-amber-500" />
                  )}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {selected && (
        <div className="rounded-xl border border-border bg-surface p-3 text-sm">
          <p className="mb-2 font-medium">
            {format(selected, "d. MMMM yyyy", { locale: cs })}
          </p>
          {!selectedEvents ||
          (selectedEvents.milestones.length === 0 &&
            selectedEvents.tasks.length === 0) ? (
            <p className="text-muted">Žádné milníky ani úkoly.</p>
          ) : (
            <ul className="space-y-2">
              {selectedEvents.milestones.map((m) => (
                <li key={m.id} className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-primary" />
                  <span>
                    <strong>Milník:</strong> {m.title}
                  </span>
                </li>
              ))}
              {selectedEvents.tasks.map((t) => (
                <li key={t.id} className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-amber-500" />
                  <span>
                    <strong>Úkol:</strong> {t.title}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
