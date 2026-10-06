import { useMemo, useState, useEffect, useCallback } from "react";
import {
  MOCK_COURSES,
  MOCK_INSTRUCTORS,
  MOCK_GROUPS,
} from "../../../constants/mockLearningData";

const STORAGE_KEY = "my_enrollments_v1";

// ═══════════════════════════════════════════════════════════
//   Enrichment — ربط enrollment ببيانات الكورس/المدرّس/الجروب
// ═══════════════════════════════════════════════════════════
function enrichEnrollment(enr) {
  const course = MOCK_COURSES.find((c) => c.id === enr.courseId);
  const group = MOCK_GROUPS.find((g) => g.id === enr.groupId);
  if (!course || !group) return null;

  const instructor = MOCK_INSTRUCTORS.find((i) => i.id === group.instructorId) || null;

  return {
    ...enr,
    course,
    group,
    instructor,
  };
}

// ═══════════════════════════════════════════════════════════
//   Seed demo (أول مرة فقط)
// ═══════════════════════════════════════════════════════════
function seedDemoEnrollments() {
  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;

  return [
    {
      id: "enr_demo_001",
      courseId: "course_001",
      groupId: "grp_001",
      enrolledAt: new Date(now - 5 * day).toISOString(),
      paymentPlan: "full",
      status: "active",
    },
    {
      id: "enr_demo_002",
      courseId: "course_006",
      groupId: "grp_011",
      enrolledAt: new Date(now - 3 * day).toISOString(),
      paymentPlan: "installments",
      status: "active",
    },
    {
      id: "enr_demo_003",
      courseId: "course_005",
      groupId: "grp_010",
      enrolledAt: new Date(now - 1 * day).toISOString(),
      paymentPlan: "full",
      status: "active",
    },
  ];
}

// ═══════════════════════════════════════════════════════════
//   The Hook
// ═══════════════════════════════════════════════════════════
export function useMyEnrollments() {
  const [raw, setRaw] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : seedDemoEnrollments();
    } catch {
      return seedDemoEnrollments();
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(raw));
    } catch {
      /* quota or private mode — silently ignore */
    }
  }, [raw]);

  // ⭐ إثراء + فلترة
  const enrollments = useMemo(
    () => raw.map(enrichEnrollment).filter(Boolean),
    [raw]
  );

  // ⭐ تصنيف حسب الحالة
  const categorized = useMemo(() => {
    const active = [];
    const upcoming = [];
    const completed = [];

    for (const enr of enrollments) {
      const s = enr.group.status;
      if (s === "active") active.push(enr);
      else if (s === "upcoming" || s === "starting_soon") upcoming.push(enr);
      else if (s === "completed") completed.push(enr);
      else active.push(enr);
    }

    return { active, upcoming, completed };
  }, [enrollments]);

  // ⭐ حساب الجلسة القادمة
  const upcomingSessions = useMemo(() => {
    const sessions = [];
    const today = new Date();
    const dayNames = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];

    for (const enr of enrollments) {
      if (!enr.group.days?.length) continue;

      for (const dayName of enr.group.days) {
        const targetDay = dayNames.indexOf(dayName);
        if (targetDay === -1) continue;

        const diff = (targetDay - today.getDay() + 7) % 7;
        const sessionDate = new Date(today);
        sessionDate.setDate(today.getDate() + diff);

        sessions.push({
          id: `${enr.id}_${dayName}`,
          course: enr.course,
          group: enr.group,
          instructor: enr.instructor,
          dayName,
          date: sessionDate,
          startTime: enr.group.startTime,
          endTime: enr.group.endTime,
          isToday: diff === 0,
        });
      }
    }

    return sessions
      .sort((a, b) => a.date - b.date)
      .slice(0, 5);
  }, [enrollments]);

  // ⭐ Actions
  const addEnrollment = useCallback((data) => {
    const enrollment = {
      id: `enr_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      courseId: data.courseId,
      groupId: data.groupId,
      enrolledAt: new Date().toISOString(),
      paymentPlan: data.paymentPlan || "full",
      paymentMethod: data.paymentMethod || "card",
      amountPaid: data.amountPaid || 0,
      status: "active",
    };
    setRaw((prev) => [...prev, enrollment]);
    return enrollment.id;
  }, []);

  const removeEnrollment = useCallback((id) => {
    setRaw((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setRaw([]);
  }, []);

  // ⭐ KPIs
  const stats = useMemo(() => {
    const totalSpent = enrollments.reduce(
      (sum, e) => sum + (e.amountPaid || e.group.price || 0),
      0
    );
    return {
      totalCourses: enrollments.length,
      activeGroups: categorized.active.length,
      upcomingSessions: upcomingSessions.length,
      totalSpent,
    };
  }, [enrollments, categorized, upcomingSessions]);

  return {
    enrollments,
    categorized,
    upcomingSessions,
    stats,
    addEnrollment,
    removeEnrollment,
    clearAll,
  };
}