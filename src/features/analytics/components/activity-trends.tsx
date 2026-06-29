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
      <CardHeader className="p-6 pb-4">
        <CardTitle className="text-lg font-bold tracking-tight">Last 30 Days Activity</CardTitle>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <div className="flex items-end justify-between gap-1 h-32 mt-4 px-1">
          {days.map(d => {
            const height = `${(d.count / maxCount) * 100}%`;
            return (
              <div key={d.date} className="flex-1 flex flex-col justify-end group relative h-full">
                <div 
                  className={`w-full rounded-t-md transition-all duration-500 ${d.count > 0 ? 'bg-primary group-hover:bg-primary/80 group-hover:shadow-md' : 'bg-muted/30'}`} 
                  style={{ height: d.count > 0 ? height : '4px' }}
                />
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-foreground text-background text-[10px] font-medium px-2.5 py-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow-lg">
                  {d.date}: {d.count}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px] border-4 border-transparent border-t-foreground" />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
