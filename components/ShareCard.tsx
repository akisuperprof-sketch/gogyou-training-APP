'use client';

import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Share2, X } from 'lucide-react';
import html2canvas from 'html2canvas';
import { Spirit } from '@/lib/types';
import { ELEMENT_COLORS } from '@/lib/data';

interface ShareCardProps {
    isOpen: boolean;
    onClose: () => void;
    spirit: Spirit;
}

export function ShareCard({ isOpen, onClose, spirit }: ShareCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);

    const handleDownload = async () => {
        if (!cardRef.current) return;
        const canvas = await html2canvas(cardRef.current, {
            backgroundColor: null,
            scale: 2
        });
        const link = document.createElement('a');
        link.download = `spirit-${spirit.name}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="relative w-full max-w-xs flex flex-col items-center"
                    >
                        {/* THE CARD */}
                        <div
                            ref={cardRef}
                            className="w-full aspect-[3/4] rounded-[2rem] p-6 shadow-2xl overflow-hidden relative"
                            style={{
                                background: `linear-gradient(135deg, ${(ELEMENT_COLORS[spirit.element] as any).bg}, #ffffff)`,
                                border: `4px solid ${(ELEMENT_COLORS[spirit.element] as any).primary}40`
                            }}
                        >
                            {/* Decorative elements */}
                            <div className="absolute top-0 right-0 w-32 h-32 opacity-10 bg-white rounded-full -mr-16 -mt-16" />
                            <div className="absolute bottom-0 left-0 w-24 h-24 opacity-10 bg-white rounded-full -ml-12 -mb-12" />

                            <div className="relative h-full flex flex-col justify-between items-center text-center">
                                <div>
                                    <p className="text-[10px] font-black tracking-[0.3em] uppercase text-slate-400">Five Elements Spirit</p>
                                    <h2 className="text-2xl font-black mt-1" style={{ color: (ELEMENT_COLORS[spirit.element] as any).primary }}>{spirit.name}</h2>
                                    <div className="inline-block px-3 py-1 rounded-full bg-white/80 shadow-sm mt-2">
                                        <span className="text-[10px] font-bold text-slate-500">{spirit.reading} • {spirit.element}</span>
                                    </div>
                                </div>

                                <div className="w-40 h-40 bg-white/40 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/50">
                                    <span className="text-7xl">👻</span> {/* Image placeholder */}
                                </div>

                                <div className="w-full">
                                    <div className="bg-white/60 p-3 rounded-2xl border border-white/50 backdrop-blur-sm shadow-sm">
                                        <p className="text-[10px] font-bold text-slate-600 leading-relaxed italic">
                                            「{spirit.description || '五行の導きを信じて。'}」
                                        </p>
                                    </div>
                                    <div className="mt-4 flex justify-between items-center text-[8px] font-black text-slate-400 uppercase tracking-widest px-2">
                                        <span>Kizuna Level: {spirit.stats.kizuna}</span>
                                        <span>Gogyou Training App</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="mt-8 flex space-x-4">
                            <button
                                onClick={handleDownload}
                                className="w-12 h-12 rounded-full bg-white text-slate-900 flex items-center justify-center shadow-lg active:scale-90 transition-transform"
                            >
                                <Download className="w-5 h-5" />
                            </button>
                            <button
                                onClick={onClose}
                                className="w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-lg active:scale-90 transition-transform"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
