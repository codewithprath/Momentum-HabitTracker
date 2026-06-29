import { z } from "zod";

export const habitSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  description: z.string().max(255, "Description is too long").optional(),
  iconName: z.string().optional(),
  colorHex: z.string().optional(),
  category: z.enum(["Health", "Mind", "Productivity", "General"]).default("General"),
  frequency: z.enum(["daily", "weekly", "monthly"]).default("daily"),
  difficulty: z.enum(["easy", "medium", "hard"]).default("medium"),
});

export type HabitInput = z.infer<typeof habitSchema>;
