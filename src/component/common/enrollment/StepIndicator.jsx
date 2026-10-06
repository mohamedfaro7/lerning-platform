import { CheckCircleIcon } from "@heroicons/react/24/outline";

export const ENROLLMENT_STEPS = [
  { id: 1, label: "تفاصيل الكورس" },
  { id: 2, label: "اختار المدرّس" },
  { id: 3, label: "اختار الجروب" },
  { id: 4, label: "الدفع" },
];

export default function StepIndicator({ currentStep }) {
  return (
    <nav
      aria-label="خطوات التسجيل"
      className="mb-8 flex items-center justify-center gap-2"
    >
      {ENROLLMENT_STEPS.map((step, index) => {
        const isActive = step.id === currentStep;
        const isCompleted = step.id < currentStep;
        const isLast = index === ENROLLMENT_STEPS.length - 1;

        return (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center gap-2">
              <div
                aria-current={isActive ? "step" : undefined}
                className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition-all"
                style={{
                  backgroundColor: isActive
                    ? "var(--accent)"
                    : isCompleted
                    ? "#10b981"
                    : "var(--card)",
                  color: isActive || isCompleted ? "#fff" : "var(--text-muted)",
                  border:
                    !isActive && !isCompleted ? "1px solid var(--border)" : "none",
                  transform: isActive ? "scale(1.1)" : "scale(1)",
                  boxShadow: isActive
                    ? "0 8px 24px color-mix(in srgb, var(--accent) 40%, transparent)"
                    : "none",
                }}
              >
                {isCompleted ? <CheckCircleIcon className="h-4 w-4" /> : step.id}
              </div>
              <span
                className="text-[10px] font-semibold"
                style={{
                  color: isActive
                    ? "var(--accent)"
                    : isCompleted
                    ? "#10b981"
                    : "var(--text-muted)",
                }}
              >
                {step.label}
              </span>
            </div>
            {!isLast && (
              <div
                className="mx-2 h-0.5 w-10 sm:w-20"
                style={{
                  backgroundColor: isCompleted ? "#10b981" : "var(--border)",
                  marginBottom: "20px",
                }}
              />
            )}
          </div>
        );
      })}
    </nav>
  );
}