import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Bars3Icon, AcademicCapIcon, BriefcaseIcon } from "@heroicons/react/24/outline";
import MobileDrawer from "./MobileDrawer";
import ThemeToggle from "./ThemeToggle";
import { useAuth } from "../../context/AuthContext"; // 👈 استيراد الـ Auth

const PUBLIC_LINKS = [
  { to: "/", label: "الرئيسية" },
  { to: "/courses", label: "الكورسات" },
  { to: "/about", label: "عن المنصة" },
  { to: "/contact", label: "اتصل بنا" },
];

export default function Navbar() {
  const { isAuthenticated, openAuthModal } = useAuth(); // 👈 جلب الحالة والدالة
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  
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

          {/* ===== القائمة الرئيسية (Desktop) ===== */}
          <ul className="hidden items-center gap-6 md:flex">
            {PUBLIC_LINKS.map((link) => {
             
              return (
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
              );
            })}
          </ul>

          {/* ===== أزرار تسجيل الدخول والسجل الآن ===== */}
          <div className="hidden items-center gap-3 md:flex">
            <ThemeToggle />
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
          </div>

          {/* ===== زر القائمة في الموبايل ===== */}
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

      {/* ===== القائمة الجانبية (Mobile Drawer) ===== */}
      <MobileDrawer
  open={drawerOpen}
  onClose={() => setDrawerOpen(false)}
  links={PUBLIC_LINKS}
/>
    </>
  );
}