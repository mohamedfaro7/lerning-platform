import { useMemo, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRightIcon,
  AcademicCapIcon,
  CalendarDaysIcon,
  ClockIcon,
  UsersIcon,
  CheckCircleIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  BanknotesIcon,
  DevicePhoneMobileIcon,
  BuildingLibraryIcon,
  LockClosedIcon,
  ExclamationTriangleIcon,
  SparklesIcon,
  CheckBadgeIcon,
} from "@heroicons/react/24/outline";
import StepIndicator from "../../component/common/enrollment/StepIndicator";
import { CURRENCY } from "../../constants/mockLearningData";
import { useEnrollmentFlow } from "../../component/common/hooks/useEnrollmentFlow";
import { useMyEnrollments } from "../../component/common/hooks/useMyEnrollments";

// ═══════════════════════════════════════════════════════════
//   Constants
// ═══════════════════════════════════════════════════════════
const PAYMENT_PLANS = [
  {
    key: "full",
    label: "دفعة واحدة",
    description: "خصم 5% على الدفع الكامل",
    discount: 0.05,
  },
  {
    key: "installments",
    label: "تقسيط على دفعتين",
    description: "50% الآن و 50% بعد شهرين",
    discount: 0,
  },
];

const PAYMENT_METHODS = [
  {
    key: "card",
    label: "بطاقة ائتمانية",
    subtitle: "Visa / Mastercard / Meeza",
    icon: CreditCardIcon,
  },
  {
    key: "fawry",
    label: "فوري",
    subtitle: "ادفع من أي منفذ فوري",
    icon: BanknotesIcon,
  },
  {
    key: "vodafone",
    label: "فودافون كاش",
    subtitle: "من محفظتك الإلكترونية",
    icon: DevicePhoneMobileIcon,
  },
  {
    key: "instapay",
    label: "إنستاباي",
    subtitle: "تحويل فوري بين البنوك",
    icon: BuildingLibraryIcon,
  },
];

const INSTALLMENT_COUNT = 2;

// ═══════════════════════════════════════════════════════════
//   Helpers
// ═══════════════════════════════════════════════════════════
const formatTime = (time) => {
  if (!time) return "—";
  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "مساءً" : "صباحاً";
  const hour12 = h % 12 || 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
};

