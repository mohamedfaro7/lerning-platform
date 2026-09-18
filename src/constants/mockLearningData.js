
// ═══════════════════════════════════════════════════════════
//   إعدادات عامة
// ═══════════════════════════════════════════════════════════
export const CURRENCY = {
  code: "EGP",
  symbol: "ج.م",
  label: "جنيه مصري",
};

// ═══════════════════════════════════════════════════════════
//   الأقسام (Sections)
// ═══════════════════════════════════════════════════════════
export const SECTIONS = [
  {
    id: "english",
    name: "English",
    nameAr: "اللغة الإنجليزية",
    color: "#3b82f6",
    icon: "🇬🇧",
    description: "كورسات تعليم اللغة الإنجليزية بمستويات مختلفة",
  },
  {
    id: "programming",
    name: "Programming",
    nameAr: "البرمجة",
    color: "#a855f7",
    icon: "💻",
    description: "كورسات البرمجة وتطوير الويب والذكاء الاصطناعي",
  },
];

// ═══════════════════════════════════════════════════════════
//   المدرسين (Instructors)
//   كل مدرّس من قسم واحد بس
// ═══════════════════════════════════════════════════════════
export const MOCK_INSTRUCTORS = [
  // ── قسم English ──
  {
    id: "inst_001",
    applicantId: "app_001",
    name: "أحمد محمد",
    email: "ahmed.m@test.com",
    phone: "0512345678",
    avatar: "أ",
    sectionId: "english",
    bio: "مدرس لغة إنجليزية معتمد بشهادة TEFL، خبرة ٨ سنوات في تدريس IELTS و TOEFL.",
    specialty: "IELTS & TOEFL",
    joinedAt: "2024-01-15",
    status: "active",
    rating: 4.7,
    ratingCount: 45,
  },
  {
    id: "inst_002",
    applicantId: "app_002",
    name: "سارة علي",
    email: "sara.a@test.com",
    phone: "0523456789",
    avatar: "س",
    sectionId: "english",
    bio: "متخصصة في تعليم الإنجليزية للأعمال (Business English) والمحادثة.",
    specialty: "Business English",
    joinedAt: "2024-02-20",
    status: "active",
    rating: 4.9,
    ratingCount: 62,
  },
  {
    id: "inst_003",
    applicantId: "app_003",
    name: "منى إبراهيم",
    email: "mona.i@test.com",
    phone: "0534567890",
    avatar: "م",
    sectionId: "english",
    bio: "مدرسة قواعد ومحادثة للمبتدئين، خبرة ٥ سنوات في المناهج المصرية والدولية.",
    specialty: "Grammar & Conversation",
    joinedAt: "2024-03-10",
    status: "active",
    rating: 4.5,
    ratingCount: 28,
  },

  // ── قسم Programming ──
  {
    id: "inst_004",
    applicantId: "app_004",
    name: "خالد حسن",
    email: "khaled.h@test.com",
    phone: "0545678901",
    avatar: "خ",
    sectionId: "programming",
    bio: "مهندس برمجيات senior، متخصص في React و Node.js، خبرة ١٠ سنوات.",
    specialty: "Full Stack Development",
    joinedAt: "2024-01-08",
    status: "active",
    rating: 4.8,
    ratingCount: 71,
  },
  {
    id: "inst_005",
    applicantId: "app_005",
    name: "يوسف سعيد",
    email: "yousef.s@test.com",
    phone: "0556789012",
    avatar: "ي",
    sectionId: "programming",
    bio: "متخصص في Python و Data Science و Machine Learning، خبرة ٧ سنوات.",
    specialty: "Data Science & AI",
    joinedAt: "2024-02-14",
    status: "active",
    rating: 4.6,
    ratingCount: 39,
  },
  {
    id: "inst_006",
    applicantId: "app_006",
    name: "ليلى كمال",
    email: "laila.k@test.com",
    phone: "0567890123",
    avatar: "ل",
    sectionId: "programming",
    bio: "مهندسة Front-end، متخصصة في UI/UX وتطوير الويب الحديث.",
    specialty: "Front-end & UI/UX",
    joinedAt: "2024-03-05",
    status: "active",
    rating: 4.7,
    ratingCount: 52,
  },
];

// ═══════════════════════════════════════════════════════════
//   الكورسات (Courses)
// ═══════════════════════════════════════════════════════════
// ← هنا يبدأ الكود اللي عندك بالفعل

