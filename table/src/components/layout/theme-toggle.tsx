"use client"

import { cn } from "@/utils/cn";
import { SunMedium, Moon } from "lucide-react";
import { useEffect, useState } from "react";

type Theme = "dark" | "light";

type ThemeToggleProps = {
  className?: string;
};

// Manage theme state, persist theme value in localStorage
export default function ThemeToggle({ className }: ThemeToggleProps) {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      setTheme("light");
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <button
      className={cn(
        "text-black bg-white dark:bg-black dark:text-white border rounded-full p-2",
        className
      )}
      onClick={() => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
      }}
    >
      {theme === "light" ? <SunMedium /> : <Moon />}
    </button>
  );
}
