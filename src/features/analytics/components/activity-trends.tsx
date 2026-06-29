"use client";
import { HeatmapData } from "../utils/metrics";
import { eachDayOfInterval, subDays, format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ActivityTrends({ data }: { data: HeatmapData[] }) {
  const map = new Map<string, number>();
  data.forEach(d => map.set(d.date, d.count));

  const today = new Date();
  const days = eachDayOfInterval({ start: subDays(today, 29), end: today }).map(d => ({
    date: format(d, "MMM dd"),
    rawDate: format(d, "yyyy-MM-dd"),
    count: map.get(format(d, "yyyy-MM-dd")) || 0
  }));

  const maxCount = Math.max(...days.map(d => d.count), 1); // Avoid division by zero

  return (
    <Card>
      <CardHeader>
        <CardTitle>Last 30 Days Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between gap-[2px] h-32 mt-4">
          {days.map(d => {
            const height = `${(d.count / maxCount) * 100}%`;
            return (
              <div key={d.date} className="flex-1 flex flex-col justify-end group relative h-full">
                <div 
                  className={`w-full rounded-t-sm transition-all duration-300 ${d.count > 0 ? 'bg-primary' : 'bg-muted/30'}`} 
                  style={{ height: d.count > 0 ? height : '4px' }}
                />
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-popover border text-popover-foreground text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 shadow-sm">
                  {d.date}: {d.count}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
