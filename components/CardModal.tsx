'use client';

import { useState, useEffect } from 'react';
import { Card as CardType } from '@/lib/types';
import { ELEMENT_COLORS, ELEMENT_JP } from '@/lib/data';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Zap } from 'lucide-react';
import { useStore } from '@/lib/store';

interface CardModalProps {
    card: CardType | null;
    onClose: () => void;
}

export function CardModal({ card, onClose }: CardModalProps) {
    const { useCard, spirits } = useStore();
    const [isHealing, setIsHealing] = useState(false);
    const [healAmount, setHealAmount] = useState(0);

    if (!card) return null;

    const handleUse = () => {
        // Calculate potential heal for UI
        const spirit = spirits.find(s => s.unlocked && s.element === card.element) || spirits.find(s => s.unlocked);
        if (!spirit) return;

        const isMatch = card.element === spirit.element;
        const amount = Math.floor(card.effectValue * (isMatch ? 1.5 : 1.0) / 2);

        setHealAmount(amount);
        setIsHealing(true);
        useCard(card.id);

        setTimeout(() => {
            setIsHealing(false);
        }, 1500);
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-md"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, y: 30 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 30 }}
                    className="relative w-full max-w-sm bg-white rounded-[2.5rem] sm:rounded-[3.5rem] shadow-3xl overflow-hidden border-2 border-slate-50 flex flex-col max-h-[90dvh]"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className={cn(
                        "h-48 sm:h-64 w-full flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br transition-all duration-700 shrink-0",
                        card.element === 'Wood' ? "from-emerald-50 to-green-100" :
                            card.element === 'Fire' ? "from-red-50 to-orange-100" :
                                card.element === 'Earth' ? "from-yellow-50 to-amber-100" :
                                    card.element === 'Metal' ? "from-slate-50 to-zinc-200" :
                                        "from-blue-50 to-indigo-100"
                    )}>
                        {/* Decorative Background Icon */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] select-none pointer-events-none">
                            <span className="text-[20rem] font-black">{ELEMENT_JP[card.element]}</span>
                        </div>

                        <div className="absolute top-8 left-8 p-3 bg-white/80 backdrop-blur-md rounded-[1.25rem] hover:bg-white transition shadow-sm z-50">
                            <button onClick={onClose} className="text-slate-400 hover:text-slate-900">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Card Emblem */}
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={isHealing ? {
                                scale: [1, 1.4, 1],
                                rotate: [0, 15, -15, 0],
                                filter: ["brightness(1)", "brightness(1.5)", "brightness(1)"]
                            } : { scale: 1, opacity: 1 }}
                            transition={{ type: 'spring', damping: 15 }}
                            className="z-10 text-7xl sm:text-9xl drop-shadow-[0_20px_50px_rgba(0,0,0,0.1)] relative"
                        >
                            <span className="relative z-10">
                                {card.element === 'Wood' ? '🌿' : card.element === 'Fire' ? '🔥' : card.element === 'Earth' ? '⛰️' : card.element === 'Metal' ? '💎' : '💧'}
                            </span>

                            {/* Healing Particles */}
                            <AnimatePresence>
                                {isHealing && (
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                        {[...Array(12)].map((_, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                                                animate={{
                                                    scale: [0, 1, 0],
                                                    x: (Math.random() - 0.5) * 200,
                                                    y: (Math.random() - 0.5) * 200,
                                                    opacity: 0
                                                }}
                                                transition={{ duration: 1, delay: i * 0.05 }}
                                                className="absolute w-4 h-4 text-yellow-400 fill-current"
                                            >
                                                <Sparkles />
                                            </motion.div>
                                        ))}
                                        <motion.div
                                            initial={{ y: 0, opacity: 0 }}
                                            animate={{ y: -100, opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="absolute text-green-500 font-black text-4xl whitespace-nowrap drop-shadow-lg"
                                        >
                                            +{healAmount} GENKI!!
                                        </motion.div>
                                    </div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 sm:p-8 pb-10 space-y-6 sm:space-y-8 no-scrollbar">
                        <div className="text-center relative">
                            <div className={cn(
                                "inline-block px-5 py-2 text-[10px] font-black tracking-[0.2em] rounded-full mb-4 border uppercase",
                                card.element === 'Wood' ? "bg-green-50 text-green-600 border-green-100" :
                                    card.element === 'Fire' ? "bg-red-50 text-red-600 border-red-100" :
                                        card.element === 'Earth' ? "bg-yellow-50 text-yellow-600 border-yellow-100" :
                                            card.element === 'Metal' ? "bg-slate-50 text-slate-600 border-slate-100" :
                                                "bg-blue-50 text-blue-600 border-blue-100"
                            )}>
                                {ELEMENT_JP[card.element]}属性・NO.{String(card.id).padStart(3, '0')}
                            </div>
                            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-none mb-3">{card.name}</h3>
                            <p className="text-xs sm:text-sm font-bold text-slate-400 italic leading-relaxed px-4">"{card.flavor}"</p>
                        </div>

                        {/* Description Box */}
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-slate-100 to-slate-50 rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                            <div className="relative p-7 bg-white rounded-[2rem] border border-slate-100 shadow-sm flex flex-col items-center">
                                <div className="flex items-center space-x-2 mb-4">
                                    <Sparkles className="w-4 h-4 text-indigo-400" />
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">漢方マメ知識</h4>
                                </div>
                                <p className="text-[13px] font-bold text-slate-600 leading-relaxed text-center">
                                    {card.description}
                                </p>
                            </div>
                        </div>

                        {/* Stats & Power */}
                        <div className="grid grid-cols-3 gap-3">
                            <div className="bg-slate-50/50 p-4 rounded-3xl border border-slate-100 text-center">
                                <p className="text-[9px] font-black text-slate-300 tracking-widest mb-1 uppercase">回復力</p>
                                <div className="flex items-center justify-center space-x-1">
                                    <Zap className="w-3 h-3 text-yellow-500 fill-current" />
                                    <span className="text-xl font-black text-slate-900">{card.effectValue}</span>
                                </div>
                            </div>
                            <div className="bg-slate-50/50 p-4 rounded-3xl border border-slate-100 text-center">
                                <p className="text-[9px] font-black text-slate-300 tracking-widest mb-1 uppercase">所持</p>
                                <span className="text-xl font-black text-slate-900">{card.ownedCount}</span>
                            </div>
                            <div className="bg-slate-50/50 p-4 rounded-3xl border border-slate-100 text-center">
                                <p className="text-[9px] font-black text-slate-300 tracking-widest mb-1 uppercase">使用</p>
                                <span className="text-xl font-black text-slate-900">{card.usedCount}</span>
                            </div>
                        </div>

                        <button
                            disabled={card.ownedCount <= 0 || isHealing}
                            onClick={handleUse}
                            className={cn(
                                "w-full py-6 rounded-[2rem] font-black text-lg transition-all shadow-2xl active:scale-95 flex items-center justify-center space-x-3",
                                card.ownedCount > 0 && !isHealing
                                    ? "bg-slate-900 text-white shadow-indigo-100"
                                    : "bg-slate-100 text-slate-300 shadow-none cursor-not-allowed"
                            )}
                        >
                            <div className="flex flex-col items-center">
                                <Zap className={cn("w-6 h-6 mb-1", card.ownedCount > 0 && !isHealing ? "text-yellow-400 fill-current" : "")} />
                                <span className="leading-none">{isHealing ? '回復中...' : 'このアイテムを飲む'}</span>
                                <span className="text-[10px] font-bold opacity-50 mt-1">精霊のごきげんを回復します</span>
                            </div>
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
