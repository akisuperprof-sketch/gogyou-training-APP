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

      {/* 
          MAIN CONTENT
      */}
      <main className={cn(
        "relative flex flex-col items-center max-w-lg mx-auto min-h-screen",
        isBuruUI ? "pt-24 pb-48" : "pt-32 pb-40"
      )}>
        {/* BUBUBURU ROOM BACKGROUND */}
        {isBuruUI && (
          <div className="absolute top-20 inset-x-4 bottom-40 bg-white rounded-[3.5rem] shadow-[inset_0_4px_20px_rgba(0,0,0,0.05)] border-4 border-white overflow-hidden">
            <div className="absolute inset-0 bg-[#FFEFD5]/40" />
            <div className="absolute bottom-0 inset-x-0 h-1/4 bg-[#FFF9E6]/60 border-t-2 border-white" />
            <div className="absolute bottom-8 inset-x-0 text-center">
              <span className="text-[10px] font-black text-[#D2B48C] tracking-[0.4em] uppercase">Living Room</span>
            </div>
          </div>
        )}

        {/* CHARACTER & BUBBLE */}
        <div className="relative z-10 w-full flex flex-col items-center">

          {/* POP SPEECH BUBBLE */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={cn(
              "relative mb-8 w-full max-w-[300px] transition-all",
              isBuruUI ? "mt-4" : "mt-8"
            )}
          >
            <div className={cn(
              "p-6 rounded-[2.5rem] shadow-xl text-center font-black relative z-10",
              isBuruUI ? "bg-white border-4 border-orange-100 text-slate-700" : "bg-white border border-slate-100 text-slate-600 italic"
            )}>
              {diagnosisResult || (isBuruUI ? "すごいことを発見したヌ！\n知りたいヌ？" : selectedSpirit?.name + "があなたを見つめています。")}
            </div>
            <div className={cn(
              "absolute -bottom-2 right-12 w-6 h-6 rotate-45",
              isBuruUI ? "bg-white border-r-4 border-b-4 border-orange-100" : "bg-white border-r border-b border-slate-100"
            )} />
          </motion.div>

          {/* SPIRIT VISUAL */}
          <div className="relative group mb-12">
            <motion.div
              animate={{
                y: isBuruUI ? [0, -20, 0] : [0, -10, 0],
                rotate: isBuruUI ? [-2, 2, -2] : 0
              }}
              transition={{ repeat: Infinity, duration: isBuruUI ? 2 : 4 }}
              className={cn(
                "relative z-10 transition-all duration-500 cursor-pointer",
                isBuruUI ? "w-52 h-52" : "w-64 h-64"
              )}
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
            </motion.div>
            {/* Character Shadows/Effects */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-32 h-6 bg-black/5 rounded-full blur-md" />
          </div>

          {/* STATS & INFO (Normal) */}
          {!isBuruUI && (
            <div className="w-full px-6 grid grid-cols-2 gap-4">
              {Object.entries(selectedSpirit?.stats || {}).map(([k, v]) => (
                <div key={k} className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
                  <span className="text-[10px] font-black text-slate-400 uppercase">{k}</span>
                  <span className="text-lg font-black text-slate-900">{v}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SPIRIT SELECTOR (Normal) */}
        {!isBuruUI && (
          <div className="flex items-center space-x-6 mt-12 mb-8 relative z-10">
            <button onClick={() => setFocusedIdx(prev => (prev - 1 + spirits.length) % spirits.length)} className="p-4 bg-white rounded-full shadow-lg border border-slate-100 active:scale-90 transition-all"><ChevronLeft className="w-6 h-6 text-slate-400" /></button>
            <div className="flex space-x-2">
              {spirits.map((_, i) => <div key={i} className={cn("w-2 h-2 rounded-full transition-all", i === focusedIdx ? "w-6 bg-indigo-500" : "bg-slate-200")} />)}
            </div>
            <button onClick={() => setFocusedIdx(prev => (prev + 1) % spirits.length)} className="p-4 bg-white rounded-full shadow-lg border border-slate-100 active:scale-90 transition-all"><ChevronRight className="w-6 h-6 text-slate-400" /></button>
          </div>
        )}

        {/* AI ADVISOR (Normal) */}
        {gameProgress.isAiMode && !isBuruUI && (
          <div className="w-full px-6 mt-8 relative z-10">
            <div className="bg-white/40 backdrop-blur-md p-6 rounded-[2.5rem] border border-white/50 shadow-xl">
              <div className="flex items-center space-x-3 mb-4">
                <Brain className="w-6 h-6 text-indigo-500" />
                <span className="text-sm font-black text-slate-900">AI体質アドバイザー</span>
              </div>
              <div className="flex space-x-2">
                <input value={userMessage} onChange={(e) => setUserMessage(e.target.value)} className="flex-1 bg-white border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-400 outline-none" placeholder="今日の体調を教えて..." />
                <button onClick={handleDiagnose} className="bg-slate-900 text-white px-6 rounded-2xl text-sm font-black active:scale-95">診断</button>
              </div>
            </div>
          </div>
        )}

        {/* PLAY BUTTONS (Normal) */}
        {!isBuruUI && (
          <div className="grid grid-cols-2 gap-4 w-full px-6 mt-12 relative z-10">
            <Link href="/play" className="bg-slate-900 p-8 rounded-[2.5rem] flex flex-col items-center justify-center space-y-2 shadow-2xl active:scale-95"><History className="w-8 h-8 text-indigo-400" /><span className="text-white font-black text-sm">修行する</span></Link>
            <Link href="/dex" className="bg-white p-8 rounded-[2.5rem] border border-slate-100 flex flex-col items-center justify-center space-y-2 shadow-xl active:scale-95"><Book className="w-8 h-8 text-emerald-500" /><span className="text-slate-900 font-black text-sm">生薬図鑑</span></Link>
          </div>
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
