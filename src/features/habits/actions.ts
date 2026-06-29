"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { habitSchema, type HabitInput } from "./schema";

async function getUserId() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    throw new Error("Unauthorized");
  }

  // Ensure user exists in our public.users table to satisfy foreign key constraints
  const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
  if (!dbUser) {
    await prisma.user.create({
      data: {
        id: user.id,
        email: user.email || "",
        firstName: user.user_metadata?.first_name || null,
        lastName: user.user_metadata?.last_name || null,
      }
    });
  }

  return user.id;
}

export async function createHabit(data: HabitInput) {
  try {
    const userId = await getUserId();
    const validatedData = habitSchema.parse(data);

    const habit = await prisma.habit.create({
      data: {
        ...validatedData,
        userId,
      },
    });

    revalidatePath("/app");
    return { success: true, habit };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : "Failed to create habit" };
  }
}

export async function updateHabit(id: string, data: HabitInput) {
  try {
    const userId = await getUserId();
    const validatedData = habitSchema.parse(data);

    // Verify ownership
    const existing = await prisma.habit.findUnique({ where: { id } });
    if (!existing || existing.userId !== userId) {
      throw new Error("Habit not found or unauthorized");
    }

    const habit = await prisma.habit.update({
      where: { id },
      data: validatedData,
    });

    revalidatePath("/app");
    return { success: true, habit };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : "Failed to update habit" };
  }
}

export async function archiveHabit(id: string) {
  try {
    const userId = await getUserId();
    
    // Verify ownership
    const existing = await prisma.habit.findUnique({ where: { id } });
    if (!existing || existing.userId !== userId) {
      throw new Error("Habit not found or unauthorized");
    }

    await prisma.habit.update({
      where: { id },
      data: { isArchived: true },
    });

    revalidatePath("/app");
    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : "Failed to archive habit" };
  }
}

export async function deleteHabit(id: string) {
  try {
    const userId = await getUserId();
    
    // Verify ownership
    const existing = await prisma.habit.findUnique({ where: { id } });
    if (!existing || existing.userId !== userId) {
      throw new Error("Habit not found or unauthorized");
    }

    // Hard delete since logs cascade
    await prisma.habit.delete({
      where: { id },
    });

    revalidatePath("/app");
    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : "Failed to delete habit" };
  }
}

export async function toggleHabitCompletion(habitId: string, date: string, status: boolean) {
  try {
    const userId = await getUserId();

    // Verify ownership
    const existing = await prisma.habit.findUnique({ where: { id: habitId } });
    if (!existing || existing.userId !== userId) {
      throw new Error("Habit not found or unauthorized");
    }

    if (status) {
      await prisma.habitLog.upsert({
        where: {
          habitId_date: {
            habitId,
            date,
          },
        },
        update: {
          status: true,
        },
        create: {
          habitId,
          userId,
          date,
          status: true,
        },
      });
    } else {
      // If un-toggling, we can just delete the log for that day
      await prisma.habitLog.delete({
        where: {
          habitId_date: {
            habitId,
            date,
          },
        },
      }).catch(() => {
        // Ignore if it doesn't exist
      });
    }

    revalidatePath("/app");
    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : "Failed to toggle habit" };
  }
}
