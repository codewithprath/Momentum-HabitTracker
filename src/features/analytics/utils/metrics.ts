import { Habit, HabitLog } from "@prisma/client";
import { 
  parseISO, 
  differenceInDays, 
  differenceInCalendarWeeks, 
  differenceInCalendarMonths,
  subDays,
  format,
  isAfter
} from "date-fns";

export type HabitWithLogs = Habit & { habitLogs: HabitLog[] };

export type HabitAnalytics = {
  habit: Habit;
  currentStreak: number;
  longestStreak: number;
  completionRate: number;
  totalCompletions: number;
  missedDays: number;
  lastCompleted: string | null;
};

export type GlobalAnalytics = {
  currentStreak: number;
  longestStreak: number;
  overallRate: number;
  todayRate: number;
  weeklyRate: number;
  monthlyRate: number;
  totalActiveHabits: number;
  completedToday: number;
  totalCompletions: number;
  activeDays: number;
};

export type HeatmapData = {
  date: string; // YYYY-MM-DD
  count: number;
};

export type InsightsSummary = {
  bestHabit: string | null;
  currentGlobalStreak: number;
  weeklyTrend: "improving" | "declining" | "stable";
  weeklyDifference: number;
};

export function generateAnalytics(habits: HabitWithLogs[], todayStr: string): {
  global: GlobalAnalytics;
  habitStats: HabitAnalytics[];
  heatmap: HeatmapData[];
  insights: InsightsSummary;
  historyStart: string;
} {
  const todayDate = parseISO(todayStr);

  const habitStats: HabitAnalytics[] = [];
  const heatmapMap = new Map<string, number>();

  let totalCompletions = 0;
  const totalActiveHabits = habits.length;
  let completedToday = 0;
  
  // For global streak calculation (active days)
  const activeDaysSet = new Set<string>();

  habits.forEach(habit => {
    const completedLogs = habit.habitLogs
      .filter((log: HabitLog) => log.status === true)
      .sort((a: HabitLog, b: HabitLog) => a.date.localeCompare(b.date));

    // Heatmap and globals
    completedLogs.forEach((log: HabitLog) => {
      heatmapMap.set(log.date, (heatmapMap.get(log.date) || 0) + 1);
      activeDaysSet.add(log.date);
      totalCompletions++;
      if (log.date === todayStr) completedToday++;
    });

    // Streak Calculation
    let currentStreak = 0;
    let longestStreak = 0;
    let currentRun = 0;

    if (completedLogs.length > 0) {
      currentRun = 1;
      longestStreak = 1;
      for (let i = 1; i < completedLogs.length; i++) {
        const prev = parseISO(completedLogs[i - 1].date);
        const curr = parseISO(completedLogs[i].date);
        
        let diff = 0;
        if (habit.frequency === "daily") diff = differenceInDays(curr, prev);
        else if (habit.frequency === "weekly") diff = differenceInCalendarWeeks(curr, prev, { weekStartsOn: 1 });
        else if (habit.frequency === "monthly") diff = differenceInCalendarMonths(curr, prev);

        if (diff === 1) {
          currentRun++;
          if (currentRun > longestStreak) longestStreak = currentRun;
        } else if (diff > 1) {
          currentRun = 1;
        }
      }

      // Check if streak is alive today
      const last = parseISO(completedLogs[completedLogs.length - 1].date);
      let diffToToday = 0;
      if (habit.frequency === "daily") diffToToday = differenceInDays(todayDate, last);
      else if (habit.frequency === "weekly") diffToToday = differenceInCalendarWeeks(todayDate, last, { weekStartsOn: 1 });
      else if (habit.frequency === "monthly") diffToToday = differenceInCalendarMonths(todayDate, last);

      if (diffToToday <= 1) {
        currentStreak = currentRun;
      }
    }

    // Completion Rate (Simplified: completions / days since creation)
    const createdDate = parseISO(format(new Date(habit.createdAt), 'yyyy-MM-dd'));
    const daysSinceCreation = Math.max(1, differenceInDays(todayDate, createdDate) + 1);
    
    let expected = daysSinceCreation;
    if (habit.frequency === "weekly") expected = Math.max(1, Math.ceil(daysSinceCreation / 7));
    if (habit.frequency === "monthly") expected = Math.max(1, Math.ceil(daysSinceCreation / 30));

    const completionRate = Math.min(100, Math.round((completedLogs.length / expected) * 100));
    const missedDays = Math.max(0, expected - completedLogs.length);

    habitStats.push({
      habit,
      currentStreak,
      longestStreak,
      completionRate,
      totalCompletions: completedLogs.length,
      missedDays,
      lastCompleted: completedLogs.length > 0 ? completedLogs[completedLogs.length - 1].date : null
    });
  });

  // Calculate Global Streak
  const sortedActiveDates = Array.from(activeDaysSet).sort();
  let globalCurrentStreak = 0;
  let globalLongestStreak = 0;
  let globalRun = 0;

  if (sortedActiveDates.length > 0) {
    globalRun = 1;
    globalLongestStreak = 1;
    for (let i = 1; i < sortedActiveDates.length; i++) {
      const prev = parseISO(sortedActiveDates[i - 1]);
      const curr = parseISO(sortedActiveDates[i]);
      if (differenceInDays(curr, prev) === 1) {
        globalRun++;
        if (globalRun > globalLongestStreak) globalLongestStreak = globalRun;
      } else {
        globalRun = 1;
      }
    }
    const lastActive = parseISO(sortedActiveDates[sortedActiveDates.length - 1]);
    if (differenceInDays(todayDate, lastActive) <= 1) {
      globalCurrentStreak = globalRun;
    }
  }

  // Global Rates
  // We need to know expected completions for timeframes.
  // Today: how many daily habits exist?
  const dailyHabits = habits.filter(h => h.frequency === 'daily').length;
  const todayRate = dailyHabits > 0 ? Math.round((completedToday / dailyHabits) * 100) : 0;
  
  // Weekly rate: completions in last 7 days vs (dailyHabits * 7 + weeklyHabits)
  const sevenDaysAgo = subDays(todayDate, 7);
  let completionsLast7Days = 0;
  let completionsPrev7Days = 0;
  const fourteenDaysAgo = subDays(todayDate, 14);

  habits.forEach(h => {
    h.habitLogs.forEach((l: HabitLog) => {
      if (l.status) {
        const d = parseISO(l.date);
        if (isAfter(d, sevenDaysAgo)) completionsLast7Days++;
        else if (isAfter(d, fourteenDaysAgo)) completionsPrev7Days++;
      }
    });
  });

  const weeklyHabits = habits.filter(h => h.frequency === 'weekly').length;
  const expectedWeekly = (dailyHabits * 7) + weeklyHabits;
  const weeklyRate = expectedWeekly > 0 ? Math.min(100, Math.round((completionsLast7Days / expectedWeekly) * 100)) : 0;

  // Monthly
  const thirtyDaysAgo = subDays(todayDate, 30);
  let completionsLast30Days = 0;
  habits.forEach(h => {
    h.habitLogs.forEach((l: HabitLog) => {
      if (l.status) {
        const d = parseISO(l.date);
        if (isAfter(d, thirtyDaysAgo)) completionsLast30Days++;
      }
    });
  });
  const monthlyHabits = habits.filter(h => h.frequency === 'monthly').length;
  const expectedMonthly = (dailyHabits * 30) + (weeklyHabits * 4) + monthlyHabits;
  const monthlyRate = expectedMonthly > 0 ? Math.min(100, Math.round((completionsLast30Days / expectedMonthly) * 100)) : 0;

  const overallRate = habitStats.length > 0 
    ? Math.round(habitStats.reduce((sum, h) => sum + h.completionRate, 0) / habitStats.length)
    : 0;

  const heatmap: HeatmapData[] = Array.from(heatmapMap.entries()).map(([date, count]) => ({ date, count }));

  // Insights Summary
  let bestHabit = null;
  if (habitStats.length > 0) {
    const sorted = [...habitStats].sort((a, b) => b.completionRate - a.completionRate);
    bestHabit = sorted[0].habit.name;
  }

  const prevWeeklyRate = expectedWeekly > 0 ? Math.min(100, Math.round((completionsPrev7Days / expectedWeekly) * 100)) : 0;
  const diff = weeklyRate - prevWeeklyRate;
  
  const insights: InsightsSummary = {
    bestHabit,
    currentGlobalStreak: globalCurrentStreak,
    weeklyTrend: diff > 0 ? "improving" : diff < 0 ? "declining" : "stable",
    weeklyDifference: diff
  };

  let historyStart = todayStr;
  if (habits.length > 0) {
    const oldest = new Date(Math.min(...habits.map(h => new Date(h.createdAt).getTime())));
    historyStart = format(oldest, 'yyyy-MM-dd');
  }

  return {
    global: {
      currentStreak: globalCurrentStreak,
      longestStreak: globalLongestStreak,
      overallRate,
      todayRate,
      weeklyRate,
      monthlyRate,
      totalActiveHabits,
      completedToday,
      totalCompletions,
      activeDays: activeDaysSet.size
    },
    habitStats,
    heatmap,
    insights,
    historyStart
  };
}
