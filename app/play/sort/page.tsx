'use client';

import { useState, useEffect } from 'react';
import { motion, PanInfo, useAnimation, AnimatePresence } from 'framer-motion';
import { Element } from '@/lib/types';
import { ELEMENT_COLORS, ELEMENT_JP } from '@/lib/data';
import { useStore } from '@/lib/store';
import { GameResult } from '@/components/GameResult';
import { TutorialOverlay } from '@/components/TutorialOverlay';
import { cn } from '@/lib/utils';
import { LayoutGrid, X } from 'lucide-react';
import Link from 'next/link';

const KEYWORDS: { term: string; element: Element }[] = [
    { term: '怒り', element: 'Wood' }, { term: '春', element: 'Wood' }, { term: '酸味', element: 'Wood' }, { term: '目', element: 'Wood' }, { term: '青・緑', element: 'Wood' }, { term: '東', element: 'Wood' }, { term: '肝臓', element: 'Wood' },
    { term: '喜び', element: 'Fire' }, { term: '夏', element: 'Fire' }, { term: '苦味', element: 'Fire' }, { term: '舌', element: 'Fire' }, { term: '赤', element: 'Fire' }, { term: '南', element: 'Fire' }, { term: '心臓', element: 'Fire' },
    { term: '思い悩み', element: 'Earth' }, { term: '土用', element: 'Earth' }, { term: '甘味', element: 'Earth' }, { term: '口', element: 'Earth' }, { term: '黄色', element: 'Earth' }, { term: '中央', element: 'Earth' }, { term: '脾臓', element: 'Earth' },
    { term: '悲しみ', element: 'Metal' }, { term: '秋', element: 'Metal' }, { term: '辛味', element: 'Metal' }, { term: '鼻', element: 'Metal' }, { term: '白', element: 'Metal' }, { term: '西', element: 'Metal' }, { term: '肺', element: 'Metal' },
    { term: '恐れ', element: 'Water' }, { term: '冬', element: 'Water' }, { term: '塩辛い', element: 'Water' }, { term: '耳', element: 'Water' }, { term: '黒', element: 'Water' }, { term: '北', element: 'Water' }, { term: '腎臓', element: 'Water' },
];

const TIME_LIMIT = 60;

