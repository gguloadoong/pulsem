"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import MarketTicker from "@/components/MarketTicker";
import MarketCard from "@/components/MarketCard";
import NewsCard from "@/components/NewsCard";
import GamificationPanel from "@/components/GamificationPanel";
import TrendingSection from "@/components/TrendingSection";
import CheckinButton from "@/components/CheckinButton";
import BottomNav from "@/components/BottomNav";
import { marketData, newsData } from "@/data/mock";

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeTab, setActiveTab] = useState("home");

  const filteredMarket = useMemo(() => {
    if (activeCategory === "all") return marketData;
    return marketData.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  const filteredNews = useMemo(() => {
    if (activeCategory === "all") return newsData;
    const categoryAssets = marketData
      .filter((m) => m.category === activeCategory)
      .map((m) => m.symbol);
    return newsData.filter((n) =>
      n.relatedAssets.some((asset) => categoryAssets.includes(asset))
    );
  }, [activeCategory]);

  return (
    <div className="min-h-screen bg-[var(--color-bg)] pb-20">
      {/* Header with category filter */}
      <Header activeCategory={activeCategory} onCategoryChange={setActiveCategory} />

      {/* Market Ticker */}
      <MarketTicker />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-4">
        <AnimatePresence mode="wait">
          {activeTab === "home" && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-4"
            >
              {/* Checkin */}
              <CheckinButton />

              {/* Gamification */}
              <GamificationPanel />

              {/* Trending */}
              <TrendingSection />

              {/* Market Overview */}
              <section>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-bold flex items-center gap-1.5">
                    📊 시장 현황
                    <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-[var(--color-primary)]/10 text-[var(--color-primary-light)] font-medium">
                      {filteredMarket.length}종목
                    </span>
                  </h2>
                  <button className="text-[10px] text-[var(--color-primary-light)] hover:underline">
                    더보기 →
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {filteredMarket.map((item, i) => (
                    <MarketCard key={item.id} item={item} index={i} />
                  ))}
                </div>
              </section>

              {/* News */}
              <section>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-bold flex items-center gap-1.5">
                    ⚡ 주요 뉴스
                    <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-[var(--color-danger)]/10 text-[var(--color-danger)] font-medium animate-pulse-live">
                      NEW
                    </span>
                  </h2>
                  <button className="text-[10px] text-[var(--color-primary-light)] hover:underline">
                    전체보기 →
                  </button>
                </div>
                <div className="flex flex-col gap-3">
                  {filteredNews.map((item, i) => (
                    <NewsCard key={item.id} item={item} index={i} />
                  ))}
                </div>
              </section>
            </motion.div>
          )}

          {activeTab === "market" && (
            <motion.div
              key="market"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h2 className="text-lg font-bold mb-4">📊 전체 시장</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredMarket.map((item, i) => (
                  <MarketCard key={item.id} item={item} index={i} />
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "news" && (
            <motion.div
              key="news"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h2 className="text-lg font-bold mb-4">⚡ 뉴스 피드</h2>
              <div className="flex flex-col gap-3">
                {newsData.map((item, i) => (
                  <NewsCard key={item.id} item={item} index={i} />
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "quest" && (
            <motion.div
              key="quest"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h2 className="text-lg font-bold mb-4">⚔️ 퀘스트 & 도전</h2>
              <GamificationPanel />
            </motion.div>
          )}

          {activeTab === "my" && (
            <motion.div
              key="my"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-6 pt-8"
            >
              <motion.div
                className="w-20 h-20 rounded-full flex items-center justify-center text-3xl"
                style={{ background: "linear-gradient(135deg, #6c5ce7, #00cec9)" }}
                whileHover={{ scale: 1.1, rotate: 10 }}
              >
                😎
              </motion.div>
              <div className="text-center">
                <h2 className="text-lg font-bold">투자자님</h2>
                <p className="text-xs text-[var(--color-text-muted)]">🥈 실버 트레이더 · Lv.12</p>
              </div>
              <div className="grid grid-cols-3 gap-4 w-full max-w-sm">
                {[
                  { label: "출석일", value: "45일", icon: "📅" },
                  { label: "연속", value: "7일", icon: "🔥" },
                  { label: "배지", value: "4개", icon: "🏅" },
                ].map((stat) => (
                  <div key={stat.label} className="glass rounded-2xl p-4 text-center">
                    <span className="text-xl">{stat.icon}</span>
                    <p className="text-lg font-bold mt-1">{stat.value}</p>
                    <p className="text-[10px] text-[var(--color-text-muted)]">{stat.label}</p>
                  </div>
                ))}
              </div>
              <div className="w-full max-w-sm flex flex-col gap-2">
                {["관심 종목 관리", "알림 설정", "테마 변경", "앱 정보"].map((menu) => (
                  <button
                    key={menu}
                    className="w-full glass rounded-xl p-3 text-left text-sm hover:border-[var(--color-primary)] transition-colors"
                  >
                    {menu}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
