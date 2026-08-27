import { NavLink } from "react-router-dom";
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function MobileDrawer({ open, onClose, links }) {
  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className="fixed inset-y-0 start-0 z-50 w-72 overflow-y-auto border-l p-6 shadow-xl"
        style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border)" }}
      >
        <div className="mb-8 flex items-center justify-between">
          <span className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>القائمة</span>
          <button onClick={onClose} style={{ color: "var(--text-muted)" }}>
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <ul className="flex flex-col gap-1">
          {links.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-[var(--accent)]/10 text-[var(--accent-text)]"
                      : "text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]"
                  }`
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="mt-6 border-t pt-6" style={{ borderColor: "var(--border)" }}>
          <div className="flex flex-col gap-3">
            <NavLink
              to="/login"
              onClick={onClose}
              className="rounded-lg border px-4 py-2 text-center text-sm font-medium transition-colors"
              style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
            >
              تسجيل الدخول
            </NavLink>
            <NavLink
              to="/register"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-center text-sm font-medium text-white"
              style={{ backgroundColor: "var(--accent)" }}
            >
              سجل الآن
            </NavLink>
          </div>
        </div>
      </div>
    </>
  );
}
