import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Bars3Icon,
  AcademicCapIcon,
  UserCircleIcon,
  BookOpenIcon,
  Cog6ToothIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../../context/AuthContext";
import MobileDrawer from "./MobileDrawer";
import Button from "./Button";
import ThemeToggle from "./ThemeToggle";

const PUBLIC_LINKS = [
  { to: "/", label: "الرئيسية" },
  { to: "/courses", label: "الكورسات" },
  { to: "/about", label: "عن المنصة" },
  { to: "/contact", label: "اتصل بنا" },
];

const ROLE_MENU = {
  student: {
    icon: UserCircleIcon,
    items: [
      { to: "/dashboard", label: "لوحة التحكم" },
      { to: "/dashboard/courses", label: "كورساتي" },
    ],
  },
  instructor: {
    icon: BookOpenIcon,
    items: [
      { to: "/instructor/dashboard", label: "لوحة التحكم" },
      { to: "/instructor/students", label: "طلابي" },
    ],
  },
  admin: {
    icon: Cog6ToothIcon,
    items: [
      { to: "/admin/courses", label: "إدارة الكورسات" },
      { to: "/admin/instructors", label: "المدرسين" },
      { to: "/admin/students", label: "الطلاب" },
      { to: "/admin/settings", label: "الإعدادات" },
    ],
  },
};

export default function Navbar() {
  const { role, user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const roleConfig = ROLE_MENU[role];
  const IconComponent = roleConfig?.icon;

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          scrolled
            ? "shadow-lg backdrop-blur-xl py-2"
            : "backdrop-blur-md py-4"
        }`}
        style={{
          backgroundColor: scrolled ? "var(--nav-bg-scroll)" : "var(--nav-bg)",
        }}
      >
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
            <AcademicCapIcon className="h-7 w-7" style={{ color: "var(--accent)" }} />
            <span className="text-lg font-bold">أكاديمي</span>
          </Link>

          <ul className="hidden items-center gap-6 md:flex">
            {PUBLIC_LINKS.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    `text-sm font-medium transition-colors ${
                      isActive ? "text-[var(--accent-text)]" : "text-[var(--text-secondary)] hover:text-[var(--accent-text)]"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="hidden items-center gap-3 md:flex">
            <ThemeToggle />

            {role === "guest" ? (
              <>
                <Link
                  to="/login"
                  className="rounded-lg border px-4 py-2 text-sm font-medium transition-all hover:border-[var(--accent)] hover:text-[var(--accent-text)]"
                  style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
                >
                  تسجيل الدخول
                </Link>
                <Link
                  to="/register"
                  className="rounded-lg px-4 py-2 text-sm font-medium text-white transition-all hover:brightness-110"
                  style={{ backgroundColor: "var(--accent)" }}
                >
                  سجل الآن
                </Link>
              </>
            ) : (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen((o) => !o)}
                  className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium transition-colors hover:bg-[var(--surface-hover)]"
                  style={{ color: "var(--text-primary)" }}
                >
                 {IconComponent && <IconComponent className="h-6 w-6" style={{ color: "var(--accent)" }} />}
                  <span>{user?.name}</span>
                  <ChevronDownIcon
                    className={`h-4 w-4 transition-transform ${menuOpen ? "rotate-180" : ""}`}
                    style={{ color: "var(--text-muted)" }}
                  />
                </button>

                {menuOpen && (
                  <div
                    className="absolute end-0 mt-2 w-48 rounded-lg border py-1 shadow-xl"
                    style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-secondary)" }}
                  >
                    {roleConfig.items.map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={() => setMenuOpen(false)}
                        className="block px-4 py-2 text-sm transition-colors hover:bg-[var(--surface-hover)]"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {item.label}
                      </Link>
                    ))}
                    <button
                      onClick={() => { logout(); setMenuOpen(false); }}
                      className="block w-full px-4 py-2 text-start text-sm text-red-500 hover:bg-[var(--surface-hover)]"
                    >
                      تسجيل الخروج
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setDrawerOpen(true)}
              className="rounded-lg p-2 transition-colors hover:bg-[var(--surface-hover)]"
              style={{ color: "var(--text-primary)" }}
              aria-label="فتح القائمة"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
          </div>
        </nav>
      </motion.header>

      <MobileDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        links={PUBLIC_LINKS}
        roleConfig={roleConfig}
      />
    </>
  );
}
