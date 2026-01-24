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
    useCard: (cardId: number, spiritId: string) => void;
    gameCompleted: (score: number, mode: 'chain' | 'guard' | 'sort') => { gainedCards: number[], gainedExp: number, reaction: string };
    refreshRequest: () => void;
    setHasSeenStory: (val: boolean) => void;
    clearNewCardsFlag: () => void;
}

export const useStore = create<AppState>()(
    persist(
        (set, get) => ({
            spirits: INITIAL_SPIRITS,
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

            useCard: (cardId, spiritId) => set((state) => {
                const card = state.cards[cardId];
                const spirit = state.spirits.find((s) => s.id === spiritId);

                if (!card || card.ownedCount <= 0 || !spirit) return state;

                const isMatch = card.element === spirit.element;
                const bonus = isMatch ? 1.5 : 1.0;
                const growth = Math.floor(card.effectValue * bonus);

                return {
                    cards: {
                        ...state.cards,
                        [cardId]: { ...card, ownedCount: card.ownedCount - 1, usedCount: card.usedCount + 1 }
                    },
                    spirits: state.spirits.map((s) => {
                        if (s.id !== spiritId) return s;
                        return {
                            ...s,
                            stats: {
                                ...s.stats,
                                jukuren: s.stats.jukuren + growth,
                                genki: Math.min(100, s.stats.genki + 10),
                                kizuna: Math.min(100, s.stats.kizuna + 5),
                            }
                        };
                    })
                };
            }),

            gameCompleted: (score, mode) => {
                const state = get();
                const request = state.gameProgress.currentRequest;
                const isRequestFulfilled = request && request.gameType === mode;

                let newMood: Mood = 'normal';
                if (score >= 500) newMood = 'good';
                else if (score < 100) newMood = 'bad';

                let cardCount = Math.max(1, Math.floor(score / 200));
                if (isRequestFulfilled) cardCount += 1;

                const gainedCards: number[] = [];
                const cardIds = Object.keys(state.cards).map(Number);
                for (let i = 0; i < cardCount; i++) {
                    const randomId = cardIds[Math.floor(Math.random() * cardIds.length)];
                    gainedCards.push(randomId);
                }

                const gainedExp = Math.floor(score / 10);

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

                    // Compute total rank/jukuren across all unlocked spirits
                    const totalJukuren = current.spirits.reduce((acc, s) => acc + s.stats.jukuren, 0) + gainedExp;

                    return {
                        cards: newCards,
                        spirits: current.spirits.map(s => {
                            const base = s.id === spiritToUpdate.id ? { ...s, mood: newMood, stats: { ...s.stats, jukuren: s.stats.jukuren + gainedExp } } : s;
                            // Unlock Metal at 500 total, Water at 1000 total
                            if (s.id === 'kon' && totalJukuren >= 500 && !s.unlocked) return { ...base, unlocked: true };
                            if (s.id === 'sui' && totalJukuren >= 1000 && !s.unlocked) return { ...base, unlocked: true };
                            return base;
                        }),
                        gameProgress: {
                            ...current.gameProgress,
                            bestScores: {
                                ...current.gameProgress.bestScores,
                                [mode]: Math.max(current.gameProgress.bestScores[mode] || 0, score)
                            },
                            currentRequest: isRequestFulfilled ? null : current.gameProgress.currentRequest,
                            hasNewCards: gainedCards.length > 0
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
            }))
        }),
        {
            name: 'gogyou-storage-v4',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
