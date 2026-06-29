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
      <div className="flex flex-col items-center justify-center p-12 text-center border rounded-xl bg-card/50 border-dashed transition-all hover:bg-card hover:border-primary/30">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 shadow-inner">
          <span className="text-primary font-bold text-2xl">+</span>
        </div>
        <h3 className="text-xl font-bold tracking-tight mb-2">No habits yet</h3>
        <p className="text-muted-foreground mb-8 max-w-sm text-sm">
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
