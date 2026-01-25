'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

interface StoryModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const STORY_STEPS = [
    {
        text: "こんにちは。五行の世界へようこそ。\nここでは「万物は5つの要素から成る」という古くからの知恵を学ぶことができます。",
        image: "/helper.png"
    },
    {
        text: "木、火、土、金、水…。これら5つが互いに助け合う「相生（そうせい）」、時に抑え合う「相克（そうこく）」によって、世界のバランスは保たれているのです。",
        image: "/helper.png"
    },
    {
        text: "最近、精霊たちの調子が少し不安定のようです。\nあなたの手で修行（ゲーム）を行い、彼らとの絆を深めてあげてください。",
        image: "/helper.png"
    },
    {
        text: "修行のご褒美には、古の知恵が詰まった「漢方カード」を差し上げます。\nさあ、図鑑を埋めながら、五行のマスターを目指しましょう！",
        image: "/helper.png"
    }
];

export function StoryModal({ isOpen, onClose }: StoryModalProps) {
    const [step, setStep] = useState(0);

    if (!isOpen) return null;

    const isLast = step === STORY_STEPS.length - 1;

    const next = () => {
        if (isLast) {
            onClose();
            setTimeout(() => setStep(0), 500);
        } else {
            setStep(s => s + 1);
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 bg-slate-900/80 backdrop-blur-md"
            >
                <motion.div
                    initial={{ scale: 0.9, y: 30 }}
                    animate={{ scale: 1, y: 0 }}
                    className="relative w-full max-w-sm bg-white rounded-[2.5rem] sm:rounded-[3rem] shadow-3xl overflow-hidden border border-white flex flex-col max-h-[90dvh]"
                >
                    {/* Character Image Background/Side */}
                    <div className="relative h-48 sm:h-64 w-full bg-slate-50 flex items-center justify-center overflow-hidden shrink-0">
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white" />
                        <motion.div
                            key={step}
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            className="relative z-10 w-full h-full"
                        >
                            <img
                                src="/helper.png"
                                alt="Helper"
                                className="w-full h-full object-contain object-bottom scale-110"
                            />
                        </motion.div>

                        <button
                            onClick={onClose}
                            className="absolute top-4 sm:top-6 right-4 sm:right-6 p-3 bg-white/50 backdrop-blur-md rounded-2xl hover:bg-white transition z-20"
                        >
                            <X className="w-5 h-5 text-slate-900" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 sm:space-y-8 no-scrollbar">
                        <div className="min-h-[100px]">
                            <AnimatePresence mode="wait">
                                <motion.p
                                    key={step}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="text-base font-black text-slate-700 leading-relaxed text-center whitespace-pre-wrap"
                                >
                                    {STORY_STEPS[step].text}
                                </motion.p>
                            </AnimatePresence>
                        </div>

                        <div className="flex flex-col items-center space-y-4">
                            <div className="flex space-x-1">
                                {STORY_STEPS.map((_, i) => (
                                    <div
                                        key={i}
                                        className={cn(
                                            "h-1.5 rounded-full transition-all",
                                            i === step ? "w-6 bg-slate-900" : "w-1.5 bg-slate-200"
                                        )}
                                    />
                                ))}
                            </div>

                            <button
                                onClick={next}
                                className="w-full py-5 bg-slate-900 text-white font-black rounded-3xl shadow-xl flex items-center justify-center space-x-3 active:scale-95 transition-all"
                            >
                                <span>{isLast ? "修行を開始する" : "次へ"}</span>
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

// Helper to use cn in this child if not imported correctly from utils
function cn(...classes: any[]) {
    return classes.filter(Boolean).join(' ');
}
