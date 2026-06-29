"use client";
import { type Habit } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { restoreHabit, deleteHabit } from "../actions";
import { toast } from "sonner";
import { useTransition } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { RotateCcw, Trash2 } from "lucide-react";

export function ArchivedHabitCard({ habit }: { habit: Habit }) {
  const [isPending, startTransition] = useTransition();

  function onRestore() {
    startTransition(async () => {
      const result = await restoreHabit(habit.id);
      if (result.success) toast.success("Habit restored");
      else toast.error(result.error);
    });
  }

  function onDelete() {
    startTransition(async () => {
      const result = await deleteHabit(habit.id);
      if (result.success) toast.success("Habit permanently deleted");
      else toast.error(result.error);
    });
  }

  return (
    <Card className="opacity-75 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300 hover:shadow-md">
      <CardContent className="flex items-center justify-between p-5">
        <div>
          <h3 className="font-semibold tracking-tight">{habit.name}</h3>
          <p className="text-xs text-muted-foreground mt-1 capitalize font-medium">{habit.category} • {habit.frequency}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onRestore} disabled={isPending}>
            <RotateCcw className="w-4 h-4 mr-2 hidden sm:inline-block" />
            Restore
          </Button>
          <AlertDialog>
            <AlertDialogTrigger render={<Button variant="destructive" size="sm" disabled={isPending} />}>
              <Trash2 className="w-4 h-4 mr-2 hidden sm:inline-block" />
              Delete
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Permanently delete?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the habit and all its logged history.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={onDelete} className="bg-destructive text-destructive-foreground">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}