// ═══════════════════════════════════════════════════════════
//   الكورسات (Courses)
// ═══════════════════════════════════════════════════════════
export const MOCK_COURSES = [
  // ── قسم English ──
  {
    id: "course_001",
    sectionId: "english",
    title: "IELTS Preparation - Complete Course",
    titleAr: "التحضير الشامل لـ IELTS",
    instructorId: "inst_001",
    price: 1500,
    duration: "8 weeks",
    status: "active", // active | closed | draft
    level: "Advanced",
    enrolledCount: 45,
  },
  {
    id: "course_002",
    sectionId: "english",
    title: "Business English for Professionals",
    titleAr: "الإنجليزية للأعمال",
    instructorId: "inst_002",
    price: 1200,
    duration: "6 weeks",
    status: "active",
    level: "Intermediate",
    enrolledCount: 32,
  },
  {
    id: "course_003",
    sectionId: "english",
    title: "English Grammar Fundamentals",
    titleAr: "أساسيات القواعد الإنجليزية",
    instructorId: "inst_003",
    price: 800,
    duration: "4 weeks",
    status: "active",
    level: "Beginner",
    enrolledCount: 28,
  },

  // ── قسم Programming ──
  {
    id: "course_004",
    sectionId: "programming",
    title: "Full Stack Web Development",
    titleAr: "تطوير الويب الشامل",
    instructorId: "inst_004",
    price: 2500,
    duration: "12 weeks",
    status: "active",
    level: "Advanced",
    enrolledCount: 71,
  },
  {
    id: "course_005",
    sectionId: "programming",
    title: "Python for Data Science",
    titleAr: "بايثون لعلوم البيانات",
    instructorId: "inst_005",
    price: 2000,
    duration: "10 weeks",
    status: "active",
    level: "Intermediate",
    enrolledCount: 39,
  },
  {
    id: "course_006",
    sectionId: "programming",
    title: "React & Modern UI Development",
    titleAr: "React وتطوير الواجهات الحديثة",
    instructorId: "inst_006",
    price: 1800,
    duration: "8 weeks",
    status: "active",
    level: "Intermediate",
    enrolledCount: 52,
  },
];

