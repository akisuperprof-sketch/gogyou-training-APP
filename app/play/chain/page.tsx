'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Element } from '@/lib/types';
import { SOUSEI, ELEMENT_COLORS, ELEMENT_JP } from '@/lib/data';
import { useStore } from '@/lib/store';
import { GameResult } from '@/components/GameResult';
import { TutorialOverlay } from '@/components/TutorialOverlay';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import Link from 'next/link';

const TIME_LIMIT = 30;

interface Node {
    id: number;
    gridIndex: number; // 0-8 for 3x3
    element: Element;
}

export default function ChainGame() {
    const [gameState, setGameState] = useState<'TUTORIAL' | 'LEVEL_SELECT' | 'PLAYING' | 'FINISHED'>('TUTORIAL');
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
    const [nodes, setNodes] = useState<Node[]>([]);
    const [chain, setChain] = useState<Node[]>([]);
    const [lastLinkResult, setLastLinkResult] = useState<'GOOD' | 'BAD' | null>(null);
    const [selectedLevel, setSelectedLevel] = useState<9 | 18 | 36 | null>(null);

    const { gameCompleted, gameProgress, unlockChainLevel } = useStore();
    const [resultData, setResultData] = useState<{ gainedCards: number[], gainedExp: number, reaction: string } | null>(null);

    const spawnNodes = (count: number) => {
        const elements: Element[] = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];
        const newNodes: Node[] = [];
        for (let i = 0; i < count; i++) {
            newNodes.push({
                id: Math.random(),
                gridIndex: i,
                element: elements[Math.floor(Math.random() * elements.length)]
            });
        }
        setNodes(newNodes);
    };

    useEffect(() => {
        if (gameState === 'PLAYING') {
            spawnNodes(selectedLevel || 9);
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
    }, [gameState, selectedLevel]);

    const handleStart = (level: 9 | 18 | 36 = 9) => {
        setScore(0);
        setTimeLeft(TIME_LIMIT);
        setGameState('PLAYING');
        setResultData(null);
        setChain([]);
        setSelectedLevel(level);
        spawnNodes(level);
    };

    const handleNodeClick = (node: Node) => {
        if (gameState !== 'PLAYING') return;

        if (chain.length === 0) {
            setChain([node]);
            setNodes(prev => prev.filter(n => n.id !== node.id));
        } else {
            const lastNode = chain[chain.length - 1];
            const nextNeeded = SOUSEI[lastNode.element];

            if (node.element === nextNeeded) {
                setChain([...chain, node]);
                setNodes(prev => {
                    const elements: Element[] = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];
                    return prev.map(n => n.gridIndex === node.gridIndex ? {
                        ...n,
                        id: Math.random(),
                        element: elements[Math.floor(Math.random() * elements.length)]
                    } : n);
                });
                setScore(s => {
                    const multiplier = selectedLevel === 36 ? 3 : selectedLevel === 18 ? 2 : 1;
                    return s + (100 + (chain.length * 50)) * multiplier;
                });
                setLastLinkResult('GOOD');
                setTimeout(() => setLastLinkResult(null), 300);
            } else {
                setLastLinkResult('BAD');
                setChain([]);
                spawnNodes(selectedLevel || 9);
                setTimeout(() => setLastLinkResult(null), 300);
            }
        }
    };

    const handleGameFinished = () => {
        const rewards = gameCompleted(score, 'chain');
        setResultData(rewards);

        if (score > 1000) {
            if (selectedLevel === 9) unlockChainLevel(2);
            if (selectedLevel === 18) unlockChainLevel(3);
        }
    };

    useEffect(() => {
        if (gameState === 'FINISHED') {
            handleGameFinished();
        }
    }, [gameState]);

    return (
        <div className="h-[100dvh] bg-white relative overflow-hidden touch-none select-none font-sans text-slate-900">
            <AnimatePresence>
                {gameState === 'TUTORIAL' && (
                    <TutorialOverlay
                        gameType="chain"
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
                                { id: 1, count: 9, label: '初級', sub: '3x3 グリッド', minScore: 0 },
                                { id: 2, count: 18, label: '中級', sub: '3x6 グリッド', minScore: 1000 },
                                { id: 3, count: 36, label: '上級', sub: '6x6 グリッド', minScore: 1000 },
                            ].map((lv) => {
                                const isLocked = gameProgress.chainLevelsUnlocked < lv.id;
                                return (
                                    <button
                                        key={lv.id}
                                        disabled={isLocked}
                                        onClick={() => handleStart(lv.count as 9 | 18 | 36)}
                                        className={cn(
                                            "w-full p-5 rounded-2xl flex items-center justify-between transition-all active:scale-95 border-2",
                                            isLocked
                                                ? "bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed"
                                                : "bg-white border-indigo-50 hover:border-indigo-500 text-slate-900 shadow-sm hover:shadow-md"
                                        )}
                                    >
                                        <div className="text-left">
                                            <div className="flex items-center space-x-2">
                                                <span className="text-lg font-black">{lv.label}</span>
                                                <span className="text-[10px] font-black px-2 py-0.5 bg-slate-100 rounded-full text-slate-400 uppercase">{lv.id > 1 ? (lv.id === 2 ? '2x' : '3x') : '1x'} pt</span>
                                            </div>
                                            <p className="text-[10px] font-bold text-slate-400">{lv.sub}</p>
                                        </div>
                                        {isLocked ? (
                                            <div className="text-[10px] font-black text-red-400">Locked</div>
                                        ) : (
                                            <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center text-white">
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
            <div className="absolute top-0 left-0 right-0 p-4 sm:p-6 flex justify-between items-center z-10">
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
                    <p className={cn("text-xl sm:text-2xl font-black tabular-nums leading-none", timeLeft < 10 ? "text-red-500 animate-pulse" : "text-blue-500")}>
                        {timeLeft}秒
                    </p>
                </div>
            </div>

            {gameState === 'PLAYING' && (
                <div className="absolute inset-0 z-0">
                    {/* Visual Feedback */}
                    <AnimatePresence>
                        {lastLinkResult === 'GOOD' && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 2 }}
                                exit={{ opacity: 0 }}
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-100 font-black text-8xl z-0 pointer-events-none tracking-tighter"
                            >
                                連鎖成功！
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Chain Progress */}
                    <div className="absolute bottom-6 sm:bottom-12 inset-x-8 flex justify-center items-center space-x-2 sm:space-x-3 pointer-events-none">
                        <AnimatePresence>
                            {chain.slice(-5).map((node, i) => (
                                <motion.div
                                    initial={{ scale: 0, x: 20 }}
                                    animate={{ scale: 1, x: 0 }}
                                    key={`${node.id}-${i}`}
                                    className={cn(
                                        "w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-[1rem] flex items-center justify-center border border-white shadow-xl relative overflow-hidden",
                                        ELEMENT_COLORS[node.element]
                                    )}
                                >
                                    <span className="text-sm sm:text-xl font-black z-10 drop-shadow-sm">{ELEMENT_JP[node.element]}</span>
                                    <div className="absolute inset-0 bg-white/10 opacity-50" />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        {chain.length > 0 && <div className="text-slate-200 text-xl sm:text-3xl animate-pulse">→</div>}
                        {chain.length === 0 && (
                            <div className="text-slate-300 text-[10px] sm:text-xs font-bold tracking-widest bg-slate-50 px-4 py-1.5 sm:px-6 sm:py-2 rounded-full border border-slate-100">
                                {selectedLevel === 9 ? '3x3 グリッド' : selectedLevel === 18 ? '3x6 グリッド' : '6x6 グリッド'}
                            </div>
                        )}
                    </div>

                    {/* Grid Nodes */}
                    <div className="absolute inset-0 flex items-center justify-center p-4 pt-16 sm:pt-20">
                        <div className={cn(
                            "grid gap-2 sm:gap-3 w-full max-w-[340px] sm:max-w-xl aspect-square",
                            selectedLevel === 9 ? "grid-cols-3 max-w-[280px]" :
                                selectedLevel === 18 ? "grid-cols-3 aspect-[3/6] max-w-[240px]" :
                                    "grid-cols-6"
                        )}>
                            {nodes.map((node) => (
                                <motion.button
                                    key={node.id}
                                    initial={{ scale: 0, rotate: -45 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    exit={{ scale: 0 }}
                                    whileTap={{ scale: 0.9 }}
                                    onPointerDown={() => handleNodeClick(node)}
                                    className={cn(
                                        "w-full h-full rounded-xl sm:rounded-2xl shadow-lg flex items-center justify-center font-black border-2 border-white transition-all ring-2 ring-slate-50/50 relative overflow-hidden",
                                        ELEMENT_COLORS[node.element],
                                        selectedLevel === 36 ? "text-xs sm:text-xl" : "text-2xl sm:text-4xl"
                                    )}
                                >
                                    <span className="drop-shadow-md z-10">{ELEMENT_JP[node.element]}</span>
                                    <div className="absolute inset-0 bg-white/10 opacity-30" />
                                </motion.button>
                            ))}
                        </div>
                    </div>

                    {/* Cycle Guide */}
                    <div className="absolute top-20 sm:top-28 left-0 right-0 flex justify-center">
                        <div className="bg-white/90 backdrop-blur-md border border-slate-100 px-4 py-1.5 sm:px-6 sm:py-3 rounded-full shadow-xl flex items-center space-x-2 sm:space-x-3">
                            {['Wood', 'Fire', 'Earth', 'Metal', 'Water'].map((el, i) => (
                                <div key={el} className="flex items-center space-x-2 sm:space-x-3">
                                    <div className={cn(
                                        "w-6 h-6 sm:w-8 sm:h-8 rounded sm:rounded-lg flex items-center justify-center text-[10px] sm:text-xs font-black text-white shadow-sm",
                                        ELEMENT_COLORS[el as Element]
                                    )}>
                                        {ELEMENT_JP[el as Element]}
                                    </div>
                                    {i < 4 && <div className="text-slate-200 text-[10px] sm:text-sm font-black">→</div>}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Result */}
            {gameState === 'FINISHED' && resultData && (
                <GameResult
                    score={score}
                    gainedExp={resultData.gainedExp}
                    gainedCardIds={resultData.gainedCards}
                    reaction={resultData.reaction}
                    onRetry={handleStart}
                />
            )}

            {/* Background Accent */}
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-green-500/5 rounded-full blur-[100px] pointer-events-none" />
        </div>
    );
}
