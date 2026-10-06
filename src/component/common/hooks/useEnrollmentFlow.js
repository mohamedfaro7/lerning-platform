import { useMemo } from "react";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import {
  MOCK_COURSES,
  MOCK_INSTRUCTORS,
  MOCK_GROUPS,
  getInstructorsByCourse,
  getGroupsByInstructorAndCourse,
  getAvailableSpots,
} from "../../../constants/mockLearningData";
import { useAuth } from "../../../context/AuthContext";

// ═══════════════════════════════════════════════════════════
//   Step Constants
// ═══════════════════════════════════════════════════════════
export const FLOW_STEPS = {
  COURSE: 1,
  INSTRUCTORS: 2,
  GROUPS: 3,
  CHECKOUT: 4,
};

export const STEP_NAMES = {
  1: "course",
  2: "instructors",
  3: "groups",
  4: "checkout",
};

// ═══════════════════════════════════════════════════════════
//   Route → Step Detection
// ═══════════════════════════════════════════════════════════
function detectStep(pathname) {
  if (/^\/courses\/[^/]+\/checkout\/[^/]+\/?$/.test(pathname))
    return FLOW_STEPS.CHECKOUT;
  if (/^\/courses\/[^/]+\/instructors\/[^/]+\/groups\/?$/.test(pathname))
    return FLOW_STEPS.GROUPS;
  if (/^\/courses\/[^/]+\/instructors\/?$/.test(pathname))
    return FLOW_STEPS.INSTRUCTORS;
  if (/^\/courses\/[^/]+\/?$/.test(pathname)) return FLOW_STEPS.COURSE;
  return 0;
}

