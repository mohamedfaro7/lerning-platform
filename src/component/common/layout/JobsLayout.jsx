import { useState, createContext, useContext, useEffect } from "react";
import JobsLeftSlider from "./JobsLeftSlider";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  HomeIcon, 
  BriefcaseIcon, 
  AcademicCapIcon, 
  PaperAirplaneIcon, 
  Bars3Icon, 
  XMarkIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import ThemeToggle from "../ThemeToggle";
import AnimatedGridBackground from "../AnimatedGridBackground";
import JobsHome from "../../../pages/jobs/JobsHome";
import Jobs from "../../../pages/jobs/Jobs";
import JobsApply from "../../../pages/jobs/JobsApply";
import { useAuth } from "../../../context/AuthContext";

const SidebarContext = createContext(null);

const SIDEBAR_ITEMS = [
  { key: "home", icon: HomeIcon, label: "مرحباً" },
  { key: "jobs", icon: BriefcaseIcon, label: "الوظائف" },
  { key: "apply", icon: PaperAirplaneIcon, label: "التقديم" },
];

const PAGES = {
  home: JobsHome,
  jobs: Jobs,
  apply: JobsApply,
};

export function useSidebar() {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error("useSidebar must be used within SidebarProvider");
  return ctx;
}

export default function JobsLayout() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [active, setActive] = useState("home");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    if (location.state && location.state.openApply) {
      setActive("apply");
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  useEffect(() => {
    if (active === "apply" && !isAuthenticated) {
      navigate("/jobs/register", { replace: true });
    }
  }, [active, isAuthenticated, navigate]);

  const Page = PAGES[active] || JobsHome;

  return (
    <SidebarContext.Provider value={{ active, setActive }}>
      <div className="flex min-h-screen" style={{ backgroundColor: "var(--bg)" }}>
        {/* Desktop Sidebar */}
        <aside
          className="relative z-20 hidden md:flex w-52 flex-shrink-0 flex-col border-l h-screen sticky top-0"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-secondary)" }}
        >
          <div className="flex items-center gap-2 px-4 py-3">
            <AcademicCapIcon className="h-6 w-6" style={{ color: "var(--accent)" }} />
            <div>
              <h2 className="font-display text-xs font-bold" style={{ color: "var(--text-primary)" }}>أكاديمي</h2>
              <p className="text-[8px]" style={{ color: "var(--text-muted)" }}>التوظيف والانضمام</p>
            </div>
          </div>

          <nav className="mt-1 flex flex-col gap-0.5 px-2">
            {SIDEBAR_ITEMS.map((item) => (
              <button
                key={item.key}
                onClick={() => setActive(item.key)}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-[11px] font-medium transition-all ${
                  active === item.key ? "shadow-md" : "hover:bg-[var(--surface-hover)]"
                }`}
                style={{
                  backgroundColor: active === item.key ? "var(--accent)" : "transparent",
                  color: active === item.key ? "#fff" : "var(--text-secondary)",
                }}
              >
                <item.icon className="h-3.5 w-3.5" />
                {item.label}
              </button>
            ))}
          </nav>

          <div className="mt-auto border-t p-2.5 flex items-center gap-1.5" style={{ borderColor: "var(--border)" }}>
            <ThemeToggle />
            <button
              onClick={() => setProfileOpen(true)}
              className="flex flex-1 items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--card)] px-2.5 py-1.5 text-[11px] font-medium transition-colors hover:border-[var(--accent)]"
              style={{ color: "var(--text-secondary)" }}
            >
              {isAuthenticated ? (
                <>
                  <div className="flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-bold text-white" style={{ backgroundColor: "var(--accent)" }}>
                    {user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <span className="truncate">{user?.name || "حسابي"}</span>
                </>
              ) : (
                <>
                  <UserCircleIcon className="h-5 w-5" style={{ color: "var(--accent)" }} />
                  <span>تسجيل الدخول</span>
                </>
              )}
            </button>
          </div>
        </aside>

        {/* Mobile Header */}
        <div
          className="fixed inset-x-0 top-0 z-50 flex items-center justify-between border-b px-4 py-3 md:hidden"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-secondary)" }}
        >
          <div className="flex items-center gap-2">
            <AcademicCapIcon className="h-6 w-6" style={{ color: "var(--accent)" }} />
            <span className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>أكاديمي</span>
          </div>
          <button onClick={() => setMobileOpen(true)} style={{ color: "var(--text-primary)" }}>
            <Bars3Icon className="h-6 w-6" />
          </button>
        </div>

        {/* Mobile Popup Menu */}
        {mobileOpen && (
          <>
            <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm md:hidden" onClick={() => setMobileOpen(false)} />
            <div
              className="fixed top-1/2 left-1/2 z-50 w-72 -translate-x-1/2 -translate-y-1/2 rounded-2xl border p-5 shadow-2xl md:hidden"
              style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border)" }}
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AcademicCapIcon className="h-6 w-6" style={{ color: "var(--accent)" }} />
                  <span className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>أكاديمي</span>
                </div>
                <button onClick={() => setMobileOpen(false)} style={{ color: "var(--text-muted)" }}>
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>

              <nav className="flex flex-col gap-1">
                {SIDEBAR_ITEMS.map((item) => (
                  <button
                    key={item.key}
                    onClick={() => { setActive(item.key); setMobileOpen(false); }}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-xs font-medium transition-all"
                    style={{
                      backgroundColor: active === item.key ? "var(--accent)" : "transparent",
                      color: active === item.key ? "#fff" : "var(--text-secondary)",
                    }}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </button>
                ))}
              </nav>

              <div className="mt-3 border-t pt-3 flex items-center gap-2" style={{ borderColor: "var(--border)" }}>
                <ThemeToggle />
                <button
                  onClick={() => { setProfileOpen(true); setMobileOpen(false); }}
                  className="flex flex-1 items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-xs font-medium transition-colors hover:border-[var(--accent)]"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {isAuthenticated ? (
                    <>
                      <div className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold text-white" style={{ backgroundColor: "var(--accent)" }}>
                        {user?.name?.charAt(0)?.toUpperCase() || "U"}
                      </div>
                      <span className="truncate">{user?.name || "حسابي"}</span>
                    </>
                  ) : (
                    <>
                      <UserCircleIcon className="h-6 w-6" style={{ color: "var(--accent)" }} />
                      <span>تسجيل الدخول</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </>
        )}

        {/* Main Content */}
        <main className="relative z-10 flex-1 overflow-auto pt-12 md:pt-0">
          <AnimatedGridBackground />
          <div className="relative z-10">
            <Page />
          </div>
        </main>
        <JobsLeftSlider isOpen={profileOpen} onClose={() => setProfileOpen(false)} />
      </div>
    </SidebarContext.Provider>
  );
}
