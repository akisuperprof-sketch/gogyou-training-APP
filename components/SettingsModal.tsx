'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Crown, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useStore } from '@/lib/store';
import { DebugPreset } from '@/lib/types';
import { useState } from 'react';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
    const { gameProgress, toggleMasterMode, applyDebugPreset } = useStore();
    const [selectedPreset, setSelectedPreset] = useState<DebugPreset>('FULL');

    const handleApply = () => {
        applyDebugPreset(selectedPreset);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[120] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="text-xl font-black text-slate-900 flex items-center">
                                <Settings className="w-5 h-5 mr-2" />
                                設定
                            </h3>
                            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-6">
                            
                            {/* Developer Mode Toggle */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-bold text-slate-900 flex items-center">
                                        <Crown className="w-4 h-4 mr-1 text-amber-500" />
                                        開発者モード
                                    </h4>
                                    <p className="text-xs text-slate-500 mt-1">詳細なデバッグ情報を表示したり、実験的な機能を試したりできます。</p>
                                </div>
                                <button
                                    onClick={toggleMasterMode}
                                    className={cn(
                                        "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none",
                                        gameProgress.isMasterMode ? "bg-indigo-600" : "bg-slate-200"
                                    )}
                                >
                                    <span
                                        className={cn(
                                            "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                                            gameProgress.isMasterMode ? "translate-x-6" : "translate-x-1"
                                        )}
                                    />
                                </button>
                            </div>

                            {/* Debug Options (Only visible when active) */}
                            <AnimatePresence>
                                {gameProgress.isMasterMode && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden space-y-4"
                                    >
                                        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                                            <p className="text-sm font-bold text-yellow-800 mb-1">開発者モード有効中:</p>
                                            <p className="text-xs text-yellow-700">全ての機能制限が解除され、デバッグログが表示されます。</p>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-900 block">
                                                診断ロジック（実験的）:
                                            </label>
                                            <select
                                                value={selectedPreset}
                                                onChange={(e) => setSelectedPreset(e.target.value as DebugPreset)}
                                                className="w-full p-2 rounded-lg border border-slate-200 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            >
                                                <option value="FULL">フル解放 (開発用デフォルト)</option>
                                                <option value="RESET">リセット (初期状態)</option>
                                                <option value="VISUAL">ビジュアルだけ (UI確認)</option>
                                                <option value="GAMES">ゲーム全部 (修行テスト)</option>
                                                <option value="SPIRITS">精霊全部 (会話テスト)</option>
                                                <option value="HALF_DRUGS">生薬半分 (収集テスト)</option>
                                                <option value="CRAFTING">調合可能 (機能テスト)</option>
                                            </select>
                                            <p className="text-[10px] text-slate-400">
                                                ※ プリセットを選ぶと、現在の進行状況が上書きされます。
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Action Button */}
                             <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="pt-2"
                             >
                                <button
                                    onClick={handleApply}
                                    disabled={!gameProgress.isMasterMode}
                                    className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    完了
                                </button>
                             </motion.div>

                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
