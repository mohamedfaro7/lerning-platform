import { useState } from "react";
import { XMarkIcon, PlusIcon } from "@heroicons/react/24/outline";

/**
 * مكون إدخال المهارات (Tag Input)
 * - المستخدم يكتب مهارة ويضغط Enter (أو +) لإضافتها
 * - يمكنه حذف أي مهارة بالضغط على X
 */
export default function SkillsInput({ skills = [], onChange, placeholder = "أضف مهارة..." }) {
  const [inputValue, setInputValue] = useState("");

  // ⭐ إضافة مهارة
  const addSkill = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    // منع التكرار (Case-insensitive)
    const exists = skills.some((s) => s.toLowerCase() === trimmed.toLowerCase());
    if (exists) {
      setInputValue("");
      return;
    }
    onChange([...skills, trimmed]);
    setInputValue("");
  };

  // ⭐ حذف مهارة
  const removeSkill = (skillToRemove) => {
    onChange(skills.filter((s) => s !== skillToRemove));
  };

  // ⭐ التعامل مع ضغط Enter
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // منع إرسال الفورم
      addSkill();
    }
    // حذف آخر مهارة بالـ Backspace لو الحقل فاضي
    if (e.key === "Backspace" && !inputValue && skills.length > 0) {
      removeSkill(skills[skills.length - 1]);
    }
  };

  return (
    <div
      className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-700 bg-slate-950 p-2 min-h-[48px] focus-within:border-indigo-500 transition"
    >
      {/* عرض المهارات المضافة */}
      {skills.map((skill) => (
        <span
          key={skill}
          className="inline-flex items-center gap-1 rounded-lg bg-indigo-500/20 px-2.5 py-1 text-xs font-semibold text-indigo-300 border border-indigo-500/30"
        >
          {skill}
          <button
            type="button"
            onClick={() => removeSkill(skill)}
            className="rounded-full p-0.5 transition hover:bg-indigo-500/30"
          >
            <XMarkIcon className="h-3 w-3" />
          </button>
        </span>
      ))}

      {/* حقل الإدخال */}
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={skills.length === 0 ? placeholder : ""}
        className="flex-1 min-w-[120px] bg-transparent px-1 py-1 text-sm text-white placeholder:text-slate-600 focus:outline-none"
      />

      {/* زر الإضافة (اختياري - للحالات اللي مش بتستخدم Enter) */}
      {inputValue.trim() && (
        <button
          type="button"
          onClick={addSkill}
          className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-white transition hover:bg-indigo-700"
          title="أضف المهارة"
        >
          <PlusIcon className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}