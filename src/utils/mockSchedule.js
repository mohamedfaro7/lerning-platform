export const MOCK_SCHEDULE = [
  {
    id: 1,
    title: "مقدمة في React Hooks",
    course: "تطوير واجهات المستخدم",
    time: "05:00 PM - 06:30 PM",
    date: "2026-08-26",
    type: "live",
    location: "القاعة الافتراضية #1",
    status: "upcoming",
  },
  {
    id: 2,
    title: "مراجعة مشاريع الطلاب",
    course: "تطوير واجهات المستخدم",
    time: "07:00 PM - 08:00 PM",
    date: "2026-08-26",
    type: "review",
    location: "مكالمة فيديو",
    status: "upcoming",
  },
  {
    id: 3,
    title: "دورة Async/Await المتقدمة",
    course: "أساسيات JavaScript",
    time: "10:00 AM - 11:30 AM",
    date: "2026-08-27",
    type: "live",
    location: "القاعة الافتراضية #2",
    status: "upcoming",
  },
  {
    id: 4,
    title: "حل مشاكل الطلاب الفردية",
    course: "تطوير واجهات المستخدم",
    time: "02:00 PM - 03:00 PM",
    date: "2026-08-28",
    type: "consultation",
    location: "مكالمة فردية",
    status: "upcoming",
  },
];

export const AVAILABLE_REPLACEMENT_DAYS = [
  { id: 1, date: "2026-08-29", day: "السبت", slots: ["10:00 AM", "02:00 PM", "05:00 PM"] },
  { id: 2, date: "2026-08-30", day: "الأحد", slots: ["10:00 AM", "03:00 PM"] },
  { id: 3, date: "2026-08-31", day: "الاثنين", slots: ["11:00 AM", "04:00 PM", "06:00 PM"] },
];
