"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Sparkles, Wand2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { HABIT_CATEGORIES } from "@/lib/ollama";
import { cn } from "@/lib/utils";

const habitIcons = [
  { value: "sparkles", label: "Sparkles", emoji: "✨" },
  { value: "heart", label: "Heart", emoji: "❤️" },
  { value: "book", label: "Book", emoji: "📚" },
  { value: "dumbbell", label: "Fitness", emoji: "💪" },
  { value: "brain", label: "Brain", emoji: "🧠" },
  { value: "coffee", label: "Coffee", emoji: "☕" },
  { value: "moon", label: "Sleep", emoji: "🌙" },
  { value: "sun", label: "Morning", emoji: "☀️" },
  { value: "water", label: "Water", emoji: "💧" },
  { value: "apple", label: "Nutrition", emoji: "🍎" },
  { value: "run", label: "Running", emoji: "🏃" },
  { value: "meditation", label: "Meditation", emoji: "🧘" },
  { value: "music", label: "Music", emoji: "🎵" },
  { value: "code", label: "Coding", emoji: "💻" },
  { value: "write", label: "Writing", emoji: "✍️" },
  { value: "paint", label: "Art", emoji: "🎨" },
];

const habitColors = [
  "#a855f7", // Lavender
  "#9333ea", // Purple
  "#7c3aed", // Violet
  "#c084fc", // Light lavender
  "#ec4899", // Pink
  "#f43f5e", // Rose
  "#f97316", // Orange
  "#eab308", // Yellow
  "#22c55e", // Green
  "#14b8a6", // Teal
  "#0ea5e9", // Sky
  "#6366f1", // Indigo
];

interface CreateHabitDialogProps {
  onSubmit: (data: {
    name: string;
    description?: string;
    icon: string;
    color: string;
    frequency: string;
    targetCount: number;
    targetPeriod: string;
    categoryId?: string;
  }) => void;
}

