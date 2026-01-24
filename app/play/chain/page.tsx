'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Element } from '@/lib/types';
import { SOUSEI, ELEMENT_COLORS, ELEMENT_JP } from '@/lib/data';
import { useStore } from '@/lib/store';
import { GameResult } from '@/components/GameResult';
import { TutorialOverlay } from '@/components/TutorialOverlay';
import { cn } from '@/lib/utils';

const TIME_LIMIT = 30;
const NODE_COUNT = 10;

interface Node {
    id: number;
    x: number;
    y: number;
    element: Element;
}

export default function ChainGame() {
    const [gameState, setGameState] = useState<'TUTORIAL' | 'PLAYING' | 'FINISHED'>('TUTORIAL');
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
    const [nodes, setNodes] = useState<Node[]>([]);
    const [chain, setChain] = useState<Node[]>([]);
    const [lastLinkResult, setLastLinkResult] = useState<'GOOD' | 'BAD' | null>(null);

    const { gameCompleted } = useStore();
    const [resultData, setResultData] = useState<{ gainedCards: number[], gainedExp: number, reaction: string } | null>(null);

    const spawnNodes = () => {
        const newNodes: Node[] = [];
        const elements: Element[] = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];
        for (let i = 0; i < NODE_COUNT; i++) {
            newNodes.push({
                id: Math.random(),
                x: Math.random() * 75 + 10,
                y: Math.random() * 55 + 20,
                element: elements[i % elements.length]
            });
        }
        setNodes(newNodes.sort(() => Math.random() - 0.5));
    };

    useEffect(() => {
        if (gameState === 'PLAYING') {
            spawnNodes();
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
            const rewards = gameCompleted(score, 'chain');
            setResultData(rewards);
        }
    }, [gameState, score, gameCompleted]);

    const handleStart = () => {
        setScore(0);
        setTimeLeft(TIME_LIMIT);
        setGameState('PLAYING');
        setResultData(null);
        setChain([]);
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
                    const remaining = prev.filter(n => n.id !== node.id);
                    const elements: Element[] = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];

                    const nextOfNext = SOUSEI[node.element];
                    const hasNext = remaining.some(n => n.element === nextOfNext);

                    const newElement = hasNext
                        ? elements[Math.floor(Math.random() * elements.length)]
                        : nextOfNext;

                    remaining.push({
                        id: Math.random(),
                        x: Math.random() * 75 + 10,
                        y: Math.random() * 55 + 20,
                        element: newElement
                    });
                    return remaining;
                });
                setScore(s => s + 100 + (chain.length * 50));
                setLastLinkResult('GOOD');
                setTimeout(() => setLastLinkResult(null), 300);
            } else {
                setLastLinkResult('BAD');
                setChain([]);
                spawnNodes();
                setTimeout(() => setLastLinkResult(null), 300);
            }
        }
    };

    return (
        <div className="min-h-[100dvh] bg-white relative overflow-hidden touch-none select-none font-sans text-slate-900">
            <TutorialOverlay
                gameType="chain"
                isOpen={gameState === 'TUTORIAL'}
                onStart={handleStart}
            />

            {/* HUD */}
            <div className="absolute top-0 left-0 right-0 p-4 sm:p-6 flex justify-between items-start z-10">
                <div className="bg-slate-50/90 backdrop-blur-sm border border-slate-100 px-4 sm:px-5 py-2 sm:py-3 rounded-[1.5rem] shadow-sm">
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-0.5">スコア</p>
                    <p className="text-2xl sm:text-3xl font-black tabular-nums text-slate-900">{score}</p>
                </div>
                <div className="bg-slate-50/90 backdrop-blur-sm border border-slate-100 px-4 sm:px-5 py-2 sm:py-3 rounded-[1.5rem] text-right shadow-sm">
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-0.5">残り時間</p>
                    <p className={cn("text-2xl sm:text-3xl font-black tabular-nums", timeLeft < 10 ? "text-red-500 animate-pulse" : "text-blue-500")}>
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
                    <div className="absolute bottom-12 inset-x-8 flex justify-center items-center space-x-3 pointer-events-none">
                        <AnimatePresence>
                            {chain.slice(-6).map((node, i) => (
                                <motion.div
                                    initial={{ scale: 0, x: 20 }}
                                    animate={{ scale: 1, x: 0 }}
                                    key={`${node.id}-${i}`}
                                    className={cn(
                                        "w-12 h-12 rounded-[1rem] flex items-center justify-center border-2 border-white shadow-xl relative overflow-hidden",
                                        ELEMENT_COLORS[node.element]
                                    )}
                                >
                                    <span className="text-xl font-black z-10 drop-shadow-sm">{ELEMENT_JP[node.element]}</span>
                                    <div className="absolute inset-0 bg-white/10 opacity-50" />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        {chain.length > 0 && <div className="text-slate-200 text-3xl animate-pulse">→</div>}
                        {chain.length === 0 && (
                            <div className="text-slate-300 text-xs font-bold tracking-widest bg-slate-50 px-6 py-2 rounded-full border border-slate-100">
                                好きな属性から連鎖を開始
                            </div>
                        )}
                    </div>

                    {/* Nodes */}
                    {nodes.map((node) => (
                        <motion.button
                            key={node.id}
                            initial={{ scale: 0, rotate: -45 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0 }}
                            whileTap={{ scale: 1.15 }}
                            onPointerDown={() => handleNodeClick(node)}
                            className={cn(
                                "absolute w-16 h-16 sm:w-20 sm:h-20 rounded-[1.5rem] sm:rounded-[2rem] shadow-2xl flex items-center justify-center text-2xl sm:text-3xl font-black border-[3px] sm:border-4 border-white transition-all ring-4 sm:ring-8 ring-slate-50/50 -translate-x-1/2 -translate-y-1/2",
                                ELEMENT_COLORS[node.element]
                            )}
                            style={{ left: `${node.x}%`, top: `${node.y}%` }}
                        >
                            <span className="drop-shadow-md z-10">{ELEMENT_JP[node.element]}</span>
                            <div className="absolute inset-0 bg-white/10 rounded-[1.5rem] sm:rounded-[2rem] opacity-30" />
                        </motion.button>
                    ))}
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
