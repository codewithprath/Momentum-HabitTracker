import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { HabitList } from "@/features/habits/components/habit-list"
import { DailyProgress } from "@/features/habits/components/daily-progress"
import { CreateHabitDialog } from "@/features/habits/components/create-habit-dialog"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Dashboard | Momentum",
  description: "Your personal dashboard.",
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/login")
  }

  // Use local date for consistency
  const dateStr = new Date().toISOString().split('T')[0];

  const habits = await prisma.habit.findMany({
    where: { 
      userId: user.id,
      isArchived: false
    },
    orderBy: { createdAt: 'desc' }
  });

  const habitLogs = await prisma.habitLog.findMany({
    where: {
      userId: user.id,
      date: dateStr,
    }
  });

  const completedCount = habitLogs.filter((log: { status: boolean }) => log.status).length;
  
  // Format greeting
  const hour = new Date().getHours();
  let greeting = "Good evening";
  if (hour < 12) greeting = "Good morning";
  else if (hour < 18) greeting = "Good afternoon";

  const displayName = user.user_metadata?.first_name || user.email?.split('@')[0] || "there";

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{greeting}, {displayName}</h1>
          <p className="text-muted-foreground mt-2">
            Here is your momentum for today, {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}.
          </p>
        </div>
        {habits.length > 0 && <CreateHabitDialog />}
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr_300px]">
        <div className="space-y-6">
          <h2 className="text-xl font-semibold tracking-tight">Today&apos;s Habits</h2>
          <HabitList habits={habits} logs={habitLogs} dateStr={dateStr} />
        </div>
        
        <div className="space-y-6">
          <DailyProgress completed={completedCount} total={habits.length} />
        </div>
      </div>
    </div>
  )
}