// ═══════════════════════════════════════════════════════════
//   الجروبات (Groups)
//   كل جروب تابع لمدرّس، وله سعة وعدد طلاب
// ═══════════════════════════════════════════════════════════
export const MOCK_GROUPS = [
  // ── جروبات أحمد محمد (inst_001 - IELTS) ──
  {
    id: "grp_001",
    instructorId: "inst_001",
    courseId: "course_001",
    name: "IELTS Group A",
    nameAr: "مجموعة IELTS - أ",
    capacity: 15,
    enrolled: 14, // ← مكتمل تقريباً (93%)
    price: 1500,
    schedule: "السبت والاثنين 6:00 مساءً",
    startedAt: "2024-10-01",
    status: "active", // active | completed | cancelled
  },
  {
    id: "grp_002",
    instructorId: "inst_001",
    courseId: "course_001",
    name: "IELTS Group B",
    nameAr: "مجموعة IELTS - ب",
    capacity: 15,
    enrolled: 8, // ← نصف ممتلئ (53%)
    price: 1500,
    schedule: "الأحد والثلاثاء 7:00 مساءً",
    startedAt: "2024-11-05",
    status: "active",
  },

  // ── جروبات سارة علي (inst_002 - Business English) ──
  {
    id: "grp_003",
    instructorId: "inst_002",
    courseId: "course_002",
    name: "Business English Morning",
    nameAr: "إنجليزية الأعمال - صباحي",
    capacity: 12,
    enrolled: 12, // ← ممتلئ تماماً (100%)
    price: 1200,
    schedule: "السبت والاثنين والأربعاء 10:00 صباحاً",
    startedAt: "2024-09-15",
    status: "active",
  },
  {
    id: "grp_004",
    instructorId: "inst_002",
    courseId: "course_002",
    name: "Business English Evening",
    nameAr: "إنجليزية الأعمال - مسائي",
    capacity: 12,
    enrolled: 7,
    price: 1200,
    schedule: "الأحد والثلاثاء 8:00 مساءً",
    startedAt: "2024-10-20",
    status: "active",
  },

  // ── جروبات منى إبراهيم (inst_003 - Grammar) ──
  {
    id: "grp_005",
    instructorId: "inst_003",
    courseId: "course_003",
    name: "Grammar Beginners",
    nameAr: "القواعد للمبتدئين",
    capacity: 20,
    enrolled: 15,
    price: 800,
    schedule: "الجمعة 4:00 مساءً",
    startedAt: "2024-11-01",
    status: "active",
  },

  // ── جروبات خالد حسن (inst_004 - Full Stack) ──
  {
    id: "grp_006",
    instructorId: "inst_004",
    courseId: "course_004",
    name: "Full Stack - Group 1",
    nameAr: "تطوير شامل - مجموعة ١",
    capacity: 15,
    enrolled: 15, // ← ممتلئ
    price: 2500,
    schedule: "السبت والاثنين والأربعاء 6:00 مساءً",
    startedAt: "2024-09-01",
    status: "active",
  },
  {
    id: "grp_007",
    instructorId: "inst_004",
    courseId: "course_004",
    name: "Full Stack - Group 2",
    nameAr: "تطوير شامل - مجموعة ٢",
    capacity: 15,
    enrolled: 10,
    price: 2500,
    schedule: "الأحد والثلاثاء والخميس 7:00 مساءً",
    startedAt: "2024-10-15",
    status: "active",
  },
  {
    id: "grp_008",
    instructorId: "inst_004",
    courseId: "course_004",
    name: "Full Stack - Advanced",
    nameAr: "تطوير شامل - متقدم",
    capacity: 10,
    enrolled: 6,
    price: 3000,
    schedule: "الجمعة والسبت 10:00 صباحاً",
    startedAt: "2024-11-10",
    status: "active",
  },

  // ── جروبات يوسف سعيد (inst_005 - Python) ──
  {
    id: "grp_009",
    instructorId: "inst_005",
    courseId: "course_005",
    name: "Python Data Science - A",
    nameAr: "بايثون لعلوم البيانات - أ",
    capacity: 12,
    enrolled: 11,
    price: 2000,
    schedule: "السبت والاثنين 8:00 مساءً",
    startedAt: "2024-10-05",
    status: "active",
  },
  {
    id: "grp_010",
    instructorId: "inst_005",
    courseId: "course_005",
    name: "Python Data Science - B",
    nameAr: "بايثون لعلوم البيانات - ب",
    capacity: 12,
    enrolled: 5,
    price: 2000,
    schedule: "الأحد والثلاثاء 9:00 مساءً",
    startedAt: "2024-11-15",
    status: "active",
  },

  // ── جروبات ليلى كمال (inst_006 - React) ──
  {
    id: "grp_011",
    instructorId: "inst_006",
    courseId: "course_006",
    name: "React Group A",
    nameAr: "React - مجموعة أ",
    capacity: 15,
    enrolled: 13,
    price: 1800,
    schedule: "السبت والاثنين 7:00 مساءً",
    startedAt: "2024-09-20",
    status: "active",
  },
  {
    id: "grp_012",
    instructorId: "inst_006",
    courseId: "course_006",
    name: "React Group B",
    nameAr: "React - مجموعة ب",
    capacity: 15,
    enrolled: 9,
    price: 1800,
    schedule: "الأحد والثلاثاء 6:00 مساءً",
    startedAt: "2024-10-25",
    status: "active",
  },
];
// ═══════════════════════════════════════════════════════════
//   الطلاب (Students) - يتم توليدهم برمجياً
// ═══════════════════════════════════════════════════════════
const FIRST_NAMES = [
  "محمد", "أحمد", "مصطفى", "عمر", "يوسف", "كريم", "حسن", "علي", "خالد", "زياد",
  "فاطمة", "سارة", "مريم", "نور", "ياسمين", "هبة", "دينا", "سلمى", "منة", "رنا",
  "ليلى", "جنى", "ملك", "هدى", "أميرة", "ريم", "شيماء", "آية", "نهى", "إيمان",
];

const LAST_NAMES = [
  "محمد", "أحمد", "حسن", "علي", "إبراهيم", "محمود", "سعيد", "خالد", "عبدالله", "فتحي",
  "رمضان", "شعبان", "سليمان", "كمال", "طه", "زكي", "فؤاد", "رشاد", "منصور", "جابر",
];

// مُولد أسماء واقعي (مش عشوائي بحت)
const generateStudentName = (index) => {
  const firstName = FIRST_NAMES[index % FIRST_NAMES.length];
  const lastName = LAST_NAMES[(index * 7) % LAST_NAMES.length];
  return `${firstName} ${lastName}`;
};