export function CreateHabitDialog({ onSubmit }: CreateHabitDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("sparkles");
  const [color, setColor] = useState("#a855f7");
  const [frequency, setFrequency] = useState("DAILY");
  const [targetCount, setTargetCount] = useState(1);
  const [targetPeriod, setTargetPeriod] = useState("DAY");
  const [categoryId, setCategoryId] = useState<string>("");
  const [isSuggestingCategory, setIsSuggestingCategory] = useState(false);
  const [aiSuggestedCategory, setAiSuggestedCategory] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSubmit({
      name: name.trim(),
      description: description.trim() || undefined,
      icon,
      color,
      frequency,
      targetCount,
      targetPeriod,
      categoryId: categoryId || undefined,
    });

    // Reset form
    resetForm();
    setOpen(false);
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setIcon("sparkles");
    setColor("#a855f7");
    setFrequency("DAILY");
    setTargetCount(1);
    setTargetPeriod("DAY");
    setCategoryId("");
    setAiSuggestedCategory(null);
  };

  const suggestCategoryWithAI = useCallback(async () => {
    if (!name.trim()) return;

    setIsSuggestingCategory(true);
    setAiSuggestedCategory(null);

    try {
      const response = await fetch("/api/ai/suggest-category", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          habitName: name,
          habitDescription: description,
        }),
      });

      const result = await response.json();

      if (result.data?.categoryId) {
        setCategoryId(result.data.categoryId);
        setAiSuggestedCategory(result.data.categoryId);

        // Also update color to match category
        const category = HABIT_CATEGORIES.find(
          (c) => c.id === result.data.categoryId
        );
        if (category) {
          setColor(category.color);
        }
      }
    } catch (error) {
      console.error("Failed to get category suggestion:", error);
    } finally {
      setIsSuggestingCategory(false);
    }
  }, [name, description]);

  const selectedIcon = habitIcons.find((i) => i.value === icon);
  const selectedCategory = HABIT_CATEGORIES.find((c) => c.id === categoryId);

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (!isOpen) resetForm();
    }}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Habit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Create New Habit
          </DialogTitle>
          <DialogDescription>
            Build a new habit to track. Start small and stay consistent.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Habit Name</Label>
            <Input
              id="name"
              placeholder="e.g., Morning meditation"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              placeholder="What does this habit involve?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
            />
          </div>

          {/* Category with AI Suggestion */}
          <div className="space-y-2">
            <Label>Category</Label>
            <div className="flex items-center gap-2">
              <Select value={categoryId} onValueChange={(value) => {
                setCategoryId(value);
                setAiSuggestedCategory(null);
                // Update color to match category
                const category = HABIT_CATEGORIES.find((c) => c.id === value);
                if (category) {
                  setColor(category.color);
                }
              }}>
                <SelectTrigger className={cn(
                  "flex-1",
                  aiSuggestedCategory && categoryId === aiSuggestedCategory && "ring-2 ring-primary/50"
                )}>
                <SelectValue placeholder="Select a category">
                  {selectedCategory && (
                    <span className="flex items-center gap-2">
                      <span>{selectedCategory.icon}</span>
                      <span>{selectedCategory.name}</span>
                      {aiSuggestedCategory === categoryId && (
                        <span className="text-xs text-primary ml-1">(AI)</span>
                      )}
                    </span>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                  {HABIT_CATEGORIES.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      <span className="flex items-center gap-2">
                        <span>{category.icon}</span>
                        <span>{category.name}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                type="button"
                variant="outline"
                size="icon"
                className="shrink-0 h-10 w-10"
                onClick={suggestCategoryWithAI}
                disabled={!name.trim() || isSuggestingCategory}
                title="AI Suggest Category"
              >
                {isSuggestingCategory ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Wand2 className="h-4 w-4" />
                )}
              </Button>
            </div>

            <AnimatePresence>
              {aiSuggestedCategory && categoryId === aiSuggestedCategory && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-xs text-primary flex items-center gap-1"
                >
                  <Sparkles className="h-3 w-3" />
                  AI suggested this category based on your habit
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Icon and Color */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Icon</Label>
              <Select value={icon} onValueChange={setIcon}>
                <SelectTrigger>
                  <SelectValue>
                    <span className="flex items-center gap-2">
                      <span>{selectedIcon?.emoji}</span>
                      <span>{selectedIcon?.label}</span>
                    </span>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <div className="grid grid-cols-4 gap-1 p-1">
                    {habitIcons.map((item) => (
                      <SelectItem
                        key={item.value}
                        value={item.value}
                        className="cursor-pointer"
                      >
                        <span className="text-xl">{item.emoji}</span>
                      </SelectItem>
                    ))}
                  </div>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Color</Label>
              <div className="flex flex-wrap gap-1.5">
                <AnimatePresence>
                  {habitColors.map((c) => (
                    <motion.button
                      key={c}
                      type="button"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setColor(c)}
                      className="w-6 h-6 rounded-full transition-all"
                      style={{
                        backgroundColor: c,
                        boxShadow:
                          color === c ? `0 0 0 2px white, 0 0 0 4px ${c}` : "",
                      }}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Frequency */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Frequency</Label>
              <Select value={frequency} onValueChange={setFrequency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DAILY">Daily</SelectItem>
                  <SelectItem value="WEEKLY">Weekly</SelectItem>
                  <SelectItem value="MONTHLY">Monthly</SelectItem>
                  <SelectItem value="CUSTOM">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {frequency === "CUSTOM" && (
              <div className="space-y-2">
                <Label>Target</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min={1}
                    max={100}
                    value={targetCount}
                    onChange={(e) => setTargetCount(parseInt(e.target.value) || 1)}
                    className="w-16"
                  />
                  <span className="text-sm text-muted-foreground">times per</span>
                  <Select value={targetPeriod} onValueChange={setTargetPeriod}>
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DAY">Day</SelectItem>
                      <SelectItem value="WEEK">Week</SelectItem>
                      <SelectItem value="MONTH">Month</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!name.trim()}>
              Create Habit
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
