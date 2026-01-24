'use client';

import { useStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { ArrowLeft, Home, Trophy } from 'lucide-react';
import Link from 'next/link';
import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CardModal } from '@/components/CardModal';
import { Card } from '@/lib/types';
import { ELEMENT_JP } from '@/lib/data';

export default function DexPage() {
    const { cards, clearNewCardsFlag } = useStore();

    useEffect(() => {
        clearNewCardsFlag();
    }, [clearNewCardsFlag]);

    const allCards = useMemo(() => Object.values(cards), [cards]);
    const discoveredCount = allCards.filter(c => c.discovered).length;
    const totalCount = allCards.length;
    const progress = Math.round((discoveredCount / totalCount) * 100);

    const [selectedCard, setSelectedCard] = useState<Card | null>(null);
    const [filter, setFilter] = useState<'ALL' | 'Wood' | 'Fire' | 'Earth' | 'Metal' | 'Water'>('ALL');

    const filteredCards = allCards.filter(c => filter === 'ALL' || c.element === filter).sort((a, b) => a.id - b.id);

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 p-6 pb-12 font-sans text-slate-900">
            <header className="flex items-center justify-between mb-8 sticky top-0 bg-slate-50/80 backdrop-blur-xl z-20 py-2">
                <div className="flex items-center space-x-6">
                    <Link href="/" className="p-4 bg-white border border-slate-100 rounded-[1.25rem] shadow-sm hover:bg-slate-50 transition-all active:scale-90">
                        <ArrowLeft className="w-6 h-6 text-slate-700" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">漢方図鑑</h1>
                        <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">収集の記録</p>
                    </div>
                </div>
                <Link href="/" className="p-4 bg-white border border-slate-100 rounded-[1.25rem] shadow-sm hover:bg-slate-50">
                    <Home className="w-6 h-6 text-slate-700" />
                </Link>
            </header>

            {/* Stats Card */}
            <section className="mb-8 bg-white p-7 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center space-x-7">
                <div className="w-20 h-20 rounded-[1.5rem] bg-indigo-500 flex items-center justify-center shadow-xl shadow-indigo-100 shrink-0">
                    <Trophy className="w-10 h-10 text-white" />
                </div>
                <div className="flex-1">
                    <div className="flex justify-between items-end mb-3">
                        <span className="text-xs font-black text-slate-400 tracking-widest uppercase">現在の収集率</span>
                        <span className="text-2xl font-black text-slate-900">{progress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden shadow-inner">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            className="h-full bg-indigo-500 rounded-full"
                        />
                    </div>
                </div>
            </section>

            {/* Filters */}
            <div className="flex space-x-3 overflow-x-auto pb-6 no-scrollbar">
                {['ALL', 'Wood', 'Fire', 'Earth', 'Metal', 'Water'].map((type) => (
                    <button
                        key={type}
                        onClick={() => setFilter(type as any)}
                        className={cn(
                            "px-6 py-3 rounded-2xl text-xs font-black tracking-wider transition-all border shadow-sm",
                            filter === type
                                ? "bg-slate-900 text-white border-slate-900 shadow-xl shadow-slate-200"
                                : "bg-white text-slate-400 border-slate-100 hover:border-slate-300"
                        )}
                    >
                        {type === 'ALL' ? '全属性' : ELEMENT_JP[type as keyof typeof ELEMENT_JP]}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-3 gap-5">
                {filteredCards.map((card) => {
                    const isDiscovered = card.discovered;
                    return (
                        <button
                            key={card.id}
                            onClick={() => isDiscovered && setSelectedCard(card)}
                            disabled={!isDiscovered}
                            className={cn(
                                "aspect-[4/5] rounded-[2rem] relative flex flex-col items-center justify-center p-4 transition-all border",
                                isDiscovered
                                    ? "bg-white border-white shadow-sm hover:shadow-md active:scale-95"
                                    : "bg-slate-100 border-slate-100 opacity-40 grayscale"
                            )}
                        >
                            {isDiscovered ? (
                                <>
                                    <div className="text-4xl mb-3 drop-shadow-sm">🌿</div>
                                    <span className="text-[11px] font-black text-center text-slate-800 leading-tight">
                                        {card.name}
                                    </span>
                                    {card.ownedCount > 0 && (
                                        <span className="absolute -top-1 -right-1 min-w-[24px] h-6 px-1.5 bg-indigo-500 text-white rounded-xl text-[10px] flex items-center justify-center font-black shadow-lg shadow-indigo-100 border-2 border-white">
                                            {card.ownedCount}
                                        </span>
                                    )}
                                </>
                            ) : (
                                <span className="text-2xl font-black text-slate-300">?</span>
                            )}
                        </button>
                    )
                })}
            </div>

            <CardModal card={selectedCard} onClose={() => setSelectedCard(null)} />
        </div>
    );
}
