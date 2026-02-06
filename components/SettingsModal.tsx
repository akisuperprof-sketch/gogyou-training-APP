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

import { useSubscription } from '@/lib/hooks/useSubscription';

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
    const {
        gameProgress,
        toggleMasterMode,
        toggleDebugFlag,
        toggleCareMode,
        toggleBuruBuruMode,
        toggleVoiceMode,
        toggleAiMode,
        toggleEvolutionMode,
        toggleCampaignMode,
        setGamesUnlockedCount,
        applyDebugPreset
    } = useStore();
    const { isPremium, subscriptionStatus, loading, checkout } = useSubscription();
    const [selectedPreset, setSelectedPreset] = useState<DebugPreset>('FULL');

    const handleApply = () => {
        applyDebugPreset(selectedPreset);
        onClose();
    };

    const periodEndStr = (dateStr?: string) => {
        if (!dateStr) return '';
        return new Date(dateStr).toLocaleDateString();
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
                        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <div className="flex items-center space-x-3">
                                <Settings className="w-5 h-5 text-slate-400" />
                                <div>
                                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">App Settings</h3>
                                    <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">Environment & Debug</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={toggleMasterMode}
                                    className={cn(
                                        "px-2 py-1 rounded-md text-[8px] font-black uppercase transition-all",
                                        gameProgress.isMasterMode ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-400"
                                    )}
                                >
                                    Master
                                </button>
                                <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-8 overflow-y-auto max-h-[80vh] overscroll-contain">

                            {/* ... (Existing Contnet) ... */}

                            {/* Subscription Section */}
                            <div className="space-y-4">
                                <h4 className="font-bold text-slate-900 flex items-center text-sm uppercase tracking-wider text-slate-400">
                                    アカウントプラン
                                </h4>
                                <div className={cn(
                                    "p-5 rounded-2xl border-2 flex flex-col items-center text-center space-y-2",
                                    isPremium ? "bg-amber-50 border-amber-200" : "bg-slate-50 border-slate-100"
                                )}>
                                    {isPremium ? (
                                        <>
                                            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mb-1">
                                                <Crown className="w-6 h-6 text-amber-500 fill-current" />
                                            </div>
                                            <h5 className="font-black text-lg text-amber-900">プレミアム会員</h5>
                                            <p className="text-xs font-bold text-amber-700">
                                                全ての機能が解放されています
                                            </p>
                                        </>
                                    ) : (
                                        <>
                                            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-1">
                                                <div className="w-6 h-6 text-slate-400">FREE</div>
                                            </div>
                                            <h5 className="font-black text-lg text-slate-700">フリープラン</h5>
                                            <p className="text-xs text-slate-500 max-w-[200px]">
                                                一部の機能が制限されています。<br />プレミアムプランで全開放しましょう。
                                            </p>
                                        </>
                                    )}

                                    {!isPremium && (
                                        <button
                                            onClick={checkout}
                                            disabled={loading}
                                            className="mt-4 w-full py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-black rounded-xl shadow-lg shadow-indigo-200 active:scale-95 transition-all flex items-center justify-center space-x-2"
                                        >
                                            {loading ? (
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            ) : (
                                                <>
                                                    <Crown className="w-4 h-4" />
                                                    <span>プレミアムに登録する</span>
                                                </>
                                            )}
                                        </button>
                                    )}
                                </div>
                            </div>

                            <hr className="border-slate-100" />

                            <div className="space-y-3">
                                <h4 className="font-bold text-slate-900 flex items-center text-xs uppercase tracking-wider text-slate-400">
                                    🧪 実験機能・先行開発モード
                                </h4>
                                <div className="grid grid-cols-1 gap-3">
                                    {[
                                        { key: 'isBuruBuruMode', label: '🍮 UI模倣モード (ぷにぷに)', desc: '画像のようなポップなUIに変更', toggle: toggleBuruBuruMode, color: 'orange' },
                                        { key: 'isCareMode', label: '🍵 お世話モード', desc: 'なでなで・お供えが可能に', toggle: toggleCareMode, color: 'emerald' },
                                        { key: 'isVoiceMode', label: '🔊 音響・振動モード', desc: 'SE・ボイス・振動演出', toggle: toggleVoiceMode, color: 'blue' },
                                        { key: 'isAiMode', label: '🧠 体質診断・AIモード', desc: 'Geminiによる診断と助言', toggle: toggleAiMode, color: 'purple' },
                                        { key: 'isEvolutionMode', label: '✨ 進化・コレクション', desc: '進化演出・シェア画像生成', toggle: toggleEvolutionMode, color: 'amber' },
                                        { key: 'isCampaignMode', label: '🎁 キャンペーン連携', desc: '期間限定・リアル店舗連携', toggle: toggleCampaignMode, color: 'indigo' },
                                    ].map((mode) => (
                                        <div key={mode.key} className={cn(
                                            "flex items-center justify-between p-3 rounded-xl border transition-all",
                                            gameProgress[mode.key as keyof typeof gameProgress]
                                                ? `bg-${mode.color}-50/50 border-${mode.color}-100`
                                                : "bg-slate-50/50 border-slate-100"
                                        )}>
                                            <div>
                                                <h5 className={cn(
                                                    "font-bold text-xs",
                                                    gameProgress[mode.key as keyof typeof gameProgress] ? `text-${mode.color}-700` : "text-slate-700"
                                                )}>{mode.label}</h5>
                                                <p className="text-[10px] text-slate-400 mt-0.5">{mode.desc}</p>
                                            </div>
                                            <button
                                                onClick={mode.toggle}
                                                className={cn(
                                                    "relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none",
                                                    gameProgress[mode.key as keyof typeof gameProgress] ? `bg-${mode.color}-500` : "bg-slate-200"
                                                )}
                                            >
                                                <span
                                                    className={cn(
                                                        "inline-block h-3 w-3 transform rounded-full bg-white transition-transform",
                                                        gameProgress[mode.key as keyof typeof gameProgress] ? "translate-x-5" : "translate-x-1"
                                                    )}
                                                />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Debug Options (Only visible when active) */}
                            <AnimatePresence>
                                {gameProgress.isMasterMode && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden space-y-4 pt-2"
                                    >
                                        <div className="space-y-3">
                                            <p className="text-xs font-bold text-slate-500">デバッグ機能 (個別ON/OFF)</p>

                                            <div className="grid grid-cols-1 gap-2">
                                                {[
                                                    { key: 'showImages', label: '🖼️ ビジュアル表示 (画像)' },
                                                    { key: 'unlockAllSpirits', label: '👻 精霊全解放' },
                                                    { key: 'unlockAllItems', label: '💊 アイテム全解放' },
                                                    { key: 'unlockPremium', label: '👑 プレミアム解放' },
                                                ].map((item) => (
                                                    <div key={item.key} className="flex items-center justify-between bg-slate-50 p-2 rounded-lg">
                                                        <span className="text-xs font-bold text-slate-700">{item.label}</span>
                                                        <button
                                                            onClick={() => toggleDebugFlag(item.key as any)}
                                                            className={cn(
                                                                "relative inline-flex h-4 w-7 items-center rounded-full transition-colors focus:outline-none",
                                                                !!gameProgress.debugFlags?.[item.key as keyof typeof gameProgress.debugFlags] ? "bg-indigo-500" : "bg-slate-300"
                                                            )}
                                                        >
                                                            <span
                                                                className={cn(
                                                                    "inline-block h-2 w-2 transform rounded-full bg-white transition-transform",
                                                                    !!gameProgress.debugFlags?.[item.key as keyof typeof gameProgress.debugFlags] ? "translate-x-4" : "translate-x-1"
                                                                )}
                                                            />
                                                        </button>
                                                    </div>
                                                ))}

                                                {/* Game Unlock Stepper */}
                                                <div className="flex items-center justify-between bg-slate-50 p-2 rounded-lg">
                                                    <span className="text-xs font-bold text-slate-700">🎮 ゲーム解放レベル</span>
                                                    <div className="flex space-x-1">
                                                        {[1, 2, 3].map((level) => (
                                                            <button
                                                                key={level}
                                                                onClick={() => {
                                                                    // レベル指定時は「全解放」フラグを強制OFFにする
                                                                    if (gameProgress.debugFlags?.unlockAllGames) {
                                                                        toggleDebugFlag('unlockAllGames');
                                                                    }
                                                                    setGamesUnlockedCount(level);
                                                                }}
                                                                className={cn(
                                                                    "w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold transition-all",
                                                                    (!gameProgress.debugFlags?.unlockAllGames && gameProgress.gamesUnlockedCount === level)
                                                                        ? "bg-indigo-500 text-white shadow-sm"
                                                                        : (gameProgress.gamesUnlockedCount >= level)
                                                                            ? "bg-indigo-100 text-indigo-400"
                                                                            : "bg-slate-200 text-slate-400"
                                                                )}
                                                            >
                                                                {level}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="pt-2 border-t border-slate-100 mt-2">
                                                <p className="text-[10px] text-slate-400 font-bold mb-1">ぶるぶるテスト用 (Genki SET)</p>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <button
                                                        onClick={() => useStore.setState(state => ({
                                                            ...state,
                                                            spirits: state.spirits.map(s => ({ ...s, unlocked: true, stats: { ...s.stats, genki: 30 } }))
                                                        }))}
                                                        className="py-1 bg-red-100 text-red-600 text-[10px] font-bold rounded"
                                                    >
                                                        瀕死 (30%)
                                                    </button>
                                                    <button
                                                        onClick={() => useStore.setState(state => ({
                                                            ...state,
                                                            spirits: state.spirits.map(s => ({ ...s, unlocked: true, stats: { ...s.stats, genki: 60 } }))
                                                        }))}
                                                        className="py-1 bg-orange-100 text-orange-600 text-[10px] font-bold rounded"
                                                    >
                                                        震え (60%)
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl active:scale-95 transition-transform"
                            >
                                閉じる
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

// Add these to interface if imported from generic type file, otherwise keep imports
