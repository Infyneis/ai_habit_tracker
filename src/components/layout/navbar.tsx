"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Home,
  ListTodo,
  BarChart3,
  Settings,
  Sparkles,
  Moon,
  Sun,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/habits", label: "Habits", icon: ListTodo },
  { href: "/stats", label: "Statistics", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between px-4 mx-auto max-w-6xl">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <motion.div
            whileHover={{ rotate: 180, scale: 1.1 }}
            transition={{ duration: 0.3 }}
            className="p-2 rounded-xl bg-primary/10"
          >
            <Sparkles className="h-5 w-5 text-primary" />
          </motion.div>
          <span className="font-semibold text-lg tracking-tight">
            Habit<span className="text-primary">Flow</span>
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link key={item.href} href={item.href}>
                <motion.div
                  className={cn(
                    "relative px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isActive && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute inset-0 bg-primary/10 rounded-lg"
                      transition={{
                        type: "spring",
                        stiffness: 350,
                        damping: 30,
                      }}
                    />
                  )}
                  <span className="relative flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </span>
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {/* Theme toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="rounded-lg"
        >
          <motion.div
            initial={false}
            animate={{ rotate: theme === "dark" ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {theme === "dark" ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </motion.div>
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>
    </header>
  );
}
