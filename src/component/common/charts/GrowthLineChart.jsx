import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { CHART_COLORS, CHART_STYLE } from "../../../constants/chartTheme";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-xl border border-slate-700/60 bg-slate-950/95 px-4 py-3 shadow-2xl backdrop-blur-xl"
        dir="rtl"
      >
        <p className="text-sm font-bold text-white">{label}</p>
        <p className="mt-1 text-xs text-slate-400">
          الطلاب الجدد:{" "}
          <span className="font-bold text-indigo-400">
            {payload[0].value}
          </span>
        </p>
      </motion.div>
    );
  }
  return null;
};

export default function GrowthLineChart({ data }) {
  const totalGrowth = data[data.length - 1]?.students || 0;
  const growthPercent =
    data.length > 1
      ? (
          ((data[data.length - 1].students - data[0].students) /
            data[0].students) *
          100
        ).toFixed(0)
      : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/80 to-slate-950/80 p-5 backdrop-blur-xl transition-all hover:border-slate-700"
    >
      {/* Animated Glow */}
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-purple-500/20 blur-3xl"
      />

      <div className="relative">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">
              نمو الطلاب خلال الأشهر
            </h3>
            <p className="mt-0.5 text-xs text-slate-500">آخر ٥ شهور</p>
          </div>
          <div className="flex items-center gap-2">
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.5, type: "spring" }}
              className="rounded-lg bg-emerald-500/20 px-2.5 py-1 text-xs font-bold text-emerald-400"
            >
              ↑ {growthPercent}%
            </motion.span>
            <motion.div
              whileHover={{ scale: 1.1, rotate: 10 }}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/20"
            >
              <span className="text-xs">📈</span>
            </motion.div>
          </div>
        </div>

        <div className="mt-4 h-64" dir="ltr">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
            >
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor={CHART_COLORS.primary}
                    stopOpacity={0.7}
                  />
                  <stop
                    offset="100%"
                    stopColor={CHART_COLORS.primary}
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="4 4"
                stroke={CHART_STYLE.grid}
                vertical={false}
              />
              <XAxis
                dataKey="month"
                stroke={CHART_STYLE.text}
                tick={{ fontSize: 12, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                stroke={CHART_STYLE.text}
                tick={{ fontSize: 11, fill: "#64748b" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="students"
                stroke={CHART_COLORS.primary}
                strokeWidth={3}
                fill="url(#areaGradient)"
                animationBegin={400}
                animationDuration={1800}
                animationEasing="ease-out"
                dot={{
                  fill: CHART_COLORS.primary,
                  r: 5,
                  strokeWidth: 2,
                  stroke: "#0f172a",
                }}
                activeDot={{
                  r: 8,
                  fill: CHART_COLORS.primary,
                  stroke: "#fff",
                  strokeWidth: 2,
                  style: { filter: "drop-shadow(0 0 12px #6366f1)" },
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
}