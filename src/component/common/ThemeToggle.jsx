import { motion } from "framer-motion";
import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";
import { useTheme } from "../../context/ThemeContext";

export default function ThemeToggle({ fullWidth = false }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      className={`relative flex items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--card)] transition-colors hover:border-[var(--accent)] ${
        fullWidth ? "w-full h-11 gap-2" : "h-10 w-10"
      }`}
      aria-label={isDark ? "تفعيل الوضع النهاري" : "تفعيل الوضع الليلي"}
    >
      <motion.div
        initial={false}
        animate={{ rotate: isDark ? 0 : 180, scale: isDark ? 1 : 0 }}
        transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 20 }}
        className="absolute"
      >
        <MoonIcon className="h-5 w-5 text-[var(--accent)]" />
      </motion.div>
      <motion.div
        initial={false}
        animate={{ rotate: isDark ? -180 : 0, scale: isDark ? 0 : 1 }}
        transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 20 }}
        className="absolute"
      >
        <SunIcon className="h-5 w-5 text-[var(--accent)]" />
      </motion.div>
    </button>
  );
}
