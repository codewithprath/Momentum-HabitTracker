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
    if (count === 0) return "bg-muted/40";
    if (count === 1) return "bg-emerald-300 dark:bg-emerald-900/60";
    if (count === 2) return "bg-emerald-400 dark:bg-emerald-700";
    if (count === 3) return "bg-emerald-500 dark:bg-emerald-500";
    return "bg-emerald-600 dark:bg-emerald-400";
  }

  return (
    <Card>
              <CardHeader className="p-6 pb-4">
        <CardTitle className="text-lg font-bold tracking-tight">Consistency Heatmap</CardTitle>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <div className="flex gap-1 overflow-x-auto pb-4 pt-2 scrollbar-hide mask-edges">
          {weeks.map((week, i) => (
            <div key={i} className="flex flex-col gap-1 animate-in fade-in slide-in-from-right-4 duration-500 fill-mode-both" style={{ animationDelay: `${i * 15}ms` }}>
              {week.map((day, j) => {
                if (!day) return <div key={j} className="w-3.5 h-3.5 rounded-sm bg-transparent" />;
                const count = intensityMap.get(day) || 0;
                return (
                  <div key={day} className="group relative">
                    <div
                      className={`w-3.5 h-3.5 rounded-sm transition-all duration-300 ${getColor(count)} hover:scale-[1.3] hover:ring-2 hover:ring-foreground/20 hover:z-10 shadow-xs`}
                    />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 bg-foreground text-background text-[10px] font-medium rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                      {format(parseISO(day), "MMM d, yyyy")}: {count} {count === 1 ? 'completion' : 'completions'}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px] border-4 border-transparent border-t-foreground" />
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-end gap-1.5 text-[10px] font-medium text-muted-foreground uppercase tracking-wider mt-4">
          <span>Less</span>
          <div className="w-3 h-3 rounded-sm bg-muted/40" />
          <div className="w-3 h-3 rounded-sm bg-emerald-300 dark:bg-emerald-900/60" />
          <div className="w-3 h-3 rounded-sm bg-emerald-400 dark:bg-emerald-700" />
          <div className="w-3 h-3 rounded-sm bg-emerald-500 dark:bg-emerald-500" />
          <div className="w-3 h-3 rounded-sm bg-emerald-600 dark:bg-emerald-400" />
          <span>More</span>
        </div>
      </CardContent>
    </Card>
  );
}
