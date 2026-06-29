import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { generateAnalytics } from "@/features/analytics/utils/metrics";
import { OverviewCards } from "@/features/analytics/components/overview-cards";
import { InsightsSummaryCard } from "@/features/analytics/components/insights-summary";
import { GitHubHeatmap } from "@/features/analytics/components/github-heatmap";
import { HabitAnalyticsList } from "@/features/analytics/components/habit-analytics-list";
import { ActivityTrends } from "@/features/analytics/components/activity-trends";
import { EmptyAnalytics } from "@/features/analytics/components/empty-analytics";

export const revalidate = 0; // Dynamic route

export default async function InsightsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Single optimized query (no N+1), limits logs to 365 days max for performance.
  const oneYearAgo = new Date();
  oneYearAgo.setDate(oneYearAgo.getDate() - 365);
  const oneYearAgoStr = oneYearAgo.toISOString().split('T')[0];

  const habits = await prisma.habit.findMany({
    where: {
      userId: user.id,
      isArchived: false,
    },
    include: {
      habitLogs: {
        where: {
          date: {
            gte: oneYearAgoStr,
          }
        },
        orderBy: {
          date: 'asc'
        }
      }
    }
  });

  if (habits.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Insights & Analytics</h1>
          <p className="text-muted-foreground mt-2">
            Visualize your consistency and long-term progress.
          </p>
        </div>
        <EmptyAnalytics />
      </div>
    );
  }

  // Calculate today based on UTC string to align with standard date strings
  const todayStr = new Date().toISOString().split('T')[0];
  const data = generateAnalytics(habits, todayStr);

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Insights & Analytics</h1>
        <p className="text-muted-foreground mt-2">
          Visualize your consistency and long-term progress.
        </p>
      </div>

      <InsightsSummaryCard data={data.insights} />
      
      <OverviewCards data={data.global} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GitHubHeatmap data={data.heatmap} historyStart={data.historyStart} />
        <ActivityTrends data={data.heatmap} />
      </div>

      <HabitAnalyticsList data={data.habitStats} />
    </div>
  );
}
