'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Zap, Shield, LayoutGrid, Sparkles, Home } from 'lucide-react';

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
    return (
        <div className="flex flex-col min-h-[100dvh] p-4 sm:p-6 pb-12 relative overflow-hidden bg-slate-50">
            <header className="flex items-center justify-between mb-6 sm:mb-10 z-10 shrink-0">
                <div className="flex items-center space-x-3 sm:space-x-6">
                    <Link href="/" className="p-3 sm:p-4 bg-white border border-slate-100 rounded-[1.25rem] shadow-sm hover:bg-slate-50 transition-all active:scale-90">
                        <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 text-slate-700" />
                    </Link>
                    <div>
                        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">修行の間</h1>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">心の鍛錬</p>
                    </div>
                </div>
                <Link href="/" className="p-3 sm:p-4 bg-white border border-slate-100 rounded-[1.25rem] shadow-sm hover:bg-slate-50 transition-all">
                    <Home className="w-5 h-5 sm:w-6 sm:h-6 text-slate-700" />
                </Link>
            </header>

            <div className="flex-1 flex flex-col space-y-5 z-10">
                {GAMES.map((game, idx) => (
                    <Link href={game.href} key={game.id} className="block">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            whileTap={{ scale: 0.98 }}
                            className="relative h-28 sm:h-36 w-full overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] group bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all"
                        >
                            <div className="relative h-full flex items-center p-5 sm:p-8 space-x-4 sm:space-x-8">
                                <div className={cn(
                                    "p-3 sm:p-5 rounded-[1.25rem] sm:rounded-[1.5rem] bg-gradient-to-br text-white shadow-xl shadow-indigo-100 shrink-0",
                                    game.color
                                )}>
                                    <div className="w-7 h-7 sm:w-10 sm:h-10 flex items-center justify-center">
                                        {game.icon}
                                    </div>
                                </div>

                                <div className="flex-1 min-w-0">
                                    <h2 className="text-lg sm:text-xl font-black text-slate-900 mb-0.5 sm:mb-1 truncate">{game.title}</h2>
                                    <p className="text-slate-500 text-[10px] sm:text-xs font-bold leading-tight line-clamp-2">{game.desc}</p>
                                </div>

                                <div className="p-2 transition-transform group-hover:translate-x-1">
                                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300">
                                        <Sparkles className="w-5 h-5" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
