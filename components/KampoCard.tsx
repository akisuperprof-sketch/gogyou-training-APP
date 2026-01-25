'use client';

import { CrudeDrug, Formula, Element } from '@/lib/types';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { ELEMENT_COLORS, ELEMENT_JP, ELEMENT_READING } from '@/lib/data';
import { Shield, Zap, Sparkles } from 'lucide-react';

interface KampoCardProps {
    card: CrudeDrug | Formula;
    isDiscovered: boolean;
    onClick: () => void;
    className?: string;
}

const ELEMENT_ICONS: Record<Element, string> = {
    Wood: '🌿',
    Fire: '🔥',
    Earth: '⛰️',
    Metal: '💎',
    Water: '💧',
};

const ELEMENT_THEMES: Record<Element, { border: string; bg: string; text: string; light: string }> = {
    Wood: { border: 'border-green-200', bg: 'bg-green-50', text: 'text-green-700', light: 'bg-green-100/50' },
    Fire: { border: 'border-red-200', bg: 'bg-red-50', text: 'text-red-700', light: 'bg-red-100/50' },
    Earth: { border: 'border-yellow-200', bg: 'bg-yellow-50', text: 'text-yellow-700', light: 'bg-yellow-100/50' },
    Metal: { border: 'border-slate-200', bg: 'bg-slate-50', text: 'text-slate-700', light: 'bg-slate-100/50' },
    Water: { border: 'border-blue-200', bg: 'bg-blue-50', text: 'text-blue-700', light: 'bg-blue-100/50' },
};

export function KampoCard({ card, isDiscovered, onClick, className }: KampoCardProps) {
    const theme = ELEMENT_THEMES[card.element];

    return (
        <motion.button
            whileHover={isDiscovered ? { y: -4, scale: 1.02 } : { scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className={cn(
                "aspect-[3/4] relative flex flex-col w-full bg-white rounded-[1.5rem] border-2 shadow-xl overflow-hidden group transition-all",
                isDiscovered ? theme.border : "border-slate-100 bg-slate-50 shadow-none",
                className
            )}
        >
            {/* Header / Element Banner */}
            <div className={cn("h-7 w-full flex items-center justify-between px-3", isDiscovered ? theme.bg : "bg-slate-100")}>
                <div className="flex items-center space-x-1">
                    <span className={cn("text-[10px]", !isDiscovered && "grayscale")}>{ELEMENT_ICONS[card.element]}</span>
                    <span className={cn("text-[9px] font-black uppercase tracking-widest", isDiscovered ? theme.text : "text-slate-400")}>
                        {isDiscovered ? (
                            <ruby>{ELEMENT_JP[card.element]}<rt className="text-[6px] tracking-normal">{ELEMENT_READING[card.element]}</rt></ruby>
                        ) : "???"}
                    </span>
                </div>
                <span className="text-[9px] font-black text-slate-300 whitespace-nowrap">ID: {String(card.id).padStart(3, '0')}</span>
            </div>

            {/* Illustration Area */}
            <div className={cn("flex-1 m-2 rounded-xl flex items-center justify-center relative overflow-hidden", isDiscovered ? theme.light : "bg-slate-200/50")}>
                {isDiscovered ? (
                    <>
                        <div className="absolute inset-0 opacity-10 pointer-events-none">
                            <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '12px 12px' }} />
                        </div>
                        <div className="relative z-10 text-5xl transform group-hover:scale-110 transition-transform duration-500 drop-shadow-xl">
                            {ELEMENT_ICONS[card.element]}
                        </div>
                        <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm border border-slate-100 px-2 py-0.5 rounded-lg flex items-center space-x-1 shadow-sm">
                            <Zap className="w-2.5 h-2.5 text-yellow-500 fill-current" />
                            <span className="text-[10px] font-black text-slate-700">{card.effectValue}</span>
                        </div>
                    </>
                ) : (
                    <div className="text-4xl text-slate-200 font-black">?</div>
                )}
            </div>

            {/* Content area */}
            <div className="px-3 pb-3 pt-1">
                {isDiscovered ? (
                    <>
                        <h3 className="text-[12px] font-black text-slate-800 leading-tight mb-0.5 truncate">
                            <ruby>{card.name}<rt className="text-[7px] font-normal tracking-tight">{card.reading}</rt></ruby>
                        </h3>
                        <p className="text-[8px] text-slate-400 font-bold leading-tight line-clamp-2">
                            {card.flavor}
                        </p>
                    </>
                ) : (
                    <>
                        <div className="h-3 w-2/3 bg-slate-200 rounded-full mb-1" />
                        <div className="h-2 w-full bg-slate-100 rounded-full" />
                    </>
                )}
            </div>

            {/* Owned Badge */}
            {isDiscovered && card.ownedCount > 0 && (
                <div className="absolute -top-1 -right-1 z-10">
                    <div className="bg-slate-900 text-white min-w-[24px] h-6 px-1.5 rounded-full text-[10px] font-black flex items-center justify-center shadow-lg border-2 border-white">
                        {card.ownedCount}
                    </div>
                </div>
            )}

            {/* Glossy Overlay */}
            {isDiscovered && (
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
        </motion.button>
    );
}