const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  const date = new Date(dateStr);
  return date.toLocaleDateString("ar-EG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const generateIdempotencyKey = () => {
  return `enr_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
};

// ═══════════════════════════════════════════════════════════
//   Order Summary Card
// ═══════════════════════════════════════════════════════════
function OrderSummaryCard({ course, instructor, group }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border p-6"
      style={{ borderColor: "var(--border)", backgroundColor: "var(--card)" }}
    >
      <h2
        className="flex items-center gap-2 text-base font-bold"
        style={{ color: "var(--text-primary)" }}
      >
        <AcademicCapIcon className="h-5 w-5 text-indigo-400" />
        تفاصيل الطلب
      </h2>

      <div className="mt-5 space-y-4">
        {/* Course */}
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-400">
            <AcademicCapIcon className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              الكورس
            </p>
            <p
              className="truncate text-sm font-bold"
              style={{ color: "var(--text-primary)" }}
            >
              {course.titleAr || course.title}
            </p>
            <p className="mt-0.5 text-xs" style={{ color: "var(--text-muted)" }}>
              {course.duration} • {course.level}
            </p>
          </div>
        </div>

        {/* Instructor */}
        <div className="flex items-start gap-3">
          <div
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white"
            style={{
              background: "linear-gradient(135deg, var(--accent), #8b5cf6)",
            }}
          >
            {instructor.avatar}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              المدرّس
            </p>
            <p
              className="truncate text-sm font-bold"
              style={{ color: "var(--text-primary)" }}
            >
              {instructor.name}
            </p>
            <p className="mt-0.5 text-xs" style={{ color: "var(--text-muted)" }}>
              {instructor.specialty}
            </p>
          </div>
        </div>

        {/* Group */}
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-400">
            <UsersIcon className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              الجروب
            </p>
            <p
              className="truncate text-sm font-bold"
              style={{ color: "var(--text-primary)" }}
            >
              {group.nameAr}
            </p>
            <div
              className="mt-1 flex flex-wrap items-center gap-3 text-xs"
              style={{ color: "var(--text-muted)" }}
            >
              {group.days?.length > 0 && (
                <span className="flex items-center gap-1">
                  <CalendarDaysIcon className="h-3 w-3" />
                  {group.days.join(" و ")}
                </span>
              )}
              {group.startTime && (
                <span className="flex items-center gap-1">
                  <ClockIcon className="h-3 w-3" />
                  {formatTime(group.startTime)} — {formatTime(group.endTime)}
                </span>
              )}
            </div>
            {group.startDate && (
              <p className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>
                تبدأ في {formatDate(group.startDate)}
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════
//   Payment Plan Selector
// ═══════════════════════════════════════════════════════════
function PaymentPlanSelector({ selected, onChange, basePrice }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 }}
      className="rounded-2xl border p-6"
      style={{ borderColor: "var(--border)", backgroundColor: "var(--card)" }}
    >
      <h2
        className="flex items-center gap-2 text-base font-bold"
        style={{ color: "var(--text-primary)" }}
      >
        <BanknotesIcon className="h-5 w-5 text-emerald-400" />
        خطة الدفع
      </h2>

      <div className="mt-4 space-y-3">
        {PAYMENT_PLANS.map((plan) => {
          const isSelected = selected === plan.key;
          const discountedPrice = Math.round(basePrice * (1 - plan.discount));
          const installmentAmount = Math.round(basePrice / INSTALLMENT_COUNT);

          return (
            <button
              key={plan.key}
              type="button"
              onClick={() => onChange(plan.key)}
              className="flex w-full items-center gap-4 rounded-xl border p-4 text-right transition-all"
              style={{
                borderColor: isSelected ? "var(--accent)" : "var(--border)",
                backgroundColor: isSelected
                  ? "color-mix(in srgb, var(--accent) 8%, transparent)"
                  : "transparent",
              }}
            >
              <div
                className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 transition"
                style={{
                  borderColor: isSelected ? "var(--accent)" : "var(--border)",
                }}
              >
                {isSelected && (
                  <div
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: "var(--accent)" }}
                  />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p
                    className="text-sm font-bold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {plan.label}
                  </p>
                  {plan.discount > 0 && (
                    <span className="rounded-md bg-emerald-500/15 px-1.5 py-0.5 text-[10px] font-bold text-emerald-400">
                      وفّر {Math.round(plan.discount * 100)}%
                    </span>
                  )}
                </div>
                <p
                  className="mt-0.5 text-xs"
                  style={{ color: "var(--text-muted)" }}
                >
                  {plan.description}
                </p>
              </div>

              <div className="flex-shrink-0 text-left">
                <p
                  className="text-sm font-black"
                  style={{ color: "var(--text-primary)" }}
                >
                  {plan.key === "full"
                    ? `${discountedPrice.toLocaleString()} ${CURRENCY.symbol}`
                    : `${installmentAmount.toLocaleString()} ${CURRENCY.symbol} × ${INSTALLMENT_COUNT}`}
                </p>
                {plan.key === "full" && (
                  <p
                    className="mt-0.5 text-[10px] line-through"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {basePrice.toLocaleString()}
                  </p>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════
//   Payment Method Selector
// ═══════════════════════════════════════════════════════════
function PaymentMethodSelector({ selected, onChange }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="rounded-2xl border p-6"
      style={{ borderColor: "var(--border)", backgroundColor: "var(--card)" }}
    >
      <h2
        className="flex items-center gap-2 text-base font-bold"
        style={{ color: "var(--text-primary)" }}
      >
        <CreditCardIcon className="h-5 w-5 text-indigo-400" />
        طريقة الدفع
      </h2>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {PAYMENT_METHODS.map((method) => {
          const isSelected = selected === method.key;
          const Icon = method.icon;

          return (
            <button
              key={method.key}
              type="button"
              onClick={() => onChange(method.key)}
              className="flex items-center gap-3 rounded-xl border p-3.5 text-right transition-all"
              style={{
                borderColor: isSelected ? "var(--accent)" : "var(--border)",
                backgroundColor: isSelected
                  ? "color-mix(in srgb, var(--accent) 8%, transparent)"
                  : "transparent",
              }}
            >
              <div
                className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg"
                style={{
                  backgroundColor: isSelected
                    ? "color-mix(in srgb, var(--accent) 15%, transparent)"
                    : "var(--border)",
                  color: isSelected ? "var(--accent)" : "var(--text-muted)",
                }}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p
                  className="text-sm font-bold"
                  style={{ color: "var(--text-primary)" }}
                >
                  {method.label}
                </p>
                <p
                  className="text-[11px]"
                  style={{ color: "var(--text-muted)" }}
                >
                  {method.subtitle}
                </p>
              </div>
              {isSelected && (
                <CheckCircleIcon
                  className="h-5 w-5 flex-shrink-0"
                  style={{ color: "var(--accent)" }}
                />
              )}
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════
//   Card Form (يظهر فقط عند اختيار "بطاقة")
// ═══════════════════════════════════════════════════════════
function CardForm({ values, onChange, errors }) {
  const handleChange = (field) => (e) => {
    onChange({ ...values, [field]: e.target.value });
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="overflow-hidden"
    >
      <div
        className="mt-4 space-y-4 rounded-2xl border p-6"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--card)" }}
      >
        <h3
          className="flex items-center gap-2 text-sm font-bold"
          style={{ color: "var(--text-primary)" }}
        >
          <LockClosedIcon className="h-4 w-4 text-emerald-400" />
          بيانات البطاقة
        </h3>

        {/* Card Number */}
        <div>
          <label
            className="mb-1.5 block text-xs font-semibold"
            style={{ color: "var(--text-secondary)" }}
          >
            رقم البطاقة
          </label>
          <input
            type="text"
            inputMode="numeric"
            placeholder="0000 0000 0000 0000"
            value={values.cardNumber}
            onChange={handleChange("cardNumber")}
            maxLength={19}
            className="w-full rounded-xl border bg-transparent px-4 py-3 text-sm outline-none transition focus:border-[var(--accent)]"
            style={{
              borderColor: errors.cardNumber ? "#f43f5e" : "var(--border)",
              color: "var(--text-primary)",
            }}
          />
          {errors.cardNumber && (
            <p className="mt-1 text-[11px] text-rose-400">{errors.cardNumber}</p>
          )}
        </div>

        {/* Name */}
        <div>
          <label
            className="mb-1.5 block text-xs font-semibold"
            style={{ color: "var(--text-secondary)" }}
          >
            الاسم على البطاقة
          </label>
          <input
            type="text"
            placeholder="Ahmed Mohamed"
            value={values.cardName}
            onChange={handleChange("cardName")}
            className="w-full rounded-xl border bg-transparent px-4 py-3 text-sm outline-none transition focus:border-[var(--accent)]"
            style={{
              borderColor: errors.cardName ? "#f43f5e" : "var(--border)",
              color: "var(--text-primary)",
            }}
          />
          {errors.cardName && (
            <p className="mt-1 text-[11px] text-rose-400">{errors.cardName}</p>
          )}
        </div>

        {/* Expiry + CVV */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              className="mb-1.5 block text-xs font-semibold"
              style={{ color: "var(--text-secondary)" }}
            >
              تاريخ الانتهاء
            </label>
            <input
              type="text"
              placeholder="MM/YY"
              maxLength={5}
              value={values.cardExpiry}
              onChange={handleChange("cardExpiry")}
              className="w-full rounded-xl border bg-transparent px-4 py-3 text-sm outline-none transition focus:border-[var(--accent)]"
              style={{
                borderColor: errors.cardExpiry ? "#f43f5e" : "var(--border)",
                color: "var(--text-primary)",
              }}
            />
            {errors.cardExpiry && (
              <p className="mt-1 text-[11px] text-rose-400">
                {errors.cardExpiry}
              </p>
            )}
          </div>
          <div>
            <label
              className="mb-1.5 block text-xs font-semibold"
              style={{ color: "var(--text-secondary)" }}
            >
              CVV
            </label>
            <input
              type="text"
              placeholder="123"
              maxLength={3}
              value={values.cardCvv}
              onChange={handleChange("cardCvv")}
              className="w-full rounded-xl border bg-transparent px-4 py-3 text-sm outline-none transition focus:border-[var(--accent)]"
              style={{
                borderColor: errors.cardCvv ? "#f43f5e" : "var(--border)",
                color: "var(--text-primary)",
              }}
            />
            {errors.cardCvv && (
              <p className="mt-1 text-[11px] text-rose-400">{errors.cardCvv}</p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════
//   Terms Checkbox
// ═══════════════════════════════════════════════════════════
function TermsCheckbox({ checked, onChange }) {
  return (
    <label
      className="flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition"
      style={{
        borderColor: "var(--border)",
        backgroundColor: "var(--card)",
      }}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-4 w-4 flex-shrink-0 rounded accent-[var(--accent)]"
      />
      <span className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
        أوافق على{" "}
        <a
          href="/terms"
          className="font-semibold underline"
          style={{ color: "var(--accent)" }}
        >
          الشروط والأحكام
        </a>{" "}
        و{" "}
        <a
          href="/refund"
          className="font-semibold underline"
          style={{ color: "var(--accent)" }}
        >
          سياسة الاسترداد
        </a>
        . أعلم أن الدفع غير قابل للإلغاء بعد بدء الجروب.
      </span>
    </label>
  );
}

// ═══════════════════════════════════════════════════════════
//   Success State
// ═══════════════════════════════════════════════════════════
function SuccessState({ group, course, onGoToDashboard }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="mx-auto max-w-lg text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/15"
      >
        <CheckBadgeIcon className="h-10 w-10 text-emerald-400" />
      </motion.div>

      <h1
        className="mt-6 text-2xl font-black sm:text-3xl"
        style={{ color: "var(--text-primary)" }}
      >
        🎉 تم التسجيل بنجاح!
      </h1>
      <p className="mt-3 text-sm" style={{ color: "var(--text-secondary)" }}>
        أهلاً بيك في{" "}
        <span className="font-bold" style={{ color: "var(--text-primary)" }}>
          {group.nameAr}
        </span>{" "}
        — كورس{" "}
        <span className="font-bold" style={{ color: "var(--text-primary)" }}>
          {course.titleAr || course.title}
        </span>
      </p>

      <div
        className="mt-6 rounded-2xl border p-5 text-right"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--card)" }}
      >
        <p className="text-xs font-semibold" style={{ color: "var(--text-muted)" }}>
          الخطوة الجاية
        </p>
        <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
          هتلاقي كل تفاصيل الجروب والمواد التعليمية في لوحة التحكم.
          هيوصلك إيميل بالتأكيد خلال دقائق.
        </p>
      </div>

      <button
        onClick={onGoToDashboard}
        className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl px-8 py-3 text-sm font-bold text-white transition hover:brightness-110 active:scale-[0.98]"
        style={{
          backgroundColor: "var(--accent)",
          boxShadow: "0 4px 16px color-mix(in srgb, var(--accent) 30%, transparent)",
        }}
      >
        <SparklesIcon className="h-4 w-4" />
        اذهب إلى لوحة التحكم
      </button>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════
//   Main Component
// ═══════════════════════════════════════════════════════════
export default function Checkout() {
  const {
    course,
    instructor,
    group,
    courseId,
    validity,
    back,
    requireAuth,
    isAuthenticated,
    goToDashboard,
  } = useEnrollmentFlow();
  
  const { addEnrollment } = useMyEnrollments();

  // ─── Local UI State ───
  const [paymentPlan, setPaymentPlan] = useState("full");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [cardValues, setCardValues] = useState({
    cardNumber: "",
    cardName: "",
    cardExpiry: "",
    cardCvv: "",
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | processing | success | error

  // ─── Guards ───
  if (!validity.courseValid) return <Navigate to="/courses" replace />;
  if (!validity.instructorValid)
    return <Navigate to={`/courses/${courseId}/instructors`} replace />;
  if (!validity.groupValid)
    return (
      <Navigate
        to={`/courses/${courseId}/instructors/${instructor?.id}/groups`}
        replace
      />
    );
  if (!validity.groupAvailable)
    return (
      <Navigate
        to={`/courses/${courseId}/instructors/${instructor?.id}/groups`}
        replace
      />
    );

  // ⭐ Auth gate — لو مش مسجل → AuthModal
  if (!isAuthenticated) {
    requireAuth();
    return null;
  }

  // ─── Derived pricing ───
  const pricing = useMemo(() => {
    const basePrice = group.price;
    const plan = PAYMENT_PLANS.find((p) => p.key === paymentPlan);
    const discount = Math.round(basePrice * (plan?.discount || 0));
    const total = basePrice - discount;
    const now = paymentPlan === "installments"
      ? Math.round(total / INSTALLMENT_COUNT)
      : total;

    return { basePrice, discount, total, now };
  }, [group.price, paymentPlan]);

  // ─── Validation ───
  const validateCard = () => {
    const e = {};
    const digits = cardValues.cardNumber.replace(/\s/g, "");

    if (!digits) e.cardNumber = "مطلوب";
    else if (digits.length < 16) e.cardNumber = "رقم البطاقة غير صحيح";
    else if (!/^\d+$/.test(digits)) e.cardNumber = "أرقام فقط";

    if (!cardValues.cardName.trim()) e.cardName = "مطلوب";
    else if (cardValues.cardName.trim().length < 3) e.cardName = "اسم غير صحيح";

    if (!cardValues.cardExpiry) e.cardExpiry = "مطلوب";
    else if (!/^\d{2}\/\d{2}$/.test(cardValues.cardExpiry))
      e.cardExpiry = "MM/YY";

    if (!cardValues.cardCvv) e.cardCvv = "مطلوب";
    else if (cardValues.cardCvv.length !== 3) e.cardCvv = "3 أرقام";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const canPay = termsAccepted && status !== "processing";

  // ─── Payment Handler ───
 const handlePay = async () => {
  if (!canPay) return;
  if (paymentMethod === "card" && !validateCard()) return;

  setStatus("processing");
  const idempotencyKey = generateIdempotencyKey();

  try {
    await new Promise((r) => setTimeout(r, 1800));

    // ⭐ احفظ التسجيل
    addEnrollment({
      courseId,
      groupId: group.id,
      paymentPlan,
      paymentMethod,
      amountPaid: pricing.now,
    });

    setStatus("success");
  } catch (err) {
    console.error(err);
    setStatus("error");
  }
};

  // ─── Card number formatter ───
  const handleCardChange = (next) => {
    // format card number with spaces
    if ("cardNumber" in next) {
      const digits = next.cardNumber.replace(/\s/g, "").slice(0, 16);
      next.cardNumber = digits.replace(/(\d{4})(?=\d)/g, "$1 ");
    }
    // format expiry
    if ("cardExpiry" in next) {
      const digits = next.cardExpiry.replace(/\D/g, "").slice(0, 4);
      next.cardExpiry =
        digits.length >= 3 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
    }
    // cvv digits only
    if ("cardCvv" in next) {
      next.cardCvv = next.cardCvv.replace(/\D/g, "").slice(0, 3);
    }
    setCardValues(next);
    // clear errors as user types
    if (Object.keys(errors).length > 0) setErrors({});
  };

  // ─── Success View ───
  if (status === "success") {
    return (
      <div className="min-h-screen px-4 py-12" dir="rtl">
        <div className="mx-auto max-w-2xl">
          <StepIndicator currentStep={4} />
          <SuccessState
            course={course}
            group={group}
            onGoToDashboard={goToDashboard}
          />
        </div>
      </div>
    );
  }

  // ─── Main Checkout View ───
  return (
    <div className="min-h-screen px-4 py-8 pb-32" dir="rtl">
      <div className="mx-auto max-w-5xl">

        <StepIndicator currentStep={4} />

        {/* Back */}
        <button
          onClick={back}
          disabled={status === "processing"}
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium transition hover:opacity-80 disabled:opacity-40"
          style={{ color: "var(--text-secondary)" }}
        >
          <ArrowRightIcon className="h-4 w-4" />
          العودة لاختيار الجروب
        </button>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1
            className="text-2xl font-black sm:text-3xl"
            style={{ color: "var(--text-primary)" }}
          >
            إتمام <span style={{ color: "var(--accent)" }}>الدفع</span>
          </h1>
          <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
            خطوة واحدة تفصلك عن بدء رحلتك التعليمية.
          </p>
        </motion.div>

        {/* ═══ Grid: Left Content + Right Summary ═══ */}
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">

          {/* ─── Left ─── */}
          <div className="space-y-4">
            <OrderSummaryCard
              course={course}
              instructor={instructor}
              group={group}
            />

            <PaymentPlanSelector
              selected={paymentPlan}
              onChange={setPaymentPlan}
              basePrice={group.price}
            />

            <PaymentMethodSelector
              selected={paymentMethod}
              onChange={setPaymentMethod}
            />

            <AnimatePresence>
              {paymentMethod === "card" && (
                <CardForm
                  key="card-form"
                  values={cardValues}
                  onChange={handleCardChange}
                  errors={errors}
                />
              )}
            </AnimatePresence>

            <TermsCheckbox checked={termsAccepted} onChange={setTermsAccepted} />

            {/* Error banner */}
            <AnimatePresence>
              {status === "error" && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-start gap-3 rounded-xl border p-4"
                  style={{
                    borderColor: "rgba(244, 63, 94, 0.3)",
                    backgroundColor: "rgba(244, 63, 94, 0.08)",
                  }}
                >
                  <ExclamationTriangleIcon className="h-5 w-5 flex-shrink-0 text-rose-400" />
                  <div>
                    <p className="text-sm font-bold text-rose-300">
                      فشل الدفع
                    </p>
                    <p className="mt-1 text-xs text-rose-300/80">
                      حصلت مشكلة أثناء معالجة الدفع. حاول تاني أو استخدم طريقة دفع تانية.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ─── Right: Summary ─── */}
          <aside className="lg:sticky lg:top-6 lg:self-start">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="overflow-hidden rounded-2xl border"
              style={{
                borderColor: "var(--border)",
                backgroundColor: "var(--card)",
              }}
            >
              {/* Price Header */}
              <div
                className="relative overflow-hidden p-6"
                style={{
                  background:
                    "linear-gradient(135deg, color-mix(in srgb, var(--accent) 15%, transparent), rgba(168, 85, 247, 0.1))",
                }}
              >
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  الإجمالي
                </p>
                <div className="mt-2 flex items-baseline gap-2">
                  <span
                    className="text-3xl font-black"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {pricing.total.toLocaleString()}
                  </span>
                  <span className="text-sm" style={{ color: "var(--text-muted)" }}>
                    {CURRENCY.symbol}
                  </span>
                </div>
                {pricing.discount > 0 && (
                  <p className="mt-1 text-xs font-bold text-emerald-400">
                    وفّرت {pricing.discount.toLocaleString()} {CURRENCY.symbol}
                  </p>
                )}
              </div>

              {/* Breakdown */}
              <div
                className="space-y-3 border-t p-6"
                style={{ borderColor: "var(--border)" }}
              >
                <div className="flex items-center justify-between text-sm">
                  <span style={{ color: "var(--text-secondary)" }}>
                    سعر الكورس
                  </span>
                  <span style={{ color: "var(--text-primary)" }}>
                    {pricing.basePrice.toLocaleString()} {CURRENCY.symbol}
                  </span>
                </div>

                {pricing.discount > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-emerald-400">خصم الدفع الكامل</span>
                    <span className="text-emerald-400">
                      −{pricing.discount.toLocaleString()} {CURRENCY.symbol}
                    </span>
                  </div>
                )}

                <div
                  className="flex items-center justify-between border-t pt-3 text-base font-bold"
                  style={{
                    borderColor: "var(--border)",
                    color: "var(--text-primary)",
                  }}
                >
                  <span>تدفع الآن</span>
                  <span>
                    {pricing.now.toLocaleString()} {CURRENCY.symbol}
                  </span>
                </div>

                {paymentPlan === "installments" && (
                  <p
                    className="rounded-lg border p-2.5 text-[11px]"
                    style={{
                      borderColor: "var(--border)",
                      color: "var(--text-muted)",
                      backgroundColor:
                        "color-mix(in srgb, var(--bg) 60%, transparent)",
                    }}
                  >
                    💡 باقي{" "}
                    {(pricing.total - pricing.now).toLocaleString()}{" "}
                    {CURRENCY.symbol} بعد شهرين.
                  </p>
                )}
              </div>

              {/* Trust badges */}
              <div
                className="flex items-center justify-center gap-3 border-t p-4 text-[10px]"
                style={{
                  borderColor: "var(--border)",
                  color: "var(--text-muted)",
                }}
              >
                <span className="flex items-center gap-1">
                  <ShieldCheckIcon className="h-3 w-3" />
                  دفع آمن
                </span>
                <span className="flex items-center gap-1">
                  <LockClosedIcon className="h-3 w-3" />
                  SSL مشفّر
                </span>
                <span>✓ ضمان استرداد</span>
              </div>
            </motion.div>
          </aside>
        </div>
      </div>

      {/* ═══ Sticky Bottom Bar ═══ */}
      <div
        className="fixed inset-x-0 bottom-0 z-40 border-t backdrop-blur-xl"
        style={{
          borderColor: "var(--border)",
          backgroundColor: "color-mix(in srgb, var(--bg) 95%, transparent)",
        }}
      >
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4">
          <div className="min-w-0">
            <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>
              الإجمالي المستحق
            </p>
            <p
              className="text-lg font-black"
              style={{ color: "var(--text-primary)" }}
            >
              {pricing.now.toLocaleString()}{" "}
              <span
                className="text-xs font-medium"
                style={{ color: "var(--text-muted)" }}
              >
                {CURRENCY.symbol}
              </span>
            </p>
          </div>

          <button
            onClick={handlePay}
            disabled={!canPay}
            className="flex flex-shrink-0 items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
            style={{
              backgroundColor: "var(--accent)",
              boxShadow: canPay
                ? "0 4px 16px color-mix(in srgb, var(--accent) 30%, transparent)"
                : "none",
            }}
          >
            {status === "processing" ? (
              <>
                <span
                  className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
                  aria-hidden
                />
                جاري المعالجة...
              </>
            ) : (
              <>
                <ShieldCheckIcon className="h-4 w-4" />
                ادفع {pricing.now.toLocaleString()} {CURRENCY.symbol}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}