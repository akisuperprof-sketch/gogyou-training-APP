import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Card, GameProgress, Spirit, Element, Mood, SpiritRequest } from './types';
import { INITIAL_CARDS, INITIAL_SPIRITS, SPIRIT_DATA } from './data';

interface AppState {
    spirits: Spirit[];
    cards: Record<number, Card>;
    gameProgress: GameProgress;

    // Actions
    unlockSpirit: (id: string) => void;
    gainCard: (cardId: number, count?: number) => void;
    useCard: (cardId: number) => void;
    gameCompleted: (score: number, mode: 'chain' | 'guard' | 'sort', level?: number) => { gainedCards: number[], gainedExp: number, reaction: string };
    refreshRequest: () => void;
    setHasSeenStory: (val: boolean) => void;
    clearNewCardsFlag: () => void;
    checkGenkiDecay: () => void;
    toggleMasterMode: () => void;
    unlockChainLevel: (level: number) => void;
    lastHealSpiritId: string | null;
    clearHealNotification: () => void;
    clearUnlockNotification: () => void;
    unlockWisdom: (id: string) => void;
}

export const useStore = create<AppState>()(
    persist(
        (set, get) => ({
            spirits: INITIAL_SPIRITS,
            lastHealSpiritId: null,
            cards: INITIAL_CARDS.reduce((acc, card) => {
                acc[card.id] = { ...card, ownedCount: 0, usedCount: 0, discovered: false };
                return acc;
            }, {} as Record<number, Card>),
            gameProgress: {
                bestScores: { chain: 0, guard: 0, sort: 0 },
                dailyStreak: 0,
                lastPlayedDate: '',
                currentRequest: null,
                hasSeenStory: false,
                hasNewCards: false,
                lastGenkiUpdate: Date.now(),
                isMasterMode: false,
                chainLevelsUnlocked: 1,
                gamesUnlockedCount: 1,
                totalSessionsPlayed: 0,
                chainEasyClears: 0,
                chainMediumClears: 0,
                unlockNotification: null,
                unlockedWisdomIds: [],
            },

            unlockSpirit: (id) => set((state) => ({
                spirits: state.spirits.map((s) => s.id === id ? { ...s, unlocked: true } : s)
            })),

            gainCard: (cardId, count = 1) => set((state) => {
                const card = state.cards[cardId];
                if (!card) return state;
                return {
                    cards: {
                        ...state.cards,
                        [cardId]: { ...card, ownedCount: card.ownedCount + count, discovered: true }
                    },
                    gameProgress: { ...state.gameProgress, hasNewCards: true }
                };
            }),

            useCard: (cardId) => set((state) => {
                const card = state.cards[cardId];
                if (!card || card.ownedCount <= 0) return state;

                const spirits = [...state.spirits];
                let spiritIdx = spirits.findIndex(s => s.unlocked && s.element === card.element);
                if (spiritIdx === -1) spiritIdx = spirits.findIndex(s => s.unlocked);

                if (spiritIdx === -1) return state;

                const spirit = spirits[spiritIdx];
                const isMatch = card.element === spirit.element;
                const recoveryAmount = Math.floor(card.effectValue * (isMatch ? 1.5 : 1.0) / 2);

                const newGenki = Math.min(100, spirit.stats.genki + recoveryAmount);
                let newMood = spirit.mood;
                if (newGenki >= 70) newMood = 'good';
                else if (newGenki >= 15) newMood = 'normal';

                spirits[spiritIdx] = {
                    ...spirit,
                    mood: newMood,
                    stats: {
                        ...spirit.stats,
                        jukuren: spirit.stats.jukuren + Math.floor(recoveryAmount / 2),
                        genki: newGenki,
                        kizuna: Math.min(100, spirit.stats.kizuna + 5),
                    }
                };

                return {
                    cards: {
                        ...state.cards,
                        [cardId]: { ...card, ownedCount: card.ownedCount - 1, usedCount: card.usedCount + 1 }
                    },
                    spirits,
                    lastHealSpiritId: spirit.id
                };
            }),

            clearHealNotification: () => set({ lastHealSpiritId: null }),

            gameCompleted: (score, mode, level) => {
                const state = get();
                const request = state.gameProgress.currentRequest;
                const isRequestFulfilled = request && request.gameType === mode;

                let newMood: Mood = 'normal';
                if (score >= 500) newMood = 'good';
                else if (score < 150) newMood = 'bad';

                // Balanced reward scaling
                const baseCardCount = Math.floor(score / 3500); // 1 card per 3500 pts
                let cardCount = Math.max(1, Math.min(5, baseCardCount)); // Max 5 cards
                if (isRequestFulfilled) cardCount += 1;

                const gainedCards: number[] = [];
                const cardIds = Object.keys(state.cards).map(Number);
                for (let i = 0; i < cardCount; i++) {
                    const randomId = cardIds[Math.floor(Math.random() * cardIds.length)];
                    gainedCards.push(randomId);
                }

                const gainedExp = Math.floor(score / 60); // Max ~100 exp for 6000 pts

                set((current) => {
                    const newCards = { ...current.cards };
                    gainedCards.forEach(id => {
                        if (newCards[id]) {
                            newCards[id] = {
                                ...newCards[id],
                                ownedCount: newCards[id].ownedCount + 1,
                                discovered: true
                            };
                        }
                    });

                    const relatedElement: Record<string, Element> = { chain: 'Wood', guard: 'Fire', sort: 'Earth' };
                    const spiritToUpdate = current.spirits.find(s => s.element === relatedElement[mode]) || current.spirits[0];

                    const newTotalSessions = current.gameProgress.totalSessionsPlayed + 1;
                    let newUnlockedCount = current.gameProgress.gamesUnlockedCount;
                    let newNotify = null;

                    if (newTotalSessions === 1 && newUnlockedCount < 2) {
                        newUnlockedCount = 2;
                        newNotify = {
                            title: "あたらしい修行！",
                            message: "お見事！新しい修行「相克ガード」ができるようになったよ。力の調和を学ぼう！"
                        };
                    } else if (newTotalSessions === 2 && newUnlockedCount < 3) {
                        newUnlockedCount = 3;
                        newNotify = {
                            title: "修行の広がり",
                            message: "修行が板についてきたね！「連想仕分け」も解放されたよ。万物の繋がりを見極めてごらん。"
                        };
                    }

                    const nextTotalJukuren = current.spirits.reduce((acc, s) => acc + s.stats.jukuren, 0) + gainedExp;

                    // Level Clear logic for Chain Game
                    let newEasyClears = current.gameProgress.chainEasyClears;
                    let newMediumClears = current.gameProgress.chainMediumClears;
                    let newChainLevelsUnlocked = current.gameProgress.chainLevelsUnlocked;

                    if (mode === 'chain') {
                        if (level === 9) {
                            newEasyClears += 1;
                            if (newEasyClears === 1 && newChainLevelsUnlocked < 2) {
                                newChainLevelsUnlocked = 2;
                                newNotify = {
                                    title: "中級解放！",
                                    message: "「相生チェイン」の中級に挑戦できるようになったよ。もっと速く、正確に繋いでみてね！"
                                };
                            }
                        } else if (level === 18) {
                            newMediumClears += 1;
                            if (newMediumClears === 5 && newChainLevelsUnlocked < 3) {
                                newChainLevelsUnlocked = 3;
                                newNotify = {
                                    title: "上級解放！",
                                    message: "素晴らしい集中力だ！「相生チェイン」の上級が解放されたよ。これぞ究極の修行だ！"
                                };
                            }
                        }
                    }

                    return {
                        cards: newCards,
                        spirits: current.spirits.map(s => {
                            let updated = s.id === spiritToUpdate.id ? { ...s, mood: newMood, stats: { ...s.stats, jukuren: s.stats.jukuren + gainedExp } } : s;
                            if (s.id === 'kon' && nextTotalJukuren >= 500 && !s.unlocked) return { ...updated, unlocked: true };
                            if (s.id === 'sui' && nextTotalJukuren >= 1000 && !s.unlocked) return { ...updated, unlocked: true };
                            return updated;
                        }),
                        gameProgress: {
                            ...current.gameProgress,
                            bestScores: {
                                ...current.gameProgress.bestScores,
                                [mode]: Math.max(current.gameProgress.bestScores[mode] || 0, score)
                            },
                            currentRequest: isRequestFulfilled ? null : current.gameProgress.currentRequest,
                            hasNewCards: gainedCards.length > 0,
                            gamesUnlockedCount: newUnlockedCount,
                            totalSessionsPlayed: newTotalSessions,
                            chainEasyClears: newEasyClears,
                            chainMediumClears: newMediumClears,
                            chainLevelsUnlocked: newChainLevelsUnlocked,
                            unlockNotification: newNotify || current.gameProgress.unlockNotification
                        }
                    };
                });

                const targetSpiritId = request?.id || 'moku';
                const spiritData = SPIRIT_DATA[targetSpiritId] || SPIRIT_DATA['moku'];
                const reactions = score >= 300 ? spiritData.reactions.success : spiritData.reactions.fail;
                const reaction = reactions[Math.floor(Math.random() * reactions.length)];

                return { gainedCards, gainedExp, reaction };
            },

            refreshRequest: () => set((state) => {
                const unlockedSpirits = state.spirits.filter(s => s.unlocked);
                if (unlockedSpirits.length === 0) return state;
                const spirit = unlockedSpirits[Math.floor(Math.random() * unlockedSpirits.length)];
                const types: ('chain' | 'guard' | 'sort')[] = ['chain', 'guard', 'sort'];
                const gameType = types[Math.floor(Math.random() * types.length)];

                const newRequest: SpiritRequest = {
                    id: spirit.id,
                    gameType,
                    text: SPIRIT_DATA[spirit.id].requestLines[gameType],
                    expiryTime: Date.now() + 3600000,
                };

                return {
                    gameProgress: {
                        ...state.gameProgress,
                        currentRequest: newRequest
                    }
                };
            }),

            setHasSeenStory: (val) => set((state) => ({
                gameProgress: { ...state.gameProgress, hasSeenStory: val }
            })),

            clearNewCardsFlag: () => set((state) => ({
                gameProgress: { ...state.gameProgress, hasNewCards: false }
            })),

            checkGenkiDecay: () => set((state) => {
                const now = Date.now();
                const lastUpdate = state.gameProgress.lastGenkiUpdate || now;
                const elapsedMs = now - lastUpdate;
                const decayAmount = Math.floor(elapsedMs / (1000 * 60 * 60 * 4.8));

                if (decayAmount <= 0) return state;

                const newSpirits = state.spirits.map(s => {
                    if (!s.unlocked) return s;
                    const newGenki = Math.max(0, s.stats.genki - decayAmount);
                    let newMood = s.mood;
                    if (newGenki < 15) newMood = 'bad';
                    else if (newGenki >= 70) newMood = 'good';
                    else if (newGenki >= 15 && s.mood === 'bad') newMood = 'normal';

                    return {
                        ...s,
                        mood: newMood,
                        stats: { ...s.stats, genki: newGenki }
                    };
                });

                return {
                    spirits: newSpirits,
                    gameProgress: {
                        ...state.gameProgress,
                        lastGenkiUpdate: now - (elapsedMs % (1000 * 60 * 60 * 4.8))
                    }
                };
            }),

            toggleMasterMode: () => set((state) => {
                const isMaster = !state.gameProgress.isMasterMode;
                if (isMaster) {
                    return {
                        spirits: state.spirits.map(s => ({ ...s, unlocked: true })),
                        cards: Object.keys(state.cards).reduce((acc, id) => {
                            const cid = Number(id);
                            acc[cid] = { ...state.cards[cid], ownedCount: Math.max(state.cards[cid].ownedCount, 99), discovered: true };
                            return acc;
                        }, {} as Record<number, Card>),
                        gameProgress: {
                            ...state.gameProgress,
                            isMasterMode: true,
                            chainLevelsUnlocked: 3,
                            gamesUnlockedCount: 3,
                            totalSessionsPlayed: 10,
                            chainEasyClears: 1,
                            chainMediumClears: 5,
                            unlockedWisdomIds: ['w1', 'w2', 'w3', 'w4', 'w5', 'w6', 'w7', 'w8', 'w9', 'w10']
                        }
                    };
                } else {
                    return {
                        gameProgress: { ...state.gameProgress, isMasterMode: false }
                    };
                }
            }),

            unlockChainLevel: (level) => set((state) => ({
                gameProgress: {
                    ...state.gameProgress,
                    chainLevelsUnlocked: Math.max(state.gameProgress.chainLevelsUnlocked, level)
                }
            })),

            clearUnlockNotification: () => set((state) => ({
                gameProgress: { ...state.gameProgress, unlockNotification: null }
            })),
            unlockWisdom: (id) => set((state) => {
                if (state.gameProgress.unlockedWisdomIds.includes(id)) return state;
                return {
                    gameProgress: {
                        ...state.gameProgress,
                        unlockedWisdomIds: [...state.gameProgress.unlockedWisdomIds, id]
                    }
                };
            }),
            clearUnlockedWisdomIds: () => set((state) => ({
                gameProgress: { ...state.gameProgress, unlockedWisdomIds: [] }
            }))
        }),
        {
            name: 'gogyou-storage-v12',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                cards: state.cards,
                spirits: state.spirits,
                gameProgress: {
                    ...state.gameProgress,
                    // Ensure unlockedWisdomIds is initialized as an empty array if not present
                    unlockedWisdomIds: state.gameProgress.unlockedWisdomIds || [],
                },
            }),
        }
    )
);
