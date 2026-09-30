import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Sector,
} from "recharts";
import { SECTION_COLORS } from "../../../constants/chartTheme";

// ⭐ Shape مخصص للـ Hover (يبرز الشريحة)
const renderActiveShape = (props) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 8}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        style={{ filter: `drop-shadow(0 0 12px ${fill})` }}
      />
    </g>
  );
};

// ⭐ Counter للرقم المركزي
function AnimatedNumber({ value }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const stepValue = value / steps;
    let current = 0;

    const interval = setInterval(() => {
      current += stepValue;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(interval);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(interval);
  }, [value]);

  return <span>{displayValue}</span>;
}

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const total = payload[0].payload.total;
    const value = payload[0].value;
    const percent = ((value / total) * 100).toFixed(1);

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-xl border border-slate-700/60 bg-slate-950/95 px-4 py-3 shadow-2xl backdrop-blur-xl"
        dir="rtl"
      >
        <p className="text-sm font-bold text-white">{payload[0].name}</p>
        <p className="mt-1 text-xs text-slate-400">
          {value} طالب
          <span className="mx-2 text-slate-600">•</span>
          <span className="font-bold text-indigo-400">{percent}%</span>
        </p>
      </motion.div>
    );
  }
  return null;
};

export default function StudentsDonutChart({ data }) {
  const [activeIndex, setActiveIndex] = useState(-1);

  const total = data.reduce((sum, d) => sum + d.value, 0);
  const dataWithTotal = data.map((d) => ({ ...d, total }));
  const colors = [SECTION_COLORS.english, SECTION_COLORS.programming];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/80 to-slate-950/80 p-5 backdrop-blur-xl transition-all hover:border-slate-700"
    >
      {/* Glow Effect */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-20 -left-20 h-40 w-40 rounded-full bg-indigo-500/20 blur-3xl"
      />

      <div className="relative">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">
              توزيع الطلاب حسب القسم
            </h3>
            <p className="mt-0.5 text-xs text-slate-500">
              إجمالي {total} طالب
            </p>
          </div>
          <motion.div
            whileHover={{ scale: 1.1, rotate: 10 }}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/20"
          >
            <span className="text-xs">👥</span>
          </motion.div>
        </div>

        {/* Chart Container */}
        <div className="relative mt-4 h-64" dir="ltr">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={dataWithTotal}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={3}
                stroke="none"
                animationBegin={200}
                animationDuration={1400}
                animationEasing="ease-out"
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                onMouseEnter={(_, index) => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(-1)}
              >
                {dataWithTotal.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={colors[index % colors.length]}
                    style={{
                      filter: "drop-shadow(0 0 8px rgba(99, 102, 241, 0.3))",
                      cursor: "pointer",
                    }}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>

          {/* ⭐ Central Number */}
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <motion.p
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
              className="text-3xl font-black text-white"
            >
              <AnimatedNumber value={total} />
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="text-[10px] font-medium text-slate-500"
            >
              إجمالي الطلاب
            </motion.p>
          </div>
        </div>

        {/* Legend - Fade in staggered */}
        <div className="mt-2 flex items-center justify-center gap-6">
          {data.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 + index * 0.15 }}
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 cursor-pointer"
            >
              <motion.div
                animate={{
                  boxShadow: [
                    `0 0 8px ${colors[index]}40`,
                    `0 0 12px ${colors[index]}80`,
                    `0 0 8px ${colors[index]}40`,
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: colors[index] }}
              />
              <span className="text-xs text-slate-400">{item.name}</span>
              <span className="text-xs font-bold text-white">{item.value}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}