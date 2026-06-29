"use client";

import { Progress } from "@/components/ui/progress";

interface DailyProgressProps {
  completed: number;
  total: number;
}

export function DailyProgress({ completed, total }: DailyProgressProps) {
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className="p-6 rounded-xl border bg-card">
      <div className="flex justify-between items-end mb-4">
        <div>
          <h3 className="font-semibold text-lg">Daily Progress</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {completed} of {total} habits completed
          </p>
        </div>
        <span className="text-3xl font-bold text-primary">{percentage}%</span>
      </div>
      <Progress value={percentage} className="h-3" />
    </div>
  );
}
