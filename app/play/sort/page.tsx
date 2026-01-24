'use client';

import { useState, useEffect } from 'react';
import { motion, PanInfo, useAnimation, AnimatePresence } from 'framer-motion';
import { Element } from '@/lib/types';
import { ELEMENT_COLORS, ELEMENT_JP } from '@/lib/data';
import { useStore } from '@/lib/store';
import { GameResult } from '@/components/GameResult';
import { TutorialOverlay } from '@/components/TutorialOverlay';
import { cn } from '@/lib/utils';
import { LayoutGrid } from 'lucide-react';

const KEYWORDS: { term: string; element: Element }[] = [
    { term: '怒り', element: 'Wood' }, { term: '春', element: 'Wood' }, { term: '酸味', element: 'Wood' }, { term: '目', element: 'Wood' }, { term: '青/緑', element: 'Wood' },
    { term: '喜び', element: 'Fire' }, { term: '夏', element: 'Fire' }, { term: '苦味', element: 'Fire' }, { term: '舌', element: 'Fire' }, { term: '赤', element: 'Fire' },
    { term: '思い悩み', element: 'Earth' }, { term: '土用', element: 'Earth' }, { term: '甘味', element: 'Earth' }, { term: '口', element: 'Earth' }, { term: '黄色', element: 'Earth' },
];

const TIME_LIMIT = 60;

export default function SortGame() {
    const [gameState, setGameState] = useState<'TUTORIAL' | 'PLAYING' | 'FINISHED'>('TUTORIAL');
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
    const [currentCard, setCurrentCard] = useState<{ term: string; element: Element } | null>(null);

    const { gameCompleted } = useStore();
    const [resultData, setResultData] = useState<{ gainedCards: number[], gainedExp: number, reaction: string } | null>(null);
    const controls = useAnimation();

    const nextCard = () => {
        const pool = KEYWORDS.filter(k => ['Wood', 'Fire', 'Earth'].includes(k.element));
        const pick = pool[Math.floor(Math.random() * pool.length)];
        setCurrentCard(pick);
        controls.set({ x: 0, y: 0, scale: 1, opacity: 1, rotate: 0 });
    };

    useEffect(() => {
        if (gameState === 'PLAYING') {
            nextCard();
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
            setResultData(gameCompleted(score, 'sort'));
        }
    }, [gameState, score, gameCompleted]);

    const handleStart = () => {
        setScore(0);
        setTimeLeft(TIME_LIMIT);
        setGameState('PLAYING');
        setResultData(null);
    }

    const handleDragEnd = (event: any, info: PanInfo) => {
        if (!currentCard) return;

        const x = info.offset.x;
        const y = info.offset.y;
        const threshold = 100;

        let selected: Element | null = null;
        if (y < -threshold) selected = 'Fire';
        else if (x < -threshold) selected = 'Wood';
        else if (x > threshold) selected = 'Earth';

        if (selected) {
            if (selected === currentCard.element) {
                setScore(s => s + 300);
                controls.start({
                    x: x > 0 ? 500 : x < 0 ? -500 : 0,
                    y: y < 0 ? -500 : 0,
                    opacity: 0,
                    scale: 0.5
                }).then(nextCard);
            } else {
                controls.start({ x: 0, y: 0, rotate: [0, -10, 10, -10, 10, 0] });
            }
        } else {
            controls.start({ x: 0, y: 0 });
        }
    };

    return (
        <div className="min-h-screen bg-white overflow-hidden flex flex-col relative text-slate-900 font-sans">
            <TutorialOverlay
                gameType="sort"
                isOpen={gameState === 'TUTORIAL'}
                onStart={handleStart}
            />

            {/* HUD */}
            <div className="p-6 flex justify-between z-10">
                <div className="bg-slate-50 border border-slate-100 px-5 py-3 rounded-[1.5rem] shadow-sm">
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-0.5">スコア</p>
                    <p className="text-3xl font-black tracking-tight tabular-nums text-slate-900">{score}</p>
                </div>
                <div className="bg-slate-50 border border-slate-100 px-5 py-3 rounded-[1.5rem] text-right shadow-sm">
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-0.5">残り時間</p>
                    <p className={cn("text-3xl font-black tabular-nums", timeLeft < 10 ? "text-red-500 animate-pulse" : "text-green-600")}>
                        {timeLeft}秒
                    </p>
                </div>
            </div>

            {gameState === 'PLAYING' && (
                <div className="flex-1 flex flex-col items-center justify-center relative px-6">
                    {/* Zones Visualization */}
                    <div className="absolute inset-x-6 inset-y-12 pointer-events-none opacity-40">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 border-4 border-dashed border-red-200 rounded-[2.5rem] flex flex-col items-center justify-center bg-red-50/50">
                            <span className="text-4xl mb-1">🔥</span>
                            <span className="text-[10px] font-black uppercase text-red-400">火</span>
                        </div>
                        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-32 h-32 border-4 border-dashed border-green-200 rounded-[2.5rem] flex flex-col items-center justify-center bg-green-50/50">
                            <span className="text-4xl mb-1">🌿</span>
                            <span className="text-[10px] font-black uppercase text-green-400">木</span>
                        </div>
                        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-32 h-32 border-4 border-dashed border-yellow-200 rounded-[2.5rem] flex flex-col items-center justify-center bg-yellow-50/50">
                            <span className="text-4xl mb-1">⛰️</span>
                            <span className="text-[10px] font-black uppercase text-yellow-600">土</span>
                        </div>
                    </div>

                    {/* Current Card */}
                    <AnimatePresence mode="wait">
                        {currentCard && (
                            <motion.div
                                key={currentCard.term}
                                drag
                                dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                                dragElastic={0.6}
                                onDragEnd={handleDragEnd}
                                animate={controls}
                                whileDrag={{ scale: 1.1, rotate: 5, zIndex: 50 }}
                                className="w-64 h-80 bg-white rounded-[3.5rem] shadow-2xl flex flex-col items-center justify-center p-10 z-20 cursor-grab active:cursor-grabbing text-slate-900 border-[12px] border-slate-50 relative"
                            >
                                <div className="absolute top-8 left-1/2 -translate-x-1/2">
                                    <div className="p-2 bg-slate-50 rounded-xl">
                                        <LayoutGrid className="w-6 h-6 text-slate-300" />
                                    </div>
                                </div>
                                <p className="text-[10px] text-slate-300 font-black uppercase tracking-[0.2em] mb-4">正しい属性へ</p>
                                <h3 className="text-5xl font-black text-center break-keep leading-tight tracking-tighter">
                                    {currentCard.term}
                                </h3>
                                <div className="mt-12 flex items-center space-x-2">
                                    <div className="w-2 h-2 rounded-full bg-slate-100 animate-bounce" />
                                    <div className="w-2 h-2 rounded-full bg-slate-100 animate-bounce [animation-delay:0.2s]" />
                                    <div className="w-2 h-2 rounded-full bg-slate-100 animate-bounce [animation-delay:0.4s]" />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}

            {/* Hint */}
            {gameState === 'PLAYING' && (
                <div className="pb-16 flex justify-center items-center opacity-60">
                    <p className="text-xs font-black text-slate-300 tracking-widest">カードをドラッグして仕分ける</p>
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
