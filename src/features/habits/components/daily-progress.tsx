"use client";

import { Progress } from "@/components/ui/progress";

interface DailyProgressProps {
  completed: number;
  total: number;
}

export function DailyProgress({ completed, total }: DailyProgressProps) {
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className="p-6 rounded-xl border border-border/50 bg-card shadow-sm transition-all hover:shadow-md">
      <div className="flex justify-between items-end mb-5">
        <div>
          <h3 className="font-semibold tracking-tight text-lg">Daily Progress</h3>
          <p className="text-sm text-muted-foreground mt-1">
            <span className="font-medium text-foreground">{completed}</span> of {total} habits completed
          </p>
        </div>
        <span className="text-4xl font-bold tracking-tighter text-primary">{percentage}%</span>
      </div>
      <Progress value={percentage} className="h-2.5 bg-primary/10" />
    </div>
  );
}
