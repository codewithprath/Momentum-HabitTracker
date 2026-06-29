"use client";

import { useOptimistic, startTransition, useState } from "react";
import { Check, MoreVertical, Edit, Archive, Trash2, Activity } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { toggleHabitCompletion, archiveHabit, deleteHabit } from "../actions";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { HabitForm } from "./habit-form";
import { toast } from "sonner";
import type { HabitInput } from "../schema";

interface HabitCardProps {
  habit: {
    id: string;
    name: string;
    description: string | null;
    category: string;
    frequency: string;
    difficulty: string;
  };
  isCompletedToday: boolean;
  dateStr: string;
}

export function HabitCard({ habit, isCompletedToday, dateStr }: HabitCardProps) {
  const [optimisticCompleted, addOptimisticComplete] = useOptimistic<boolean, boolean>(
    isCompletedToday,
    (_, newStatus) => newStatus
  );

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleToggle = () => {
    const newStatus = !optimisticCompleted;
    startTransition(async () => {
      addOptimisticComplete(newStatus);
      const res = await toggleHabitCompletion(habit.id, dateStr, newStatus);
      if (!res.success) {
        toast.error("Failed to update habit status");
      }
    });
  };

  const handleArchive = async () => {
    const res = await archiveHabit(habit.id);
    if (res.success) toast.success("Habit archived");
    else toast.error(res.error);
  };

  const handleDelete = async () => {
    const res = await deleteHabit(habit.id);
    if (res.success) {
      toast.success("Habit deleted");
      setIsDeleteDialogOpen(false);
    } else {
      toast.error(res.error);
    }
  };

  const difficultyColor = {
    easy: "text-green-500",
    medium: "text-yellow-500",
    hard: "text-red-500",
  }[habit.difficulty] || "text-muted-foreground";

  return (
    <>
      <Card className="group transition-all hover:shadow-md relative overflow-hidden">
        <CardContent className="p-4 flex items-center gap-4">
          <button
            onClick={handleToggle}
            className={cn(
              "flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors",
              optimisticCompleted
                ? "bg-primary border-primary text-primary-foreground"
                : "border-muted-foreground/30 hover:border-primary/50 text-transparent"
            )}
            aria-label={optimisticCompleted ? "Mark incomplete" : "Mark complete"}
          >
            <Check className="w-5 h-5" />
          </button>

          <div className="flex-1 min-w-0">
            <h3 className={cn(
              "font-medium truncate transition-all duration-300",
              optimisticCompleted && "text-muted-foreground line-through"
            )}>
              {habit.name}
            </h3>
            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
              <span className="flex items-center gap-1">
                <Activity className="w-3 h-3" />
                {habit.category}
              </span>
              <span className="capitalize">{habit.frequency}</span>
              <span className={cn("capitalize font-medium", difficultyColor)}>{habit.difficulty}</span>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "opacity-0 group-hover:opacity-100 transition-opacity")}>
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleArchive}>
                <Archive className="h-4 w-4 mr-2" />
                Archive
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => setIsDeleteDialogOpen(true)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardContent>
        {optimisticCompleted && (
          <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
        )}
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Habit</DialogTitle>
          </DialogHeader>
          <HabitForm 
            onSuccess={() => setIsEditDialogOpen(false)} 
            initialData={{
              id: habit.id,
              name: habit.name,
              description: habit.description || undefined,
              category: habit.category as HabitInput["category"],
              frequency: habit.frequency as HabitInput["frequency"],
              difficulty: habit.difficulty as HabitInput["difficulty"],
            }}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the habit
              &quot;{habit.name}&quot; and remove all of its check-in data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
