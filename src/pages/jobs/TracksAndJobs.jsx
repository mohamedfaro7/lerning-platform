import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  PlusIcon,
  FolderPlusIcon,
  ChevronRightIcon,
  ArrowRightIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";
import { MOCK_TRACKS } from "../../constants/mockTracks";
import TrackCard from "../../component/common/TracksAndJobs/TrackCard";
import JobCard from "../../component/common/TracksAndJobs/JobCard";
import AddTrackModal from "../../component/common/TracksAndJobs/AddTrackModal";
import AddJobModal from "../../component/common/TracksAndJobs/AddJobModal";

export default function TracksAndJobs() {
  const [searchParams] = useSearchParams();
  const [tracks, setTracks] = useState(MOCK_TRACKS);
  const [selectedTrackId, setSelectedTrackId] = useState(MOCK_TRACKS[0]?.id || null);
  const [showTrackModal, setShowTrackModal] = useState(false);
const [showJobModal, setShowJobModal] = useState(false);
const [editingTrack, setEditingTrack] = useState(null);
const [editingJob, setEditingJob] = useState(null);

  // ⭐ Auto-Select للـ Track و Job من الرابط (من السلايدر)
  useEffect(() => {
    const trackFromUrl = searchParams.get("track");
    const jobFromUrl = searchParams.get("job");

    if (trackFromUrl) {
      setSelectedTrackId(trackFromUrl);
    }
    if (jobFromUrl) {
      // ممكن نعمل Auto-scroll للـ Job بعدين
      console.log("Auto-selecting job:", jobFromUrl);
    }
  }, [searchParams]);

  // المسار المحدد حالياً
  const selectedTrack = useMemo(
    () => tracks.find((t) => t.id === selectedTrackId),
    [tracks, selectedTrackId]
  );
// ═══ إدارة المسارات ═══
const handleAddTrack = () => {
  setEditingTrack(null);
  setShowTrackModal(true);
};

const handleEditTrack = (track) => {
  setEditingTrack(track);
  setShowTrackModal(true);
};

const handleSaveTrack = (data) => {
  if (editingTrack) {
    // تعديل
    setTracks((prev) =>
      prev.map((t) =>
        t.id === editingTrack.id ? { ...t, name: data.name } : t
      )
    );
  } else {
    // إضافة
    const newTrack = {
      id: `track_${Date.now()}`,
      name: data.name,
      createdAt: new Date().toISOString(),
      jobs: [],
    };
    setTracks((prev) => [...prev, newTrack]);
    setSelectedTrackId(newTrack.id); // نحدده فوراً
  }
  setShowTrackModal(false);
  setEditingTrack(null);
};

const handleDeleteTrack = (track) => {
  if (
    !window.confirm(
      `هل أنت متأكد؟ سيتم حذف "${track.name}" و ${track.jobs.length} وظيفة تابعة له.`
    )
  )
    return;
  setTracks((prev) => prev.filter((t) => t.id !== track.id));
  if (selectedTrackId === track.id) {
    setSelectedTrackId(tracks[0]?.id || null);
  }
};

// ═══ إدارة الوظائف ═══
const handleAddJob = () => {
  if (!selectedTrackId) {
    alert("اختر مسار أولاً");
    return;
  }
  setEditingJob(null);
  setShowJobModal(true);
};

const handleEditJob = (job) => {
  setEditingJob(job);
  setShowJobModal(true);
};

const handleSaveJob = (data) => {
  if (!selectedTrackId) return;

  if (editingJob) {
    // تعديل
    setTracks((prev) =>
      prev.map((t) =>
        t.id === selectedTrackId
          ? {
              ...t,
              jobs: t.jobs.map((j) =>
                j.id === editingJob.id ? { ...j, ...data } : j
              ),
            }
          : t
      )
    );
  } else {
    // إضافة
    const newJob = {
      id: `job_${Date.now()}`,
      trackId: selectedTrackId,
      ...data,
      createdAt: new Date().toISOString(),
    };
    setTracks((prev) =>
      prev.map((t) =>
        t.id === selectedTrackId ? { ...t, jobs: [...t.jobs, newJob] } : t
      )
    );
  }
  setShowJobModal(false);
  setEditingJob(null);
};

const handleDeleteJob = (job) => {
  if (!window.confirm(`هل أنت متأكد من حذف "${job.name}"؟`)) return;
  setTracks((prev) =>
    prev.map((t) =>
      t.id === selectedTrackId
        ? { ...t, jobs: t.jobs.filter((j) => j.id !== job.id) }
        : t
    )
  );
};
  

  
   return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4" dir="rtl">
      <div className="mx-auto max-w-7xl">

        {/* ═══ Header ═══ */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-950/50 px-4 py-1.5 text-xs font-semibold text-indigo-300">
            <Squares2X2Icon className="h-4 w-4" />
            إدارة المحتوى
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-black text-white sm:text-3xl">
                إدارة <span className="text-indigo-400">المسارات والوظائف</span>
              </h1>
              <p className="mt-1 text-sm text-slate-400">
                نظّم المسارات الوظيفية وأضف الوظائف المناسبة تحت كل مسار.
              </p>
            </div>
            <button
              onClick={handleAddTrack}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-700"
            >
              <FolderPlusIcon className="h-5 w-5" />
              مسار جديد
            </button>
          </div>
        </div>

        {/* ═══ Split View: Desktop ═══ */}
        <div className="flex flex-col gap-6 lg:flex-row">

          {/* ────── Left Panel: Tracks ────── */}
          <div className="w-full lg:w-1/3 lg:max-w-sm">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-300">
                المسارات ({tracks.length})
              </h2>
            </div>
            <div className="space-y-3">
              {tracks.map((track) => (
                <TrackCard
                  key={track.id}
                  track={track}
                  isSelected={selectedTrackId === track.id}
                  onSelect={setSelectedTrackId}
                  onEdit={handleEditTrack}
                  onDelete={handleDeleteTrack}
                />
              ))}
            </div>
          </div>

          {/* ────── Right Panel: Jobs ────── */}
          <div className="w-full lg:flex-1">
            {selectedTrack ? (
              <motion.div
                key={selectedTrack.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {/* Track Header */}
                <div className="mb-5 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-xl">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-[10px] font-semibold text-slate-500">
                        المسار المحدد
                      </p>
                      <h3 className="mt-1 text-xl font-bold text-white">
                        {selectedTrack.name}
                      </h3>
                      <p className="mt-1 text-xs text-slate-400">
                        {selectedTrack.jobs.length} وظيفة تحت هذا المسار
                      </p>
                    </div>
                    <button
                      onClick={handleAddJob}
                      className="flex items-center gap-2 rounded-xl border border-indigo-500/40 bg-indigo-950/40 px-4 py-2 text-sm font-bold text-indigo-300 transition hover:bg-indigo-950/70"
                    >
                      <PlusIcon className="h-4 w-4" />
                      وظيفة جديدة
                    </button>
                  </div>
                </div>

                {/* Jobs List */}
                {selectedTrack.jobs.length === 0 ? (
                  <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-12 text-center backdrop-blur-xl">
                    <p className="text-slate-400">
                      لا توجد وظائف بعد. اضغط "وظيفة جديدة" للبدء.
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    {selectedTrack.jobs.map((job) => (
                      <JobCard
                        key={job.id}
                        job={job}
                        onEdit={handleEditJob}
                        onDelete={handleDeleteJob}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            ) : (
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-12 text-center backdrop-blur-xl">
                <p className="text-slate-400">
                  اختر مساراً من القائمة على اليمين لعرض وظائفه.
                </p>
              </div>
            )}
          </div>
        </div>

      </div>
      {/* ═══ Modals ═══ */}
<AddTrackModal
  isOpen={showTrackModal}
  onClose={() => {
    setShowTrackModal(false);
    setEditingTrack(null);
  }}
  onSave={handleSaveTrack}
  editingTrack={editingTrack}
/>

<AddJobModal
  isOpen={showJobModal}
  onClose={() => {
    setShowJobModal(false);
    setEditingJob(null);
  }}
  onSave={handleSaveJob}
  editingJob={editingJob}
  trackName={selectedTrack?.name}
/>
    </div>
  );
}