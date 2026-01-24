'use client';

import { Card as CardType } from '@/lib/types';
import { ELEMENT_COLORS, ELEMENT_JP } from '@/lib/data';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';

interface CardModalProps {
    card: CardType | null;
    onClose: () => void;
}

export function CardModal({ card, onClose }: CardModalProps) {
    if (!card) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/50 backdrop-blur-lg"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, y: 30 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 30 }}
                    className="relative w-full max-w-sm bg-white rounded-[3.5rem] shadow-3xl overflow-hidden border border-white"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className={cn(
                        "h-56 w-full flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br",
                        card.element === 'Wood' ? "from-green-400 to-emerald-500" :
                            card.element === 'Fire' ? "from-red-400 to-orange-500" :
                                card.element === 'Earth' ? "from-yellow-400 to-amber-500" :
                                    card.element === 'Metal' ? "from-slate-300 to-zinc-400" :
                                        "from-blue-400 to-indigo-500"
                    )}>
                        <div className="absolute top-8 right-8 text-white/20 text-8xl font-black z-0 uppercase tracking-tighter">
                            {ELEMENT_JP[card.element]}
                        </div>
                        <div className="z-10 text-8xl drop-shadow-2xl animate-float">🌿</div>

                        <button onClick={onClose} className="absolute top-8 left-8 p-4 bg-white/20 backdrop-blur-md rounded-[1.25rem] hover:bg-white/30 transition text-white">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="p-10 space-y-8">
                        <div className="text-center">
                            <div className="inline-block px-4 py-1.5 bg-slate-50 text-slate-500 text-[10px] font-black tracking-widest rounded-full mb-3 border border-slate-100">
                                {ELEMENT_JP[card.element]}の力
                            </div>
                            <h3 className="text-4xl font-black text-slate-900 tracking-tight">{card.name}</h3>
                            <p className="text-base font-bold text-slate-400 italic mt-3 leading-tight">"{card.flavor}"</p>
                        </div>

                        <div className="p-6 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                            <div className="flex items-center justify-center space-x-2 mb-3">
                                <Sparkles className="w-4 h-4 text-indigo-300" />
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">漢方解説</h4>
                            </div>
                            <p className="text-sm font-bold text-slate-600 leading-relaxed text-center">
                                {card.description}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-5">
                            <div className="bg-slate-50 p-5 rounded-[2rem] border border-slate-100 text-center shadow-sm">
                                <p className="text-[10px] font-black text-slate-400 tracking-widest mb-1 uppercase">所持数</p>
                                <span className="text-3xl font-black text-slate-900">{card.ownedCount}</span>
                            </div>
                            <div className="bg-slate-50 p-5 rounded-[2rem] border border-slate-100 text-center shadow-sm">
                                <p className="text-[10px] font-black text-slate-400 tracking-widest mb-1 uppercase">使用回数</p>
                                <span className="text-3xl font-black text-slate-900">{card.usedCount}</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
