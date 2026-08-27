export default function Input({
  label,
  name,
  as = "input",
  type = "text",
  error,
  className = "",
  ...rest
}) {
  const Tag = as;

  const baseClasses = `w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all
    placeholder:text-[var(--text-muted)]
    focus:ring-2 focus:ring-[var(--accent)]
    ${error ? "border-red-400" : "focus:border-[var(--accent)]"}`;

  return (
    <div className={className}>
      {label && (
        <label htmlFor={name} className="mb-1.5 block text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
          {label}
        </label>
      )}

      <Tag
        id={name}
        name={name}
        type={as === "input" ? type : undefined}
        className={baseClasses}
        style={{ borderColor: "var(--input-border)", backgroundColor: "var(--input-bg)", color: "var(--text-primary)" }}
        {...rest}
      />

      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}
