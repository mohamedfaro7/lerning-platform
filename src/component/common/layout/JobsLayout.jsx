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
  UserCircleIcon  // ← أضف هذه
} from "@heroicons/react/24/outline";
import ThemeToggle from "../ThemeToggle";
import AnimatedGridBackground from "../AnimatedGridBackground";
import JobsHome from "../../../pages/jobs/JobsHome";
import Jobs from "../../../pages/jobs/Jobs";
import JobsApply from "../../../pages/jobs/JobsApply";
import { useAuth } from "../../../context/AuthContext";
import ApplicationTracker from "../../../pages/jobs/ApplicationTracker";

// 🚀 السياق: يتم إنشاؤه مرة واحدة خارج المكون
const SidebarContext = createContext(null);

// ⭐ مصفوفة عناصر الـ Sidebar (ثابتة)
const SIDEBAR_ITEMS = [
  { key: "home", icon: HomeIcon, label: "مرحباً" },
  { key: "jobs", icon: BriefcaseIcon, label: "الوظائف" },
  { key: "apply", icon: PaperAirplaneIcon, label: "التقديم" },
  { key: "track", icon: PaperAirplaneIcon, label:"النتيجة" },
 ];

// ⭐ خريطة الصفحات حسب الـ key
const PAGES = {
  home: JobsHome,
  jobs: Jobs,
  apply: JobsApply,
  track: ApplicationTracker,
};

// ⭐ Hook لاستخدام الـ Sidebar (يُستدعى من الأبناء)
export function useSidebar() {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error("useSidebar must be used within SidebarProvider");
  return ctx;
}

export default function JobsLayout() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate(); // احتياطاً للاستخدام المستقبلي
  const location = useLocation();
  
  const [active, setActive] = useState("home");
  const [mobileOpen, setMobileOpen] = useState(false);

  // 🔒 تأثير جانبي: استقبال إشارة "openApply" من التسجيل
  useEffect(() => {
    // التحقق الآمن من وجود state و openApply
    if (location.state && location.state.openApply) {
      setActive("apply");
      // مسح الـ state لتجنب البقاء في وضع Apply بعد الـ Refresh
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
          className="relative z-20 hidden md:flex w-64 flex-shrink-0 flex-col border-l"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-secondary)" }}
        >
          <div className="flex items-center gap-3 p-6">
            <AcademicCapIcon className="h-8 w-8" style={{ color: "var(--accent)" }} />
            <div>
              <h2 className="font-display text-lg font-bold" style={{ color: "var(--text-primary)" }}>أكاديمي</h2>
              <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>التوظيف والانضمام</p>
            </div>
          </div>

          <nav className="mt-2 flex flex-1 flex-col gap-1 px-3">
            {SIDEBAR_ITEMS.map((item) => (
              <button
                key={item.key}
                onClick={() => setActive(item.key)}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                  active === item.key ? "shadow-md" : "hover:bg-[var(--surface-hover)]"
                }`}
                style={{
                  backgroundColor: active === item.key ? "var(--accent)" : "transparent",
                  color: active === item.key ? "#fff" : "var(--text-secondary)",
                }}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </button>
            ))}
          </nav>

          <div className="border-t p-4" style={{ borderColor: "var(--border)" }}>
            <ThemeToggle />
          </div>
        </aside>

        {/* Mobile Header */}
        <div
          className="fixed inset-x-0 top-0 z-50 flex items-center justify-between border-b p-4 md:hidden"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-secondary)" }}
        >
          <div className="flex items-center gap-2">
            <AcademicCapIcon className="h-6 w-6" style={{ color: "var(--accent)" }} />
            <span className="font-bold" style={{ color: "var(--text-primary)" }}>أكاديمي</span>
          </div>
          <button onClick={() => setMobileOpen(true)} style={{ color: "var(--text-primary)" }}>
            <Bars3Icon className="h-6 w-6" />
          </button>
        </div>

        {/* Mobile Drawer */}
        {mobileOpen && (
          <>
            <div className="fixed inset-0 z-50 bg-black/50 md:hidden" onClick={() => setMobileOpen(false)} />
            <div
              className="fixed inset-y-0 start-0 z-50 w-72 border-l p-6 shadow-xl md:hidden"
              style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border)" }}
            >
              <div className="mb-8 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AcademicCapIcon className="h-6 w-6" style={{ color: "var(--accent)" }} />
                  <span className="font-bold" style={{ color: "var(--text-primary)" }}>أكاديمي</span>
                </div>
                <button onClick={() => setMobileOpen(false)} style={{ color: "var(--text-muted)" }}>
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              <nav className="flex flex-col gap-1">
                {SIDEBAR_ITEMS.map((item) => (
                  <button
                    key={item.key}
                    onClick={() => { setActive(item.key); setMobileOpen(false); }}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all"
                    style={{
                      backgroundColor: active === item.key ? "var(--accent)" : "transparent",
                      color: active === item.key ? "#fff" : "var(--text-secondary)",
                    }}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>
          </>
        )}

        {/* Main Content */}
        <main className="relative z-10 flex-1 overflow-hidden pt-16 md:pt-0">
          <AnimatedGridBackground />
          <div className="relative z-10">
            <Page />
          </div>
        </main>
        <JobsLeftSlider />
      </div>
    </SidebarContext.Provider>
  );
}