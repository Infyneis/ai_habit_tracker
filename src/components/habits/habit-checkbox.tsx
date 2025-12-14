"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface HabitCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  color?: string;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
}

const sizeClasses = {
  sm: "h-6 w-6",
  md: "h-8 w-8",
  lg: "h-10 w-10",
};

const iconSizes = {
  sm: "h-3.5 w-3.5",
  md: "h-5 w-5",
  lg: "h-6 w-6",
};

export function HabitCheckbox({
  checked,
  onChange,
  color = "var(--primary)",
  size = "md",
  disabled = false,
}: HabitCheckboxProps) {
  return (
    <motion.button
      type="button"
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative rounded-full border-2 flex items-center justify-center transition-colors",
        sizeClasses[size],
        disabled && "opacity-50 cursor-not-allowed"
      )}
      style={{
        borderColor: checked ? color : "var(--border)",
        backgroundColor: checked ? color : "transparent",
      }}
      whileHover={{ scale: disabled ? 1 : 1.1 }}
      whileTap={{ scale: disabled ? 1 : 0.9 }}
    >
      <AnimatePresence mode="wait">
        {checked && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 30,
            }}
          >
            <Check className={cn(iconSizes[size], "text-primary-foreground")} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ripple effect on check */}
      <AnimatePresence>
        {checked && (
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ backgroundColor: color }}
            initial={{ scale: 1, opacity: 0.5 }}
            animate={{ scale: 2, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          />
        )}
      </AnimatePresence>
    </motion.button>
  );
}
