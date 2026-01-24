'use client';

import { useStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { ArrowLeft, Home, Trophy, SlidersHorizontal } from 'lucide-react';
import Link from 'next/link';
import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CardModal } from '@/components/CardModal';
import { Card } from '@/lib/types';
import { ELEMENT_JP } from '@/lib/data';
import { KampoCard } from '@/components/KampoCard';

type SortType = 'id' | 'element' | 'used';

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
    const [sortBy, setSortBy] = useState<SortType>('id');

    const filteredCards = useMemo(() => {
        let result = allCards.filter(c => filter === 'ALL' || c.element === filter);

        if (sortBy === 'id') {
            result.sort((a, b) => a.id - b.id);
        } else if (sortBy === 'element') {
            const order = { Wood: 1, Fire: 2, Earth: 3, Metal: 4, Water: 5 };
            result.sort((a, b) => order[a.element] - order[b.element]);
        } else if (sortBy === 'used') {
            result.sort((a, b) => b.usedCount - a.usedCount);
        }

        return result;
    }, [allCards, filter, sortBy]);

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 p-6 pb-12 font-sans text-slate-900">
            <header className="flex items-center justify-between mb-8 sticky top-0 bg-slate-50/80 backdrop-blur-xl z-20 py-2">
                <div className="flex items-center space-x-6">
                    <Link href="/" className="p-4 bg-white border border-slate-100 rounded-[1.25rem] shadow-sm hover:bg-slate-50 transition-all active:scale-90">
                        <ArrowLeft className="w-6 h-6 text-slate-700" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">漢方図鑑</h1>
                        <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">Collection History</p>
                    </div>
                </div>
                <Link href="/" className="p-4 bg-white border border-slate-100 rounded-[1.25rem] shadow-sm hover:bg-slate-50">
                    <Home className="w-6 h-6 text-slate-700" />
                </Link>
            </header>

            {/* Stats Card */}
            <section className="mb-8 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center space-x-7">
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

            {/* Filters & Sorting */}
            <div className="space-y-4 mb-8">
                <div className="flex space-x-2 overflow-x-auto pb-2 no-scrollbar">
                    {['ALL', 'Wood', 'Fire', 'Earth', 'Metal', 'Water'].map((type) => (
                        <button
                            key={type}
                            onClick={() => setFilter(type as any)}
                            className={cn(
                                "px-6 py-3 rounded-2xl text-xs font-black tracking-wider transition-all border whitespace-nowrap shadow-sm",
                                filter === type
                                    ? "bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-200"
                                    : "bg-white text-slate-400 border-slate-100 hover:border-slate-300"
                            )}
                        >
                            {type === 'ALL' ? '全属性' : ELEMENT_JP[type as keyof typeof ELEMENT_JP]}
                        </button>
                    ))}
                </div>

                <div className="flex items-center space-x-3 bg-white/50 p-2 rounded-2xl border border-slate-100 overflow-x-auto no-scrollbar">
                    <div className="p-2 shrink-0">
                        <SlidersHorizontal className="w-4 h-4 text-slate-300" />
                    </div>
                    {[
                        { id: 'id', label: '取得順' },
                        { id: 'element', label: '五行順' },
                        { id: 'used', label: '使用回数' }
                    ].map((s) => (
                        <button
                            key={s.id}
                            onClick={() => setSortBy(s.id as SortType)}
                            className={cn(
                                "px-4 py-2 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all whitespace-nowrap",
                                sortBy === s.id
                                    ? "bg-indigo-50 text-indigo-600 ring-1 ring-indigo-200"
                                    : "text-slate-400 hover:text-slate-600"
                            )}
                        >
                            {s.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6 pb-20">
                <AnimatePresence mode="popLayout">
                    {filteredCards.map((card) => (
                        <motion.div
                            layout
                            key={card.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                        >
                            <KampoCard
                                card={card}
                                isDiscovered={card.discovered}
                                onClick={() => card.discovered && setSelectedCard(card)}
                            />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            <CardModal card={selectedCard} onClose={() => setSelectedCard(null)} />
        </div>
    );
}
