// قائمة الوظائف المتاحة
export const JOBS_LIST = [
  { id: "technical_manager", title: "مدير تقني", color: "#3b82f6" },
  { id: "track_head", title: "رئيس مسار", color: "#a855f7" },
  { id: "academic_reviewer", title: "مراجع أكاديمي", color: "#06b6d4" },
  { id: "ops_planner", title: "مخطط عمليات", color: "#10b981" },
  { id: "quality_reviewer", title: "مراجع جودة", color: "#f59e0b" },
  { id: "admin", title: "المشرف العام", color: "#ef4444" },
];

// قائمة المتقدمين (Mock)
export const APPLICANTS = [
  { id: "u1", name: "أحمد محمد", email: "ahmed@test.com", avatar: "أ" },
  { id: "u2", name: "سارة علي", email: "sara@test.com", avatar: "س" },
  { id: "u3", name: "خالد حسن", email: "khaled@test.com", avatar: "خ" },
  { id: "u4", name: "منى إبراهيم", email: "mona@test.com", avatar: "م" },
  { id: "u5", name: "يوسف سعيد", email: "yousef@test.com", avatar: "ي" },
];

// المصفوفة: كل متقدم × كل وظيفة
// الحالات: "accepted" | "rejected" | "pending"
export const INITIAL_MATRIX = {
  u1: {
    technical_manager: "accepted",
    track_head: "rejected",
    academic_reviewer: "pending",
    ops_planner: null,
    quality_reviewer: null,
    admin: null,
  },
  u2: {
    technical_manager: "rejected",
    track_head: "accepted",
    academic_reviewer: "accepted",
    ops_planner: "pending",
    quality_reviewer: null,
    admin: null,
  },
  u3: {
    technical_manager: null,
    track_head: "pending",
    academic_reviewer: "rejected",
    ops_planner: "accepted",
    quality_reviewer: null,
    admin: null,
  },
  u4: {
    technical_manager: "pending",
    track_head: null,
    academic_reviewer: null,
    ops_planner: "accepted",
    quality_reviewer: "rejected",
    admin: null,
  },
  u5: {
    technical_manager: null,
    track_head: "accepted",
    academic_reviewer: null,
    ops_planner: null,
    quality_reviewer: "accepted",
    admin: "pending",
  },
};