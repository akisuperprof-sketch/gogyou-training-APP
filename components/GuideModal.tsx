'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap, Shield, BookOpen, Search, ArrowRight, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GuideModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function GuideModal({ isOpen, onClose }: GuideModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[120] bg-slate-900/60 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6"
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 50 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 50 }}
                        className="bg-white rounded-[3rem] w-full max-w-2xl h-[85vh] flex flex-col overflow-hidden shadow-3xl border-4 border-indigo-50"
                    >
                        {/* Header */}
                        <div className="p-6 sm:p-8 border-b border-slate-50 flex justify-between items-center bg-indigo-50/30">
                            <div className="flex items-center space-x-3">
                                <div className="p-3 bg-indigo-500 rounded-2xl shadow-lg">
                                    <BookOpen className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl sm:text-2xl font-black text-slate-900">五行学習ガイド</h3>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Master Learning Concepts</p>
                                </div>
                            </div>
                            <button onClick={onClose} className="p-3 bg-white rounded-2xl text-slate-400 hover:text-slate-600 shadow-sm active:scale-90 transition-all">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-12 no-scrollbar">

                            {/* Core Concept Section */}
                            <section className="space-y-6">
                                <div className="inline-block px-4 py-1.5 bg-indigo-100 text-indigo-600 text-[10px] font-black rounded-full uppercase tracking-widest">
                                    Core Concept
                                </div>
                                <h4 className="text-2xl font-black text-slate-900 leading-tight">
                                    五行を学ぶ上で<br /><span className="text-indigo-500">最も大切な「見極め」</span>
                                </h4>
                                <div className="bg-slate-50 rounded-[2.5rem] p-6 sm:p-8 border border-slate-100 space-y-6">
                                    <div className="flex items-start space-x-4">
                                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm text-indigo-500">
                                            <Search className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-700 leading-relaxed">
                                                まず、自分の心や体が<br />
                                                <span className="text-lg text-slate-900 font-black">「いま、どこが強すぎ（暴走）て、どこが弱っているか？」</span><br />
                                                を見極めることが全ての始まりです。
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="bg-white p-5 rounded-3xl border border-indigo-100 shadow-sm space-y-3">
                                            <div className="flex items-center space-x-2 text-red-500">
                                                <Shield className="w-5 h-5 fill-current" />
                                                <span className="font-black text-sm uppercase">Brake</span>
                                            </div>
                                            <p className="text-sm font-bold text-slate-600">
                                                強すぎる所には<br />
                                                <span className="text-lg text-slate-900 font-black">相克（ブレーキ）</span>を！
                                            </p>
                                            <p className="text-[10px] text-slate-400 leading-relaxed">暴走したエネルギーを抑え、調和を取り戻します。</p>
                                        </div>
                                        <div className="bg-white p-5 rounded-3xl border border-indigo-100 shadow-sm space-y-3">
                                            <div className="flex items-center space-x-2 text-indigo-500">
                                                <Zap className="w-5 h-5 fill-current" />
                                                <span className="font-black text-sm uppercase">Accelerator</span>
                                            </div>
                                            <p className="text-sm font-bold text-slate-600">
                                                弱っている所には<br />
                                                <span className="text-lg text-slate-900 font-black">相生（アクセル）</span>を！
                                            </p>
                                            <p className="text-[10px] text-slate-400 leading-relaxed">枯渇したエネルギーを補い、循環を助けます。</p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Game Link Section */}
                            <section className="space-y-6">
                                <div className="inline-block px-4 py-1.5 bg-emerald-100 text-emerald-600 text-[10px] font-black rounded-full uppercase tracking-widest">
                                    Training Systems
                                </div>
                                <h4 className="text-2xl font-black text-slate-900 leading-tight">修行を通じた体感学習</h4>

                                <div className="space-y-4">
                                    <div className="group bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:border-indigo-100 transition-all">
                                        <div className="flex items-center space-x-4 mb-3">
                                            <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center text-white shadow-lg">
                                                <Zap className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h5 className="font-black text-slate-900">相生チェイン (Sousei)</h5>
                                                <p className="text-[10px] font-bold text-slate-400">エネルギーを補う巡りの修行</p>
                                            </div>
                                        </div>
                                        <p className="text-xs text-slate-500 leading-relaxed">
                                            「木➜火➜土➜金➜水」という生み出す流れを学び、弱った場所へエネルギーを送る感覚を養います。
                                        </p>
                                    </div>

                                    <div className="group bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:border-indigo-100 transition-all">
                                        <div className="flex items-center space-x-4 mb-3">
                                            <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center text-white shadow-lg">
                                                <Shield className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h5 className="font-black text-slate-900">相克ガード (Soukoku)</h5>
                                                <p className="text-[10px] font-bold text-slate-400">暴走を抑える制御の修行</p>
                                            </div>
                                        </div>
                                        <p className="text-xs text-slate-500 leading-relaxed">
                                            「木➜土➜水➜火➜金」という抑制の力を使い、過剰になったエネルギー（暴走）を食い止める瞬発力を磨きます。
                                        </p>
                                    </div>

                                    <div className="group bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:border-indigo-100 transition-all">
                                        <div className="flex items-center space-x-4 mb-3">
                                            <div className="w-12 h-12 bg-indigo-500 rounded-2xl flex items-center justify-center text-white shadow-lg">
                                                <Search className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h5 className="font-black text-slate-900">連想仕分け (Correlation)</h5>
                                                <p className="text-[10px] font-bold text-slate-400">万物の属性を見極める修行</p>
                                            </div>
                                        </div>
                                        <p className="text-xs text-slate-500 leading-relaxed">
                                            季節、感情、臓器、味など、あらゆる事象がどの五行に属するかを瞬時に判断し、総合的な知識を深めます。
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* Conclusion Section */}
                            <section className="bg-indigo-900 rounded-[3rem] p-8 sm:p-10 text-center space-y-6 relative overflow-hidden">
                                <Sparkles className="absolute top-4 left-4 w-8 h-8 text-indigo-400/30" />
                                <Sparkles className="absolute bottom-4 right-4 w-12 h-12 text-indigo-400/30" />
                                <h4 className="text-2xl font-black text-white">あなたの内なる宇宙を<br />調和させましょう</h4>
                                <p className="text-sm font-bold text-indigo-200 leading-relaxed">
                                    修行で得た感覚は、必ず日常の養生に活かされます。<br />
                                    日々の「見極め」を楽しんでください。
                                </p>
                                <button
                                    onClick={onClose}
                                    className="px-8 py-4 bg-white text-indigo-950 font-black rounded-2xl shadow-xl hover:scale-105 transition-all"
                                >
                                    理解しました
                                </button>
                            </section>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
