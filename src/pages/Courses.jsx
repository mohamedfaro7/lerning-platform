import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const ACCENTS = ["#3b82f6", "#a855f7", "#06b6d4", "#10b981", "#f59e0b", "#ef4444"];

const COURSES = [
  { id: 1, title: "مقدمة في البرمجة", category: "برمجة", accent: ACCENTS[0], duration: "8 أسابيع", lessons: 24, level: "مبتدئ" },
  { id: 2, title: "تطوير تطبيقات الويب", category: "برمجة", accent: ACCENTS[1], duration: "12 أسبوع", lessons: 36, level: "متوسط" },
  { id: 3, title: "الإنجليزية للمبتدئين", category: "لغات", accent: ACCENTS[2], duration: "10 أسابيع", lessons: 30, level: "مبتدئ" },
  { id: 4, title: "تصميم واجهات المستخدم", category: "تصميم", accent: ACCENTS[3], duration: "6 أسابيع", lessons: 18, level: "مبتدئ" },
  { id: 5, title: "أساسيات الذكاء الاصطناعي", category: "برمجة", accent: ACCENTS[4], duration: "8 أسابيع", lessons: 20, level: "متوسط" },
  { id: 6, title: "الإنجليزية المتقدمة", category: "لغات", accent: ACCENTS[5], duration: "8 أسابيع", lessons: 22, level: "متقدم" },
];

const CATEGORIES = ["الكل", "برمجة", "لغات", "تصميم"];
const SORT_OPTIONS = [
  { key: "default", label: "الافتراضي" },
  { key: "duration-asc", label: "المدة ↑" },
  { key: "duration-desc", label: "المدة ↓" },
  { key: "lessons-asc", label: "الدروس ↑" },
  { key: "lessons-desc", label: "الدروس ↓" },
];

export default function Courses() {
  const [active, setActive] = useState("الكل");
  const [sortKey, setSortKey] = useState("default");

  const sortedCourses = useMemo(() => {
    const list = [...COURSES];
    if (active !== "الكل") list.sort((a, b) => (a.category === active ? -1 : b.category === active ? 1 : 0));

    if (sortKey === "duration-asc") list.sort((a, b) => parseInt(a.duration) - parseInt(b.duration));
    else if (sortKey === "duration-desc") list.sort((a, b) => parseInt(b.duration) - parseInt(a.duration));
    else if (sortKey === "lessons-asc") list.sort((a, b) => a.lessons - b.lessons);
    else if (sortKey === "lessons-desc") list.sort((a, b) => b.lessons - a.lessons);

    return list;
  }, [active, sortKey]);

  return (
    <section className="mx-auto max-w-6xl px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-2xl text-center"
      >
        <h1 className="font-display text-4xl font-black" style={{ color: "var(--text-primary)" }}>
          استكشف <span style={{ color: "var(--accent)" }}>الكورسات</span>
        </h1>
        <p className="mt-4 text-base" style={{ color: "var(--text-secondary)" }}>
          اختر المسار المناسب وابدأ رحلتك الآن.
        </p>
      </motion.div>

      {/* Controls */}
      <div className="mt-10 flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className="rounded-full border px-4 py-1.5 text-xs font-semibold transition-all"
              style={{
                borderColor: active === cat ? "var(--accent)" : "var(--border)",
                backgroundColor: active === cat ? "var(--accent)" : "transparent",
                color: active === cat ? "#fff" : "var(--text-secondary)",
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        <select
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value)}
          className="rounded-xl border px-3 py-1.5 text-xs font-semibold outline-none focus:ring-2 focus:ring-[var(--accent)]"
          style={{ borderColor: "var(--border)", color: "var(--text-secondary)", backgroundColor: "var(--card)" }}
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.key} value={opt.key}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Grid */}
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {sortedCourses.map((c) => (
            <motion.div
              key={c.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
              whileHover={{ scale: 1.02, boxShadow: `0 0 30px ${c.accent}25` }}
              className="group relative flex flex-col gap-4 rounded-2xl border p-6 backdrop-blur-sm transition-all"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--card)" }}
            >
              <div className="flex items-center justify-between">
                <span
                  className="rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider"
                  style={{ backgroundColor: `${c.accent}18`, color: c.accent }}
                >
                  {c.category}
                </span>
                <span className="text-[11px] font-semibold" style={{ color: "var(--text-muted)" }}>{c.level}</span>
              </div>

              <div className="flex flex-col gap-1">
                <h3 className="font-display text-lg font-bold" style={{ color: "var(--text-primary)" }}>{c.title}</h3>
                <div className="flex items-center gap-3 text-xs" style={{ color: "var(--text-muted)" }}>
                  <span>{c.lessons} درس</span>
                  <span>•</span>
                  <span>{c.duration}</span>
                </div>
              </div>

              <div className="mt-auto pt-2">
                <Link
                  to={`/courses/${c.id}`}
                  className="block w-full rounded-xl py-2.5 text-center text-sm font-semibold text-white transition-all hover:brightness-110"
                  style={{ backgroundColor: c.accent }}
                >
                  ابدأ التعلم
                </Link>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
}
