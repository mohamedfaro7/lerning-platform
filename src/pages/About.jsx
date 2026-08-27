import { motion } from "framer-motion";
import { AcademicCapIcon, HeartIcon, SparklesIcon } from "@heroicons/react/24/outline";

const VALUES = [
  { icon: AcademicCapIcon, title: "جودة التعليم", desc: "نحرص على تقديم محتوى يلبي معايير السوق العالمي." },
  { icon: HeartIcon, title: "رعاية الطلاب", desc: "ندعمك في كل خطوة من خطوات رحلتك التعليمية." },
  { icon: SparklesIcon, title: "ابتكار مستمر", desc: "نطور منصتنا باستمرار لتلبية احتياجاتك." },
];

const team = [
  { name: "أحمد", role: "المؤسس", color: "var(--accent)" },
  { name: "سارة", role: "مديرة المحتوى", color: "#a855f7" },
  { name: "محمد", role: "مطور المنصة", color: "#06b6d4" },
];

export default function About() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-2xl text-center"
      >
        <h1 className="font-display text-4xl font-black" style={{ color: "var(--text-primary)" }}>
          عن <span style={{ color: "var(--accent)" }}>أكاديمي</span>
        </h1>
        <p className="mt-5 text-base leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          نؤمن بأن التعليم الجيد يغيّر life. أكاديمي منصة تجمع بين المدرسين المتميزين والطلاب الطموحين لبناء مستقبل أفضل.
        </p>
      </motion.div>

      <div className="mt-16 grid gap-6 sm:grid-cols-3">
        {VALUES.map((v, i) => (
          <motion.div
            key={v.title}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="rounded-2xl border p-6 text-center backdrop-blur-sm"
            style={{ borderColor: "var(--border)", backgroundColor: "var(--card)" }}
          >
            <div
              className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl"
              style={{ backgroundColor: "var(--accent)", opacity: 0.12 }}
            >
              <v.icon className="h-6 w-6" style={{ color: "var(--accent)" }} />
            </div>
            <h3 className="font-display text-lg font-bold" style={{ color: "var(--text-primary)" }}>{v.title}</h3>
            <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{v.desc}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="mt-20 text-center"
      >
        <h2 className="font-display text-2xl font-bold" style={{ color: "var(--text-primary)" }}>فريقنا</h2>
        <div className="mt-8 flex flex-wrap justify-center gap-6">
          {team.map((t) => (
            <div key={t.name} className="flex flex-col items-center gap-3">
              <div
                className="flex h-20 w-20 items-center justify-center rounded-full text-2xl font-bold text-white"
                style={{ backgroundColor: t.color }}
              >
                {t.name[0]}
              </div>
              <div>
                <p className="font-semibold" style={{ color: "var(--text-primary)" }}>{t.name}</p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
