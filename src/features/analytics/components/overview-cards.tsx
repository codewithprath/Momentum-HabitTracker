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
        <Card key={i}>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{c.label}</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold">{c.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
