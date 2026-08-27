import { motion } from "framer-motion";
import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";
import { useTheme } from "../../context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--card)] transition-colors hover:border-[var(--accent)]"
      aria-label={isDark ? "تفعيل الوضع النهاري" : "تفعيل الوضع الليلي"}
    >
      <motion.div
        initial={false}
        animate={{ rotate: isDark ? 0 : 180, scale: isDark ? 1 : 0 }}
        transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 20 }}
        className="absolute"
      >
        <MoonIcon className="h-4 w-4 text-[var(--accent)]" />
      </motion.div>
      <motion.div
        initial={false}
        animate={{ rotate: isDark ? -180 : 0, scale: isDark ? 0 : 1 }}
        transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 20 }}
        className="absolute"
      >
        <SunIcon className="h-4 w-4 text-[var(--accent)]" />
      </motion.div>
    </button>
  );
}
