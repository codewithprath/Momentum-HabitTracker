"use client";

import { HabitCard } from "./habit-card";
import { CreateHabitDialog } from "./create-habit-dialog";
import type { Habit, HabitLog } from "@prisma/client";

interface HabitListProps {
  habits: Habit[];
  logs: HabitLog[];
  dateStr: string;
}

export function HabitList({ habits, logs, dateStr }: HabitListProps) {
  if (habits.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center border rounded-xl bg-card border-dashed">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <span className="text-primary font-bold text-xl">+</span>
        </div>
        <h3 className="text-lg font-semibold mb-1">No habits yet</h3>
        <p className="text-muted-foreground mb-6 max-w-sm">
          Create your first habit to start building momentum. Start small and focus on consistency.
        </p>
        <CreateHabitDialog />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {habits.map((habit) => {
        const isCompletedToday = logs.some(
          (log) => log.habitId === habit.id && log.status === true
        );

        return (
          <HabitCard
            key={habit.id}
            habit={habit}
            isCompletedToday={isCompletedToday}
            dateStr={dateStr}
          />
        );
      })}
    </div>
  );
}
