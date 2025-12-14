"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, RefreshCw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AffirmationCardProps {
  affirmation: string;
  onRefresh?: () => void;
  isLoading?: boolean;
}

export function AffirmationCard({
  affirmation,
  onRefresh,
  isLoading = false,
}: AffirmationCardProps) {
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!affirmation) return;

    setIsTyping(true);
    setDisplayText("");

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < affirmation.length) {
        setDisplayText(affirmation.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [affirmation]);

  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-transparent to-primary/10">
      {/* Animated sparkles background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/30 rounded-full"
            initial={{
              x: Math.random() * 100 + "%",
              y: Math.random() * 100 + "%",
              scale: 0,
            }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.4,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <CardContent className="relative p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Sparkles className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
            </motion.div>

            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Daily Affirmation
              </p>

              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex gap-1"
                  >
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 rounded-full bg-primary/50"
                        animate={{ y: [0, -8, 0] }}
                        transition={{
                          duration: 0.6,
                          repeat: Infinity,
                          delay: i * 0.1,
                        }}
                      />
                    ))}
                  </motion.div>
                ) : (
                  <motion.p
                    key="text"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-lg font-medium leading-relaxed"
                  >
                    {displayText}
                    {isTyping && (
                      <motion.span
                        animate={{ opacity: [1, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                        className="inline-block w-0.5 h-5 bg-primary ml-0.5 align-middle"
                      />
                    )}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>

          {onRefresh && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onRefresh}
              disabled={isLoading}
              className="h-8 w-8 flex-shrink-0"
            >
              <RefreshCw
                className={cn(
                  "h-4 w-4",
                  isLoading && "animate-spin"
                )}
              />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
