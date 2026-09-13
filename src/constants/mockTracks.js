// وحدات المدة الزمنية المتاحة
export const DURATION_UNITS = [
  { id: "days", label: "يوم", shortLabel: "يوم" },
  { id: "weeks", label: "أسبوع", shortLabel: "أسبوع" },
  { id: "months", label: "شهر", shortLabel: "شهر" },
];

// ⭐ البيانات الوهمية: Array of Objects (Tracks) - كل Track فيه Array of Jobs
export const MOCK_TRACKS = [
  {
    id: "track_001",
    name: "Full Stack Developer",
    createdAt: "2025-03-15",
    jobs: [
      {
        id: "job_001",
        name: "Frontend Developer",
        trackId: "track_001",
        details: "تطوير واجهات المستخدم باستخدام React.js و Tailwind CSS. خبرة في إدارة الحالة (Context API، Redux) والتعامل مع الـ APIs.",
        experienceYears: 3,
        skills: ["React", "JavaScript", "HTML", "CSS", "Tailwind", "REST APIs"],
        duration: { value: 30, unit: "days" },
        createdAt: "2025-03-15",
      },
      {
        id: "job_002",
        name: "Backend Developer",
        trackId: "track_001",
        details: "تطوير الـ APIs وخدمات الويب باستخدام Node.js و Express، وإدارة قواعد البيانات MongoDB و PostgreSQL.",
        experienceYears: 4,
        skills: ["Node.js", "Express", "MongoDB", "PostgreSQL", "REST APIs", "JWT"],
        duration: { value: 6, unit: "weeks" },
        createdAt: "2025-03-15",
      },
      {
        id: "job_003",
        name: "DevOps Engineer",
        trackId: "track_001",
        details: "إدارة البنية التحتية، CI/CD، والنشر على السحابة باستخدام Docker و Kubernetes.",
        experienceYears: 5,
        skills: ["Docker", "Kubernetes", "AWS", "CI/CD", "Linux"],
        duration: { value: 2, unit: "months" },
        createdAt: "2025-03-15",
      },
    ],
  },
  {
    id: "track_002",
    name: "Data Science & AI",
    createdAt: "2025-03-12",
    jobs: [
      {
        id: "job_004",
        name: "Machine Learning Engineer",
        trackId: "track_002",
        details: "بناء وتدريب نماذج تعلم الآلة باستخدام Python و TensorFlow، وتحسين الأداء والدقة.",
        experienceYears: 4,
        skills: ["Python", "TensorFlow", "PyTorch", "Pandas", "NumPy", "Scikit-learn"],
        duration: { value: 45, unit: "days" },
        createdAt: "2025-03-12",
      },
      {
        id: "job_005",
        name: "Data Analyst",
        trackId: "track_002",
        details: "تحليل البيانات الضخمة واستخراج الرؤى باستخدام SQL و Power BI وإعداد التقارير.",
        experienceYears: 2,
        skills: ["SQL", "Power BI", "Excel", "Python", "Tableau"],
        duration: { value: 3, unit: "weeks" },
        createdAt: "2025-03-12",
      },
    ],
  },
  {
    id: "track_003",
    name: "UI/UX Design",
    createdAt: "2025-03-10",
    jobs: [
      {
        id: "job_006",
        name: "Product Designer",
        trackId: "track_003",
        details: "تصميم تجربة المستخدم وواجهات المنتج باستخدام Figma، وإجراء اختبارات الاستخدام.",
        experienceYears: 3,
        skills: ["Figma", "Adobe XD", "Prototyping", "User Research", "Wireframing"],
        duration: { value: 4, unit: "weeks" },
        createdAt: "2025-03-10",
      },
    ],
  },
];