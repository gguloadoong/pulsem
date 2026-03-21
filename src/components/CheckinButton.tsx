"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function CheckinButton() {
  const [checked, setChecked] = useState(false);
  const [showReward, setShowReward] = useState(false);

  const handleCheckin = () => {
    if (checked) return;
    setChecked(true);
    setShowReward(true);
    setTimeout(() => setShowReward(false), 2000);
  };

  return (
    <div className="relative">
      <motion.button
        onClick={handleCheckin}
        whileHover={{ scale: checked ? 1 : 1.03 }}
        whileTap={{ scale: checked ? 1 : 0.97 }}
        className={`w-full py-3 rounded-2xl font-bold text-sm transition-all relative overflow-hidden ${
          checked
            ? "bg-[var(--color-success)]/10 border border-[var(--color-success)]/30 text-[var(--color-success)]"
            : "border border-transparent text-white"
        }`}
        style={
          checked
            ? {}
            : { background: "linear-gradient(135deg, #6c5ce7, #00cec9)" }
        }
      >
        {!checked && (
          <motion.div
            className="absolute inset-0 opacity-30"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
            }}
            animate={{ x: ["-100%", "200%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
        )}
        <span className="relative z-10">
          {checked ? "✅ 출석 완료! +20 XP" : "🔥 오늘의 출석 체크인"}
        </span>
      </motion.button>

      {/* XP Reward popup */}
      <AnimatePresence>
        {showReward && (
          <motion.div
            initial={{ opacity: 0, y: 0, scale: 0.5 }}
            animate={{ opacity: 1, y: -40, scale: 1 }}
            exit={{ opacity: 0, y: -60 }}
            className="absolute left-1/2 -translate-x-1/2 top-0 text-[var(--color-accent-warm)] font-black text-lg pointer-events-none"
          >
            +20 XP 🎉
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
