"use client";

import { motion } from "framer-motion";

interface TrendItem {
  rank: number;
  keyword: string;
  category: string;
  change: "up" | "down" | "new" | "same";
  count: string;
}

const trendingData: TrendItem[] = [
  { rank: 1, keyword: "HBM4 양산", category: "반도체", change: "new", count: "12.4K" },
  { rank: 2, keyword: "Fed 금리 동결", category: "글로벌", change: "up", count: "9.8K" },
  { rank: 3, keyword: "가상자산 과세 유예", category: "규제", change: "new", count: "8.2K" },
  { rank: 4, keyword: "강남 아파트 상승", category: "부동산", change: "same", count: "6.5K" },
  { rank: 5, keyword: "솔라나 DEX", category: "코인", change: "up", count: "5.1K" },
];

const changeIcons = {
  up: "🔺",
  down: "🔻",
  new: "🆕",
  same: "➖",
};

export default function TrendingSection() {
  return (
    <section className="glass rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-bold flex items-center gap-1.5">
          🔥 실시간 트렌딩
        </h2>
        <span className="text-[9px] text-[var(--color-text-dim)] animate-pulse-live flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-success)]" />
          LIVE
        </span>
      </div>

      <div className="flex flex-col gap-1">
        {trendingData.map((item, i) => (
          <motion.div
            key={item.rank}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ x: 4, backgroundColor: "rgba(108, 92, 231, 0.05)" }}
            className="flex items-center gap-3 py-2 px-2 rounded-lg cursor-pointer transition-colors"
          >
            <span
              className={`w-5 text-xs font-black tabular-nums ${
                item.rank <= 3 ? "text-[var(--color-accent-warm)]" : "text-[var(--color-text-dim)]"
              }`}
            >
              {item.rank}
            </span>
            <span className="text-[10px]">{changeIcons[item.change]}</span>
            <span className="text-sm font-medium flex-1">{item.keyword}</span>
            <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-[var(--color-surface)] text-[var(--color-text-muted)]">
              {item.category}
            </span>
            <span className="text-[10px] text-[var(--color-text-dim)] tabular-nums w-10 text-right">
              {item.count}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
