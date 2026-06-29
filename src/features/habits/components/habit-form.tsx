"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { habitSchema, type HabitInput } from "../schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createHabit, updateHabit } from "../actions";
import { toast } from "sonner";
import { useTransition } from "react";

interface HabitFormProps {
  onSuccess?: () => void;
  initialData?: HabitInput & { id: string };
}

export function HabitForm({ onSuccess, initialData }: HabitFormProps) {
  const [isPending, startTransition] = useTransition();

  const { register, handleSubmit, control, formState: { errors } } = useForm<HabitInput>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(habitSchema) as any,
    defaultValues: initialData || {
      name: "",
      description: "",
      category: "General",
      frequency: "daily",
      difficulty: "medium",
    },
  });

  function onSubmit(data: HabitInput) {
    startTransition(async () => {
      const result = initialData
        ? await updateHabit(initialData.id, data)
        : await createHabit(data);

      if (result.success) {
        toast.success(`Habit ${initialData ? 'updated' : 'created'} successfully!`);
        onSuccess?.();
      } else {
        toast.error(result.error || "Failed to save habit.");
      }
    });
  }

  function onError(errors: unknown) {
    console.error("Validation failed:", errors);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Habit Name</Label>
        <Input id="name" placeholder="Read 10 pages" {...register("name")} />
        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description (Optional)</Label>
        <Input id="description" placeholder="Any specific book?" {...register("description")} />
        {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Category</Label>
          <Controller
            control={control}
            name="category"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Health">Health</SelectItem>
                  <SelectItem value="Mind">Mind</SelectItem>
                  <SelectItem value="Productivity">Productivity</SelectItem>
                  <SelectItem value="General">General</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.category && <p className="text-sm text-destructive">{errors.category.message}</p>}
        </div>

        <div className="space-y-2">
          <Label>Frequency</Label>
          <Controller
            control={control}
            name="frequency"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.frequency && <p className="text-sm text-destructive">{errors.frequency.message}</p>}
        </div>

        <div className="space-y-2">
          <Label>Difficulty</Label>
          <Controller
            control={control}
            name="difficulty"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.difficulty && <p className="text-sm text-destructive">{errors.difficulty.message}</p>}
        </div>
      </div>

      <Button type="submit" className="w-full mt-4" disabled={isPending}>
        {isPending ? "Saving..." : initialData ? "Update Habit" : "Create Habit"}
      </Button>
    </form>
  );
}
