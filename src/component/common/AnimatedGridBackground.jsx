import { useRef, useEffect, useCallback } from "react";
import { useTheme } from "../../context/ThemeContext";

export default function AnimatedGridBackground() {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const smoothMouseRef = useRef({ x: 0.5, y: 0.5 });
  const animRef = useRef(null);
  const { theme } = useTheme();

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let cw, ch, dpr;
    const resize = () => {
      dpr = window.devicePixelRatio || 1;
      cw = window.innerWidth;
      ch = window.innerHeight;
      canvas.width = cw * dpr;
      canvas.height = ch * dpr;
      canvas.style.width = cw + "px";
      canvas.style.height = ch + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const noise = (x, y, t) => {
      const s1 = Math.sin(x * 0.015 + t * 0.8) * Math.cos(y * 0.012 + t * 0.6);
      const s2 = Math.sin(x * 0.008 - t * 0.5 + y * 0.01) * 0.7;
      const s3 = Math.cos(x * 0.01 + y * 0.015 + t * 1.1) * 0.5;
      const s4 = Math.sin((x + y) * 0.005 + t * 0.4) * 0.8;
      const s5 = Math.cos(x * 0.02 - t * 1.3) * Math.sin(y * 0.018 + t * 0.9) * 0.4;
      return (s1 + s2 + s3 + s4 + s5) / 3.4;
    };

    let time = 0;

    const animate = () => {
      time += 0.015;
      cw = window.innerWidth;
      ch = window.innerHeight;

      const sm = smoothMouseRef.current;
      const tm = mouseRef.current;
      sm.x += (tm.x - sm.x) * 0.04;
      sm.y += (tm.y - sm.y) * 0.04;
      const mx = sm.x * cw;
      const my = sm.y * ch;

      ctx.clearRect(0, 0, cw, ch);

      const isDark = document.documentElement.getAttribute("data-theme") === "dark";

      const layers = isDark
        ? [
            { rows: 18, cols: 30, speedA: 0.6, speedB: 0.4, amp: 40, alpha: 0.08, color: [70, 140, 255] },
            { rows: 25, cols: 40, speedA: 0.9, speedB: 0.7, amp: 28, alpha: 0.06, color: [90, 160, 255] },
            { rows: 35, cols: 55, speedA: 1.3, speedB: 1.0, amp: 18, alpha: 0.04, color: [100, 170, 255] },
            { rows: 12, cols: 20, speedA: 0.3, speedB: 0.2, amp: 55, alpha: 0.05, color: [60, 120, 220] },
          ]
        : [
            { rows: 18, cols: 30, speedA: 0.6, speedB: 0.4, amp: 40, alpha: 0.12, color: [59, 130, 246] },
            { rows: 25, cols: 40, speedA: 0.9, speedB: 0.7, amp: 28, alpha: 0.09, color: [99, 102, 241] },
            { rows: 35, cols: 55, speedA: 1.3, speedB: 1.0, amp: 18, alpha: 0.07, color: [139, 92, 246] },
            { rows: 12, cols: 20, speedA: 0.3, speedB: 0.2, amp: 55, alpha: 0.08, color: [14, 165, 233] },
          ];

      const particleColor = isDark ? [70, 140, 255] : [59, 130, 246];
      const mouseGlowAlpha = isDark ? 0.07 : 0.05;

      for (const layer of layers) {
        const { rows, cols, speedA, speedB, amp, alpha, color } = layer;

        for (let row = 0; row < rows; row++) {
          ctx.beginPath();
          const yBase = (row / (rows - 1)) * ch;

          for (let col = 0; col <= cols; col++) {
            const xBase = (col / cols) * cw;
            const n1 = noise(xBase, yBase, time * speedA);
            const n2 = noise(xBase * 1.5, yBase * 1.5, time * speedB + 100);
            const dx = xBase - mx;
            const dy = yBase - my;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const mouseDist = Math.max(0, 1 - dist / 350);
            const mouseWave = Math.sin(dist * 0.02 - time * 3) * mouseDist * 25;
            const yOff = n1 * amp + n2 * amp * 0.5 + mouseWave;
            if (col === 0) ctx.moveTo(xBase, yBase + yOff);
            else ctx.lineTo(xBase, yBase + yOff);
          }
          const rowDist = Math.abs(yBase - my);
          const boost = isDark ? 0.06 : 0.04;
          const a = alpha + Math.max(0, boost - (rowDist / ch) * boost);
          ctx.strokeStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${a})`;
          ctx.lineWidth = isDark ? 0.8 : 1.0;
          ctx.stroke();
        }

        for (let col = 0; col < cols; col++) {
          ctx.beginPath();
          const xBase = (col / (cols - 1)) * cw;
          for (let row = 0; row <= rows; row++) {
            const yBase = (row / rows) * ch;
            const n1 = noise(xBase, yBase, time * speedA);
            const n2 = noise(xBase * 1.5, yBase * 1.5, time * speedB + 200);
            const dx = xBase - mx;
            const dy = yBase - my;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const mouseDist = Math.max(0, 1 - dist / 350);
            const mouseWave = Math.sin(dist * 0.02 - time * 3) * mouseDist * 25;
            const xOff = n1 * amp * 0.7 + n2 * amp * 0.3 + mouseWave * 0.7;
            if (row === 0) ctx.moveTo(xBase + xOff, yBase);
            else ctx.lineTo(xBase + xOff, yBase);
          }
          const colDist = Math.abs(xBase - mx);
          const boost = isDark ? 0.04 : 0.03;
          const a = alpha * 0.8 + Math.max(0, boost - (colDist / cw) * boost);
          ctx.strokeStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${a})`;
          ctx.lineWidth = isDark ? 0.6 : 0.8;
          ctx.stroke();
        }
      }

      const particleCount = isDark ? 80 : 50;
      for (let i = 0; i < particleCount; i++) {
        const seed = i * 137.508;
        const px = ((seed * 0.1 + time * 15) % cw);
        const py = ((seed * 0.17 + time * 10 + noise(px, 0, time) * 80) % ch);
        const dx = px - mx;
        const dy = py - my;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 200) {
          const a = (1 - dist / 200) * (isDark ? 0.5 : 0.25);
          const pulse = Math.sin(time * 2 + i) * 0.3 + 0.7;
          const size = 1.5 + (1 - dist / 200) * 2;

          ctx.beginPath();
          ctx.arc(px, py, size * pulse, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${particleColor[0]}, ${particleColor[1]}, ${particleColor[2]}, ${a * pulse})`;
          ctx.fill();

          const g = ctx.createRadialGradient(px, py, 0, px, py, size * 5);
          g.addColorStop(0, `rgba(${particleColor[0]}, ${particleColor[1]}, ${particleColor[2]}, ${a * 0.2 * pulse})`);
          g.addColorStop(1, `rgba(${particleColor[0]}, ${particleColor[1]}, ${particleColor[2]}, 0)`);
          ctx.fillStyle = g;
          ctx.fillRect(px - size * 5, py - size * 5, size * 10, size * 10);
        }
      }

      const grad = ctx.createRadialGradient(mx, my, 0, mx, my, 350);
      grad.addColorStop(0, `rgba(60, 130, 246, ${mouseGlowAlpha})`);
      grad.addColorStop(0.4, `rgba(60, 130, 246, ${mouseGlowAlpha * 0.4})`);
      grad.addColorStop(1, "rgba(60, 130, 246, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, cw, ch);

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);

    const handleMouseMove = (e) => {
      mouseRef.current.x = e.clientX / window.innerWidth;
      mouseRef.current.y = e.clientY / window.innerHeight;
    };
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useEffect(() => {
    const cleanup = draw();
    return cleanup;
  }, [draw]);

  const isDark = theme === "dark";

  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ background: "transparent" }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isDark
            ? "radial-gradient(ellipse at center, transparent 20%, #0a0a0a 85%)"
            : "radial-gradient(ellipse at center, transparent 30%, rgba(248,250,252,0.5) 90%)",
        }}
      />
    </div>
  );
}
