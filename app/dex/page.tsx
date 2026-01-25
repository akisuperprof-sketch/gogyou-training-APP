'use client';

import { useStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { ArrowLeft, Trophy, SlidersHorizontal, Sparkles, Book, Zap, ChevronRight, X } from 'lucide-react';
import Link from 'next/link';
import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CrudeDrug, Formula } from '@/lib/types';
import { ELEMENT_JP } from '@/lib/data';
import { KampoCard } from '@/components/KampoCard';
import { CardModal } from '@/components/CardModal';

type TabType = 'DRUGS' | 'FORMULAS';
type SortType = 'id' | 'element' | 'count';

export default function DexPage() {
    const { crudeDrugs, formulas, craftFormula, gameProgress, purchasePremium } = useStore();
    const [activeTab, setActiveTab] = useState<TabType>('DRUGS');
    const [selectedFormula, setSelectedFormula] = useState<Formula | null>(null);
    const [selectedDrug, setSelectedDrug] = useState<CrudeDrug | null>(null);
    const [filter, setFilter] = useState<'ALL' | 'Wood' | 'Fire' | 'Earth' | 'Metal' | 'Water'>('ALL');
    const [sortBy, setSortBy] = useState<SortType>('id');
    const [craftResult, setCraftResult] = useState<{ success: boolean, message: string } | null>(null);

    const allDrugs = useMemo(() => Object.values(crudeDrugs), [crudeDrugs]);
    const allFormulas = useMemo(() => Object.values(formulas), [formulas]);

    const discoveredDrugs = allDrugs.filter(c => c.discovered).length;
    const progressDrugs = Math.round((discoveredDrugs / allDrugs.length) * 100);

    const discoveredFormulas = allFormulas.filter(f => f.discovered).length;
    const progressFormulas = Math.round((discoveredFormulas / allFormulas.length) * 100);

    const filteredItems = useMemo(() => {
        let result: (CrudeDrug | Formula)[] = activeTab === 'DRUGS' ? [...allDrugs] : [...allFormulas];
        result = result.filter(item => filter === 'ALL' || item.element === filter);

        if (sortBy === 'id') {
            result.sort((a, b) => a.id - b.id);
        } else if (sortBy === 'element') {
            const order = { Wood: 1, Fire: 2, Earth: 3, Metal: 4, Water: 5 };
            result.sort((a, b) => order[a.element] - order[b.element]);
        } else if (sortBy === 'count') {
            result.sort((a, b) => b.ownedCount - a.ownedCount);
        }

        return result;
    }, [activeTab, allDrugs, allFormulas, filter, sortBy]);

    const handleCraft = (id: number) => {
        const result = craftFormula(id);
        setCraftResult(result);
        setTimeout(() => setCraftResult(null), 3000);
    };

    return (
        <div className="min-h-[100dvh] flex flex-col bg-slate-50 p-4 sm:p-6 pb-24 font-sans text-slate-900">
            <header className="flex items-center space-x-4 mb-6 sticky top-0 bg-slate-50/80 backdrop-blur-xl z-[70] py-2">
                <Link href="/" className="p-3 sm:p-4 bg-white border border-slate-100 rounded-[1.25rem] shadow-sm hover:bg-slate-50 transition-all active:scale-90">
                    <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 text-slate-700" />
                </Link>
                <div>
                    <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">生薬図鑑</h1>
                    <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase truncate">Crude Drug Collection</p>
                </div>
            </header>

            {/* Main Tabs */}
            <div className="flex bg-white/50 p-1.5 rounded-[1.75rem] border border-slate-100 mb-6 shadow-sm">
                <button
                    onClick={() => setActiveTab('DRUGS')}
                    className={cn(
                        "flex-1 flex items-center justify-center space-x-2 py-3.5 rounded-[1.25rem] transition-all",
                        activeTab === 'DRUGS'
                            ? "bg-slate-900 text-white shadow-lg shadow-slate-200"
                            : "text-slate-400 hover:text-slate-600"
                    )}
                >
                    <Book className={cn("w-4 h-4", activeTab === 'DRUGS' ? "text-emerald-400" : "")} />
                    <span className="text-xs font-black tracking-widest">基本生薬</span>
                </button>
                <button
                    onClick={() => setActiveTab('FORMULAS')}
                    className={cn(
                        "flex-1 flex items-center justify-center space-x-2 py-3.5 rounded-[1.25rem] transition-all relative",
                        activeTab === 'FORMULAS'
                            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100"
                            : "text-slate-400 hover:text-slate-600"
                    )}
                >
                    <Sparkles className={cn("w-4 h-4", activeTab === 'FORMULAS' ? "text-amber-400" : "")} />
                    <span className="text-xs font-black tracking-widest">漢方調合</span>
                    {!gameProgress.isPremiumUnlocked && (
                        <div className="absolute -top-1 -right-1">
                            <Zap className="w-3 h-3 text-amber-500 fill-current animate-pulse" />
                        </div>
                    )}
                </button>
            </div>

            {/* Progress Card */}
            <section className="mb-8 bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm flex items-center space-x-4">
                <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg text-white",
                    activeTab === 'DRUGS' ? "bg-emerald-500" : "bg-indigo-500"
                )}>
                    {activeTab === 'DRUGS' ? <Book className="w-6 h-6" /> : <Sparkles className="w-6 h-6" />}
                </div>
                <div className="flex-1">
                    <div className="flex justify-between items-end mb-2">
                        <span className="text-[10px] font-black text-slate-400 tracking-widest uppercase">
                            {activeTab === 'DRUGS' ? '生薬 収集率' : '漢方 習得率'}
                        </span>
                        <div className="text-right leading-none">
                            <span className="text-xl font-black text-slate-900">{activeTab === 'DRUGS' ? progressDrugs : progressFormulas}%</span>
                            <span className="text-[9px] block font-bold text-slate-400">
                                ({activeTab === 'DRUGS' ? discoveredDrugs : discoveredFormulas} / {activeTab === 'DRUGS' ? allDrugs.length : allFormulas.length})
                            </span>
                        </div>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${activeTab === 'DRUGS' ? progressDrugs : progressFormulas}%` }}
                            className={cn("h-full", activeTab === 'DRUGS' ? "bg-emerald-500" : "bg-indigo-500")}
                        />
                    </div>
                </div>
            </section>

            {/* Content Display */}
            <AnimatePresence mode="wait">
                {activeTab === 'FORMULAS' && !gameProgress.isPremiumUnlocked ? (
                    <motion.div
                        key="locked-premium"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="flex-1 flex flex-col items-center justify-center py-12 px-8 text-center bg-white rounded-[3rem] border-2 border-dashed border-indigo-100"
                    >
                        <div className="w-20 h-20 bg-indigo-50 rounded-[2rem] flex items-center justify-center mb-6">
                            <Sparkles className="w-10 h-10 text-indigo-500" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 mb-2">漢方調合モード</h3>
                        <p className="text-sm font-bold text-slate-400 leading-relaxed mb-8 px-4">
                            生薬を組み合わせて強力な漢方を作る「調合」機能は、マスター薬師へのアップグレードで解放されます。
                        </p>
                        <button
                            onClick={() => purchasePremium()}
                            className="w-full max-w-[240px] py-5 bg-indigo-600 text-white font-black rounded-3xl shadow-2xl shadow-indigo-100 transition-all active:scale-95"
                        >
                            アップグレードを解放する
                        </button>
                        <p className="text-[9px] font-bold text-indigo-400 uppercase mt-6 tracking-widest">
                            Ancient Wisdom Awaits
                        </p>
                    </motion.div>
                ) : (
                    <motion.div
                        key="content-list"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-6"
                    >
                        {/* Filter Pills */}
                        <div className="flex space-x-2 overflow-x-auto pb-4 no-scrollbar">
                            {['ALL', 'Wood', 'Fire', 'Earth', 'Metal', 'Water'].map((type) => (
                                <button
                                    key={type}
                                    onClick={() => setFilter(type as any)}
                                    className={cn(
                                        "px-5 py-2.5 rounded-2xl text-[10px] font-black tracking-wider transition-all border whitespace-nowrap shadow-sm",
                                        filter === type
                                            ? "bg-slate-900 text-white border-slate-900"
                                            : "bg-white text-slate-400 border-slate-100 hover:border-slate-300"
                                    )}
                                >
                                    {type === 'ALL' ? '全属性' : ELEMENT_JP[type as keyof typeof ELEMENT_JP]}
                                </button>
                            ))}
                        </div>

                        {/* Item Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pb-12">
                            <AnimatePresence mode="popLayout">
                                {filteredItems.map((item) => (
                                    <motion.div
                                        layout
                                        key={item.id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                    >
                                        <KampoCard
                                            card={item as any}
                                            isDiscovered={item.discovered}
                                            onClick={() => {
                                                if (activeTab === 'FORMULAS') {
                                                    setSelectedFormula(item as Formula);
                                                } else {
                                                    if (item.discovered) {
                                                        setSelectedDrug(item as CrudeDrug);
                                                    }
                                                }
                                            }}
                                        />
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Crafting / Recipe Modal */}
            <AnimatePresence>
                {selectedFormula && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-xl flex items-center justify-center p-4"
                        onClick={() => setSelectedFormula(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 50 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 50 }}
                            className="bg-white rounded-[3rem] w-full max-w-sm overflow-hidden flex flex-col shadow-3xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-8 border-b border-slate-50 relative flex flex-col items-center">
                                <button
                                    onClick={() => setSelectedFormula(null)}
                                    className="absolute top-6 right-6 p-2 bg-slate-50 rounded-xl text-slate-400"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                                <div className="w-16 h-16 bg-indigo-50 rounded-3xl flex items-center justify-center mb-4 shadow-inner">
                                    <Sparkles className="w-8 h-8 text-indigo-500" />
                                </div>
                                <h3 className="text-2xl font-black text-slate-900">{selectedFormula.name}</h3>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Formula Recipe</p>
                            </div>

                            <div className="p-8 space-y-6">
                                <div className="space-y-3">
                                    <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-wider">必要な生薬</h4>
                                    <div className="space-y-2">
                                        {selectedFormula.recipe.map((ingredient) => {
                                            const drug = crudeDrugs[ingredient.crudeDrugId];
                                            const hasEnough = drug.ownedCount >= ingredient.count;
                                            const ELEMENT_ICONS = {
                                                Wood: '🌿',
                                                Fire: '🔥',
                                                Earth: '⛰️',
                                                Metal: '💎',
                                                Water: '💧',
                                            };
                                            return (
                                                <div key={ingredient.crudeDrugId} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-xs shadow-sm">
                                                            {ELEMENT_ICONS[drug.element]}
                                                        </div>
                                                        <span className="text-xs font-bold text-slate-700">{drug.name}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <span className={cn(
                                                            "text-xs font-black",
                                                            hasEnough ? "text-slate-900" : "text-red-500"
                                                        )}>
                                                            {drug.ownedCount} / {ingredient.count}
                                                        </span>
                                                        {hasEnough ? (
                                                            <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center">
                                                                <ChevronRight className="w-3 h-3 text-white" />
                                                            </div>
                                                        ) : (
                                                            <div className="w-4 h-4 rounded-full bg-slate-200" />
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                <button
                                    disabled={!selectedFormula.recipe.every(i => crudeDrugs[i.crudeDrugId].ownedCount >= i.count)}
                                    onClick={() => handleCraft(selectedFormula.id)}
                                    className={cn(
                                        "w-full py-5 rounded-[1.5rem] font-black shadow-xl transition-all active:scale-95 flex flex-col items-center",
                                        selectedFormula.recipe.every(i => crudeDrugs[i.crudeDrugId].ownedCount >= i.count)
                                            ? "bg-slate-900 text-white shadow-indigo-100"
                                            : "bg-slate-100 text-slate-300 cursor-not-allowed"
                                    )}
                                >
                                    <span className="leading-none text-base">調合する</span>
                                    <span className="text-[10px] opacity-50 mt-1">生薬を消費して漢方を作ります</span>
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Drug Details Modal */}
            <CardModal card={selectedDrug} onClose={() => setSelectedDrug(null)} />

            {/* Result Toast */}
            <AnimatePresence>
                {craftResult && (
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        className={cn(
                            "fixed bottom-24 left-1/2 -translate-x-1/2 px-6 py-4 rounded-2xl shadow-2xl z-[150] flex items-center space-x-3 min-w-[280px]",
                            craftResult.success ? "bg-emerald-600 text-white" : "bg-red-600 text-white"
                        )}
                    >
                        {craftResult.success ? <Zap className="w-5 h-5 fill-current" /> : <X className="w-5 h-5" />}
                        <span className="font-black text-sm">{craftResult.message}</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
