import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus, Flame, Target } from "lucide-react";
import { InsightsSummary } from "../utils/metrics";

export function InsightsSummaryCard({ data }: { data: InsightsSummary }) {
  return (
    <Card className="bg-gradient-to-r from-primary/10 via-background to-background border-primary/20">
      <CardContent className="p-6">
        <h2 className="text-xl font-bold tracking-tight mb-4">Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-primary/20 text-primary rounded-lg">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-medium">Momentum</p>
              <p className="text-sm text-muted-foreground mt-1">
                You are on a <strong className="text-foreground">{data.currentGlobalStreak} day</strong> global streak.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 bg-primary/20 text-primary rounded-lg">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-medium">Best Habit</p>
              <p className="text-sm text-muted-foreground mt-1">
                {data.bestHabit ? (
                  <>Your most consistent habit is <strong className="text-foreground">{data.bestHabit}</strong>.</>
                ) : (
                  "Not enough data yet."
                )}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 bg-primary/20 text-primary rounded-lg">
              {data.weeklyTrend === "improving" ? (
                <TrendingUp className="w-5 h-5 text-emerald-500" />
              ) : data.weeklyTrend === "declining" ? (
                <TrendingDown className="w-5 h-5 text-destructive" />
              ) : (
                <Minus className="w-5 h-5 text-muted-foreground" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium">Weekly Trend</p>
              <p className="text-sm text-muted-foreground mt-1">
                Your consistency is {data.weeklyTrend} 
                {data.weeklyTrend !== "stable" && <strong> ({data.weeklyDifference > 0 ? "+" : ""}{data.weeklyDifference}%)</strong>}.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
