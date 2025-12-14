"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, ListTodo, BarChart3, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/habits", label: "Habits", icon: ListTodo },
  { href: "/stats", label: "Stats", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden border-t border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="flex items-center justify-around py-2 px-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link key={item.href} href={item.href} className="flex-1">
              <motion.div
                className={cn(
                  "flex flex-col items-center gap-1 py-2 rounded-xl transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className="relative p-2 rounded-xl"
                  animate={{
                    backgroundColor: isActive
                      ? "var(--primary)"
                      : "transparent",
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <Icon
                    className={cn(
                      "h-5 w-5 transition-colors",
                      isActive ? "text-primary-foreground" : ""
                    )}
                  />
                  {isActive && (
                    <motion.div
                      layoutId="mobile-nav-indicator"
                      className="absolute inset-0 bg-primary rounded-xl -z-10"
                      transition={{
                        type: "spring",
                        stiffness: 350,
                        damping: 30,
                      }}
                    />
                  )}
                </motion.div>
                <span className="text-xs font-medium">{item.label}</span>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