// ═══════════════════════════════════════════════════════════
//   The Hook
// ═══════════════════════════════════════════════════════════
export function useEnrollmentFlow() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
const { isAuthenticated, openAuthModal } = useAuth();

  // ─── 1. Where am I in the flow? ───
  const step = useMemo(
    () => detectStep(location.pathname),
    [location.pathname]
  );

  // ─── 2. Extract IDs (from path AND query) ───
  // ⭐ بيدعم :id (route الحالي) و :courseId (route مستقبلي)
  const courseId = params.id || params.courseId || null;
  const instructorIdFromPath = params.instructorId || null;
  const groupIdFromPath = params.groupId || null;

  // Provisional (tentative) selections live in query params
  const instructorIdFromQuery = searchParams.get("instructor");
  const groupIdFromQuery = searchParams.get("group");

  // Stable dep for useMemo (URLSearchParams is a new instance each render)
  const searchKey = searchParams.toString();

  // ─── 3. Load entities (with smart fallbacks) ───
  const course = useMemo(
    () =>
      courseId ? MOCK_COURSES.find((c) => c.id === courseId) ?? null : null,
    [courseId]
  );

  const group = useMemo(() => {
    const gid = groupIdFromPath || groupIdFromQuery;
    return gid ? MOCK_GROUPS.find((g) => g.id === gid) ?? null : null;
  }, [groupIdFromPath, groupIdFromQuery]);

  // ⭐ Instructor can come from path (step 3) OR inferred from group (step 4)
  const instructorId = instructorIdFromPath || group?.instructorId || null;

  const instructor = useMemo(
    () =>
      instructorId
        ? MOCK_INSTRUCTORS.find((i) => i.id === instructorId) ?? null
        : null,
    [instructorId]
  );

  // ─── 4. Available candidates (for lists) ───
  const availableInstructors = useMemo(
    () => (courseId ? getInstructorsByCourse(courseId) : []),
    [courseId]
  );

  const availableGroups = useMemo(
    () =>
      courseId && instructorId
        ? getGroupsByInstructorAndCourse(instructorId, courseId)
        : [],
    [courseId, instructorId]
  );

  // ─── 5. Validity flags (defensive checks) ───
  const validity = useMemo(() => {
    const courseValid = !!course;

    const instructorValid =
      !!instructor &&
      availableInstructors.some((i) => i.id === instructor.id);

    const groupValid =
      !!group &&
      group.courseId === courseId &&
      (!instructorId || group.instructorId === instructorId);

    const groupAvailable = groupValid && getAvailableSpots(group) > 0;

    return { courseValid, instructorValid, groupValid, groupAvailable };
  }, [course, instructor, group, courseId, instructorId, availableInstructors]);

  // ─── 6. Can the user proceed from current step? ───
  const canProceed = useMemo(() => {
    switch (step) {
      case FLOW_STEPS.COURSE:
        return validity.courseValid;
      case FLOW_STEPS.INSTRUCTORS:
        return !!instructorIdFromQuery;
      case FLOW_STEPS.GROUPS:
        return !!groupIdFromQuery;
      case FLOW_STEPS.CHECKOUT:
        return validity.groupAvailable;
      default:
        return false;
    }
  }, [step, validity, instructorIdFromQuery, groupIdFromQuery]);

  // ─── 7. Actions (memoized on URL state) ───
  const actions = useMemo(() => {
    const go = (path) => navigate(path);

    return {
      // ⭐ Forward navigation
      goToInstructors() {
        if (!courseId) return;
        go(`/courses/${courseId}/instructors`);
      },

      goToGroups(explicitInstructorId) {
        const id = explicitInstructorId || instructorIdFromQuery;
        if (!courseId || !id) return;
        go(`/courses/${courseId}/instructors/${id}/groups`);
      },

      goToCheckout(explicitGroupId) {
        const id = explicitGroupId || groupIdFromQuery;
        if (!courseId || !id) return;
        go(`/courses/${courseId}/checkout/${id}`);
      },

      goToDashboard() {
        go("/student/dashboard");
      },

      // ⭐ Smart back (step-aware, NOT browser -1)
      back() {
        switch (step) {
          case FLOW_STEPS.INSTRUCTORS:
            go(`/courses/${courseId}`);
            break;
          case FLOW_STEPS.GROUPS:
            go(`/courses/${courseId}/instructors`);
            break;
          case FLOW_STEPS.CHECKOUT:
            if (instructorId) {
              go(`/courses/${courseId}/instructors/${instructorId}/groups`);
            } else {
              go(`/courses/${courseId}/instructors`);
            }
            break;
          default:
            navigate(-1);
        }
      },

      // ⭐ Provisional selection (updates query params, replace history)
      selectInstructor(id) {
        const next = new URLSearchParams(searchKey);
        if (next.get("instructor") === id) {
          next.delete("instructor"); // toggle off
        } else {
          next.set("instructor", id);
        }
        setSearchParams(next, { replace: true });
      },

      selectGroup(id) {
        const next = new URLSearchParams(searchKey);
        if (next.get("group") === id) {
          next.delete("group"); // toggle off
        } else {
          next.set("group", id);
        }
        setSearchParams(next, { replace: true });
      },

      clearSelection() {
        setSearchParams({}, { replace: true });
      },
    };
  }, [
    courseId,
    instructorId,
    instructorIdFromQuery,
    groupIdFromQuery,
    step,
    searchKey,
    navigate,
    setSearchParams,
  ]);

  // ─── 8. Auth helper (returns true if OK, false if redirected) ───
  const requireAuth = useMemo(
  () => () => {
    if (isAuthenticated) return true;
    openAuthModal();
    return false;
  },
  [isAuthenticated, openAuthModal]
);

  // ─── 9. Return everything ───
  return {
    // ── WHERE ──
    step,
    stepName: STEP_NAMES[step] || "unknown",
    isStep: (n) => step === n,

    // ── WHAT (committed) ──
    courseId,
    instructorId,
    groupId: groupIdFromPath || groupIdFromQuery,

    // ── WHAT (provisional — for highlighting) ──
    provisionalInstructorId: instructorIdFromQuery,
    provisionalGroupId: groupIdFromQuery,

    // ── ENTITIES ──
    course,
    instructor,
    group,

    // ── CANDIDATES ──
    availableInstructors,
    availableGroups,

    // ── FLAGS ──
    validity,
    canProceed,
    isAuthenticated,

    // ── ACTIONS ──
    ...actions,

    // ── AUTH ──
    requireAuth,
  };
}