export default function SortGame() {
    const [gameState, setGameState] = useState<'TUTORIAL' | 'PLAYING' | 'FINISHED'>('TUTORIAL');
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
    const [currentCard, setCurrentCard] = useState<{ term: string; element: Element } | null>(null);
    const [level, setLevel] = useState(1); // 1: 3 elements, 2: 5 elements

    const { gameCompleted, gameProgress } = useStore();
    const [resultData, setResultData] = useState<{ gainedCards: number[], gainedExp: number, reaction: string } | null>(null);
    const controls = useAnimation();

    const nextCard = () => {
        const isMaster = gameProgress.isMasterMode;
        const currentLevel = isMaster ? 2 : (score > 1500 ? 2 : 1);
        setLevel(currentLevel);

        const allowedElements = currentLevel === 1 ? ['Wood', 'Fire', 'Earth'] : ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];
        const pool = KEYWORDS.filter(k => allowedElements.includes(k.element));
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
        const threshold = 80;

        let selected: Element | null = null;
        if (level === 1) {
            if (y < -threshold) selected = 'Fire';
            else if (x < -threshold) selected = 'Wood';
            else if (x > threshold) selected = 'Earth';
        } else {
            if (y < -threshold) selected = 'Fire';
            else if (x < -threshold && y < 0) selected = 'Wood';
            else if (x > threshold && y < 0) selected = 'Earth';
            else if (x < -threshold && y > 0) selected = 'Metal';
            else if (x > threshold && y > 0) selected = 'Water';
        }

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
        <div className="h-[100dvh] bg-white overflow-hidden flex flex-col relative text-slate-900 font-sans">
            <AnimatePresence>
                {gameState === 'TUTORIAL' && (
                    <TutorialOverlay
                        gameType="sort"
                        isOpen={true}
                        onStart={handleStart}
                    />
                )}
            </AnimatePresence>

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
                    <p className={cn("text-xl sm:text-2xl font-black tabular-nums leading-none", timeLeft < 10 ? "text-red-500 animate-pulse" : "text-green-600")}>
                        {timeLeft}秒
                    </p>
                </div>
            </div>

            {gameState === 'PLAYING' && (
                <div className="flex-1 flex flex-col items-center justify-center relative px-6">
                    {/* Zones Visualization */}
                    <div className="absolute inset-x-2 sm:inset-x-6 inset-y-12 pointer-events-none opacity-40">
                        {/* Top: Fire */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-24 sm:w-32 sm:h-32 border-4 border-dashed border-red-200 rounded-[2rem] sm:rounded-[2.5rem] flex flex-col items-center justify-center bg-red-50/50">
                            <span className="text-3xl sm:text-4xl mb-1">🔥</span>
                            <span className="text-[10px] font-black uppercase text-red-400">火（上）</span>
                        </div>
                        {/* Left: Wood */}
                        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-24 h-24 sm:w-32 sm:h-32 border-4 border-dashed border-green-200 rounded-[2rem] sm:rounded-[2.5rem] flex flex-col items-center justify-center bg-green-50/50">
                            <span className="text-3xl sm:text-4xl mb-1">🌿</span>
                            <span className="text-[10px] font-black uppercase text-green-400">木（左）</span>
                        </div>
                        {/* Right: Earth */}
                        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-24 h-24 sm:w-32 sm:h-32 border-4 border-dashed border-yellow-200 rounded-[2rem] sm:rounded-[2.5rem] flex flex-col items-center justify-center bg-yellow-50/50">
                            <span className="text-3xl sm:text-4xl mb-1">⛰️</span>
                            <span className="text-[10px] font-black uppercase text-yellow-600">土（右）</span>
                        </div>

                        {level === 2 && (
                            <>
                                {/* Bottom Left: Metal */}
                                <div className="absolute bottom-0 left-0 w-24 h-24 sm:w-32 sm:h-32 border-4 border-dashed border-slate-200 rounded-[2rem] sm:rounded-[2.5rem] flex flex-col items-center justify-center bg-slate-50/50">
                                    <span className="text-3xl sm:text-4xl mb-1">💎</span>
                                    <span className="text-[10px] font-black uppercase text-slate-400">金（左下）</span>
                                </div>
                                {/* Bottom Right: Water */}
                                <div className="absolute bottom-0 right-0 w-24 h-24 sm:w-32 sm:h-32 border-4 border-dashed border-blue-200 rounded-[2rem] sm:rounded-[2.5rem] flex flex-col items-center justify-center bg-blue-50/50">
                                    <span className="text-3xl sm:text-4xl mb-1">💧</span>
                                    <span className="text-[10px] font-black uppercase text-blue-400">水（右下）</span>
                                </div>
                            </>
                        )}
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
                                className="w-40 h-52 sm:w-64 sm:h-80 bg-white rounded-[2rem] sm:rounded-[3.5rem] shadow-2xl flex flex-col items-center justify-center p-4 sm:p-10 z-20 cursor-grab active:cursor-grabbing text-slate-900 border-[6px] sm:border-[12px] border-slate-50 relative shrink-0"
                            >
                                <div className="absolute top-6 sm:top-8 left-1/2 -translate-x-1/2">
                                    <div className="p-1.5 sm:p-2 bg-slate-50 rounded-lg sm:rounded-xl">
                                        <LayoutGrid className="w-5 h-5 sm:w-6 sm:h-6 text-slate-300" />
                                    </div>
                                </div>
                                <p className="text-[8px] sm:text-[10px] text-slate-300 font-black uppercase tracking-[0.2em] mb-2 sm:mb-4">正しい属性へ</p>
                                <h3 className="text-2xl sm:text-5xl font-black text-center break-keep leading-tight tracking-tighter">
                                    {currentCard.term}
                                </h3>
                                <div className="mt-6 sm:mt-12 flex items-center space-x-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-100 animate-bounce" />
                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-100 animate-bounce [animation-delay:0.2s]" />
                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-100 animate-bounce [animation-delay:0.4s]" />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}

            {/* Hint */}
            {gameState === 'PLAYING' && (
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="pb-12 sm:pb-16 flex flex-col items-center space-y-2 z-10"
                >
                    <p className="text-sm font-black text-indigo-500 tracking-widest animate-bounce">
                        カードを正しい属性へドラッグ！！
                    </p>
                    <p className="text-[10px] font-bold text-slate-300">
                        {level === 1 ? '3方向（上・左・右）' : '5方向（上・左・右・左下・右下）'}
                    </p>
                </motion.div>
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
