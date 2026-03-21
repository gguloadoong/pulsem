"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const categories = [
  { id: "all", label: "전체", icon: "🔥" },
  { id: "stock", label: "주식", icon: "📈" },
  { id: "crypto", label: "코인", icon: "₿" },
  { id: "realestate", label: "부동산", icon: "🏠" },
];

interface HeaderProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function Header({ activeCategory, onCategoryChange }: HeaderProps) {
  const [showSearch, setShowSearch] = useState(false);

  return (
    <header className="sticky top-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-4 py-3">
        {/* Top row */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <motion.div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-lg font-bold"
              style={{ background: "linear-gradient(135deg, #6c5ce7, #00cec9)" }}
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              P
            </motion.div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">
                Pulse<span className="gradient-text">M</span>
              </h1>
              <p className="text-[10px] text-[var(--color-text-dim)]">투자의 맥박</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowSearch(!showSearch)}
              className="w-9 h-9 rounded-xl glass flex items-center justify-center text-sm hover:border-[var(--color-primary)] transition-colors"
            >
              🔍
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-9 h-9 rounded-xl glass flex items-center justify-center text-sm relative hover:border-[var(--color-primary)] transition-colors"
            >
              🔔
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[var(--color-danger)] rounded-full text-[9px] flex items-center justify-center font-bold">
                3
              </span>
            </motion.button>
          </div>
        </div>

        {/* Search bar */}
        <AnimatePresence>
          {showSearch && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-3"
            >
              <input
                type="text"
                placeholder="종목, 뉴스, 지역 검색..."
                className="w-full px-4 py-2.5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-sm focus:outline-none focus:border-[var(--color-primary)] transition-colors placeholder:text-[var(--color-text-dim)]"
                autoFocus
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Category tabs */}
        <div className="flex gap-1 p-1 rounded-xl bg-[var(--color-surface)]">
          {categories.map((cat) => (
            <motion.button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all relative ${
                activeCategory === cat.id
                  ? "text-white"
                  : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
              }`}
              whileTap={{ scale: 0.97 }}
            >
              {activeCategory === cat.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 rounded-lg"
                  style={{ background: "linear-gradient(135deg, #6c5ce7, #5a4bd1)" }}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                />
              )}
              <span className="relative z-10 flex items-center justify-center gap-1">
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </header>
  );
}
