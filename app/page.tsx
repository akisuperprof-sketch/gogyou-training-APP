'use client';

import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useStore } from '@/lib/store';
import { SPIRIT_DATA, MOOD_COLORS, ELEMENT_COLORS } from '@/lib/data';
import { HelpCircle, Sparkles, Crown, Book, History, Info, Zap, ChevronLeft, ChevronRight, X, BookOpen, Settings } from 'lucide-react';
import { StoryModal } from '@/components/StoryModal';
import { GuideModal } from '@/components/GuideModal';
import { SettingsModal } from '@/components/SettingsModal';
import { DAILY_WISDOM } from '@/lib/wisdomData';
import { DailyWisdom } from '@/lib/types';
import { useSubscription } from '@/lib/hooks/useSubscription';

export default function Home() {
  const { spirits, crudeDrugs, formulas, gameProgress, setHasSeenStory, checkGenkiDecay, toggleMasterMode, applyDebugPreset, lastHealSpiritId, clearHealNotification, clearUnlockNotification } = useStore();
  const [mounted, setMounted] = useState(false);
  const [focusedIdx, setFocusedIdx] = useState(0);
  const [storyOpen, setStoryOpen] = useState(false);
  const [isGlowActive, setIsGlowActive] = useState(false);
  const [todayWisdom, setTodayWisdom] = useState<DailyWisdom | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    if (mounted) {
      const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
      const wisdom = DAILY_WISDOM[dayOfYear % DAILY_WISDOM.length];
      setTodayWisdom(wisdom);
      // Auto-unlock today's wisdom
      if (!gameProgress.unlockedWisdomIds.includes(wisdom.id)) {
        useStore.getState().unlockWisdom(wisdom.id);
      }
    }
  }, [mounted, gameProgress.unlockedWisdomIds]);

  const { isAllowed, loading: subLoading } = useSubscription();

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
    checkGenkiDecay();
  }, [checkGenkiDecay]);

  // Force close for unauthorized users after check
  useEffect(() => {
    // TODO: 本番環境ではこのコメントアウトを外して厳密に制御する
    /*
    if (!subLoading && !isAllowed) {
        // alert('開発中によりアクセスが制限されています');
        // liff.closeWindow(); 
    }
    */
  }, [isAllowed, subLoading]);

  // Story / Tutorial auto-open
  useEffect(() => {
    if (mounted && !gameProgress.hasSeenStory) {
      setStoryOpen(true);
      setHasSeenStory(true);
    }
  }, [mounted, gameProgress.hasSeenStory, setHasSeenStory]);

  // Handle glow animation for healed spirit
  useEffect(() => {
    if (lastHealSpiritId && spirits[focusedIdx] && spirits[focusedIdx].id === lastHealSpiritId) {
      setIsGlowActive(true);
      const timer = setTimeout(() => {
        setIsGlowActive(false);
        clearHealNotification();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [lastHealSpiritId, focusedIdx, spirits, clearHealNotification]);

  if (!mounted) return <div className="min-h-screen bg-white" />;

  // Block unauthorized users visually (Blocking UI)
  if (!subLoading && !isAllowed) {
    /*
    // こちらも本番時に有効化する
    return (
        <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white p-8 text-center space-y-6">
            <Info className="w-16 h-16 text-slate-500" />
            <h1 className="text-2xl font-black">メンテナンス中</h1>
            <p className="text-sm font-bold text-slate-400">現在開発者プレビュー期間中です。<br/>許可されたアカウントのみアクセス可能です。</p>
        </div>
    );
    */
  }

  const unlockedSpirits = spirits.filter(s => s.unlocked);
  const spirit = unlockedSpirits[focusedIdx] || spirits[0];

  const totalExp = spirits.reduce((acc, s) => acc + s.stats.jukuren, 0);
  const totalDrugs = Object.values(crudeDrugs).reduce((acc, c) => acc + c.ownedCount, 0);
  const totalFormulaInStock = Object.values(formulas).reduce((acc, f) => acc + f.ownedCount, 0);

  const moodToJp = {
    good: '絶好調',
    normal: 'ふつう',
    bad: 'お疲れ'
  };

  const nextSpirit = () => setFocusedIdx((prev) => (prev + 1) % unlockedSpirits.length);
  const prevSpirit = () => setFocusedIdx((prev) => (prev - 1 + unlockedSpirits.length) % unlockedSpirits.length);

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden font-sans text-slate-900 pb-20">
      {/* Unlock Notification Overlay */}
      <AnimatePresence>
        {gameProgress.unlockNotification && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-[3rem] p-8 max-w-sm w-full shadow-3xl border-4 border-yellow-200 flex flex-col items-center relative overflow-visible"
            >
              {/* Announcer character effect */}
              <div className="absolute -top-16 -right-4 w-32 h-32 z-10">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                  className="w-full h-full bg-yellow-100 rounded-full border-4 border-white shadow-xl flex items-center justify-center overflow-hidden"
                >
                  <Sparkles className="w-16 h-16 text-yellow-500 fill-current opacity-80" />
                </motion.div>
              </div>

              <div className="w-full space-y-4 pt-4 text-center">
                <div className="inline-block px-4 py-1.5 bg-yellow-400 text-white text-[10px] font-black rounded-full shadow-sm uppercase tracking-widest">
                  Unlock Achievement
                </div>
                <h3 className="text-2xl font-black text-slate-900 leading-tight">
                  {gameProgress.unlockNotification.title}
                </h3>
                <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 relative">
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-slate-50 border-l border-t border-slate-100 rotate-45" />
                  <p className="text-sm font-bold text-slate-600 leading-relaxed italic">
                    "{gameProgress.unlockNotification.message}"
                  </p>
                </div>
              </div>

              <button
                onClick={clearUnlockNotification}
                className="w-full mt-8 py-5 bg-slate-900 text-white font-black rounded-2xl shadow-xl active:scale-95 transition-all text-lg hover:bg-slate-800"
              >
                修行に励む！
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <StoryModal isOpen={storyOpen} onClose={() => setStoryOpen(false)} />
      <GuideModal isOpen={guideOpen} onClose={() => setGuideOpen(false)} />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-50/90 backdrop-blur-md border-b border-slate-100/50">
        <div className="max-w-lg mx-auto w-full p-4 sm:p-6 space-y-3">
          {/* Main Title */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tighter">
                陰陽五行学習APP
              </h1>
              <p className="text-[8px] text-slate-400 font-black uppercase tracking-widest">Yin Yang & Five Elements Learning</p>
            </div>

            <div className="flex items-center space-x-2">
              <div className="relative">
                <button
                  onClick={() => setSettingsOpen(true)}
                  className="p-2.5 rounded-2xl transition-all active:scale-90 border flex flex-col items-center justify-center space-y-0.5 bg-white border-slate-100 text-slate-300 hover:text-slate-500"
                >
                  <Settings className="w-4 h-4" />
                  <span className="text-[6px] font-black uppercase leading-none">Settings</span>
                </button>

                <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
              </div>
              {gameProgress.isMasterMode && (
                <button
                  onClick={() => setGuideOpen(true)}
                  className="p-2.5 bg-indigo-500 border border-indigo-400 rounded-2xl shadow-lg text-white hover:bg-indigo-600 active:scale-90 transition-all flex flex-col items-center"
                >
                  <BookOpen className="w-4 h-4" />
                  <span className="text-[6px] font-black uppercase leading-none mt-0.5">使い方</span>
                </button>
              )}
              <button
                onClick={() => setStoryOpen(true)}
                className="p-2.5 bg-white border border-slate-100 rounded-2xl shadow-sm text-slate-400 hover:text-slate-600 active:scale-90"
              >
                <HelpCircle className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="flex items-center space-x-3">
            <div className="flex-1 px-3 py-2 bg-white/50 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
              <p className="text-[7px] text-slate-400 font-black uppercase tracking-widest">習得経験値</p>
              <div className="flex items-center space-x-1.5">
                <Zap className="w-3 h-3 text-indigo-500 fill-current" />
                <span className="text-sm font-black tabular-nums">{totalExp}</span>
              </div>
            </div>
            <div className="flex-1 px-3 py-2 bg-white/50 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
              <p className="text-[7px] text-slate-400 font-black uppercase tracking-widest">所持生薬</p>
              <div className="flex items-center space-x-1.5">
                <Book className="w-3 h-3 text-emerald-500 fill-current" />
                <span className="text-sm font-black tabular-nums">{totalDrugs}</span>
              </div>
            </div>
            <div className="flex-1 px-3 py-2 bg-white/50 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
              <p className="text-[7px] text-slate-400 font-black uppercase tracking-widest">所持漢方</p>
              <div className="flex items-center space-x-1.5">
                <Sparkles className="w-3 h-3 text-amber-500 fill-current" />
                <span className="text-sm font-black tabular-nums">{totalFormulaInStock}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="pt-40 sm:pt-48 px-4 flex flex-col items-center">
        {/* Spirit Selector / Display */}
        <div className="w-full max-w-lg relative flex items-center justify-center h-[400px]">
          <button onClick={prevSpirit} className="absolute left-0 z-30 p-2 bg-white/50 backdrop-blur-md rounded-full shadow-sm hover:bg-white transition">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button onClick={nextSpirit} className="absolute right-0 z-30 p-2 bg-white/50 backdrop-blur-md rounded-full shadow-sm hover:bg-white transition">
            <ChevronRight className="w-6 h-6" />
          </button>

          <AnimatePresence mode="popLayout">
            {unlockedSpirits.map((spirit, idx) => {
              const isFocused = idx === focusedIdx;
              const spiritInfo = SPIRIT_DATA[spirit.id];
              const moodLine = spiritInfo.moodLines[spirit.mood][0];
              const isCurrentHealedSpirit = isFocused && isGlowActive;

              return (
                <motion.div
                  key={spirit.id}
                  initial={{ opacity: 0, scale: 0.8, x: (idx - focusedIdx) * 100 }}
                  animate={{
                    opacity: isFocused ? 1 : 0.3,
                    scale: isFocused ? 1.15 : 0.8,
                    x: (idx - focusedIdx) * 200,
                    zIndex: isFocused ? 20 : 10,
                    boxShadow: isCurrentHealedSpirit ? "0 0 60px rgba(250, 204, 21, 0.8)" : (isFocused ? "0 25px 50px -12px rgba(0, 0, 0, 0.1)" : "none")
                  }}
                  transition={{ type: 'spring', damping: 20 }}
                  className={cn(
                    "absolute w-44 sm:w-56 h-72 sm:h-80 rounded-[2.5rem] sm:rounded-[3.5rem] p-6 flex flex-col items-center justify-between border-2 transition-all bg-white",
                    isCurrentHealedSpirit ? "border-yellow-400" : (isFocused ? "border-white" : "border-slate-50 grayscale")
                  )}
                >
                  {isCurrentHealedSpirit && (
                    <div className="absolute inset-0 z-0 pointer-events-none">
                      {[...Array(15)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{
                            opacity: [0, 1, 0],
                            scale: [0.5, 1.2, 0.5],
                            y: [0, -250],
                            x: (Math.random() - 0.5) * 200
                          }}
                          transition={{ duration: 2, repeat: Infinity, delay: Math.random() * 2 }}
                          className="absolute bottom-0 left-1/2 text-yellow-500"
                        >
                          <Sparkles className="w-5 h-5 fill-current" />
                        </motion.div>
                      ))}
                    </div>
                  )}

                  <div className="flex flex-col items-center relative z-10 w-full">
                    <div className="text-center mb-4">
                      <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-none">{spirit.name}</h2>
                      <p className="text-[8px] text-slate-400 font-black uppercase tracking-widest mt-1">{spirit.element} Element</p>
                    </div>

                    <motion.div
                      className="relative w-24 h-24 sm:w-32 sm:h-32 mb-6"
                      animate={
                        (gameProgress.isBuruBuruMode && spirit.stats.genki < 70)
                          ? { x: [-2, 2, -2, 2, 0] }
                          : {}
                      }
                      transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 1 }}
                    >
                      {gameProgress.isMasterMode ? (
                        <img
                          src={spiritInfo.illustration}
                          alt={spirit.name}
                          className={cn(
                            "w-full h-full object-contain transition-all duration-500",
                            (gameProgress.isBuruBuruMode && spirit.stats.genki < 40) ? "grayscale contrast-125 brightness-90" : ""
                          )}
                        />
                      ) : (
                        <div className="text-6xl sm:text-7xl flex items-center justify-center h-full">
                          {spirit.element === 'Wood' ? '🌿' : spirit.element === 'Fire' ? '🔥' : spirit.element === 'Earth' ? '⛰️' : spirit.element === 'Metal' ? '💎' : '💧'}
                        </div>
                      )}

                      {/* SOS Icon Overlay */}
                      {gameProgress.isBuruBuruMode && spirit.stats.genki < 70 && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-black text-xs border-2 border-white shadow-md z-20"
                        >
                          Please!
                        </motion.div>
                      )}
                    </motion.div>

                    <div className="w-full space-y-2">
                      <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-400 tracking-tighter">
                        <span>ごきげん</span>
                        <span className={cn(
                          "px-2 py-0.5 rounded-full text-[8px]",
                          spirit.mood === 'good' ? 'bg-yellow-100 text-yellow-600' :
                            spirit.mood === 'bad' ? 'bg-slate-100 text-slate-400' : 'bg-blue-50 text-blue-500'
                        )}>{moodToJp[spirit.mood]}</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${spirit.stats.genki}%` }}
                          className={cn(
                            "h-full transition-all duration-1000",
                            spirit.stats.genki > 70 ? "bg-yellow-400" : spirit.stats.genki > 15 ? "bg-indigo-500" : "bg-slate-300"
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Message Bubble */}
        <motion.div
          key={spirit.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "mt-8 p-6 rounded-[2rem] shadow-xl border max-w-sm w-full relative transition-colors duration-500",
            (gameProgress.isBuruBuruMode && spirit.stats.genki < 70)
              ? "bg-red-50 border-red-200"
              : "bg-white border-slate-100"
          )}
        >
          <div className={cn(
            "absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 border-l border-t rotate-45 transition-colors duration-500",
            (gameProgress.isBuruBuruMode && spirit.stats.genki < 70)
              ? "bg-red-50 border-red-200"
              : "bg-white border-slate-100"
          )} />
          <p className={cn(
            "text-center font-bold italic leading-relaxed",
            (gameProgress.isBuruBuruMode && spirit.stats.genki < 70) ? "text-red-800" : "text-slate-600"
          )}>
            {(gameProgress.isBuruBuruMode && spirit.stats.genki < 70)
              ? (spirit.stats.genki < 40 ? "ねえ、もうだめかも...たすけて..." : "あの...少し体が重い気がするの...")
              : `"${SPIRIT_DATA[spirit.id].moodLines[spirit.mood][0]}"`
            }
          </p>
        </motion.div>

        {/* Daily Wisdom Section (Developer Only) */}
        {gameProgress.isMasterMode && todayWisdom && (
          <section className="w-full max-w-sm mt-12">
            <div className="flex justify-between items-center mb-4 px-2">
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center">
                <Sparkles className="w-4 h-4 mr-2 text-yellow-500" />
                今日の五行
              </h3>
              <button
                onClick={() => setHistoryOpen(true)}
                className="text-[10px] font-black text-indigo-500 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-tighter active:scale-95"
              >
                過去の知恵を見る
              </button>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[2.5rem] p-6 shadow-2xl border-2 border-indigo-50 relative overflow-hidden group"
            >
              <div className={cn(
                "absolute top-0 right-0 px-4 py-1 rounded-bl-2xl text-[10px] font-black text-white uppercase tracking-widest",
                MOOD_COLORS[todayWisdom.element === 'Balance' ? 'good' : 'normal']
              )}>
                {todayWisdom.tag}
              </div>
              <div className="flex items-start space-x-4">
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-inner",
                  ELEMENT_COLORS[todayWisdom.element === 'Balance' ? 'Earth' : todayWisdom.element]
                )}>
                  {todayWisdom.element === 'Balance' ? '☯️' : (
                    todayWisdom.element === 'Wood' ? '🌿' :
                      todayWisdom.element === 'Fire' ? '🔥' :
                        todayWisdom.element === 'Earth' ? '⛰️' :
                          todayWisdom.element === 'Metal' ? '💎' : '💧'
                  )}
                </div>
                <div className="space-y-2">
                  <h4 className="text-lg font-black text-slate-900 leading-none">{todayWisdom.title}</h4>
                  <p className="text-sm font-bold text-slate-500 leading-relaxed italic">
                    "{todayWisdom.content}"
                  </p>
                </div>
              </div>
            </motion.div>
          </section>
        )}

        {/* History Modal (Developer Only) */}
        <AnimatePresence>
          {historyOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[110] bg-slate-900/60 backdrop-blur-xl flex items-center justify-center p-6"
            >
              <motion.div
                initial={{ scale: 0.9, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-white rounded-[3rem] w-full max-w-md h-[80vh] flex flex-col overflow-hidden relative"
              >
                <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900">習得した知恵</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Wisdom Collection</p>
                  </div>
                  <button onClick={() => setHistoryOpen(false)} className="p-3 bg-slate-50 rounded-2xl text-slate-400">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
                  {DAILY_WISDOM.filter(w => gameProgress.unlockedWisdomIds.includes(w.id)).map(w => (
                    <div key={w.id} className="bg-slate-50 rounded-3xl p-5 border border-slate-100 flex items-start space-x-4">
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                        ELEMENT_COLORS[w.element === 'Balance' ? 'Earth' : w.element]
                      )}>
                        <span className="text-sm">{w.element === 'Balance' ? '☯️' : '✨'}</span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-black text-slate-900">{w.title}</span>
                          <span className="text-[8px] font-black text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full">{w.tag}</span>
                        </div>
                        <p className="text-[11px] font-bold text-slate-500 leading-relaxed">{w.content}</p>
                      </div>
                    </div>
                  ))}
                  {gameProgress.unlockedWisdomIds.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-center p-12 space-y-4">
                      <Book className="w-16 h-16 text-slate-100" />
                      <p className="text-sm font-bold text-slate-300">まだ知恵を習得していません。<br />毎日の学習を続けましょう。</p>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="grid grid-cols-2 gap-4 w-full max-w-sm mt-12">
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
      </main>

      {/* Footer / Info */}
      <footer className="mt-20 pb-12 px-6 max-w-lg mx-auto text-center space-y-4">
        <div className="p-4 bg-slate-100/50 rounded-2xl">
          <p className="text-[10px] font-bold text-slate-400 leading-relaxed text-left">
            【免責事項】本アプリは、五行思想や漢方の概念を学ぶための教育用ゲームプログラムであり、診断、処方、治療などの医療行為や、医学的アドバイスを提供するものではありません。アプリ内の描写や調合などは演出であり、実生活での自己判断による服用等は避けてください。
          </p>
        </div>
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Gogyou Training App v1.2.1</p>
      </footer>
    </div >
  );
}
