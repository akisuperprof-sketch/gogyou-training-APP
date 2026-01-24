'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/lib/store';
import Link from 'next/link';
import { RotateCcw, Home, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ELEMENT_COLORS, ELEMENT_JP } from '@/lib/data';

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
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/95 backdrop-blur-2xl p-8">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center space-y-8 max-w-sm w-full"
            >
                <div className="relative">
                    {/* Decorative Rings with Element Colors */}
                    <div className="absolute inset-0 flex items-center justify-center -z-10">
                        <div className="w-80 h-80 border-4 border-dashed border-green-100 rounded-full animate-[spin_60s_linear_infinite]" />
                        <div className="absolute w-64 h-64 border-4 border-dashed border-red-100 rounded-full animate-[spin_40s_linear_infinite_reverse]" />
                        <div className="absolute w-48 h-48 border-4 border-dashed border-yellow-100 rounded-full animate-[spin_20s_linear_infinite]" />
                    </div>

                    <div className="bg-white/80 backdrop-blur-md rounded-[3rem] p-8 shadow-2xl shadow-slate-200 border border-white">
                        <h2 className="text-xl font-black text-slate-400 tracking-[0.3em] mb-3 uppercase">修行結果</h2>
                        <p className="text-8xl font-black text-slate-900 tabular-nums tracking-tighter drop-shadow-xl">
                            {score}
                        </p>
                    </div>
                </div>

                {/* Spirit Reaction */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="bg-slate-50 border border-slate-100 p-6 rounded-[2.5rem] relative overflow-hidden shadow-sm flex items-center space-x-4"
                >
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-inner shrink-0">
                        <Sparkles className="w-6 h-6 text-indigo-400" />
                    </div>
                    <p className="text-base font-black text-slate-700 italic flex-1 text-left leading-snug">"{reaction}"</p>
                </motion.div>

                <div className="grid grid-cols-2 gap-5">
                    <div className="bg-white p-5 rounded-[2rem] border-2 border-slate-50 shadow-sm text-center">
                        <p className="text-[10px] text-slate-300 font-black tracking-widest mb-1.5 uppercase">獲得経験値</p>
                        <p className="text-3xl font-black text-green-500">+{gainedExp}</p>
                    </div>
                    <div className="bg-white p-5 rounded-[2rem] border-2 border-slate-50 shadow-sm text-center">
                        <p className="text-[10px] text-slate-300 font-black tracking-widest mb-1.5 uppercase">獲得カード</p>
                        <p className="text-3xl font-black text-blue-500">+{gainedCardIds.length}</p>
                    </div>
                </div>

                {/* Reward Showcase */}
                <AnimatePresence>
                    {gainedCardIds.length > 0 && (
                        <div className="flex justify-center space-x-[-15px] pt-4">
                            {gainedCardIds.slice(0, 5).map((id, idx) => {
                                const card = cards[id];
                                if (!card) return null;
                                return (
                                    <motion.div
                                        key={idx}
                                        initial={{ y: 50, opacity: 0, rotate: -15 }}
                                        animate={{ y: 0, opacity: 1, rotate: idx * 8 - 15 }}
                                        transition={{ delay: 1 + idx * 0.1, type: 'spring' }}
                                        style={{ zIndex: idx }}
                                        className={cn(
                                            "w-20 h-28 bg-white rounded-2xl shadow-2xl flex flex-col items-center justify-center border-t-4 shadow-slate-200",
                                            card.element === 'Wood' ? "border-green-400" :
                                                card.element === 'Fire' ? "border-red-400" :
                                                    card.element === 'Earth' ? "border-yellow-400" :
                                                        card.element === 'Metal' ? "border-slate-300" :
                                                            "border-blue-400"
                                        )}
                                    >
                                        <span className="text-4xl mb-2 drop-shadow-sm">🌿</span>
                                        <p className="text-[9px] font-black text-center px-1 text-slate-800 leading-tight truncate w-full uppercase">
                                            {card.name}
                                        </p>
                                    </motion.div>
                                )
                            })}
                        </div>
                    )}
                </AnimatePresence>

                <div className="flex items-center justify-center space-x-8 pt-10">
                    <button
                        onClick={onRetry}
                        className="flex flex-col items-center p-5 bg-slate-50 rounded-[1.5rem] hover:bg-slate-100 active:scale-95 transition-all text-slate-400 hover:text-slate-600 shadow-sm border border-slate-100"
                    >
                        <RotateCcw className="w-7 h-7 mb-1" />
                        <span className="text-[10px] font-black tracking-widest">修行へ</span>
                    </button>
                    <Link href="/">
                        <button className="flex flex-col items-center p-7 bg-slate-900 text-white rounded-[2.5rem] shadow-2xl shadow-indigo-100 active:scale-95 transition-all">
                            <Home className="w-10 h-10 mb-1" />
                            <span className="text-xs font-black tracking-widest">里に帰る</span>
                        </button>
                    </Link>
                </div>

            </motion.div>
        </div>
    );
}
