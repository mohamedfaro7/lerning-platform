import { useState } from "react";
import { motion } from "framer-motion";
import { EnvelopeIcon, PhoneIcon, MapPinIcon } from "@heroicons/react/24/outline";
import Input from "../component/common/Input";
import Button from "../component/common/Button";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("شكراً لتواصلك! سنرد عليك قريباً.");
  };

  return (
    <section className="mx-auto max-w-6xl px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-2xl text-center"
      >
        <h1 className="font-display text-4xl font-black" style={{ color: "var(--text-primary)" }}>
          اتصل <span style={{ color: "var(--accent)" }}>بنا</span>
        </h1>
        <p className="mt-4 text-base leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          هل لديك سؤال أو اقتراح؟ لا تتردد في التواصل معنا.
        </p>
      </motion.div>

      <div className="mt-12 grid gap-8 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="flex flex-col gap-6"
        >
          <div className="rounded-2xl border p-6 backdrop-blur-sm" style={{ borderColor: "var(--border)", backgroundColor: "var(--card)" }}>
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl" style={{ backgroundColor: "var(--accent)", opacity: 0.12 }}>
                <EnvelopeIcon className="h-6 w-6" style={{ color: "var(--accent)" }} />
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>البريد الإلكتروني</p>
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>info@akademy.com</p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border p-6 backdrop-blur-sm" style={{ borderColor: "var(--border)", backgroundColor: "var(--card)" }}>
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl" style={{ backgroundColor: "#a855f7", opacity: 0.12 }}>
                <PhoneIcon className="h-6 w-6" style={{ color: "#a855f7" }} />
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>الهاتف</p>
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>+966 50 123 4567</p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border p-6 backdrop-blur-sm" style={{ borderColor: "var(--border)", backgroundColor: "var(--card)" }}>
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl" style={{ backgroundColor: "#06b6d4", opacity: 0.12 }}>
                <MapPinIcon className="h-6 w-6" style={{ color: "#06b6d4" }} />
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>الموقع</p>
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>الرياض، المملكة العربية السعودية</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="rounded-2xl border p-6 backdrop-blur-sm"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--card)" }}
        >
          <div className="flex flex-col gap-4">
            <Input name="name" placeholder="الاسم" value={form.name} onChange={handleChange} />
            <Input name="email" type="email" placeholder="البريد الإلكتروني" value={form.email} onChange={handleChange} />
            <Input name="subject" placeholder="الموضوع" value={form.subject} onChange={handleChange} />
            <textarea
              name="message"
              placeholder="رسالتك..."
              rows="4"
              value={form.message}
              onChange={handleChange}
              className="w-full rounded-xl border px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              style={{ borderColor: "var(--input-border)", backgroundColor: "var(--input-bg)" }}
            />
            <Button type="submit" className="w-full">
              إرسال الرسالة
            </Button>
          </div>
        </motion.form>
      </div>
    </section>
  );
}
