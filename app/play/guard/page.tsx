'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Element } from '@/lib/types';
import { SOUKOKU, ELEMENT_COLORS, ELEMENT_JP } from '@/lib/data';
import { useStore } from '@/lib/store';
import { GameResult } from '@/components/GameResult';
import { TutorialOverlay } from '@/components/TutorialOverlay';
import { cn } from '@/lib/utils';
import { Shield, X } from 'lucide-react';
import Link from 'next/link';

const TIME_LIMIT = 45;

export default function GuardGame() {
    const [gameState, setGameState] = useState<'TUTORIAL' | 'LEVEL_SELECT' | 'PLAYING' | 'FINISHED'>('TUTORIAL');
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
    const [turnData, setTurnData] = useState<{ enemy: Element; options: Element[]; isNoneCorrect: boolean } | null>(null);
    const [turnKey, setTurnKey] = useState(0);
    const [effect, setEffect] = useState<'CORRECT' | 'WRONG' | null>(null);
    const [missedOptions, setMissedOptions] = useState<Set<Element>>(new Set());
    const [isNoneMissed, setIsNoneMissed] = useState(false);
    const [selectedLevel, setSelectedLevel] = useState<1 | 2 | 3 | null>(null);
    const [showLevelIntro, setShowLevelIntro] = useState(false);
    const [showGuideForTurn, setShowGuideForTurn] = useState(true);

    const { gameProgress, gameCompleted } = useStore();
    const [resultData, setResultData] = useState<{ gainedCards: number[], gainedExp: number, reaction: string } | null>(null);

    const nextTurn = () => {
        const elements: Element[] = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];
        const newEnemy = elements[Math.floor(Math.random() * elements.length)];

        const correct = elements.find(e => SOUKOKU[e] === newEnemy) as Element;
        const hasCorrect = Math.random() > 0.15; // 85% chance to have the answer
        const isNoneCorrect = !hasCorrect;

        const wrongPool = elements.filter(e => e !== correct);
        let newOptions: Element[];
        if (hasCorrect) {
            const w1 = wrongPool.splice(Math.floor(Math.random() * wrongPool.length), 1)[0];
            const w2 = wrongPool.splice(Math.floor(Math.random() * wrongPool.length), 1)[0];
            newOptions = [correct, w1, w2].sort(() => Math.random() - 0.5);
        } else {
            const w1 = wrongPool.splice(Math.floor(Math.random() * wrongPool.length), 1)[0];
            const w2 = wrongPool.splice(Math.floor(Math.random() * wrongPool.length), 1)[0];
            const w3 = wrongPool.splice(Math.floor(Math.random() * wrongPool.length), 1)[0];
            newOptions = [w1, w2, w3].sort(() => Math.random() - 0.5);
        }

        // Level-based guide logic
        let showGuide = true;
        if (selectedLevel === 2) {
            showGuide = Math.random() > 0.3; // 30% chance no guide
        } else if (selectedLevel === 3) {
            showGuide = false; // Always no guide
        }

        setTurnData({
            enemy: newEnemy,
            options: newOptions,
            isNoneCorrect
        });
        setTurnKey(prev => prev + 1);
        setMissedOptions(new Set());
        setIsNoneMissed(false);
        setShowGuideForTurn(showGuide);
    };

    useEffect(() => {
        if (gameState === 'PLAYING') {
            nextTurn();
            const interval = setInterval(() => {
                setTimeLeft((t) => {
                    if (t <= 1) {
                        setGameState('FINISHED');
                        return 0;
                    }
                    return t - 1;
                });
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [gameState]);

    // Use a separate effect to handle enemy auto-switching to allow manual resets
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (gameState === 'PLAYING') {
            const startTimer = () => {
                timer = setTimeout(() => {
                    nextTurn();
                    startTimer();
                }, 6000);
            };
            startTimer();
        }
        return () => clearTimeout(timer);
    }, [gameState, turnKey]); // Resets whenever a new turn starts

    useEffect(() => {
        if (gameState === 'FINISHED') {
            setResultData(gameCompleted(score, 'guard', selectedLevel || 1));
        }
    }, [gameState, score, gameCompleted, selectedLevel]);

    const handleLevelSelect = (level: 1 | 2 | 3) => {
        setScore(0);
        setTimeLeft(TIME_LIMIT);
        setSelectedLevel(level);
        setGameState('PLAYING');
        setResultData(null);
        setShowLevelIntro(true);
        setTimeout(() => setShowLevelIntro(false), 2000);
    }

    const handleAnswer = (choice: Element | 'NONE') => {
        if (effect || !turnData) return;
        if (choice === 'NONE' && isNoneMissed) return;
        if (choice !== 'NONE' && missedOptions.has(choice)) return;

        const correct = choice === 'NONE' ? turnData.isNoneCorrect : (SOUKOKU[choice] === turnData.enemy);

        if (correct) {
            setScore(s => s + 200);
            setEffect('CORRECT');
            setTimeout(() => {
                setEffect(null);
                nextTurn();
            }, 500);
        } else {
            setScore(s => Math.max(0, s - 50));
            if (choice === 'NONE') {
                setIsNoneMissed(true);
            } else {
                setMissedOptions(prev => new Set(prev).add(choice));
            }
            setEffect('WRONG');
            setTimeout(() => setEffect(null), 300);
        }
    };

    return (
        <div className="h-[100dvh] bg-white relative overflow-hidden flex flex-col text-slate-900 font-sans">
            <AnimatePresence>
                {gameState === 'TUTORIAL' && (
                    <TutorialOverlay
                        gameType="guard"
                        isOpen={true}
                        onStart={() => setGameState('LEVEL_SELECT')}
                    />
                )}
            </AnimatePresence>

            {gameState === 'LEVEL_SELECT' && (
                <div className="absolute inset-0 z-50 bg-white/60 backdrop-blur-md flex flex-col items-center justify-center p-6 pb-20">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white p-8 rounded-[3rem] shadow-2xl border border-slate-100 w-full max-w-sm flex flex-col items-center space-y-6"
                    >
                        <div className="text-center">
                            <h3 className="text-2xl font-black text-slate-900 mb-2">修行レベルを選択</h3>
                            <p className="text-xs text-slate-400 font-bold">難易度が高いほど獲得ポイントアップ！</p>
                        </div>

                        <div className="grid grid-cols-1 gap-3 w-full">
                            {[
                                { id: 1, label: '初級', sub: '五行の導きあり', multiplier: '1x' },
                                { id: 2, label: '中級', sub: '導きが消えることも…', multiplier: '2x' },
                                { id: 3, label: '上級', sub: '自らの知識で立ち向かえ', multiplier: '3x' },
                            ].map((lv) => {
                                const isLocked = gameProgress.guardLevelsUnlocked < lv.id;
                                return (
                                    <button
                                        key={lv.id}
                                        disabled={isLocked}
                                        onClick={() => handleLevelSelect(lv.id as 1 | 2 | 3)}
                                        className={cn(
                                            "w-full p-5 rounded-2xl flex items-center justify-between transition-all active:scale-95 border-2",
                                            isLocked
                                                ? "bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed"
                                                : "bg-white border-amber-50 hover:border-amber-500 text-slate-900 shadow-sm hover:shadow-md"
                                        )}
                                    >
                                        <div className="text-left">
                                            <div className="flex items-center space-x-2">
                                                <span className="text-lg font-black">{lv.label}</span>
                                                <span className="text-[10px] font-black px-2 py-0.5 bg-slate-100 rounded-full text-slate-400 uppercase">{lv.multiplier} pt</span>
                                            </div>
                                            <p className="text-[10px] font-bold text-slate-400">{lv.sub}</p>
                                        </div>
                                        {isLocked ? (
                                            <div className="text-[10px] font-black text-red-400">Locked</div>
                                        ) : (
                                            <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center text-white">
                                                <div className="text-lg">→</div>
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </motion.div>
                </div>
            )}

            {/* HUD */}
            <div className="absolute top-0 left-0 right-0 p-4 sm:p-6 flex justify-between items-center z-40 bg-white/40 backdrop-blur-sm">
                <div className="flex items-center space-x-3">
                    <Link href="/play" className="p-3 bg-white border border-slate-100 rounded-2xl shadow-sm text-slate-400 hover:text-slate-900 transition active:scale-90">
                        <X className="w-5 h-5" />
                    </Link>
                    <div className="bg-white border border-slate-100 px-4 py-2 rounded-2xl shadow-sm">
                        <p className="text-[8px] text-slate-400 font-black uppercase tracking-widest mb-0.5 leading-none">スコア</p>
                        <p className="text-xl sm:text-2xl font-black tabular-nums text-slate-900 leading-none">{score}</p>
                    </div>
                </div>
                <div className="bg-white border border-slate-100 px-4 py-2 rounded-2xl text-right shadow-sm">
                    <p className="text-[8px] text-slate-400 font-black uppercase tracking-widest mb-0.5 leading-none">残り時間</p>
                    <p className={cn("text-xl sm:text-2xl font-black tabular-nums leading-none", timeLeft < 10 ? "text-red-500 animate-pulse" : "text-amber-500")}>
                        {timeLeft}秒
                    </p>
                </div>
            </div>

            {/* Level Intro Overlay */}
            <AnimatePresence>
                {showLevelIntro && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.5 }}
                        className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-slate-900/40 backdrop-blur-sm pointer-events-none"
                    >
                        <div className="bg-white px-10 py-6 rounded-[3rem] shadow-2xl border-4 border-amber-500 flex flex-col items-center">
                            <span className="text-[10px] font-black text-amber-500 uppercase tracking-[0.3em] mb-1">Spirit Guide</span>
                            <h2 className="text-5xl font-black text-slate-900 tracking-tighter">
                                {selectedLevel === 1 ? '初級' : selectedLevel === 2 ? '中級' : '上級'}
                            </h2>
                            <p className="mt-2 text-xs font-bold text-slate-400">
                                {selectedLevel === 3 ? '五行の導きなし！' : '相克の理で護れ！'}
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {gameState === 'PLAYING' && turnData && (
                <div className="flex-1 flex flex-col items-center justify-center pt-16 sm:pt-24 pb-8 sm:pb-20 space-y-6 sm:space-y-12 min-h-0">
                    {/* Enemy (Approaching from back) */}
                    <div className="text-center relative perspective-1000 w-full flex flex-col items-center flex-1 justify-center">
                        <AnimatePresence>
                            <motion.div
                                key={`${turnData.enemy}-${turnKey}`}
                                initial={{ scale: 0.1, z: -1000, opacity: 0.3 }}
                                animate={effect === 'CORRECT' ? {
                                    scale: [1, 1.2, 0.8, 1],
                                    rotate: [0, -10, 10, 0],
                                    x: [0, -10, 10, 0]
                                } : { scale: 1, z: 0, opacity: 1 }}
                                exit={{ scale: 1.5, z: 500, opacity: 0 }}
                                transition={effect === 'CORRECT' ? { duration: 0.4 } : { duration: 5.5, ease: "linear" }}
                                className={cn("inline-flex items-center justify-center w-28 h-28 sm:w-48 sm:h-48 rounded-[2rem] sm:rounded-[3.5rem] text-4xl sm:text-8xl shadow-[0_30px_80px_rgba(0,0,0,0.3)] border-4 sm:border-8 border-white relative z-10",
                                    turnData.enemy === 'Fire' ? 'bg-red-500 text-white shadow-red-500/50' :
                                        turnData.enemy === 'Water' ? 'bg-blue-500 text-white shadow-blue-500/50' :
                                            turnData.enemy === 'Wood' ? 'bg-green-500 text-white shadow-green-500/50' :
                                                turnData.enemy === 'Metal' ? 'bg-slate-300 text-slate-700 shadow-slate-400/50' :
                                                    'bg-yellow-600 text-white shadow-yellow-700/50'
                                )}>
                                <span className="drop-shadow-lg">{ELEMENT_JP[turnData.enemy]}</span>

                                {/* Impact Burst Effect */}
                                {effect === 'CORRECT' && (
                                    <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
                                        {[...Array(8)].map((_, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ scale: 0, x: 0, y: 0 }}
                                                animate={{ scale: 1, x: (i % 2 === 0 ? 1 : -1) * (Math.random() * 100), y: (i < 4 ? 1 : -1) * (Math.random() * 100), opacity: 0 }}
                                                className="absolute w-4 h-4 rounded-full bg-white sm:w-6 sm:h-6"
                                            />
                                        ))}
                                    </div>
                                )}

                                {/* Defense Hit Effect Overlay */}
                                <AnimatePresence>
                                    {effect === 'CORRECT' && (
                                        <motion.div
                                            initial={{ scale: 0, opacity: 0 }}
                                            animate={{ scale: 1.5, opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="absolute inset-0 flex items-center justify-center z-20"
                                        >
                                            <div className="w-full h-full rounded-full border-4 border-white animate-ping" />
                                            <Shield className="w-16 h-16 text-white absolute fill-current opacity-80" />
                                        </motion.div>
                                    )}
                                    {effect === 'WRONG' && (
                                        <motion.div
                                            initial={{ x: -10 }}
                                            animate={{ x: [10, -10, 10, -10, 0] }}
                                            className="absolute inset-0 bg-red-500/40 rounded-[2rem] sm:rounded-[3.5rem] z-20"
                                        />
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        </AnimatePresence>

                        {/* Soukoku Guide (Improved) */}
                        <div className="mt-4 flex flex-col items-center shrink-0 w-full px-4">
                            <AnimatePresence>
                                {showGuideForTurn ? (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="bg-white/90 backdrop-blur-md border border-slate-100 p-2 sm:p-4 rounded-3xl shadow-xl w-full max-w-[320px]"
                                    >
                                        <div className="flex justify-between items-center mb-2 px-2">
                                            <span className="text-[7px] font-black text-red-400 bg-red-50 px-2 py-0.5 rounded-full uppercase tracking-widest">敵の属性 (出題)</span>
                                            <span className="text-[7px] font-black text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full uppercase tracking-widest">あなたの属性 (対策)</span>
                                        </div>
                                        <div className="flex justify-between items-center px-1">
                                            {[
                                                { s: 'Wood', t: 'Metal' },
                                                { s: 'Fire', t: 'Water' },
                                                { s: 'Earth', t: 'Wood' },
                                                { s: 'Metal', t: 'Fire' },
                                                { s: 'Water', t: 'Earth' }
                                            ].map((pair, i) => (
                                                <div key={i} className="flex flex-col items-center">
                                                    <div className={cn(
                                                        "w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-[9px] text-white font-black opacity-40 grayscale-[0.3]",
                                                        ELEMENT_COLORS[pair.s as Element]
                                                    )}>
                                                        {ELEMENT_JP[pair.s as Element]}
                                                    </div>
                                                    <div className="text-slate-200 text-[10px] font-black my-0.5">⬇︎</div>
                                                    <div className={cn(
                                                        "w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-[9px] text-white font-black shadow-sm ring-1 ring-white",
                                                        ELEMENT_COLORS[pair.t as Element]
                                                    )}>
                                                        {ELEMENT_JP[pair.t as Element]}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                ) : (
                                    <div className="h-[92px] sm:h-[128px] flex items-center justify-center">
                                        <div className="text-slate-200 font-black text-2xl tracking-[0.5em] opacity-20 uppercase">No Guide</div>
                                    </div>
                                )}
                            </AnimatePresence>
                        </div>
                        <p className="text-slate-500 text-[10px] font-black mt-4 leading-none bg-slate-50 px-4 py-1.5 rounded-full border border-slate-100 italic">
                            {showGuideForTurn ? '中央の敵に「勝つ」属性を下から選べ！' : '自らの知識で「勝つ」属性を導き出せ！'}
                        </p>
                    </div>

                    {/* Options */}
                    <div className="w-full max-w-md px-4 sm:px-6 z-10 shrink-0 space-y-3 sm:space-y-4">
                        <div className="grid grid-cols-3 gap-2 sm:gap-4">
                            {turnData.options.map((opt, i) => {
                                const isMissed = missedOptions.has(opt);
                                return (
                                    <motion.button
                                        key={`${opt}-${i}`}
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: isMissed ? 0.4 : 1 }}
                                        transition={{ delay: i * 0.1 }}
                                        onClick={() => handleAnswer(opt)}
                                        whileTap={!isMissed ? { scale: 0.9, y: 5 } : {}}
                                        className={cn(
                                            "h-16 sm:h-28 rounded-[1.5rem] sm:rounded-[2.5rem] flex flex-col items-center justify-center font-black text-sm sm:text-xl shadow-lg border-b-[4px] sm:border-b-[6px] border-black/20 transition-all active:border-b-0 relative overflow-hidden",
                                            ELEMENT_COLORS[opt],
                                            isMissed && "grayscale cursor-not-allowed"
                                        )}
                                    >
                                        <span className="drop-shadow-sm leading-none">
                                            {isMissed ? 'miss' : ELEMENT_JP[opt]}
                                        </span>
                                    </motion.button>
                                );
                            })}
                        </div>

                        <motion.button
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: isNoneMissed ? 0.4 : 1 }}
                            transition={{ delay: 0.3 }}
                            onClick={() => handleAnswer('NONE')}
                            whileTap={!isNoneMissed ? { scale: 0.98, y: 2 } : {}}
                            className={cn(
                                "w-full py-4 sm:py-5 rounded-2xl sm:rounded-[2rem] bg-slate-50 text-slate-400 font-black text-xs sm:text-lg border-2 border-dashed border-slate-200 shadow-sm transition-all active:border-b-0 active:translate-y-1 relative",
                                isNoneMissed && "opacity-50 grayscale cursor-not-allowed"
                            )}
                        >
                            {isNoneMissed ? '正解は他にあった！' : 'ここに正解の属性がない'}
                        </motion.button>
                    </div>
                </div>
            )}

            {gameState === 'FINISHED' && resultData && (
                <GameResult
                    score={score}
                    gainedExp={resultData.gainedExp}
                    gainedCardIds={resultData.gainedCards}
                    reaction={resultData.reaction}
                    onRetry={() => setGameState('LEVEL_SELECT')}
                />
            )}
        </div>
    );
}
