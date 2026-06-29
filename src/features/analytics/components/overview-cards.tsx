import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GlobalAnalytics } from "../utils/metrics";

export function OverviewCards({ data }: { data: GlobalAnalytics }) {
  const cards = [
    { label: "Overall Rate", value: `${data.overallRate}%` },
    { label: "Weekly Rate", value: `${data.weeklyRate}%` },
    { label: "Monthly Rate", value: `${data.monthlyRate}%` },
    { label: "Longest Streak", value: `${data.longestStreak} days` },
    { label: "Active Days", value: data.activeDays },
    { label: "Total Completions", value: data.totalCompletions },
    { label: "Total Active Habits", value: data.totalActiveHabits },
    { label: "Completed Today", value: data.completedToday },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((c, i) => (
        <Card key={i} className="transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:border-primary/20">
          <CardHeader className="p-5 pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{c.label}</CardTitle>
          </CardHeader>
          <CardContent className="p-5 pt-0">
            <div className="text-3xl font-bold tracking-tight">{c.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
