import { useAuth } from "../../context/AuthContext";
import { AcademicCapIcon, CalendarIcon, UserGroupIcon } from "@heroicons/react/24/outline";

const STAT_CARDS = [
  { icon: AcademicCapIcon, label: "الكورسات", value: "12", color: "var(--accent)" },
  { icon: UserGroupIcon, label: "الطلاب", value: "156", color: "#a855f7" },
  { icon: CalendarIcon, label: "المحاضرات", value: "48", color: "#06b6d4" },
];

const RECENT = [
  { title: "مقدمة في البرمجة", time: "منذ ساعتين", color: "var(--accent)" },
  { title: "تطوير تطبيقات الويب", time: "منذ يوم", color: "#a855f7" },
  { title: "الإنجليزية للمبتدئين", time: "منذ 3 أيام", color: "#06b6d4" },
];

export default function DashboardHome() {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="font-display text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
        مرحباً، {user?.name}
      </h1>
      <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>إليك نظرة عامة على حسابك</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {STAT_CARDS.map((s) => (
          <div
            key={s.label}
            className="flex items-center gap-4 rounded-2xl border p-5 backdrop-blur-sm"
            style={{ borderColor: "var(--border)", backgroundColor: "var(--card)" }}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl" style={{ backgroundColor: `${s.color}18` }}>
              <s.icon className="h-6 w-6" style={{ color: s.color }} />
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>{s.value}</p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border p-6 backdrop-blur-sm" style={{ borderColor: "var(--border)", backgroundColor: "var(--card)" }}>
        <h3 className="font-display text-base font-bold" style={{ color: "var(--text-primary)" }}>آخر النشاطات</h3>
        <div className="mt-4 flex flex-col gap-3">
          {RECENT.map((r) => (
            <div
              key={r.title}
              className="flex items-center justify-between rounded-xl border p-4 transition-all hover:border-[var(--accent)]/30"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
            >
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: r.color }} />
                <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{r.title}</p>
              </div>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>{r.time}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