// توليد طالب واحد
const generateStudent = (id, groupId, index) => {
  const name = generateStudentName(index);
  const email = `student${index + 1}@test.com`;
  const phone = `01${(10000000 + index * 137).toString().slice(0, 9)}`;
  const joinDate = new Date(2024, 8 + (index % 4), (index % 28) + 1).toISOString().split("T")[0];

  // حالة الدفع: 75% دفعوا كامل، 15% دفعوا جزئي، 10% متأخرين
  const paymentStatus = index % 10 === 0 ? "unpaid" : index % 7 === 0 ? "partial" : "paid";

  return {
    id,
    name,
    email,
    phone,
    avatar: name.charAt(0),
    groupId,
    joinedAt: joinDate,
    status: "active", // active | completed | dropped
    paymentStatus, // paid | partial | unpaid
  };
};

// توليد الطلاب لكل جروب حسب عدد enrolled
export const MOCK_STUDENTS = (() => {
  const students = [];
  let studentIndex = 0;

  MOCK_GROUPS.forEach((group) => {
    for (let i = 0; i < group.enrolled; i++) {
      studentIndex++;
      const id = `std_${String(studentIndex).padStart(3, "0")}`;
      students.push(generateStudent(id, group.id, studentIndex));
    }
  });

  return students;
})();

// ═══════════════════════════════════════════════════════════
//   المدفوعات (Payments) - مشتقة من الطلاب
// ═══════════════════════════════════════════════════════════
export const MOCK_PAYMENTS = MOCK_STUDENTS.map((student, index) => {
  const group = MOCK_GROUPS.find((g) => g.id === student.groupId);
  const coursePrice = group?.price || 1000;

  // حسب حالة الدفع
  const paidAmount =
    student.paymentStatus === "paid"
      ? coursePrice
      : student.paymentStatus === "partial"
      ? Math.round(coursePrice * 0.5) // دفع 50%
      : 0; // لم يدفع

  return {
    id: `pay_${String(index + 1).padStart(3, "0")}`,
    studentId: student.id,
    groupId: student.groupId,
    totalAmount: coursePrice,
    paidAmount,
    dueAmount: coursePrice - paidAmount,
    paidAt: student.paymentStatus === "unpaid" ? null : student.joinedAt,
    status: student.paymentStatus,
  };
});

// ═══════════════════════════════════════════════════════════
//   الفيدباك (Feedback) - تقييمات الطلاب للمدرسين
// ═══════════════════════════════════════════════════════════
export const MOCK_FEEDBACK = (() => {
  const feedbacks = [];
  const sampleComments = [
    "شرح ممتاز ومبسط، استفدت جداً",
    "المدرس متعاون جداً وبيجاوب على كل الأسئلة",
    "الكورس مفيد جداً لكن محتاج وقت أكبر",
    "أسلوب الشرح رائع، أنصح بالكورس",
    "استفدت كتير، شكراً على المجهود",
    "المحتوى عملي جداً ومفيد لسوق العمل",
    "يمكن تحسين التنظيم قليلاً",
    "أفضل كورس أخذته في المجال",
  ];

  MOCK_STUDENTS.forEach((student, index) => {
    // 70% بس من الطلاب يكتبوا feedback
    if (index % 10 < 7) {
      const rating = index % 5 === 0 ? 4 : 5; // أغلبهم 5 نجوم
      feedbacks.push({
        id: `fb_${String(index + 1).padStart(3, "0")}`,
        studentId: student.id,
        instructorId: MOCK_GROUPS.find((g) => g.id === student.groupId)?.instructorId,
        groupId: student.groupId,
        rating,
        comment: sampleComments[index % sampleComments.length],
        createdAt: student.joinedAt,
      });
    }
  });

  return feedbacks;
})();

// ═══════════════════════════════════════════════════════════
//   دوال مساعدة (Helper Functions) - للحسابات
// ═══════════════════════════════════════════════════════════

// جلب المدرسين حسب القسم
export const getInstructorsBySection = (sectionId) =>
  MOCK_INSTRUCTORS.filter((i) => i.sectionId === sectionId);

// جلب الكورسات حسب القسم
export const getCoursesBySection = (sectionId) =>
  MOCK_COURSES.filter((c) => c.sectionId === sectionId);

// جلب الجروبات حسب المدرّس
export const getGroupsByInstructor = (instructorId) =>
  MOCK_GROUPS.filter((g) => g.instructorId === instructorId);

// جلب الجروبات حسب القسم (عبر المدرّس)
export const getGroupsBySection = (sectionId) => {
  const instructorIds = getInstructorsBySection(sectionId).map((i) => i.id);
  return MOCK_GROUPS.filter((g) => instructorIds.includes(g.instructorId));
};

// حساب إجمالي إيرادات جروب
export const getGroupRevenue = (group) => {
  const payments = MOCK_PAYMENTS.filter((p) => p.groupId === group.id);
  return payments.reduce((sum, p) => sum + p.paidAmount, 0);
};

