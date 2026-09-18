import { StarIcon } from "@heroicons/react/24/solid";

/**
 * مكون عرض التقييم بالنجوم
 *
 * @param {number} rating - التقييم من 0 لـ 5 (يقبل كسور، مثل 4.7)
 * @param {string} size - حجم النجوم: "sm" | "md" | "lg"
 * @param {boolean} showNumber - إظهار الرقم جنب النجوم
 * @param {number} count - عدد التقييمات (اختياري)
 */
export default function StarRating({
  rating = 0,
  size = "sm",
  showNumber = true,
  count = null,
}) {
  // أحجام النجوم
  const sizes = {
    sm: "h-3.5 w-3.5",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  // ضمان إن التقييم بين 0 و 5
  const safeRating = Math.max(0, Math.min(5, rating));

  return (
    <div className="flex items-center gap-1.5">
      {/* النجوم */}
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => {
          // نحسب نسبة امتلاء النجمة (0% | 50% | 100%)
          const fillPercentage =
            safeRating >= star
              ? 100
              : safeRating >= star - 0.5
              ? 50
              : 0;

          return (
            <div key={star} className="relative">
              {/* نجمة الخلفية (فاضية) */}
              <StarIcon
                className={`${sizes[size]} text-slate-700`}
                strokeWidth={1.5}
              />

              {/* نجمة المقدمة (مليانة جزئياً أو كلياً) */}
              {fillPercentage > 0 && (
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: `${fillPercentage}%` }}
                >
                  <StarIcon
                    className={`${sizes[size]} text-amber-400`}
                    strokeWidth={0}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* الرقم + عدد التقييمات */}
      {showNumber && (
        <div className="flex items-baseline gap-1">
          <span className="text-xs font-bold text-slate-200">
            {safeRating.toFixed(1)}
          </span>
          {count !== null && (
            <span className="text-[10px] text-slate-500">({count})</span>
          )}
        </div>
      )}
    </div>
  );
}