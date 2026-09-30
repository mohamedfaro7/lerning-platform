import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { SECTION_COLORS, CHART_STYLE } from "../../../constants/chartTheme";

const CustomTooltip = ({ active, payload, currencySymbol }) => {
  if (active && payload && payload.length) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-slate-700/60 bg-slate-950/95 px-4 py-3 shadow-2xl backdrop-blur-xl"
        dir="rtl"
      >
        <p className="text-sm font-bold text-white">{payload[0].payload.name}</p>
        <p className="mt-1 text-xs text-slate-400">
          الإيرادات:{" "}
          <span className="font-bold text-emerald-400">
            {payload[0].value.toLocaleString()} {currencySymbol}
          </span>
        </p>
      </motion.div>
    );
  }
  return null;
};

export default function RevenueBarChart({ data, currencySymbol = "ج.م" }) {
  const colors = [SECTION_COLORS.english, SECTION_COLORS.programming];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/80 to-slate-950/80 p-5 backdrop-blur-xl transition-all hover:border-slate-700"
    >
      {/* Animated Glow */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-emerald-500/20 blur-3xl"
      />

      <div className="relative">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">
              الإيرادات حسب القسم
            </h3>
            <p className="mt-0.5 text-xs text-slate-500">
              بالـ {currencySymbol}
            </p>
          </div>
          <motion.div
            whileHover={{ scale: 1.1, rotate: -10 }}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20"
          >
            <span className="text-xs">💰</span>
          </motion.div>
        </div>

        <div className="mt-4 h-64" dir="ltr">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 25, right: 10, left: 0, bottom: 5 }}
            >
              <defs>
                {data.map((entry, index) => (
                  <linearGradient
                    key={index}
                    id={`barGradient${index}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor={colors[index % colors.length]}
                      stopOpacity={1}
                    />
                    <stop
                      offset="100%"
                      stopColor={colors[index % colors.length]}
                      stopOpacity={0.3}
                    />
                  </linearGradient>
                ))}
              </defs>

              <CartesianGrid
                strokeDasharray="4 4"
                stroke={CHART_STYLE.grid}
                vertical={false}
              />
              <XAxis
                dataKey="name"
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
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip
                content={<CustomTooltip currencySymbol={currencySymbol} />}
                cursor={{ fill: "rgba(255,255,255,0.05)" }}
              />
              <Bar
                dataKey="value"
                radius={[12, 12, 0, 0]}
                maxBarSize={70}
                animationBegin={300}
                animationDuration={1400}
                animationEasing="ease-out"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={`url(#barGradient${index})`}
                    style={{
                      filter: `drop-shadow(0 0 12px ${colors[index]}60)`,
                    }}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
}