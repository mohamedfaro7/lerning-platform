import { motion } from "framer-motion";
import { 
  UserCircleIcon, 
  ArrowLeftOnRectangleIcon, 
  ArrowRightOnRectangleIcon 
} from "@heroicons/react/24/outline";
import { useAuth } from "../../context/AuthContext";

export default function LeftBottomSlider() {
  const { user, isAuthenticated, openAuthModal, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="fixed bottom-6 left-6 z-40"
    >
      <div
        className="flex items-center gap-3 rounded-2xl border px-4 py-2 shadow-lg backdrop-blur-md"
        style={{
          backgroundColor: "var(--bg-secondary, rgba(255,255,255,0.8))",
          borderColor: "var(--border)",
        }}
      >
        {isAuthenticated ? (
          <>
            <div className="flex items-center gap-2">
              <UserCircleIcon className="h-6 w-6" style={{ color: "var(--accent)" }} />
              <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                {user?.name || "مستخدم"}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 rounded-lg px-3 py-1 text-xs font-semibold text-white transition-all hover:brightness-110"
              style={{ backgroundColor: "#ef4444" }}
            >
              <ArrowLeftOnRectangleIcon className="inline-block h-4 w-4 ml-1" />
              خروج
            </button>
          </>
        ) : (
          <button
            onClick={openAuthModal}
            className="flex items-center gap-2 rounded-lg px-4 py-1.5 text-sm font-semibold text-white transition-all hover:brightness-110"
            style={{ backgroundColor: "var(--accent)" }}
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5" />
            تسجيل دخول
          </button>
        )}
      </div>
    </motion.div>
  );
}