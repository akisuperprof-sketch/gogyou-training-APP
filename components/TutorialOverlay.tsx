'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Zap, Shield, LayoutGrid } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TutorialOverlayProps {
    isOpen: boolean;
    gameType: 'chain' | 'guard' | 'sort';
    onStart: () => void;
}

const TUTORIAL_DATA = {
    chain: {
        title: '相生チェイン',
        desc: '属性を繋いで連鎖を作る',
        icon: <Zap className="w-14 h-14 text-white" />,
        rules: [
            '相生（そうせい）の順に繋げよう',
            '木 → 火 → 土 → 金 → 水 → 木',
            '繋げるほどスコアボーナス！',
        ],
        bg: 'from-blue-50 to-white',
        accent: 'bg-blue-500 shadow-blue-200',
        color: 'blue'
    },
    guard: {
        title: '相克ガード',
        desc: '暴走する力を抑え込む',
        icon: <Shield className="w-14 h-14 text-white" />,
        rules: [
            '相克（そうこく）で暴走を止めよう',
            '相手の苦手な属性をタップ！',
            '木は土、土は水、水は火、火は金、金は木',
        ],
        bg: 'from-red-50 to-white',
        accent: 'bg-red-500 shadow-red-200',
        color: 'red'
    },
    sort: {
        title: '連想仕分け',
        desc: '万物の繋がりを見極める',
        icon: <LayoutGrid className="w-14 h-14 text-white" />,
        rules: [
            '正しい五行にドラッグしよう',
            '左：木　中央：火　右：土',
            '色や感情、季節がヒントだよ！',
        ],
        bg: 'from-green-50 to-white',
        accent: 'bg-green-500 shadow-green-200',
        color: 'green'
    },
};

export function TutorialOverlay({ isOpen, gameType, onStart }: TutorialOverlayProps) {
    if (!isOpen) return null;

    const data = TUTORIAL_DATA[gameType];

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 bg-slate-900/40 backdrop-blur-xl"
            >
                <motion.div
                    initial={{ scale: 0.9, y: 30 }}
                    animate={{ scale: 1, y: 0 }}
                    className={cn(
                        "relative w-full max-w-sm rounded-[2.5rem] sm:rounded-[3.5rem] p-6 sm:p-10 bg-white shadow-3xl overflow-hidden border-4 border-white bg-gradient-to-b flex flex-col max-h-[90dvh]",
                        data.bg
                    )}
                >
                    {/* Subtle Background Elements */}
                    <div className={cn("absolute -top-10 -right-10 w-48 h-48 rounded-full blur-3xl opacity-20 bg-current", `text-${data.color}-500`)} />

                    <div className="flex-1 overflow-y-auto w-full no-scrollbar">
                        <div className="flex flex-col items-center text-center space-y-6 sm:space-y-10 relative z-10 py-2">
                            <div className={cn("p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] shadow-2xl shrink-0", data.accent)}>
                                <div className="w-10 h-10 sm:w-14 sm:h-14 flex items-center justify-center text-white">
                                    {data.icon}
                                </div>
                            </div>

                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">修行の教え</p>
                                <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tighter">{data.title}</h2>
                                <p className="text-xs font-bold text-slate-400 mt-2">{data.desc}</p>
                            </div>

                            <div className="space-y-3 sm:space-y-4 w-full">
                                {data.rules.map((rule, i) => (
                                    <motion.div
                                        initial={{ opacity: 0, x: -15 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3 + i * 0.1 }}
                                        key={i}
                                        className="flex items-center space-x-3 sm:space-x-4 text-left bg-white/80 p-4 sm:p-5 rounded-[1.25rem] sm:rounded-[1.5rem] border border-white shadow-sm"
                                    >
                                        <div className={cn("w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-[10px] font-black text-white shrink-0 shadow-lg", data.accent)}>
                                            {i + 1}
                                        </div>
                                        <p className="text-xs sm:text-sm font-black text-slate-700 leading-snug">{rule}</p>
                                    </motion.div>
                                ))}
                            </div>

                            <button
                                onClick={onStart}
                                className={cn(
                                    "w-full py-5 sm:py-6 text-white font-black rounded-2xl sm:rounded-3xl shadow-2xl flex items-center justify-center space-x-3 active:scale-95 transition-all shrink-0",
                                    data.accent
                                )}
                            >
                                <Play className="fill-current w-5 h-5 sm:w-6 sm:h-6 border-none" />
                                <span className="text-base sm:text-lg tracking-widest">開始する</span>
                            </button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
