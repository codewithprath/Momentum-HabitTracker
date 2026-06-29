"use client";
import { HeatmapData } from "../utils/metrics";
import { eachDayOfInterval, subDays, format, getDay, parseISO, max } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMemo } from "react";

export function GitHubHeatmap({ data, historyStart }: { data: HeatmapData[], historyStart: string }) {
  const intensityMap = useMemo(() => {
    const map = new Map<string, number>();
    data.forEach(d => map.set(d.date, d.count));
    return map;
  }, [data]);

  const days = useMemo(() => {
    const today = new Date();
    // Cap history at 365 days ago, but shrink if history is shorter
    const oldestAllowed = subDays(today, 364);
    const parsedHistoryStart = parseISO(historyStart);
    
    // We want the start to be the older of historyStart or 30 days ago (for a decent minimum visual size), capped at 365
    let start = max([oldestAllowed, parsedHistoryStart]);
    
    // Ensure we have at least 30 days of boxes for aesthetic reasons if possible
    if (eachDayOfInterval({ start, end: today }).length < 30) {
      start = max([oldestAllowed, subDays(today, 30)]);
    }

    const diffToSunday = getDay(start); 
    const padding = Array(diffToSunday).fill(null);
    
    const dates = eachDayOfInterval({ start, end: today }).map(d => format(d, "yyyy-MM-dd"));
    return [...padding, ...dates];
  }, [historyStart]);

  const weeks = useMemo(() => {
    const result = [];
    for (let i = 0; i < days.length; i += 7) {
      result.push(days.slice(i, i + 7));
    }
    return result;
  }, [days]);

  function getColor(count: number) {
    if (count === 0) return "bg-muted/30";
    if (count === 1) return "bg-emerald-200 dark:bg-emerald-900";
    if (count === 2) return "bg-emerald-300 dark:bg-emerald-700";
    if (count === 3) return "bg-emerald-400 dark:bg-emerald-500";
    return "bg-emerald-500 dark:bg-emerald-400";
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Consistency Heatmap</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-[3px] overflow-x-auto pb-4 pt-2 scrollbar-thin">
          {weeks.map((week, i) => (
            <div key={i} className="flex flex-col gap-[3px]">
              {week.map((day, j) => {
                if (!day) return <div key={j} className="w-[12px] h-[12px] rounded-sm bg-transparent" />;
                const count = intensityMap.get(day) || 0;
                return (
                  <div
                    key={day}
                    title={`${day}: ${count} completions`}
                    className={`w-[12px] h-[12px] rounded-sm transition-colors ${getColor(count)} hover:ring-1 hover:ring-foreground/50`}
                  />
                );
              })}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-end gap-2 text-xs text-muted-foreground mt-2">
          <span>Less</span>
          <div className="w-[12px] h-[12px] rounded-sm bg-muted/30" />
          <div className="w-[12px] h-[12px] rounded-sm bg-emerald-200 dark:bg-emerald-900" />
          <div className="w-[12px] h-[12px] rounded-sm bg-emerald-300 dark:bg-emerald-700" />
          <div className="w-[12px] h-[12px] rounded-sm bg-emerald-400 dark:bg-emerald-500" />
          <div className="w-[12px] h-[12px] rounded-sm bg-emerald-500 dark:bg-emerald-400" />
          <span>More</span>
        </div>
      </CardContent>
    </Card>
  );
}
