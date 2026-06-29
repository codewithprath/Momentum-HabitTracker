import { Card, CardContent } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function EmptyAnalytics() {
  return (
    <Card className="border-dashed bg-card/50 mt-8 transition-all hover:bg-card hover:border-primary/30">
      <CardContent className="flex flex-col items-center justify-center p-16 text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6 shadow-inner">
          <BarChart3 className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-xl font-bold tracking-tight mb-2">No Analytics Yet</h3>
        <p className="text-muted-foreground max-w-sm mb-8 text-sm">
          Analytics will appear here once you create habits and start logging your progress.
        </p>
        <Button render={<Link href="/app">Go to Dashboard</Link>} />
      </CardContent>
    </Card>
  );
}
