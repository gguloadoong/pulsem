"use client";

import { motion } from "framer-motion";
import { marketData } from "@/data/mock";

export default function MarketTicker() {
  const items = [...marketData, ...marketData];

  return (
    <div className="overflow-hidden py-3 border-b border-[var(--color-border)]">
      <motion.div
        className="flex gap-6 whitespace-nowrap"
        animate={{ x: [0, -1200] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      >
        {items.map((item, i) => {
          const isUp = item.change >= 0;
          return (
            <div key={`${item.id}-${i}`} className="flex items-center gap-2 shrink-0">
              <span className="text-xs">{item.icon}</span>
              <span className="text-xs font-medium text-[var(--color-text-muted)]">{item.symbol}</span>
              <span
                className={`text-xs font-bold tabular-nums ${
                  isUp ? "text-[var(--color-up)]" : "text-[var(--color-down)]"
                }`}
              >
                {isUp ? "▲" : "▼"} {Math.abs(item.changePercent).toFixed(2)}%
              </span>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}
