import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ArchivedHabitCard } from "@/features/habits/components/archived-habit-card";

export default async function ArchivedPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const archivedHabits = await prisma.habit.findMany({
    where: {
      userId: user.id,
      isArchived: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Archived Habits</h1>
        <p className="text-muted-foreground mt-2">
          Habits you have archived. You can restore them or permanently delete them.
        </p>
      </div>

      {archivedHabits.length === 0 ? (
        <div className="text-center py-12 border rounded-xl bg-card text-muted-foreground">
          No archived habits found.
        </div>
      ) : (
        <div className="grid gap-4">
          {archivedHabits.map((habit) => (
            <ArchivedHabitCard key={habit.id} habit={habit} />
          ))}
        </div>
      )}
    </div>
  );
}
