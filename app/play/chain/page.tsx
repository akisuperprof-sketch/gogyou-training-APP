'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Element } from '@/lib/types';
import { SOUSEI, ELEMENT_COLORS, ELEMENT_JP, SOUKOKU } from '@/lib/data';
import { useStore } from '@/lib/store';
import { GameResult } from '@/components/GameResult';
import { TutorialOverlay } from '@/components/TutorialOverlay';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import Link from 'next/link';

const TIME_LIMIT = 30;
const NODE_COUNT = 10;

interface Node {
    id: number;
    gridIndex: number; // 0-8 for 3x3
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
        const elements: Element[] = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];
        const newNodes: Node[] = [];
        for (let i = 0; i < 9; i++) {
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
                    const elements: Element[] = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];
                    return prev.map(n => n.gridIndex === node.gridIndex ? {
                        ...n,
                        id: Math.random(),
                        element: elements[Math.floor(Math.random() * elements.length)]
                    } : n);
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

                    {/* Grid Nodes */}
                    <div className="absolute inset-0 flex items-center justify-center p-6 pt-20">
                        <div className="grid grid-cols-3 gap-3 w-full max-w-sm aspect-square">
                            {nodes.map((node) => (
                                <motion.button
                                    key={node.id}
                                    initial={{ scale: 0, rotate: -45 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    exit={{ scale: 0 }}
                                    whileTap={{ scale: 0.9 }}
                                    onPointerDown={() => handleNodeClick(node)}
                                    className={cn(
                                        "w-full h-full rounded-[1.5rem] sm:rounded-[2rem] shadow-lg flex items-center justify-center text-3xl sm:text-4xl font-black border-4 border-white transition-all ring-4 ring-slate-50/50 relative overflow-hidden",
                                        ELEMENT_COLORS[node.element]
                                    )}
                                >
                                    <span className="drop-shadow-md z-10">{ELEMENT_JP[node.element]}</span>
                                    <div className="absolute inset-0 bg-white/10 opacity-30" />
                                </motion.button>
                            ))}
                        </div>
                    </div>

                    {/* Cycle Guide */}
                    <div className="absolute top-24 sm:top-28 left-0 right-0 flex justify-center">
                        <div className="bg-white/90 backdrop-blur-md border border-slate-100 px-6 py-3 rounded-full shadow-xl flex items-center space-x-3">
                            {['Wood', 'Fire', 'Earth', 'Metal', 'Water'].map((el, i) => (
                                <div key={el} className="flex items-center space-x-3">
                                    <div className={cn(
                                        "w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black text-white shadow-sm",
                                        ELEMENT_COLORS[el as Element]
                                    )}>
                                        {ELEMENT_JP[el as Element]}
                                    </div>
                                    {i < 4 && <div className="text-slate-200 font-black">→</div>}
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
