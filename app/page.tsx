'use client';

import { useStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { SPIRIT_DATA } from '@/lib/data';
import { HelpCircle, Sparkles, Crown } from 'lucide-react';
import { StoryModal } from '@/components/StoryModal';

export default function Home() {
  const { spirits, gameProgress, setHasSeenStory, checkGenkiDecay, toggleMasterMode } = useStore();
  const [mounted, setMounted] = useState(false);
  const [focusedIdx, setFocusedIdx] = useState(0);
  const [storyOpen, setStoryOpen] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
    checkGenkiDecay();
  }, [checkGenkiDecay]);

  // Handle tutorial trigger after mount and store hydration
  useEffect(() => {
    if (mounted) {
      if (!gameProgress.hasSeenStory) {
        setStoryOpen(true);
        setHasSeenStory(true);
      }
      // Initial request generation if none exists
      if (!gameProgress.currentRequest) {
        useStore.getState().refreshRequest();
      }
    }
  }, [mounted, gameProgress.hasSeenStory, gameProgress.currentRequest, setHasSeenStory]);

  if (!mounted) return <div className="min-h-screen bg-white" />;

  const unlockedSpirits = spirits.filter(s => s.unlocked);
  const currentRequest = gameProgress.currentRequest;

  const moodToJp = {
    good: '絶好調',
    normal: 'ふつう',
    bad: 'お疲れ'
  };

  return (
    <div className="flex flex-col h-[100dvh] p-4 pb-20 sm:p-6 sm:pb-24 space-y-3 sm:space-y-6 relative overflow-hidden bg-white font-sans text-slate-900">
      <StoryModal isOpen={storyOpen} onClose={() => setStoryOpen(false)} />

      {/* Header */}
      <header className="flex justify-between items-center z-10">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            五行精霊と漢方図鑑
          </h1>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Wu Xing Spirits & Kampo</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={toggleMasterMode}
            className={cn(
              "p-3 rounded-2xl border transition shadow-sm",
              gameProgress.isMasterMode
                ? "bg-yellow-400 border-yellow-500 text-white shadow-yellow-200"
                : "bg-slate-50 border-slate-100 text-slate-300 hover:text-slate-400"
            )}
            title="マスターモード"
          >
            <div className="flex items-center space-x-2">
              <Crown className="w-5 h-5 fill-current" />
              {gameProgress.isMasterMode && <span className="text-[10px] font-black uppercase tracking-tighter">Master</span>}
            </div>
          </button>
          <button
            onClick={() => setStoryOpen(true)}
            className="p-3 bg-slate-50 border border-slate-100 rounded-2xl shadow-sm text-slate-400 hover:text-slate-600 transition"
          >
            <HelpCircle className="w-5 h-5" />
          </button>
          <div className="px-4 py-2 bg-slate-50 rounded-2xl text-[10px] font-black text-slate-600 border border-slate-100 shadow-sm flex flex-col items-center justify-center">
            <span className="text-slate-300 mb-0.5 text-[8px] uppercase font-bold">習得度合計</span>
            <span className="text-base text-indigo-600 leading-none">
              {spirits.reduce((acc, s) => acc + s.stats.jukuren, 0)}
            </span>
          </div>
        </div>
      </header>

      {/* Spirit Carousel */}
      <section className="flex-1 flex flex-col items-center justify-center space-y-2 sm:space-y-8 z-10 min-h-0 overflow-hidden">
        <div className="relative w-full h-[260px] sm:h-[340px] flex items-center justify-center">
          {unlockedSpirits.map((spirit, idx) => {
            const isFocused = idx === focusedIdx;
            const spiritInfo = SPIRIT_DATA[spirit.id];
            const moodLine = spiritInfo.moodLines[spirit.mood][0];

            return (
              <motion.div
                key={spirit.id}
                layout
                onClick={() => setFocusedIdx(idx)}
                animate={{
                  x: (idx - focusedIdx) * 110,
                  scale: isFocused ? 1.15 : 0.75,
                  opacity: isFocused ? 1 : 0.4,
                  rotate: (idx - focusedIdx) * 5,
                  zIndex: isFocused ? 20 : 10
                }}
                className={cn(
                  "absolute w-36 sm:w-44 h-56 sm:h-72 rounded-[2.5rem] sm:rounded-[3.5rem] p-4 sm:p-6 flex flex-col items-center justify-between border-2 transition-all cursor-pointer bg-white",
                  isFocused ? "shadow-2xl shadow-slate-200 border-white" : "border-slate-50 shadow-sm grayscale-[0.6]",
                  spirit.mood === 'good' && isFocused && "border-yellow-200 ring-4 ring-yellow-50",
                  spirit.mood === 'bad' && isFocused && "border-slate-200 opacity-80"
                )}
              >
                <div className="flex flex-col items-center">
                  <motion.div
                    animate={isFocused ? { y: [0, -5, 0] } : {}}
                    transition={{ repeat: Infinity, duration: 3.5 }}
                    className="relative w-24 h-24 sm:w-32 sm:h-32 mb-2 sm:mb-4 flex items-center justify-center"
                  >
                    {gameProgress.isMasterMode ? (
                      <div className="relative w-full h-full">
                        <img
                          src={spiritInfo.illustration}
                          alt={spirit.name}
                          className="w-full h-full object-contain drop-shadow-xl"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent pointer-events-none" />
                      </div>
                    ) : (
                      <span className="text-5xl sm:text-7xl drop-shadow-sm">
                        {spirit.element === 'Wood' ? '🌿' : spirit.element === 'Fire' ? '🔥' : spirit.element === 'Earth' ? '⛰️' : spirit.element === 'Metal' ? '💎' : '💧'}
                      </span>
                    )}
                  </motion.div>
                  <h2 className="text-lg sm:text-xl font-black text-slate-900 leading-none">{spirit.name}</h2>
                  <div className={cn(
                    "text-[8px] sm:text-[10px] font-black px-3 py-1 sm:px-4 sm:py-1.5 mt-1.5 rounded-full tracking-wider border shadow-sm",
                    spirit.mood === 'good' ? "bg-yellow-50 text-yellow-600 border-yellow-100" :
                      spirit.mood === 'bad' ? "bg-slate-50 text-slate-400 border-slate-100" :
                        "bg-blue-50 text-blue-500 border-blue-100"
                  )}>
                    {moodToJp[spirit.mood]}
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {isFocused && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-[10px] sm:text-[11px] text-center bg-slate-50 text-slate-600 p-2 sm:p-3.5 rounded-xl sm:rounded-2xl border border-slate-100 w-full font-bold leading-tight"
                    >
                      {moodLine}
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="w-full space-y-2">
                  <div className="flex justify-between text-[10px] font-black text-slate-400 tracking-widest uppercase">
                    <span>元気度</span>
                    <span>{spirit.stats.genki}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden shadow-inner">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${spirit.stats.genki}%` }}
                      className={cn(
                        "h-full rounded-full transition-all duration-1000",
                        spirit.element === 'Wood' ? "bg-green-400" :
                          spirit.element === 'Fire' ? "bg-red-400" :
                            spirit.element === 'Earth' ? "bg-yellow-400" :
                              spirit.element === 'Metal' ? "bg-slate-400" : "bg-blue-400"
                      )}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Request Box */}
        <AnimatePresence>
          {currentRequest && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full bg-indigo-50 border border-indigo-100 p-4 sm:p-5 rounded-[2rem] sm:rounded-[2.5rem] flex items-center space-x-3 sm:space-x-5 shadow-lg shadow-indigo-50 shrink-0"
            >
              <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-2xl sm:rounded-[1.5rem] bg-indigo-500 flex items-center justify-center text-xl sm:text-3xl shrink-0 shadow-xl shadow-indigo-100">
                💬
              </div>
              <div className="flex-1">
                <p className="text-[8px] sm:text-[10px] text-indigo-400 font-black mb-0.5 sm:mb-1.5 tracking-widest uppercase">精霊のお願い</p>
                <p className="text-[11px] sm:text-sm font-black text-slate-800 leading-tight sm:leading-snug">{currentRequest.text}</p>
              </div>
              <Link href={`/play/${currentRequest.gameType}`} className="shrink-0 bg-indigo-600 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-[1rem] sm:rounded-2xl text-[10px] sm:text-[11px] font-black shadow-xl shadow-indigo-100 active:scale-95 transition-all">
                行く！
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        {/* New Card Notification from Helper */}
        <AnimatePresence>
          {gameProgress.hasNewCards && (
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 50, opacity: 0 }}
              className="fixed bottom-32 right-6 z-30 flex flex-col items-end"
            >
              <div className="bg-white border-2 border-slate-100 p-5 rounded-3xl shadow-2xl shadow-indigo-100 max-w-[210px] relative mb-3">
                <p className="text-[11px] font-black text-slate-700 leading-relaxed text-center">
                  新しいカードをゲットしたよ！<br />
                  図鑑を確認してみてね。
                </p>
                <div className="absolute top-1/2 -right-2 -translate-y-1/2 w-4 h-4 bg-white border-r-2 border-t-2 border-slate-100 rotate-45" />
              </div>
              <div className="w-24 h-24 relative mr-[-15px]">
                <img src="/helper.png" alt="Helper" className="w-full h-full object-contain" />
                <motion.div
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ repeat: Infinity, duration: 1.2 }}
                  className="absolute -top-1 -left-1"
                >
                  <Sparkles className="w-6 h-6 text-yellow-500 fill-current" />
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Footer Nav */}
      <footer className="fixed bottom-4 sm:bottom-6 inset-x-4 sm:inset-x-6 z-20">
        <div className="bg-white/95 backdrop-blur-xl rounded-[2.5rem] sm:rounded-[3rem] p-2 sm:p-4 flex justify-between items-center shadow-2xl border border-slate-100">

          <Link href="/play" className="flex flex-col items-center flex-1 group py-1">
            <div className="relative">
              <span className="text-2xl sm:text-3xl group-hover:scale-110 transition-transform block">🎮</span>
              {gameProgress.currentRequest && (
                <motion.div
                  animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"
                />
              )}
            </div>
            <span className="text-[10px] sm:text-[11px] font-black mt-0.5 sm:mt-1 text-slate-800 leading-none">修行する</span>
          </Link>

          <div className="relative group px-1 sm:px-2">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-tr from-green-400 via-blue-500 to-indigo-600 rounded-[1.5rem] sm:rounded-[2rem] flex items-center justify-center shadow-xl shadow-indigo-100 -mt-8 sm:-mt-14 border-4 border-white active:scale-95 transition-transform">
              <span className="text-2xl sm:text-3xl">🏠</span>
            </div>
          </div>

          <Link href="/dex" className="flex flex-col items-center flex-1 group py-1 relative">
            <div className="relative px-2">
              <span className="text-2xl sm:text-3xl group-hover:scale-110 transition-transform block">📜</span>
              {gameProgress.hasNewCards && (
                <motion.div
                  animate={{ scale: [1, 1.5, 1], rotate: [0, 15, -15, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="absolute -top-1 -right-1"
                >
                  <Sparkles className="w-4 h-4 text-yellow-500 fill-current" />
                </motion.div>
              )}
            </div>
            <span className="text-[10px] sm:text-[11px] font-black mt-0.5 sm:mt-1 text-slate-800 leading-none">図鑑を見る</span>
          </Link>
        </div>
      </footer>
    </div>
  );
}
