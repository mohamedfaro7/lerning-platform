import { Link } from "react-router-dom";
import { AcademicCapIcon } from "@heroicons/react/24/outline";
 
const QUICK_LINKS = [
  { to: "/", label: "الرئيسية" },
  { to: "/courses", label: "الكورسات" },
  { to: "/about", label: "عن المنصة" },
  { to: "/contact", label: "اتصل بنا" },
];
 
const SOCIAL_LINKS = [
  { label: "Facebook", href: "#", path: "M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12" },
  { label: "Instagram", href: "#", path: "M12 2c2.7 0 3.1 0 4.1.06 1.1.05 1.8.2 2.4.44a5 5 0 0 1 1.8 1.2 5 5 0 0 1 1.2 1.8c.24.6.4 1.3.44 2.4.05 1 .06 1.4.06 4.1s0 3.1-.06 4.1c-.05 1.1-.2 1.8-.44 2.4a5 5 0 0 1-1.2 1.8 5 5 0 0 1-1.8 1.2c-.6.24-1.3.4-2.4.44-1 .05-1.4.06-4.1.06s-3.1 0-4.1-.06c-1.1-.05-1.8-.2-2.4-.44a5 5 0 0 1-1.8-1.2 5 5 0 0 1-1.2-1.8c-.24-.6-.4-1.3-.44-2.4C2 15.1 2 14.7 2 12s0-3.1.06-4.1c.05-1.1.2-1.8.44-2.4a5 5 0 0 1 1.2-1.8 5 5 0 0 1 1.8-1.2c.6-.24 1.3-.4 2.4-.44C8.9 2 9.3 2 12 2m0 1.8c-2.6 0-3 0-4 .06-.9.04-1.4.18-1.7.3-.4.15-.7.35-1.05.7-.35.35-.55.65-.7 1.05-.12.3-.26.8-.3 1.7-.05 1-.06 1.4-.06 4s0 3 .06 4c.04.9.18 1.4.3 1.7.15.4.35.7.7 1.05.35.35.65.55 1.05.7.3.12.8.26 1.7.3 1 .05 1.4.06 4 .06s3 0 4-.06c.9-.04 1.4-.18 1.7-.3.4-.15.7-.35 1.05-.7.35-.35.55-.65.7-1.05.12-.3.26-.8.3-1.7.05-1 .06-1.4.06-4s0-3-.06-4c-.04-.9-.18-1.4-.3-1.7-.15-.4-.35-.7-.7-1.05a2.8 2.8 0 0 0-1.05-.7c-.3-.12-.8-.26-1.7-.3-1-.05-1.4-.06-4-.06M12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10m0 1.8a3.2 3.2 0 1 0 0 6.4 3.2 3.2 0 0 0 0-6.4m5.2-2.9a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4" },
  { label: "LinkedIn", href: "#", path: "M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5M3 9h4v12H3zM9 9h3.8v1.7h.05c.5-.9 1.8-1.9 3.7-1.9 4 0 4.7 2.6 4.7 6V21H17v-5.3c0-1.3 0-2.9-1.8-2.9s-2 1.4-2 2.8V21H9z" },
];
 
export default function Footer() {
  const year = new Date().getFullYear();
 
  return (
    <footer className="border-t" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg)" }}>
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-3">
        <div>
          <Link to="/" className="flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
            <AcademicCapIcon className="h-6 w-6" style={{ color: "var(--accent)" }} />
            <span className="font-display text-lg font-bold">أكاديمي</span>
          </Link>
          <p className="mt-3 text-sm" style={{ color: "var(--text-secondary)" }}>
            منصة تعليمية تربط الطلاب بأفضل المدرسين في البرمجة والإنجليزية.
          </p>
        </div>
 
        <div>
          <h3 className="font-display text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
            روابط سريعة
          </h3>
          <ul className="mt-3 flex flex-col gap-2">
            {QUICK_LINKS.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="text-sm transition-colors hover:text-[var(--accent-text)]"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
 
        <div>
          <h3 className="font-display text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
            تابعنا
          </h3>
          <div className="mt-3 flex gap-3">
            {SOCIAL_LINKS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="flex h-9 w-9 items-center justify-center rounded-full border transition-colors hover:text-[var(--accent-text)]"
                style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                  <path d={social.path} />
                </svg>
              </a>
            ))}
          </div>
        </div>
      </div>
 
      <div className="border-t py-4 text-center text-xs" style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}>
        © {year} أكاديمي. جميع الحقوق محفوظة.
      </div>
    </footer>
  );
}
