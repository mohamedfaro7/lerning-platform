import { useState } from "react";
import { motion } from "framer-motion";
import { MagnifyingGlassIcon, ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/outline";
import { MOCK_STUDENTS } from "../../utils/mockStudents";

export default function InstructorStudents() {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState("name");
  const [sortDir, setSortDir] = useState("asc");

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
  };

  const filtered = MOCK_STUDENTS
    .filter((s) => s.name.includes(search) || s.course.includes(search))
    .sort((a, b) => {
      const val = (x) => sortKey === "name" ? x.name : sortKey === "course" ? x.course : x.progress;
      const mul = sortDir === "asc" ? 1 : -1;
      return val(a) > val(b) ? mul : -mul;
    });

  const SortIcon = ({ col }) => {
    if (sortKey !== col) return null;
    return sortDir === "asc" ? <ArrowUpIcon className="inline h-3 w-3" /> : <ArrowDownIcon className="inline h-3 w-3" />;
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold" style={{ color: "var(--text-primary)" }}>طلابي</h1>
          <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>تتبع تقدم طلابك</p>
        </div>
        <div className="relative">
          <MagnifyingGlassIcon className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="بحث..."
            className="rounded-xl border py-2 pe-4 ps-9 text-sm outline-none focus:ring-2 focus:ring-[var(--accent)]"
            style={{ borderColor: "var(--border)", color: "var(--text-primary)", backgroundColor: "var(--input-bg)" }}
          />
        </div>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border backdrop-blur-sm" style={{ borderColor: "var(--border)", backgroundColor: "var(--card)" }}>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b" style={{ borderColor: "var(--border)" }}>
              {[
                { key: "name", label: "الاسم" },
                { key: "course", label: "الكورس" },
                { key: "progress", label: "التقدم" },
              ].map((col) => (
                <th
                  key={col.key}
                  onClick={() => toggleSort(col.key)}
                  className="cursor-pointer px-6 py-3 text-xs font-semibold uppercase tracking-wider"
                  style={{ color: "var(--text-muted)" }}
                >
                  {col.label} <SortIcon col={col.key} />
                </th>
              ))}
              <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>الحالة</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s, i) => (
              <motion.tr
                key={s.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="border-b transition-colors hover:bg-[var(--surface-hover)]"
                style={{ borderColor: "var(--border)" }}
              >
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white" style={{ backgroundColor: s.color }}>
                      {s.name[0]}
                    </div>
                    <span className="font-medium" style={{ color: "var(--text-primary)" }}>{s.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4" style={{ color: "var(--text-secondary)" }}>{s.course}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-24 overflow-hidden rounded-full" style={{ backgroundColor: "var(--border)" }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${s.progress}%` }}
                        transition={{ duration: 1, delay: i * 0.05 }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: s.progress >= 80 ? "#10b981" : s.progress >= 50 ? "#f59e0b" : "var(--accent)" }}
                      />
                    </div>
                    <span className="text-xs font-semibold" style={{ color: "var(--text-muted)" }}>{s.progress}%</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
                    style={{
                      backgroundColor: s.active ? "#10b98118" : "#ef444418",
                      color: s.active ? "#10b981" : "#ef4444",
                    }}
                  >
                    {s.active ? "نشط" : "غير نشط"}
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
