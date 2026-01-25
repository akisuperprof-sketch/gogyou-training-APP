'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Zap, Shield, LayoutGrid, Sparkles, Home, Lock } from 'lucide-react';
import { useStore } from '@/lib/store';

const GAMES = [
    {
        id: 'chain',
        title: (
            <>
                <ruby>相生<rt className="text-[10px] tracking-normal font-normal">そうせい</rt></ruby>チェイン
            </>
        ),
        desc: (
            <>
                次の要素を「生む」助け合いの<ruby>相生<rt className="text-[7px]">そうせい</rt></ruby>を繋ごう
            </>
        ),
        color: 'from-blue-500 to-cyan-400',
        icon: <Zap className="w-10 h-10" />,
        href: '/play/chain'
    },
    {
        id: 'guard',
        title: (
            <>
                <ruby>相克<rt className="text-[10px] tracking-normal font-normal">そうこく</rt></ruby>ガード
            </>
        ),
        desc: (
            <>
                暴走する力を「抑える」<ruby>相克<rt className="text-[7px]">そうこく</rt></ruby>で調和を守ろう
            </>
        ),
        color: 'from-orange-500 to-red-400',
        icon: <Shield className="w-10 h-10" />,
        href: '/play/guard'
    },
    {
        id: 'sort',
        title: '連想仕分け',
        desc: '季節や感情など、万物の属性を見極めよう',
        color: 'from-emerald-500 to-green-400',
        icon: <LayoutGrid className="w-10 h-10" />,
        href: '/play/sort'
    }
];

export default function PlayMenu() {
    const { gameProgress } = useStore();
    const unlockedCount = gameProgress.gamesUnlockedCount || 1;

    return (
        <div className="flex flex-col h-[100dvh] p-4 sm:p-6 pb-8 relative overflow-hidden bg-slate-50">
            <header className="flex items-center justify-between mb-4 sm:mb-8 z-10 shrink-0">
                <div className="flex items-center space-x-3 sm:space-x-6">
                    <Link href="/" className="p-3 sm:p-4 bg-white border border-slate-100 rounded-[1.25rem] shadow-sm hover:bg-slate-50 transition-all active:scale-90">
                        <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 text-slate-700" />
                    </Link>
                    <div>
                        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">修行の間</h1>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none">心の鍛錬</p>
                    </div>
                </div>
                <Link href="/" className="p-3 sm:p-4 bg-white border border-slate-100 rounded-[1.25rem] shadow-sm hover:bg-slate-50 transition-all">
                    <Home className="w-5 h-5 sm:w-6 sm:h-6 text-slate-700" />
                </Link>
            </header>

            <div className="flex-1 flex flex-col space-y-3 sm:space-y-5 z-10 overflow-y-auto no-scrollbar">
                {GAMES.map((game, idx) => {
                    const isLocked = idx >= unlockedCount;
                    return (
                        <div key={game.id} className="relative">
                            <Link
                                href={isLocked ? '#' : game.href}
                                className={cn("block transition-all", isLocked && "opacity-50 grayscale cursor-not-allowed")}
                                onClick={(e) => isLocked && e.preventDefault()}
                            >
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: idx * 0.1 }}
                                    whileTap={!isLocked ? { scale: 0.98 } : {}}
                                    className="relative h-24 sm:h-36 w-full overflow-hidden rounded-[1.5rem] sm:rounded-[2.5rem] group bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all shrink-0"
                                >
                                    <div className="relative h-full flex items-center p-4 sm:p-8 space-x-3 sm:space-x-8">
                                        <div className={cn(
                                            "p-2.5 sm:p-5 rounded-2xl sm:rounded-[1.5rem] bg-gradient-to-br text-white shadow-xl shadow-indigo-100 shrink-0",
                                            isLocked ? "from-slate-300 to-slate-400" : game.color
                                        )}>
                                            <div className="w-6 h-6 sm:w-10 sm:h-10 flex items-center justify-center">
                                                {isLocked ? <Lock className="w-6 h-6 sm:w-8 sm:h-8" /> : game.icon}
                                            </div>
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <h2 className="text-lg sm:text-xl font-black text-slate-900 mb-0.5 sm:mb-1 truncate">
                                                {isLocked ? '????? 修行' : game.title}
                                            </h2>
                                            <p className="text-slate-500 text-[10px] sm:text-xs font-bold leading-tight line-clamp-2">
                                                {isLocked ? '修行を重ねて解放しよう' : game.desc}
                                            </p>
                                        </div>

                                        {!isLocked && (
                                            <div className="p-2 transition-transform group-hover:translate-x-1">
                                                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300">
                                                    <Sparkles className="w-5 h-5" />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            </Link>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
