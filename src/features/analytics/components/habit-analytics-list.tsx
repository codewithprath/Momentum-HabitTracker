"use client";
import { HabitAnalytics } from "../utils/metrics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";
import { Button } from "@/components/ui/button";

type SortOption = "consistency-high" | "consistency-low" | "streak" | "alphabetical";

export function HabitAnalyticsList({ data }: { data: HabitAnalytics[] }) {
  const [sort, setSort] = useState<SortOption>("consistency-high");

  const sortedData = [...data].sort((a, b) => {
    if (sort === "consistency-high") return b.completionRate - a.completionRate;
    if (sort === "consistency-low") return a.completionRate - b.completionRate;
    if (sort === "streak") return b.currentStreak - a.currentStreak;
    return a.habit.name.localeCompare(b.habit.name);
  });

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-2 gap-4">
        <CardTitle>Habit Consistency</CardTitle>
        <div className="flex flex-wrap gap-2">
          <Button variant={sort === "consistency-high" ? "secondary" : "ghost"} size="sm" onClick={() => setSort("consistency-high")}>
            Highest
          </Button>
          <Button variant={sort === "consistency-low" ? "secondary" : "ghost"} size="sm" onClick={() => setSort("consistency-low")}>
            Lowest
          </Button>
          <Button variant={sort === "streak" ? "secondary" : "ghost"} size="sm" onClick={() => setSort("streak")}>
            Streak
          </Button>
          <Button variant={sort === "alphabetical" ? "secondary" : "ghost"} size="sm" onClick={() => setSort("alphabetical")}>
            A-Z
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm">No habits available.</div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Habit</TableHead>
                  <TableHead className="text-right">Consistency</TableHead>
                  <TableHead className="text-right">Streak</TableHead>
                  <TableHead className="text-right">Total Done</TableHead>
                  <TableHead className="text-right hidden md:table-cell">Missed</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedData.map((h) => (
                  <TableRow key={h.habit.id}>
                    <TableCell className="font-medium">
                      {h.habit.name}
                      <div className="text-xs text-muted-foreground md:hidden">{h.missedDays} missed</div>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className={h.completionRate > 75 ? "text-emerald-500 font-semibold" : h.completionRate < 30 ? "text-destructive font-semibold" : ""}>
                        {h.completionRate}%
                      </span>
                    </TableCell>
                    <TableCell className="text-right">{h.currentStreak} <span className="text-xs text-muted-foreground">({h.longestStreak} max)</span></TableCell>
                    <TableCell className="text-right">{h.totalCompletions}</TableCell>
                    <TableCell className="text-right hidden md:table-cell">{h.missedDays}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
