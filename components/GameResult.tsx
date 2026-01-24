'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/lib/store';
import Link from 'next/link';
import { RotateCcw, Home, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GameResultProps {
    score: number;
    gainedExp: number;
    gainedCardIds: number[];
    reaction: string;
    onRetry: () => void;
}

export function GameResult({ score, gainedExp, gainedCardIds, reaction, onRetry }: GameResultProps) {
    const { cards } = useStore();

    return (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/95 backdrop-blur-3xl p-4 sm:p-6 overflow-y-auto no-scrollbar">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center space-y-4 sm:space-y-8 max-w-sm w-full py-8"
            >
                <div className="relative">
                    {/* Decorative Animations */}
                    <div className="absolute inset-0 flex items-center justify-center -z-10">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                            className="w-80 h-80 border-2 border-dashed border-slate-100 rounded-full"
                        />
                        <motion.div
                            animate={{ rotate: -360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                            className="absolute w-64 h-64 border-2 border-dashed border-slate-50 rounded-full"
                        />
                    </div>

                    <div className="bg-white/90 backdrop-blur-md rounded-[2.5rem] sm:rounded-[3.5rem] p-6 sm:p-10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] border border-white">
                        <h2 className="text-sm font-black text-slate-400 tracking-[0.4em] mb-4 uppercase">修行結果</h2>
                        <p className="text-7xl sm:text-9xl font-black text-slate-900 tabular-nums tracking-tighter leading-none">
                            {score}
                        </p>
                    </div>
                </div>

                {/* Spirit Reaction */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="bg-slate-50/50 backdrop-blur-sm border border-slate-100 p-6 rounded-[2.5rem] relative overflow-hidden shadow-sm flex items-center space-x-5"
                >
                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-inner shrink-0 border border-slate-100">
                        <Sparkles className="w-7 h-7 text-indigo-400" />
                    </div>
                    <p className="text-base font-black text-slate-700 italic flex-1 text-left leading-relaxed">
                        "{reaction}"
                    </p>
                </motion.div>

                <div className="grid grid-cols-2 gap-3 sm:gap-5">
                    <div className="bg-white p-4 sm:p-6 rounded-[2rem] sm:rounded-[2.5rem] border-2 border-slate-50 shadow-sm text-center">
                        <p className="text-[10px] text-slate-400 font-bold tracking-widest mb-1.5 uppercase">習得度</p>
                        <p className="text-3xl sm:text-4xl font-black text-indigo-600">+{gainedExp}</p>
                    </div>
                    <div className="bg-white p-4 sm:p-6 rounded-[2rem] sm:rounded-[2.5rem] border-2 border-slate-50 shadow-sm text-center">
                        <p className="text-[10px] text-slate-400 font-bold tracking-widest mb-1.5 uppercase">獲得カード</p>
                        <p className="text-3xl sm:text-4xl font-black text-blue-500">+{gainedCardIds.length}</p>
                    </div>
                </div>

                {/* Reward Showcase */}
                <AnimatePresence>
                    {gainedCardIds.length > 0 && (
                        <div className="flex justify-center space-x-[-20px] pt-2 px-10">
                            {gainedCardIds.slice(0, 5).map((id, idx) => {
                                const card = cards[id];
                                if (!card) return null;
                                return (
                                    <motion.div
                                        key={`${id}-${idx}`}
                                        initial={{ y: 50, opacity: 0, rotate: -20 }}
                                        animate={{ y: 0, opacity: 1, rotate: idx * 10 - 20 }}
                                        transition={{ delay: 0.8 + idx * 0.1, type: 'spring', damping: 12 }}
                                        style={{ zIndex: idx }}
                                        className={cn(
                                            "w-22 h-32 bg-white rounded-2xl shadow-2xl flex flex-col items-center justify-center border-t-8 shadow-slate-200 border border-slate-50",
                                            card.element === 'Wood' ? "border-green-400" :
                                                card.element === 'Fire' ? "border-red-400" :
                                                    card.element === 'Earth' ? "border-yellow-400" :
                                                        card.element === 'Metal' ? "border-slate-300" :
                                                            "border-blue-400"
                                        )}
                                    >
                                        <span className="text-5xl mb-3 drop-shadow-sm">🌿</span>
                                        <p className="text-[10px] font-black text-center px-1 text-slate-800 leading-tight truncate w-full">
                                            {card.name}
                                        </p>
                                    </motion.div>
                                )
                            })}
                        </div>
                    )}
                </AnimatePresence>

                <div className="grid grid-cols-2 gap-3 sm:gap-5 pt-6 sm:pt-10">
                    <button
                        onClick={onRetry}
                        className="flex items-center justify-center space-x-2 sm:space-x-3 p-4 sm:p-6 bg-slate-100 text-slate-600 rounded-2xl sm:rounded-3xl font-black hover:bg-slate-200 active:scale-95 transition-all shadow-sm"
                    >
                        <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6" />
                        <span className="text-sm sm:text-base">修行へ</span>
                    </button>
                    <Link href="/" className="w-full">
                        <button className="w-full flex items-center justify-center space-x-2 sm:space-x-3 p-4 sm:p-6 bg-slate-900 text-white rounded-2xl sm:rounded-3xl font-black shadow-2xl shadow-indigo-100 active:scale-95 transition-all">
                            <Home className="w-5 h-5 sm:w-6 sm:h-6" />
                            <span className="text-sm sm:text-base">里に帰る</span>
                        </button>
                    </Link>
                </div>

            </motion.div>
        </div>
    );
}
