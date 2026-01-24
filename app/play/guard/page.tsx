'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Element } from '@/lib/types';
import { SOUKOKU, ELEMENT_COLORS, ELEMENT_JP } from '@/lib/data';
import { useStore } from '@/lib/store';
import { GameResult } from '@/components/GameResult';
import { TutorialOverlay } from '@/components/TutorialOverlay';
import { cn } from '@/lib/utils';
import { Shield } from 'lucide-react';

const TIME_LIMIT = 45;

export default function GuardGame() {
    const [gameState, setGameState] = useState<'TUTORIAL' | 'PLAYING' | 'FINISHED'>('TUTORIAL');
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
    const [enemy, setEnemy] = useState<Element>('Fire');
    const [options, setOptions] = useState<Element[]>([]);

    const { gameCompleted } = useStore();
    const [resultData, setResultData] = useState<{ gainedCards: number[], gainedExp: number, reaction: string } | null>(null);

    const nextTurn = () => {
        const elements: Element[] = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];
        const newEnemy = elements[Math.floor(Math.random() * elements.length)];
        setEnemy(newEnemy);

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
            return () => clearInterval(interval);
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
            nextTurn();
        } else {
            setScore(s => Math.max(0, s - 50));
        }
    };

    return (
        <div className="min-h-screen bg-white relative overflow-hidden flex flex-col text-slate-900 font-sans">
            <TutorialOverlay
                gameType="guard"
                isOpen={gameState === 'TUTORIAL'}
                onStart={handleStart}
            />

            {/* HUD */}
            <div className="p-6 flex justify-between items-start z-10">
                <div className="bg-slate-50 border border-slate-100 px-5 py-3 rounded-[1.5rem] shadow-sm">
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-0.5">スコア</p>
                    <p className="text-3xl font-black tabular-nums text-slate-900">{score}</p>
                </div>
                <div className="bg-slate-50 border border-slate-100 px-5 py-3 rounded-[1.5rem] text-right shadow-sm">
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-0.5">残り時間</p>
                    <p className={cn("text-3xl font-black tabular-nums", timeLeft < 10 ? "text-red-500 animate-pulse" : "text-amber-500")}>
                        {timeLeft}秒
                    </p>
                </div>
            </div>

            {gameState === 'PLAYING' && (
                <div className="flex-1 flex flex-col items-center justify-center pb-20 space-y-16">
                    {/* Enemy */}
                    <div className="text-center relative">
                        <motion.div
                            key={enemy}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className={cn("inline-flex items-center justify-center w-48 h-48 rounded-[3.5rem] text-8xl shadow-[0_20px_60px_rgba(0,0,0,0.1)] border-8 border-white relative z-10",
                                enemy === 'Fire' ? 'bg-red-500 text-white' :
                                    enemy === 'Water' ? 'bg-blue-500 text-white' :
                                        enemy === 'Wood' ? 'bg-green-500 text-white' :
                                            enemy === 'Metal' ? 'bg-slate-300 text-slate-700' :
                                                'bg-yellow-600 text-white'
                            )}>
                            <span className="drop-shadow-lg">{ELEMENT_JP[enemy]}</span>
                            <motion.div
                                animate={{ scale: [1, 1.15, 1], opacity: [0.1, 0.3, 0.1] }}
                                transition={{ repeat: Infinity, duration: 1.5 }}
                                className="absolute inset-[-15px] border-4 border-current rounded-[4rem] pointer-events-none"
                            />
                        </motion.div>
                        <div className="mt-12">
                            <div className="inline-block px-4 py-1.5 bg-red-50 text-red-600 rounded-full text-xs font-black tracking-widest mb-2 border border-red-100">
                                ⚠️ 暴走注意！
                            </div>
                            <p className="text-slate-400 text-xs font-bold">勝てる属性を選んで止めて！</p>
                        </div>
                    </div>

                    {/* Options */}
                    <div className="grid grid-cols-3 gap-5 px-6 w-full max-w-md">
                        {options.map((opt, i) => (
                            <motion.button
                                key={`${opt}-${i}`}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: i * 0.1 }}
                                onClick={() => handleAnswer(opt)}
                                whileTap={{ scale: 0.9, y: 5 }}
                                className={cn(
                                    "h-32 rounded-[2.5rem] flex flex-col items-center justify-center font-black text-2xl shadow-xl border-b-[8px] border-black/20 transition-all active:border-b-0",
                                    ELEMENT_COLORS[opt]
                                )}
                            >
                                <Shield className="w-8 h-8 mb-2 opacity-40" />
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
