"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { userStats, quests, Quest } from "@/data/mock";

function XpBar() {
  const percent = (userStats.xp / userStats.xpToNext) * 100;
  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{userStats.rankIcon}</span>
          <div>
            <p className="text-xs text-[var(--color-text-muted)]">Lv.{userStats.level}</p>
            <p className="text-sm font-bold">{userStats.rank}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-[var(--color-text-muted)]">XP</p>
          <p className="text-sm font-bold tabular-nums">
            {userStats.xp.toLocaleString()}/{userStats.xpToNext.toLocaleString()}
          </p>
        </div>
      </div>
      <div className="w-full h-2 bg-[var(--color-surface)] rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{ background: "linear-gradient(90deg, #6c5ce7, #00cec9)" }}
        />
      </div>
    </div>
  );
}

function StreakCard() {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="glass rounded-2xl p-4"
    >
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-medium text-[var(--color-text-muted)]">연속 출석</p>
        <span className="text-lg">🔥</span>
      </div>
      <div className="flex items-baseline gap-1">
        <motion.span
          key={userStats.streak}
          initial={{ scale: 1.5, color: "#fdcb6e" }}
          animate={{ scale: 1, color: "#e8e8f0" }}
          className="text-3xl font-black tabular-nums"
        >
          {userStats.streak}
        </motion.span>
        <span className="text-sm text-[var(--color-text-muted)]">일</span>
      </div>
      <div className="flex gap-1 mt-3">
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className={`flex-1 h-1.5 rounded-full ${
              i < userStats.streak
                ? "bg-gradient-to-r from-[var(--color-accent-warm)] to-[var(--color-danger)]"
                : "bg-[var(--color-surface)]"
            }`}
          />
        ))}
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-[9px] text-[var(--color-text-dim)]">월</span>
        <span className="text-[9px] text-[var(--color-text-dim)]">일</span>
      </div>
    </motion.div>
  );
}

function QuestCard({ quest }: { quest: Quest }) {
  const percent = (quest.progress / quest.total) * 100;
  const isDone = quest.progress >= quest.total;

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className={`flex items-center gap-3 p-3 rounded-xl ${
        isDone ? "bg-[var(--color-success)]/5 border border-[var(--color-success)]/20" : "bg-[var(--color-surface)]"
      } transition-all`}
    >
      <span className="text-lg">{quest.icon}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <p className={`text-xs font-medium ${isDone ? "line-through text-[var(--color-text-dim)]" : ""}`}>
            {quest.title}
          </p>
          <span className="text-[10px] text-[var(--color-accent-warm)] font-bold">+{quest.xpReward} XP</span>
        </div>
        <div className="w-full h-1 bg-[var(--color-border)] rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="h-full rounded-full"
            style={{
              background: isDone
                ? "var(--color-success)"
                : "linear-gradient(90deg, #6c5ce7, #a29bfe)",
            }}
          />
        </div>
        <p className="text-[9px] text-[var(--color-text-dim)] mt-0.5">
          {quest.progress}/{quest.total}
        </p>
      </div>
    </motion.div>
  );
}

function BadgeGrid() {
  return (
    <div className="grid grid-cols-4 gap-2">
      {userStats.badges.map((badge) => (
        <motion.div
          key={badge.id}
          whileHover={{ scale: 1.15, y: -4 }}
          className={`aspect-square rounded-xl flex flex-col items-center justify-center gap-0.5 ${
            badge.earned
              ? "glass glow-primary"
              : "bg-[var(--color-surface)] opacity-40"
          } cursor-pointer`}
          title={badge.description}
        >
          <span className="text-xl">{badge.icon}</span>
          <span className="text-[8px] text-[var(--color-text-muted)] text-center leading-tight px-1">
            {badge.name}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

type TabId = "quests" | "badges";

export default function GamificationPanel() {
  const [activeTab, setActiveTab] = useState<TabId>("quests");

  const tabs: { id: TabId; label: string; icon: string }[] = [
    { id: "quests", label: "퀘스트", icon: "⚔️" },
    { id: "badges", label: "배지", icon: "🏅" },
  ];

  return (
    <section>
      {/* XP + Streak */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <XpBar />
        <StreakCard />
      </div>

      {/* Tabs */}
      <div className="glass rounded-2xl p-4">
        <div className="flex gap-1 p-1 rounded-xl bg-[var(--color-surface)] mb-3">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-[var(--color-primary)] text-white"
                  : "text-[var(--color-text-muted)]"
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "quests" && (
            <motion.div
              key="quests"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col gap-2"
            >
              {quests.map((q) => (
                <QuestCard key={q.id} quest={q} />
              ))}
            </motion.div>
          )}
          {activeTab === "badges" && (
            <motion.div
              key="badges"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <BadgeGrid />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
