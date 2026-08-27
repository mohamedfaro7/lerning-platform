import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AcademicCapIcon, UserGroupIcon, PlayCircleIcon } from "@heroicons/react/24/outline";

const HERO_ACCENT = "var(--accent)";
const HERO_ACCENT_2 = "#a855f7";
const HERO_ACCENT_3 = "#06b6d4";

const cards = [
  {
    icon: AcademicCapIcon,
    title: "محتوى احترافي",
    desc: "كورسات مصممة بعناية من مدرسين معدين.",
    accent: HERO_ACCENT,
  },
  {
    icon: UserGroupIcon,
    title: "مجتمع تفاعلي",
    desc: "تواصل مع زملائك ومدرسيك بسهولة.",
    accent: HERO_ACCENT_2,
  },
  {
    icon: PlayCircleIcon,
    title: "تعلم عملي",
    desc: "مشاريع حقيقية تبني مهاراتك.",
    accent: HERO_ACCENT_3,
  },
];

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};
const item = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120, damping: 18 } },
};

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="relative mx-auto mt-8 max-w-6xl px-4 pt-12 sm:pt-20">
        {/* Floating Visual */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <motion.div
            className="absolute -right-28 top-12 h-[320px] w-[320px] rounded-full blur-[120px]"
            style={{ backgroundColor: HERO_ACCENT, opacity: 0.07 }}
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute -left-20 top-48 h-[260px] w-[260px] rounded-full blur-[110px]"
            style={{ backgroundColor: HERO_ACCENT_2, opacity: 0.06 }}
            animate={{ scale: [1.1, 1, 1.1] }}
            transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute left-1/2 top-8 h-[220px] w-[220px] -translate-x-1/2 rounded-full blur-[100px]"
            style={{ backgroundColor: HERO_ACCENT_3, opacity: 0.06 }}
            animate={{ y: [0, 20, 0] }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative z-10 mx-auto max-w-3xl text-center"
        >
          <span
            className="mb-4 inline-block rounded-full border px-4 py-1.5 text-xs font-semibold"
            style={{ borderColor: "var(--border)", color: "var(--accent-text)", backgroundColor: "var(--card)" }}
          >
            ابدأ رحلتك التعليمية الآن
          </span>
          <h1
            className="font-display text-4xl font-black leading-tight tracking-tight sm:text-5xl"
            style={{ color: "var(--text-primary)" }}
          >
            ارتقِ بمهاراتك مع{" "}
            <span style={{ color: HERO_ACCENT }}>أكاديمي</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed sm:text-lg" style={{ color: "var(--text-secondary)" }}>
            منصة تعليمية تربط الطلاب بأفضل المدرسين في البرمجة والإنجليزية. تعلّم بالسرعة التي تناسبك وطوّر مهاراتك بفعالية.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/courses"
              className="rounded-xl px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:brightness-110"
              style={{ backgroundColor: HERO_ACCENT }}
            >
              تصفّح الكورسات
            </Link>
            <Link
              to="/register"
              className="rounded-xl border px-6 py-3 text-sm font-semibold transition-all hover:border-[var(--accent)] hover:text-[var(--accent-text)]"
              style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
            >
              سجّل مجاناً
            </Link>
          </div>
        </motion.div>

        {/* Floating Course Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5, ease: "easeOut" }}
          className="relative z-10 mx-auto mt-12 max-w-md overflow-hidden rounded-2xl border p-4 backdrop-blur-xl sm:mt-16"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--card)" }}
        >
          <div className="flex items-center gap-4">
            <div
              className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl"
              style={{ backgroundColor: `${HERO_ACCENT}15` }}
            >
              <AcademicCapIcon className="h-6 w-6" style={{ color: HERO_ACCENT }} />
            </div>
            <div>
              <p className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>مقدمة في البرمجة</p>
              <p className="mt-0.5 text-xs" style={{ color: "var(--text-muted)" }}>ابدأ من الصفر وانطلق نحو الاحتراف</p>
            </div>
            <span className="me-auto rounded-lg px-2 py-0.5 text-[11px] font-semibold" style={{ color: "var(--accent-text)", backgroundColor: `${HERO_ACCENT}15` }}>
              الأكثر طلباً
            </span>
          </div>
        </motion.div>
      </section>

      {/* FEATURES */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid gap-6 sm:grid-cols-3"
        >
          {cards.map((card) => (
            <motion.div
              key={card.title}
              variants={item}
              className="group rounded-2xl border p-6 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02]"
              style={{
                borderColor: "var(--border)",
                backgroundColor: "var(--card)",
              }}
              whileHover={{ boxShadow: `0 0 30px ${card.accent}25` }}
            >
              <div
                className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl transition-transform group-hover:scale-110"
                style={{ backgroundColor: `${card.accent}18` }}
              >
                <card.icon className="h-6 w-6" style={{ color: card.accent }} />
              </div>
              <h3 className="font-display text-base font-bold" style={{ color: "var(--text-primary)" }}>{card.title}</h3>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{card.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </>
  );
}
