import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label={theme === "light" ? "Dunkelmodus aktivieren" : "Hellmodus aktivieren"}
      className="rounded-full w-9 h-9 p-0"
    >
      {theme === "light" ? (
        <Moon className="h-5 w-5 text-neutral-700 hover:text-primary transition" />
      ) : (
        <Sun className="h-5 w-5 text-white hover:text-yellow-300 transition" />
      )}
    </Button>
  );
}