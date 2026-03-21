"use client";

import { motion } from "framer-motion";
import { MarketItem, formatPrice, formatChange } from "@/data/mock";

interface MarketCardProps {
  item: MarketItem;
  index: number;
}

function MiniChart({ data, isUp }: { data: number[]; isUp: boolean }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const width = 80;
  const height = 32;
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((v - min) / range) * height;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
      <defs>
        <linearGradient id={`grad-${isUp}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={isUp ? "#00b894" : "#ff6b6b"} stopOpacity={0.3} />
          <stop offset="100%" stopColor={isUp ? "#00b894" : "#ff6b6b"} stopOpacity={0} />
        </linearGradient>
      </defs>
      <polygon
        points={`0,${height} ${points} ${width},${height}`}
        fill={`url(#grad-${isUp})`}
      />
      <polyline
        points={points}
        fill="none"
        stroke={isUp ? "#00b894" : "#ff6b6b"}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function MarketCard({ item, index }: MarketCardProps) {
  const isUp = item.change >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className="glass rounded-2xl p-4 cursor-pointer hover:border-[var(--color-primary)] transition-all group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl">{item.icon}</span>
          <div>
            <h3 className="font-semibold text-sm group-hover:text-[var(--color-primary-light)] transition-colors">
              {item.name}
            </h3>
            <p className="text-[10px] text-[var(--color-text-dim)]">{item.symbol}</p>
          </div>
        </div>
        <MiniChart data={item.sparkline} isUp={isUp} />
      </div>

      <div className="flex items-end justify-between">
        <div>
          <p className="text-lg font-bold tabular-nums">
            {item.category === "crypto" ? "₩" : item.category === "stock" ? "₩" : ""}
            {formatPrice(item.price, item.category)}
            {item.category === "stock" ? "" : ""}
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            <span
              className={`text-xs font-semibold ${isUp ? "text-[var(--color-up)]" : "text-[var(--color-down)]"}`}
            >
              {formatChange(item.change, item.category)}
            </span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-md font-medium ${
                isUp
                  ? "bg-[var(--color-up)]/10 text-[var(--color-up)]"
                  : "bg-[var(--color-down)]/10 text-[var(--color-down)]"
              }`}
            >
              {isUp ? "▲" : "▼"} {Math.abs(item.changePercent).toFixed(2)}%
            </span>
          </div>
        </div>
        <p className="text-[10px] text-[var(--color-text-dim)]">
          거래량 {item.volume}
        </p>
      </div>
    </motion.div>
  );
}
