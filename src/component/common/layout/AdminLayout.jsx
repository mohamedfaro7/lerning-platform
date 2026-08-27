import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import {
  HomeIcon,
  BookOpenIcon,
  UserGroupIcon,
  AcademicCapIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import ThemeToggle from "../ThemeToggle";

const LINKS = [
  { to: "/admin", icon: HomeIcon, label: "لوحة التحكم", end: true },
  { to: "/admin/courses", icon: BookOpenIcon, label: "الكورسات" },
  { to: "/admin/instructors", icon: AcademicCapIcon, label: "المدرسين" },
  { to: "/admin/students", icon: UserGroupIcon, label: "الطلاب" },
  { to: "/admin/settings", icon: Cog6ToothIcon, label: "الإعدادات" },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "var(--bg)" }}>
      <aside
        className="hidden w-64 flex-shrink-0 border-l md:block"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-secondary)" }}
      >
        <div className="flex items-center justify-between p-6">
          <h1 className="font-display text-xl font-bold" style={{ color: "var(--text-primary)" }}>
            لوحة الإدارة
          </h1>
          <ThemeToggle />
        </div>
        <nav className="mt-2 flex flex-col gap-1 px-3">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[var(--accent)]/10 text-[var(--accent-text)]"
                    : "text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]"
                }`
              }
            >
              <link.icon className="h-5 w-5" />
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="absolute bottom-0 w-64 border-t p-4" style={{ borderColor: "var(--border)" }}>
          <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{user?.name}</p>
          <button onClick={logout} className="mt-1 text-sm text-red-500 hover:underline">
            تسجيل الخروج
          </button>
        </div>
      </aside>
      <main className="flex-1 p-6 md:p-8">
        <Outlet />
      </main>
    </div>
  );
}
