'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Zap, Shield, LayoutGrid, Sparkles, Home } from 'lucide-react';

const GAMES = [
    {
        id: 'chain',
        title: '相生チェイン',
        desc: '五行のエネルギーを繋ごう',
        color: 'from-blue-500 to-cyan-400',
        icon: <Zap className="w-10 h-10" />,
        href: '/play/chain'
    },
    {
        id: 'guard',
        title: '相克ガード',
        desc: '暴走を抑え、調和を取り戻す',
        color: 'from-orange-500 to-red-400',
        icon: <Shield className="w-10 h-10" />,
        href: '/play/guard'
    },
    {
        id: 'sort',
        title: '連想仕分け',
        desc: '万物の属性を見極めよう',
        color: 'from-emerald-500 to-green-400',
        icon: <LayoutGrid className="w-10 h-10" />,
        href: '/play/sort'
    }
];

export default function PlayMenu() {
    return (
        <div className="flex flex-col min-h-screen p-6 pb-12 relative overflow-hidden bg-slate-50">
            <header className="flex items-center justify-between mb-10 z-10">
                <div className="flex items-center space-x-6">
                    <Link href="/" className="p-4 bg-white border border-slate-100 rounded-[1.25rem] shadow-sm hover:bg-slate-50 transition-all active:scale-90">
                        <ArrowLeft className="w-6 h-6 text-slate-700" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">修行の間</h1>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">心の鍛錬</p>
                    </div>
                </div>
                <Link href="/" className="p-4 bg-white border border-slate-100 rounded-[1.25rem] shadow-sm hover:bg-slate-50 transition-all">
                    <Home className="w-6 h-6 text-slate-700" />
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
                            className="relative h-36 w-full overflow-hidden rounded-[2.5rem] group bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all"
                        >
                            <div className="relative h-full flex items-center p-8 space-x-8">
                                <div className={cn(
                                    "p-5 rounded-[1.5rem] bg-gradient-to-br text-white shadow-xl shadow-indigo-100",
                                    game.color
                                )}>
                                    {game.icon}
                                </div>

                                <div className="flex-1">
                                    <h2 className="text-xl font-black text-slate-900 mb-1">{game.title}</h2>
                                    <p className="text-slate-500 text-xs font-bold leading-tight">{game.desc}</p>
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
