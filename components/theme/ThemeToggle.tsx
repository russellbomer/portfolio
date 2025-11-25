"use client";

import { useTheme } from "@/components/theme/ThemeProvider";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { scheme, setScheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleScheme = () => {
    setScheme(scheme === "dark" ? "light" : "dark");
  };

  const label = `Activate ${scheme === "dark" ? "light" : "dark"} mode`;

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label={label}
      onClick={toggleScheme}
      className="relative"
    >
      {mounted ? (
        <>
          <Sun className="size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </>
      ) : (
        <span className="sr-only">Toggle color scheme</span>
      )}
    </Button>
  );
}
