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
    const [gameState, setGameState] = useState<'TUTORIAL' | 'PLAYING' | 'FINISHED'>('TUTORIAL');
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
    const [enemy, setEnemy] = useState<Element>('Fire');
    const [options, setOptions] = useState<Element[]>([]);
    const [turnKey, setTurnKey] = useState(0);
    const [effect, setEffect] = useState<'CORRECT' | 'WRONG' | null>(null);

    const { gameCompleted } = useStore();
    const [resultData, setResultData] = useState<{ gainedCards: number[], gainedExp: number, reaction: string } | null>(null);

    const nextTurn = () => {
        const elements: Element[] = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];
        const newEnemy = elements[Math.floor(Math.random() * elements.length)];
        setEnemy(newEnemy);
        setTurnKey(prev => prev + 1);

        const correct = elements.find(e => SOUKOKU[e] === newEnemy) as Element;
        const wrongPool = elements.filter(e => e !== correct);
        const wrong1 = wrongPool.splice(Math.floor(Math.random() * wrongPool.length), 1)[0];
        const wrong2 = wrongPool.splice(Math.floor(Math.random() * wrongPool.length), 1)[0];
        const newOptions = [correct, wrong1, wrong2].sort(() => Math.random() - 0.5);
        setOptions(newOptions);
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

            // Turn Timer: Switch enemy every 4 seconds if no answer
            const turnInterval = setInterval(() => {
                nextTurn();
            }, 4000);

            return () => {
                clearInterval(interval);
                clearInterval(turnInterval);
            };
        }
    }, [gameState]);

    useEffect(() => {
        if (gameState === 'FINISHED') {
            setResultData(gameCompleted(score, 'guard'));
        }
    }, [gameState, score, gameCompleted]);

    const handleStart = () => {
        setScore(0);
        setTimeLeft(TIME_LIMIT);
        setGameState('PLAYING');
        setResultData(null);
    }

    const handleAnswer = (choice: Element) => {
        const correct = SOUKOKU[choice] === enemy;
        if (correct) {
            setScore(s => s + 200);
            setEffect('CORRECT');
            setTimeout(() => {
                setEffect(null);
                nextTurn();
            }, 300);
        } else {
            setScore(s => Math.max(0, s - 50));
            setEffect('WRONG');
            setTimeout(() => setEffect(null), 300);
        }
    };

    return (
        <div className="min-h-[100dvh] bg-white relative overflow-hidden flex flex-col text-slate-900 font-sans">
            <TutorialOverlay
                gameType="guard"
                isOpen={gameState === 'TUTORIAL'}
                onStart={handleStart}
            />

            {/* HUD */}
            <div className="absolute top-0 left-0 right-0 p-4 sm:p-6 flex justify-between items-center z-20">
                <div className="flex items-center space-x-3">
                    <Link href="/play" className="p-3 bg-white/90 backdrop-blur-sm border border-slate-100 rounded-2xl shadow-sm text-slate-400 hover:text-slate-900 transition active:scale-90">
                        <X className="w-5 h-5" />
                    </Link>
                    <div className="bg-slate-50/90 backdrop-blur-sm border border-slate-100 px-4 py-2 rounded-2xl shadow-sm">
                        <p className="text-[8px] text-slate-400 font-black uppercase tracking-widest mb-0.5 leading-none">スコア</p>
                        <p className="text-xl sm:text-2xl font-black tabular-nums text-slate-900 leading-none">{score}</p>
                    </div>
                </div>
                <div className="bg-slate-50/90 backdrop-blur-sm border border-slate-100 px-4 py-2 rounded-2xl text-right shadow-sm">
                    <p className="text-[8px] text-slate-400 font-black uppercase tracking-widest mb-0.5 leading-none">残り時間</p>
                    <p className={cn("text-xl sm:text-2xl font-black tabular-nums leading-none", timeLeft < 10 ? "text-red-500 animate-pulse" : "text-amber-500")}>
                        {timeLeft}秒
                    </p>
                </div>
            </div>

            {gameState === 'PLAYING' && (
                <div className="flex-1 flex flex-col items-center justify-center pt-24 pb-12 sm:pb-20 space-y-8 sm:space-y-12">
                    {/* Enemy (Approaching from back) */}
                    <div className="text-center relative perspective-1000 w-full flex flex-col items-center">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={`${enemy}-${turnKey}`}
                                initial={{ scale: 0.1, z: -1000, opacity: 0 }}
                                animate={{ scale: 1, z: 0, opacity: 1 }}
                                exit={{ scale: 1.5, z: 500, opacity: 0 }}
                                transition={{ duration: 3.5, ease: "linear" }}
                                className={cn("inline-flex items-center justify-center w-36 h-36 sm:w-48 sm:h-48 rounded-[3rem] sm:rounded-[3.5rem] text-6xl sm:text-8xl shadow-[0_20px_60px_rgba(0,0,0,0.1)] border-8 border-white relative z-10",
                                    enemy === 'Fire' ? 'bg-red-500 text-white shadow-red-200' :
                                        enemy === 'Water' ? 'bg-blue-500 text-white shadow-blue-200' :
                                            enemy === 'Wood' ? 'bg-green-500 text-white shadow-green-200' :
                                                enemy === 'Metal' ? 'bg-slate-300 text-slate-700 shadow-slate-200' :
                                                    'bg-yellow-600 text-white shadow-yellow-200'
                                )}>
                                <span className="drop-shadow-lg">{ELEMENT_JP[enemy]}</span>

                                {/* Defense Hit Effect Overlay */}
                                <AnimatePresence>
                                    {effect === 'CORRECT' && (
                                        <motion.div
                                            initial={{ scale: 0, opacity: 0 }}
                                            animate={{ scale: 2, opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="absolute inset-0 flex items-center justify-center z-20"
                                        >
                                            <div className="w-full h-full rounded-full border-8 border-white animate-ping" />
                                            <Shield className="w-24 h-24 text-white absolute fill-current opacity-80" />
                                        </motion.div>
                                    )}
                                    {effect === 'WRONG' && (
                                        <motion.div
                                            initial={{ x: -10 }}
                                            animate={{ x: [10, -10, 10, -10, 0] }}
                                            className="absolute inset-0 bg-red-500/40 rounded-[3rem] sm:rounded-[3.5rem] z-20"
                                        />
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        </AnimatePresence>

                        {/* Soukoku Guide */}
                        <div className="mt-8 flex flex-col items-center">
                            <div className="bg-slate-50/80 backdrop-blur-sm border border-slate-100 px-6 py-2 rounded-full shadow-sm mb-4">
                                <div className="flex items-center space-x-2 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap overflow-x-auto no-scrollbar max-w-[80vw]">
                                    {['Wood', 'Earth', 'Water', 'Fire', 'Metal', 'Wood'].map((el, i) => (
                                        <div key={`guide-${i}`} className="flex items-center space-x-2">
                                            <span className={cn(
                                                "w-5 h-5 rounded flex items-center justify-center text-[8px] text-white",
                                                ELEMENT_COLORS[el as Element]
                                            )}>{ELEMENT_JP[el as Element]}</span>
                                            {i < 5 && <span>勝つ</span>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <p className="text-slate-400 text-xs font-bold leading-none translate-y-2">迫ってくる暴走を食い止めて！</p>
                        </div>
                    </div>

                    {/* Options */}
                    <div className="grid grid-cols-3 gap-3 sm:gap-5 px-4 sm:px-6 w-full max-w-md z-10">
                        {options.map((opt, i) => (
                            <motion.button
                                key={`${opt}-${i}`}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: i * 0.1 }}
                                onClick={() => handleAnswer(opt)}
                                whileTap={{ scale: 0.9, y: 5 }}
                                className={cn(
                                    "h-24 sm:h-32 rounded-[2rem] sm:rounded-[2.5rem] flex flex-col items-center justify-center font-black text-xl sm:text-2xl shadow-xl border-b-[8px] border-black/20 transition-all active:border-b-0",
                                    ELEMENT_COLORS[opt]
                                )}
                            >
                                <Shield className="w-6 h-6 sm:w-8 sm:h-8 mb-1 sm:mb-2 opacity-40 shrink-0" />
                                <span className="drop-shadow-sm">{ELEMENT_JP[opt]}</span>
                            </motion.button>
                        ))}
                    </div>
                </div>
            )}

            {gameState === 'FINISHED' && resultData && (
                <GameResult
                    score={score}
                    gainedExp={resultData.gainedExp}
                    gainedCardIds={resultData.gainedCards}
                    reaction={resultData.reaction}
                    onRetry={handleStart}
                />
            )}
        </div>
    );
}
