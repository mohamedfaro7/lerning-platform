import { useState, useMemo, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  MOCK_COURSES,
  MOCK_INSTRUCTORS,
  getGroupsByInstructor,
  CURRENCY,
} from "../constants/mockLearningData";

const CATEGORIES = ["الكل", "english", "programming"];
const CATEGORY_LABELS = {
  "الكل": "الكل",
  english: "English",
  programming: "برمجة",
};

const SORT_OPTIONS = [
  { key: "default", label: "الافتراضي" },
  { key: "duration-asc", label: "المدة ↑" },
  { key: "duration-desc", label: "المدة ↓" },
  { key: "price-asc", label: "السعر ↑" },
  { key: "price-desc", label: "السعر ↓" },
];

// استخراج عدد الأسابيع من duration (زي "8 weeks" → 8)
const parseDuration = (duration) => {
  const match = duration?.match(/\d+/);
  return match ? parseInt(match[0]) : 0;
};

export default function Courses() {
  const [active, setActive] = useState("الكل");
  const [sortKey, setSortKey] = useState("default");
  const cardRefs = useRef({});
  const timers = useRef([]);

  // ⭐ تجهيز الكورسات مع بيانات إضافية
  const coursesWithMeta = useMemo(() => {
    return MOCK_COURSES.map((course, index) => {
      const instructor = MOCK_INSTRUCTORS.find(
        (i) => i.id === course.instructorId
      );
      const groups = getGroupsByInstructor(course.instructorId);
      // مجموع الطلاب في كل جروبات المدرّس
      const totalEnrolled = groups.reduce((sum, g) => sum + g.enrolled, 0);

      return {
        ...course,
        instructorName: instructor?.name || "—",
        instructorAvatar: instructor?.avatar || "?",
        totalEnrolled,
        accent: ["#3b82f6", "#a855f7", "#06b6d4", "#10b981", "#f59e0b", "#ef4444"][
          index % 6
        ],
      };
    });
  }, []);

  // ⭐ الفلترة والترتيب
  const sortedCourses = useMemo(() => {
    let list = [...coursesWithMeta];

    // فلتر حسب القسم
    if (active !== "الكل") {
      list = list.filter((c) => c.sectionId === active);
    }

    // ترتيب
    if (sortKey === "duration-asc")
      list.sort((a, b) => parseDuration(a.duration) - parseDuration(b.duration));
    else if (sortKey === "duration-desc")
      list.sort((a, b) => parseDuration(b.duration) - parseDuration(a.duration));
    else if (sortKey === "price-asc") list.sort((a, b) => a.price - b.price);
    else if (sortKey === "price-desc") list.sort((a, b) => b.price - a.price);

    return list;
  }, [coursesWithMeta, active, sortKey]);

  useEffect(() => {
    return () => timers.current.forEach(clearTimeout);
  }, []);

  return (
    <section className="mx-auto max-w-6xl px-4 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <h1
          className="font-display text-4xl font-black"
          style={{ color: "var(--text-primary)" }}
        >
          استكشف <span style={{ color: "var(--accent)" }}>الكورسات</span>
        </h1>
        <p
          className="mt-4 text-base"
          style={{ color: "var(--text-secondary)" }}
        >
          اختر المسار المناسب وابدأ رحلتك الآن.
        </p>
      </div>

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
                backgroundColor:
                  active === cat ? "var(--accent)" : "transparent",
                color: active === cat ? "#fff" : "var(--text-secondary)",
              }}
            >
              {CATEGORY_LABELS[cat] || cat}
            </button>
          ))}
        </div>

        <select
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value)}
          className="rounded-xl border px-3 py-1.5 text-xs font-semibold outline-none focus:ring-2 focus:ring-[var(--accent)]"
          style={{
            borderColor: "var(--border)",
            color: "var(--text-secondary)",
            backgroundColor: "var(--card)",
          }}
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.key} value={opt.key}>
              {opt.label}
            </option>
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
            ref={(el) => {
              cardRefs.current[c.id] = el;
            }}
            className="group relative flex w-full flex-col gap-4 rounded-2xl border p-6 backdrop-blur-sm transition-all hover:border-[var(--accent)]/40 sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
            style={{
              borderColor: "var(--border)",
              backgroundColor: "var(--card)",
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <span
                className="rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider"
                style={{
                  backgroundColor: `${c.accent}18`,
                  color: c.accent,
                }}
              >
                {CATEGORY_LABELS[c.sectionId] || c.sectionId}
              </span>
              <span
                className="text-[11px] font-semibold"
                style={{ color: "var(--text-muted)" }}
              >
                {c.level}
              </span>
            </div>

            {/* Title */}
            <div className="flex flex-col gap-1">
              <h3
                className="font-display text-lg font-bold line-clamp-2"
                style={{ color: "var(--text-primary)" }}
              >
                {c.titleAr || c.title}
              </h3>
              <p
                className="text-xs"
                style={{ color: "var(--text-muted)" }}
              >
                {c.title}
              </p>
            </div>

            {/* Instructor */}
            <div className="flex items-center gap-2">
              <div
                className="flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold text-white"
                style={{ backgroundColor: c.accent }}
              >
                {c.instructorAvatar}
              </div>
              <span
                className="text-xs"
                style={{ color: "var(--text-secondary)" }}
              >
                {c.instructorName}
              </span>
            </div>

            {/* Meta */}
            <div
              className="flex items-center gap-3 text-xs"
              style={{ color: "var(--text-muted)" }}
            >
              <span>{c.duration}</span>
              <span>•</span>
              <span>{c.totalEnrolled} طالب</span>
            </div>

            {/* Price + Button */}
            <div className="mt-auto space-y-3 pt-2">
              <p
                className="text-lg font-black"
                style={{ color: "var(--text-primary)" }}
              >
                {c.price.toLocaleString()}{" "}
                <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
                  {CURRENCY.symbol}
                </span>
              </p>

              <Link
                to={`/courses/${c.id}`}
                className="block w-full rounded-xl py-2.5 text-center text-sm font-semibold text-white transition-all hover:brightness-110"
                style={{ backgroundColor: c.accent }}
              >
                عرض التفاصيل
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {sortedCourses.length === 0 && (
        <div className="mt-8 rounded-2xl border border-dashed border-slate-700 bg-slate-900/40 p-12 text-center">
          <p className="text-sm text-slate-400">
            لا توجد كورسات في هذا القسم حالياً.
          </p>
        </div>
      )}
    </section>
  );
}