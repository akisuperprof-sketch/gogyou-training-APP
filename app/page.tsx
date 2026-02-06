'use client';

import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useStore } from '@/lib/store';
import { soundManager } from '@/lib/soundManager';
import { SPIRIT_DATA, MOOD_COLORS, ELEMENT_COLORS } from '@/lib/data';
import { HelpCircle, Sparkles, Crown, Book, History, Info, Zap, ChevronLeft, ChevronRight, X, BookOpen, Settings, Brain, Share2 } from 'lucide-react';
import { StoryModal } from '@/components/StoryModal';
import { GuideModal } from '@/components/GuideModal';
import { SettingsModal } from '@/components/SettingsModal';
import { ShareCard } from '@/components/ShareCard';
import { DAILY_WISDOM } from '@/lib/wisdomData';
import { DailyWisdom } from '@/lib/types';

export default function Home() {
  const { spirits, gameProgress, checkGenkiDecay, lastHealSpiritId, clearHealNotification, clearUnlockNotification } = useStore();
  const [mounted, setMounted] = useState(false);
  const [focusedIdx, setFocusedIdx] = useState(0);
  const selectedSpirit = spirits[focusedIdx];

  const [userMessage, setUserMessage] = useState('');
  const [diagnosisResult, setDiagnosisResult] = useState('');
  const [isDiagnosing, setIsDiagnosing] = useState(false);

  const handleDiagnose = async () => {
    if (!userMessage) return;
    setIsDiagnosing(true);
    try {
      const res = await fetch('/api/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, spiritElement: selectedSpirit?.element })
      });
      const data = await res.json();
      if (data.text) {
        setDiagnosisResult(data.text);
        setUserMessage('');
      }
    } catch (error) {
      setDiagnosisResult('通信に失敗しました。精霊も疲れているみたい...');
    } finally {
      setIsDiagnosing(false);
    }
  };

  const [storyOpen, setStoryOpen] = useState(false);
  const [isGlowActive, setIsGlowActive] = useState(false);
  const [todayWisdom, setTodayWisdom] = useState<DailyWisdom | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    checkGenkiDecay();
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    setTodayWisdom(DAILY_WISDOM[dayOfYear % DAILY_WISDOM.length]);
  }, [checkGenkiDecay]);

  const isBuruUI = gameProgress.isBuruBuruMode;

  return (
    <div className={cn(
      "min-h-screen transition-all duration-700 font-sans selection:bg-indigo-100 overflow-x-hidden",
      isBuruUI ? "bg-[#FFF9E6]" : "bg-slate-50"
    )}>
      {/* 
          MODALS
      */}
      <StoryModal isOpen={storyOpen} onClose={() => setStoryOpen(false)} spirit={selectedSpirit} />
      <GuideModal isOpen={guideOpen} onClose={() => setGuideOpen(false)} />
      <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
      {selectedSpirit && <ShareCard isOpen={shareOpen} onClose={() => setShareOpen(false)} spirit={selectedSpirit} />}

      {/* 
          TOP HEADER (Switchable)
      */}
      {isBuruUI ? (
        <div className="fixed top-0 inset-x-0 z-[100] px-4 pt-4 pb-2 bg-gradient-to-b from-white/80 to-transparent backdrop-blur-sm">
          <div className="flex justify-between items-center max-w-lg mx-auto">
            <div className="flex items-center space-x-2">
              <div className="bg-white rounded-2xl p-1 shadow-sm border-2 border-orange-100 flex items-center space-x-2 px-3 h-10">
                <span className="text-lg">🌿</span>
                <span className="text-xs font-black text-orange-400">999k+</span>
                <button className="w-4 h-4 bg-orange-400 rounded-full text-white text-[8px] flex items-center justify-center">+</button>
              </div>
              <div className="bg-white rounded-2xl p-1 shadow-sm border-2 border-blue-100 flex items-center space-x-2 px-3 h-10">
                <span className="text-lg">💎</span>
                <span className="text-xs font-black text-blue-400">99k</span>
                <button className="w-4 h-4 bg-blue-400 rounded-full text-white text-[8px] flex items-center justify-center">+</button>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="bg-white rounded-2xl p-1 shadow-sm border-2 border-pink-100 flex items-center space-x-2 px-3 h-10">
                <span className="text-lg">⚡</span>
                <span className="text-xs font-black text-pink-400">5/5</span>
              </div>
              <button onClick={() => setSettingsOpen(true)} className="w-10 h-10 bg-white rounded-2xl shadow-sm border-2 border-slate-100 flex items-center justify-center active:scale-90 transition-transform">
                <Settings className="w-5 h-5 text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <header className="fixed top-0 left-0 right-0 z-50 bg-slate-50/90 backdrop-blur-md border-b border-slate-100/50">
          <div className="max-w-lg mx-auto w-full p-4 sm:p-6 flex justify-between items-center">
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tighter">陰陽五行学習APP</h1>
              <p className="text-[8px] text-slate-400 font-black uppercase tracking-widest">Yin Yang & Five Elements Learning</p>
            </div>
            <div className="flex items-center space-x-2">
              <button onClick={() => setSettingsOpen(true)} className="p-3 bg-white border border-slate-100 rounded-2xl shadow-sm text-slate-300 active:scale-90"><Settings className="w-5 h-5" /></button>
              <button onClick={() => setGuideOpen(true)} className="p-3 bg-indigo-500 rounded-2xl shadow-lg text-white active:scale-90"><BookOpen className="w-5 h-5" /></button>
            </div>
          </div>
        </header>
      )}

      <main className={cn(
        "relative flex flex-col items-center max-w-lg mx-auto min-h-screen",
        isBuruUI ? "pt-24 pb-48" : "pt-40 sm:pt-48 px-4"
      )}>
        {/* =================================================================
             BUBUBURU MODE UI (Mimic)
           ================================================================= */}
        {isBuruUI && (
          <>
            {/* ROOM BACKGROUND */}
            <div className="absolute top-20 inset-x-4 bottom-40 bg-white rounded-[3.5rem] shadow-[inset_0_4px_20px_rgba(0,0,0,0.05)] border-4 border-white overflow-hidden">
              <div className="absolute inset-0 bg-[#FFEFD5]/40" />
              <div className="absolute bottom-0 inset-x-0 h-1/4 bg-[#FFF9E6]/60 border-t-2 border-white" />
              <div className="absolute bottom-8 inset-x-0 text-center">
                <span className="text-[10px] font-black text-[#D2B48C] tracking-[0.4em] uppercase">Living Room</span>
              </div>
            </div>

            <div className="relative z-10 w-full flex flex-col items-center mt-4">
              {/* SPEECH BUBBLE */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="relative mb-8 w-full max-w-[300px] transition-all"
              >
                <div className="p-6 rounded-[2.5rem] shadow-xl text-center font-black relative z-10 bg-white border-4 border-orange-100 text-slate-700">
                  {diagnosisResult || "すごいことを発見したヌ！\n知りたいヌ？"}
                </div>
                <div className="absolute -bottom-2 right-12 w-6 h-6 rotate-45 bg-white border-r-4 border-b-4 border-orange-100" />
              </motion.div>

              {/* SPIRIT VISUAL (BuruBuru Style) */}
              <div className="relative group mb-12">
                <motion.div
                  animate={{
                    y: [0, -20, 0],
                    rotate: [-2, 2, -2]
                  }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="relative z-10 transition-all duration-500 cursor-pointer w-52 h-52"
                  onClick={() => {
                    useStore.getState().petSpirit(selectedSpirit.id);
                    setIsGlowActive(true);
                    setTimeout(() => setIsGlowActive(false), 300);
                    if (gameProgress.isVoiceMode) soundManager.playSoftTap();
                  }}
                >
                  <img
                    src={SPIRIT_DATA[selectedSpirit?.id || 'moku'].illustration}
                    className={cn("w-full h-full object-contain", isGlowActive && "brightness-125 scale-110")}
                  />
                  {/* SOS Icon */}
                  {selectedSpirit.stats.genki < 70 && (
                    <motion.div
                      initial={{ scale: 0 }} animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-black text-xs border-2 border-white shadow-md z-20"
                    >
                      <span className="animate-pulse">SOS</span>
                    </motion.div>
                  )}
                </motion.div>
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-32 h-6 bg-black/5 rounded-full blur-md" />
              </div>
            </div>
          </>
        )}


        {/* =================================================================
             CLASSIC MODE UI (Original)
           ================================================================= */}
        {!isBuruUI && (
          <>
            {/* Spirit Selector / Display (Swipe Style) */}
            <div className="w-full max-w-lg relative flex items-center justify-center h-[400px]">
              <button onClick={() => setFocusedIdx(prev => (prev - 1 + spirits.length) % spirits.length)} className="absolute left-0 z-30 p-2 bg-white/50 backdrop-blur-md rounded-full shadow-sm hover:bg-white transition">
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button onClick={() => setFocusedIdx(prev => (prev + 1) % spirits.length)} className="absolute right-0 z-30 p-2 bg-white/50 backdrop-blur-md rounded-full shadow-sm hover:bg-white transition">
                <ChevronRight className="w-6 h-6" />
              </button>

              <AnimatePresence mode="popLayout">
                {spirits.map((spirit, idx) => {
                  const isFocused = idx === focusedIdx;
                  if (!isFocused && !gameProgress.debugFlags.showImages && Math.abs(idx - focusedIdx) > 1) return null; // Optimization

                  // Only show current, prev, next or all if needed. For simplicity, showing all but filtered by style

                  return (
                    <motion.div
                      key={spirit.id}
                      initial={{ opacity: 0, scale: 0.8, x: (idx - focusedIdx) * 100 }}
                      animate={{
                        opacity: isFocused ? 1 : 0.3,
                        scale: isFocused ? 1.15 : 0.8,
                        x: (idx - focusedIdx) * 200,
                        zIndex: isFocused ? 20 : 10,
                        filter: isFocused ? 'none' : 'blur(2px)',
                      }}
                      transition={{ type: 'spring', damping: 20 }}
                      className={cn(
                        "absolute w-44 sm:w-56 h-72 sm:h-80 rounded-[2.5rem] sm:rounded-[3.5rem] p-6 flex flex-col items-center justify-between border-2 transition-all bg-white",
                        isFocused ? "border-white shadow-2xl" : "border-slate-50 grayscale"
                      )}
                    >
                      <div className="flex flex-col items-center relative z-10 w-full h-full justify-between">
                        <div className="text-center">
                          <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-none">{spirit.name}</h2>
                          <p className="text-[8px] text-slate-400 font-black uppercase tracking-widest mt-1">{spirit.element} Element</p>
                        </div>

                        <motion.div
                          className="relative w-28 h-28 sm:w-36 sm:h-36 cursor-pointer"
                          whileTap={{ scale: 0.9 }}
                          onClick={() => {
                            useStore.getState().petSpirit(spirit.id);
                            if (gameProgress.isVoiceMode) soundManager.playSoftTap();
                          }}
                        >
                          <img
                            src={SPIRIT_DATA[spirit.id].illustration}
                            className="w-full h-full object-contain drop-shadow-xl"
                          />
                        </motion.div>

                        <div className="w-full space-y-2">
                          <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-400 tracking-tighter">
                            <span>Energy</span>
                            <span>{spirit.stats.genki}%</span>
                          </div>
                          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={cn("h-full transition-all duration-1000", spirit.stats.genki > 70 ? "bg-yellow-400" : "bg-slate-300")}
                              style={{ width: `${spirit.stats.genki}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Message Bubble (Classic) */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 p-6 rounded-[2rem] shadow-xl border max-w-sm w-full relative bg-white border-slate-100"
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 border-l border-t rotate-45 bg-white border-slate-100" />
              <p className="text-center font-bold italic leading-relaxed text-slate-600">
                "{SPIRIT_DATA[selectedSpirit.id].moodLines[selectedSpirit.mood][0]}"
              </p>
            </motion.div>

            {/* AI Advisor (Classic Position) */}
            {gameProgress.isAiMode && (
              <div className="w-full max-w-sm mt-8 relative z-10">
                <div className="bg-white/40 p-4 rounded-3xl border border-white/50 shadow-sm flex items-center space-x-2">
                  <input value={userMessage} onChange={(e) => setUserMessage(e.target.value)} className="flex-1 bg-white border-none rounded-xl px-4 py-2 text-xs" placeholder="AIに相談..." />
                  <button onClick={handleDiagnose} className="bg-indigo-500 text-white p-2 rounded-xl"><Brain className="w-4 h-4" /></button>
                </div>
              </div>
            )}

            {/* Navigation Buttons (Classic) */}
            <div className="grid grid-cols-2 gap-4 w-full max-w-sm mt-12 mb-20">
              <Link href="/play" className="group">
                <div className="bg-slate-900 p-6 rounded-[2rem] flex flex-col items-center justify-center space-y-2 shadow-2xl transition-all active:scale-95 hover:bg-slate-800">
                  <History className="w-8 h-8 text-indigo-400" />
                  <span className="text-white font-black text-sm">修行する</span>
                </div>
              </Link>
              <Link href="/dex" className="group">
                <div className="bg-white p-6 rounded-[2rem] border border-slate-100 flex flex-col items-center justify-center space-y-2 shadow-xl transition-all active:scale-95 hover:border-indigo-100">
                  <Book className="w-8 h-8 text-emerald-500" />
                  <span className="text-slate-900 font-black text-sm">生薬図鑑</span>
                </div>
              </Link>
            </div>
          </>
        )}

      </main>

      {/* 
          BOTTOM NAVIGATION (Switchable)
      */}
      {isBuruUI ? (
        <div className="fixed bottom-0 inset-x-0 z-[100] pb-10 px-4">
          <div className="max-w-md mx-auto bg-[#F5DEB3] rounded-[3rem] p-2 shadow-[0_15px_30px_rgba(0,0,0,0.15)] border-b-8 border-[#D2B48C]">
            <div className="grid grid-cols-5 gap-1">
              <button className="flex flex-col items-center p-2 rounded-[2rem] hover:bg-white/10">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-xl mb-1 shadow-sm border-2 border-orange-50">☰</div>
                <span className="text-[9px] font-black text-[#8B4513]">メニュー</span>
              </button>
              <button className="flex flex-col items-center p-2 rounded-[2rem] hover:bg-white/10">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-xl mb-1 shadow-sm border-2 border-pink-50">🏰</div>
                <span className="text-[9px] font-black text-[#8B4513]">おでかけ</span>
              </button>

              <div className="relative -top-10 flex flex-col items-center">
                <div className="w-20 h-20 bg-gradient-to-b from-[#7CFC00] to-[#32CD32] rounded-[2.2rem] shadow-xl border-4 border-white flex flex-col items-center justify-center ring-[12px] ring-[#F5DEB3]">
                  <span className="text-[10px] font-black text-white leading-none">Lv.</span>
                  <span className="text-2xl font-black text-white">87</span>
                </div>
              </div>

              <button className="flex flex-col items-center p-2 rounded-[2rem] hover:bg-white/10">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-xl mb-1 shadow-sm border-2 border-yellow-50">🧹</div>
                <span className="text-[9px] font-black text-[#8B4513]">おせわ</span>
              </button>
              <button className="flex flex-col items-center p-2 rounded-[2rem] hover:bg-white/10">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-xl mb-1 shadow-sm border-2 border-blue-50">🛒</div>
                <span className="text-[9px] font-black text-[#8B4513]">かいもの</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <footer className="mt-20 pb-12 px-6 max-w-lg mx-auto text-center space-y-4">
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Gogyou Training App v1.3.0</p>
        </footer>
      )}
    </div>
  );
}
