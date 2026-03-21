"use client";

import { motion } from "framer-motion";
import { NewsItem } from "@/data/mock";

const impactConfig = {
  high: { label: "HIGH", color: "text-[var(--color-danger)]", bg: "bg-[var(--color-danger)]/10", dot: "bg-[var(--color-danger)]" },
  medium: { label: "MID", color: "text-[var(--color-accent-warm)]", bg: "bg-[var(--color-accent-warm)]/10", dot: "bg-[var(--color-accent-warm)]" },
  low: { label: "LOW", color: "text-[var(--color-text-dim)]", bg: "bg-[var(--color-surface)]", dot: "bg-[var(--color-text-dim)]" },
};

const categoryConfig = {
  regulation: { label: "규제", icon: "⚖️", color: "text-[var(--color-accent-warm)]" },
  market: { label: "시장", icon: "📊", color: "text-[var(--color-accent)]" },
  analysis: { label: "분석", icon: "🔬", color: "text-[var(--color-primary-light)]" },
  breaking: { label: "속보", icon: "⚡", color: "text-[var(--color-danger)]" },
};

interface NewsCardProps {
  item: NewsItem;
  index: number;
}

export default function NewsCard({ item, index }: NewsCardProps) {
  const impact = impactConfig[item.impact];
  const category = categoryConfig[item.category];

  return (
    <motion.article
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      whileHover={{ x: 4 }}
      className="glass rounded-2xl p-4 cursor-pointer hover:border-[var(--color-primary)] transition-all group"
    >
      <div className="flex items-start gap-3">
        {/* Impact indicator */}
        <div className="flex flex-col items-center gap-1 pt-0.5">
          <div className={`w-2 h-2 rounded-full ${impact.dot} ${item.impact === "high" ? "animate-pulse-live" : ""}`} />
          <div className="w-px h-8 bg-[var(--color-border)]" />
        </div>

        <div className="flex-1 min-w-0">
          {/* Category & time */}
          <div className="flex items-center gap-2 mb-1.5">
            <span className={`text-[10px] font-semibold ${category.color} flex items-center gap-1`}>
              {category.icon} {category.label}
            </span>
            <span className="text-[10px] text-[var(--color-text-dim)]">·</span>
            <span className="text-[10px] text-[var(--color-text-dim)]">{item.timeAgo}</span>
            <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-bold ${impact.color} ${impact.bg}`}>
              {impact.label}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-sm font-semibold leading-snug mb-1.5 group-hover:text-[var(--color-primary-light)] transition-colors line-clamp-2">
            {item.title}
          </h3>

          {/* Summary */}
          <p className="text-xs text-[var(--color-text-muted)] leading-relaxed line-clamp-2 mb-2">
            {item.summary}
          </p>

          {/* Related assets & source */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              {item.relatedAssets.map((asset) => (
                <span
                  key={asset}
                  className="text-[9px] px-1.5 py-0.5 rounded-md bg-[var(--color-surface)] text-[var(--color-text-muted)] border border-[var(--color-border)]"
                >
                  {asset}
                </span>
              ))}
            </div>
            <span className="text-[10px] text-[var(--color-text-dim)]">{item.source}</span>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