// حساب إجمالي إيرادات مدرّس
export const getInstructorRevenue = (instructorId) => {
  const groups = getGroupsByInstructor(instructorId);
  return groups.reduce((sum, g) => sum + getGroupRevenue(g), 0);
};

// حساب إجمالي إيرادات قسم
export const getSectionRevenue = (sectionId) => {
  const instructors = getInstructorsBySection(sectionId);
  return instructors.reduce((sum, i) => sum + getInstructorRevenue(i.id), 0);
};

// حساب متوسط تقييم مدرّس
export const getInstructorRating = (instructorId) => {
  const feedbacks = MOCK_FEEDBACK.filter((f) => f.instructorId === instructorId);
  if (feedbacks.length === 0) return 0;
  const sum = feedbacks.reduce((s, f) => s + f.rating, 0);
  return Number((sum / feedbacks.length).toFixed(1));
};
// ═══════════════════════════════════════════════════════════
//   دوال إضافية للإحصائيات (Analytics)
// ═══════════════════════════════════════════════════════════

// عدد الطلاب في قسم (عبر الجروبات)
export const getStudentsBySection = (sectionId) => {
  const groups = getGroupsBySection(sectionId);
  const groupIds = groups.map((g) => g.id);
  return MOCK_STUDENTS.filter((s) => groupIds.includes(s.groupId));
};

// ⭐ دالة واحدة تجيب كل الإحصائيات (للمنصة كلها أو قسم معين)
export const getStats = (sectionId = null) => {
  // لو sectionId = null، يبقى General (كل المنصة)
  const instructors = sectionId
    ? getInstructorsBySection(sectionId)
    : MOCK_INSTRUCTORS;

  const courses = sectionId
    ? getCoursesBySection(sectionId)
    : MOCK_COURSES;

  const groups = sectionId
    ? getGroupsBySection(sectionId)
    : MOCK_GROUPS;

  const students = sectionId
    ? getStudentsBySection(sectionId)
    : MOCK_STUDENTS;

  // المدفوعات
  const payments = MOCK_PAYMENTS.filter((p) =>
    groups.some((g) => g.id === p.groupId)
  );

  const collected = payments.reduce((sum, p) => sum + p.paidAmount, 0);
  const pending = payments.reduce((sum, p) => sum + p.dueAmount, 0);

  // التقييم
  const instructorIds = instructors.map((i) => i.id);
  const feedbacks = MOCK_FEEDBACK.filter((f) =>
    instructorIds.includes(f.instructorId)
  );
  const avgRating =
    feedbacks.length > 0
      ? Number(
          (
            feedbacks.reduce((s, f) => s + f.rating, 0) / feedbacks.length
          ).toFixed(1)
        )
      : 0;

  return {
    totalStudents: students.length,
    totalInstructors: instructors.length,
    totalCourses: courses.length,
    totalGroups: groups.length,
    collected,
    pending,
    avgRating,
    instructors,
  };
};
// ═══════════════════════════════════════════════════════════
//   دوال تفاصيل الأستاذ (Instructor Detail Helpers)
// ═══════════════════════════════════════════════════════════

// جلب مدرّس بالـ ID
export const getInstructorById = (instructorId) =>
  MOCK_INSTRUCTORS.find((i) => i.id === instructorId);

// جلب طلاب مدرّس (عبر جروباته)
export const getStudentsByInstructor = (instructorId) => {
  const groups = getGroupsByInstructor(instructorId);
  const groupIds = groups.map((g) => g.id);
  return MOCK_STUDENTS.filter((s) => groupIds.includes(s.groupId));
};

// جلب طلاب جروب معين
export const getStudentsByGroup = (groupId) =>
  MOCK_STUDENTS.filter((s) => s.groupId === groupId);

// جلب الفيدباك الخاص بمدرّس (مرتب من الأحدث للأقدم)
export const getFeedbackByInstructor = (instructorId) => {
  return MOCK_FEEDBACK
    .filter((f) => f.instructorId === instructorId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

// جلب معلومات الطالب بالـ ID (للـ Feedback)
export const getStudentById = (studentId) =>
  MOCK_STUDENTS.find((s) => s.id === studentId);

// حساب إجمالي الطلاب المسجلين في جروب معين (المدفوعين + غير المدفوعين)
export const getGroupCollected = (groupId) => {
  const payments = MOCK_PAYMENTS.filter((p) => p.groupId === groupId);
  return payments.reduce((sum, p) => sum + p.paidAmount, 0);
};