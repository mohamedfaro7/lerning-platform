import { useState, useMemo, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

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
  const [animPhase, setAnimPhase] = useState("idle");
  const cardRefs = useRef({});
  const timers = useRef([]);

  const sortedCourses = useMemo(() => {
    const list = [...COURSES];
    if (active !== "الكل") list.sort((a, b) => (a.category === active ? -1 : b.category === active ? 1 : 0));
    if (sortKey === "duration-asc") list.sort((a, b) => parseInt(a.duration) - parseInt(b.duration));
    else if (sortKey === "duration-desc") list.sort((a, b) => parseInt(b.duration) - parseInt(a.duration));
    else if (sortKey === "lessons-asc") list.sort((a, b) => a.lessons - b.lessons);
    else if (sortKey === "lessons-desc") list.sort((a, b) => b.lessons - a.lessons);
    return list;
  }, [active, sortKey]);

  useEffect(() => {
    return () => timers.current.forEach(clearTimeout);
  }, []);

  const triggerAnimation = (newActive, newSortKey) => {
    timers.current.forEach(clearTimeout);
    timers.current = [];

    setActive(newActive);
    setSortKey(newSortKey);

    // Let React render the new order, then animate
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const container = document.getElementById("courses-grid");
        if (!container) return;

        const cRect = container.getBoundingClientRect();
        const cards = sortedCourses.map((c) => cardRefs.current[c.id]).filter(Boolean);
        if (cards.length === 0) return;

        const positions = cards.map((el) => {
          const r = el.getBoundingClientRect();
          return {
            x: r.left - cRect.left + r.width / 2,
            y: r.top - cRect.top + r.height / 2,
          };
        });

        // Center of grid
        const cx = cRect.width / 2;
        const cy = cRect.height / 2;

        // ─── PHASE 1: GATHER ───
        cards.forEach((el, i) => {
          const dx = cx - positions[i].x;
          const dy = cy - positions[i].y;
          el.style.transition = "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s ease";
          el.style.transform = `translate(${dx}px, ${dy}px) scale(0.4)`;
          el.style.zIndex = "50";
          el.style.opacity = "0.85";
        });

        // ─── PHASE 2: SPREAD ───
        timers.current.push(
          setTimeout(() => {
            cards.forEach((el, i) => {
              el.style.transition = `transform 0.75s cubic-bezier(0.34, 1.56, 0.64, 1) ${i * 0.07}s, opacity 0.4s ease ${i * 0.07}s`;
              el.style.transform = "";
              el.style.zIndex = "";
              el.style.opacity = "";
            });

            timers.current.push(
              setTimeout(() => setAnimPhase("idle"), 900)
            );
          }, 450)
        );
      });
    });
  };

  const handleCategoryChange = (cat) => {
    if (cat === active) return;
    triggerAnimation(cat, sortKey);
  };

  const handleSortChange = (e) => {
    triggerAnimation(active, e.target.value);
  };

  return (
    <section className="mx-auto max-w-6xl px-4 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="font-display text-4xl font-black" style={{ color: "var(--text-primary)" }}>
          استكشف <span style={{ color: "var(--accent)" }}>الكورسات</span>
        </h1>
        <p className="mt-4 text-base" style={{ color: "var(--text-secondary)" }}>
          اختر المسار المناسب وابدأ رحلتك الآن.
        </p>
      </div>

      {/* Controls */}
      <div className="mt-10 flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
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
          onChange={handleSortChange}
          className="rounded-xl border px-3 py-1.5 text-xs font-semibold outline-none focus:ring-2 focus:ring-[var(--accent)]"
          style={{ borderColor: "var(--border)", color: "var(--text-secondary)", backgroundColor: "var(--card)" }}
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.key} value={opt.key}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Grid */}
      <div
        id="courses-grid"
        className="mt-8 flex flex-wrap justify-center content-start gap-6"
      >
        {sortedCourses.map((c) => (
          <div
            key={c.id}
            ref={(el) => { cardRefs.current[c.id] = el; }}
            className="group relative flex w-full flex-col gap-4 rounded-2xl border p-6 backdrop-blur-sm sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
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
          </div>
        ))}
      </div>
    </section>
  );
}
