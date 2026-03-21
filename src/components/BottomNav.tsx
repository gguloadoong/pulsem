"use client";

import { motion } from "framer-motion";

const navItems = [
  { id: "home", label: "홈", icon: "🏠", activeIcon: "🔥" },
  { id: "market", label: "시장", icon: "📊", activeIcon: "📈" },
  { id: "news", label: "뉴스", icon: "📰", activeIcon: "⚡" },
  { id: "quest", label: "퀘스트", icon: "🎯", activeIcon: "⚔️" },
  { id: "my", label: "MY", icon: "👤", activeIcon: "😎" },
];

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-[var(--color-border)]">
      <div className="max-w-7xl mx-auto flex items-center justify-around px-2 py-1">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <motion.button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              whileTap={{ scale: 0.9 }}
              className="flex flex-col items-center gap-0.5 py-2 px-4 relative"
            >
              {isActive && (
                <motion.div
                  layoutId="bottomNavActive"
                  className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full"
                  style={{ background: "linear-gradient(90deg, #6c5ce7, #00cec9)" }}
                  transition={{ type: "spring", bounce: 0.25, duration: 0.4 }}
                />
              )}
              <motion.span
                className="text-lg"
                animate={{ scale: isActive ? 1.2 : 1 }}
                transition={{ type: "spring", bounce: 0.5 }}
              >
                {isActive ? item.activeIcon : item.icon}
              </motion.span>
              <span
                className={`text-[9px] font-medium transition-colors ${
                  isActive ? "text-[var(--color-primary-light)]" : "text-[var(--color-text-dim)]"
                }`}
              >
                {item.label}
              </span>
            </motion.button>
          );
        })}
      </div>
      {/* Safe area for iOS */}
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}
