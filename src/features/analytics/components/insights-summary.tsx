import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus, Flame, Target } from "lucide-react";
import { InsightsSummary } from "../utils/metrics";

export function InsightsSummaryCard({ data }: { data: InsightsSummary }) {
  return (
    <Card className="bg-gradient-to-r from-primary/10 via-background to-background border-primary/20">
      <CardContent className="p-6">
        <h2 className="text-xl font-bold tracking-tight mb-4">Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-background/50 transition-colors">
            <div className="p-2.5 bg-primary/10 text-primary rounded-lg shadow-inner">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-tight">Momentum</p>
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                🔥 You&apos;re currently on a <strong className="text-foreground">{data.currentGlobalStreak}-day</strong> streak.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-background/50 transition-colors">
            <div className="p-2.5 bg-primary/10 text-primary rounded-lg shadow-inner">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-tight">Best Habit</p>
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                {data.bestHabit ? (
                  <>📚 <strong className="text-foreground">{data.bestHabit}</strong> is your strongest habit.</>
                ) : (
                  "Not enough data yet."
                )}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-background/50 transition-colors">
            <div className="p-2.5 bg-primary/10 text-primary rounded-lg shadow-inner">
              {data.weeklyTrend === "improving" ? (
                <TrendingUp className="w-5 h-5 text-emerald-500" />
              ) : data.weeklyTrend === "declining" ? (
                <TrendingDown className="w-5 h-5 text-destructive" />
              ) : (
                <Minus className="w-5 h-5 text-muted-foreground" />
              )}
            </div>
            <div>
              <p className="text-sm font-semibold tracking-tight">Weekly Trend</p>
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                {data.weeklyTrend === "improving" ? "📈" : data.weeklyTrend === "declining" ? "📉" : "📊"} Your weekly consistency {data.weeklyTrend === "improving" ? "improved" : data.weeklyTrend === "declining" ? "declined" : "remained stable"}
                {data.weeklyTrend !== "stable" && <> by <strong className="text-foreground">{data.weeklyDifference}%</strong></>}.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
