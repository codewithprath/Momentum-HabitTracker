import { Card, CardContent } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function EmptyAnalytics() {
  return (
    <Card className="border-dashed border-2 bg-transparent mt-8">
      <CardContent className="flex flex-col items-center justify-center p-12 text-center">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <BarChart3 className="w-6 h-6 text-primary" />
        </div>
        <h3 className="text-xl font-bold tracking-tight mb-2">No Analytics Yet</h3>
        <p className="text-muted-foreground max-w-sm mb-6">
          Analytics will appear here once you create habits and start logging your progress.
        </p>
        <Button render={<Link href="/app">Go to Dashboard</Link>} />
      </CardContent>
    </Card>
  );
}
