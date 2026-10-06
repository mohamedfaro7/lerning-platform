import { useMemo } from "react";
import {
  MOCK_COURSES,
  getInstructorsByCourse,
  getGroupsByInstructorAndCourse,
} from "../constants/mockLearningData";

export function useCourseInstructors(courseId) {
  return useMemo(() => {
    const course = MOCK_COURSES.find((c) => c.id === courseId);
    if (!course) return { course: null, instructors: [] };

    const instructors = getInstructorsByCourse(courseId).map((inst) => {
      const groups = getGroupsByInstructorAndCourse(inst.id, courseId);
      const totalStudents = groups.reduce((sum, g) => sum + g.enrolled, 0);
      const availableSpots = groups.reduce(
        (sum, g) => sum + Math.max(0, g.capacity - g.enrolled),
        0
      );
      return {
        ...inst,
        groups,
        totalStudents,
        availableSpots,
        hasAvailableSpots: availableSpots > 0,
      };
    });

    return { course, instructors };
  }, [courseId]);
}