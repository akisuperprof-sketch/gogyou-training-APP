import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CrudeDrug, Formula, GameProgress, Spirit, Element, Mood, SpiritRequest, DebugPreset } from './types';
import { INITIAL_CRUDE_DRUGS, INITIAL_FORMULAS, INITIAL_SPIRITS, SPIRIT_DATA } from './data';

interface AppState {
    spirits: Spirit[];
    crudeDrugs: Record<number, CrudeDrug>;
    formulas: Record<number, Formula>;
    gameProgress: GameProgress;

    // Actions
    unlockSpirit: (id: string) => void;
    gainCrudeDrug: (drugId: number, count?: number) => void;
    gameCompleted: (score: number, mode: 'chain' | 'guard' | 'sort', level?: number) => { gainedCards: number[], gainedExp: number, reaction: string };
    healSpirit: (spiritId: string, formulaId: number) => void;
    craftFormula: (formulaId: number) => { success: boolean, message: string };
    refreshRequest: () => void;
    setHasSeenStory: (val: boolean) => void;
    checkGenkiDecay: () => void;
    toggleMasterMode: () => void;
    unlockChainLevel: (level: number) => void;
    lastHealSpiritId: string | null;
    clearHealNotification: () => void;
    clearUnlockNotification: () => void;
    unlockWisdom: (id: string) => void;
    purchasePremium: () => void;
    applyDebugPreset: (preset: DebugPreset) => void;
    toggleBuruBuruMode: () => void;
    toggleCareMode: () => void;
    toggleVoiceMode: () => void;
    toggleAiMode: () => void;
    toggleEvolutionMode: () => void;
    toggleCampaignMode: () => void;
    petSpirit: (id: string) => void;
    feedSpirit: (id: string) => void;
    toggleDebugFlag: (key: keyof import('./types').DebugFlags) => void;
    setGamesUnlockedCount: (count: number) => void;
}

export const useStore = create<AppState>()(
    persist(
        (set, get) => ({
            spirits: INITIAL_SPIRITS,
            lastHealSpiritId: null,
            crudeDrugs: INITIAL_CRUDE_DRUGS.reduce((acc, drug) => {
                acc[drug.id] = { ...drug, ownedCount: 10, usedCount: 0, discovered: true };
                return acc;
            }, {} as Record<number, CrudeDrug>),
            formulas: INITIAL_FORMULAS.reduce((acc, formula) => {
                acc[formula.id] = { ...formula, ownedCount: 5, usedCount: 0, discovered: true };
                return acc;
            }, {} as Record<number, Formula>),
            gameProgress: {
                bestScores: { chain: 0, guard: 0, sort: 0 },
                dailyStreak: 0,
                lastPlayedDate: '',
                currentRequest: null,
                hasSeenStory: true,
                hasNewCards: false,
                lastGenkiUpdate: Date.now(),
                isMasterMode: true,
                chainLevelsUnlocked: 3,
                guardLevelsUnlocked: 3,
                gamesUnlockedCount: 3,
                totalSessionsPlayed: 10,
                chainEasyClears: 5,
                chainMediumClears: 5,
                guardEasyClears: 5,
                guardMediumClears: 5,
                unlockNotification: null,
                unlockedWisdomIds: [],
                unlockedFormulaIds: [],
                isPremiumUnlocked: true,
                isBuruBuruMode: false,
                isCareMode: false,
                isVoiceMode: false,
                isAiMode: false,
                isEvolutionMode: false,
                isCampaignMode: false,
                debugFlags: {
                    showImages: false,
                    unlockAllGames: false,
                    unlockAllSpirits: false,
                    unlockAllItems: false,
                    unlockPremium: false,
                }
            },

            toggleBuruBuruMode: () => set((state) => ({
                gameProgress: { ...state.gameProgress, isBuruBuruMode: !state.gameProgress.isBuruBuruMode }
            })),

            toggleCareMode: () => set((state) => ({
                gameProgress: { ...state.gameProgress, isCareMode: !state.gameProgress.isCareMode }
            })),

            toggleVoiceMode: () => set((state) => ({
                gameProgress: { ...state.gameProgress, isVoiceMode: !state.gameProgress.isVoiceMode }
            })),

            toggleAiMode: () => set((state) => ({
                gameProgress: { ...state.gameProgress, isAiMode: !state.gameProgress.isAiMode }
            })),

            toggleEvolutionMode: () => set((state) => ({
                gameProgress: { ...state.gameProgress, isEvolutionMode: !state.gameProgress.isEvolutionMode }
            })),

            toggleCampaignMode: () => set((state) => ({
                gameProgress: { ...state.gameProgress, isCampaignMode: !state.gameProgress.isCampaignMode }
            })),

            // なでなでアクション
            petSpirit: (id: string) => set((state) => {
                const spirits = [...state.spirits];
                const idx = spirits.findIndex(s => s.id === id);
                if (idx === -1) return state;

                const spirit = spirits[idx];
                let newGenki = spirit.stats.genki;
                let newKizuna = spirit.stats.kizuna;

                // 瀕死時に撫でると少し回復 (応急処置)
                if (spirit.stats.genki < 40) {
                    newGenki = Math.min(40, spirit.stats.genki + 5);
                } else {
                    // 通常時は絆などが上がる（上限あり）
                    newKizuna = Math.min(100, spirit.stats.kizuna + 1);
                }

                spirits[idx] = {
                    ...spirit,
                    stats: {
                        ...spirit.stats,
                        genki: newGenki,
                        kizuna: newKizuna
                    }
                };

                return { spirits };
            }),

            // お供えアクション (簡易実装: 数値上のアイテムが減るわけではないが、いったんアクションとして実装)
            // 将来的にはアイテムIDを受け取って減らす
            feedSpirit: (id: string) => set((state) => {
                const spirits = [...state.spirits];
                const idx = spirits.findIndex(s => s.id === id);
                if (idx === -1) return state;

                const spirit = spirits[idx];
                // 大幅回復
                const newGenki = Math.min(100, spirit.stats.genki + 50);

                spirits[idx] = {
                    ...spirit,
                    stats: {
                        ...spirit.stats,
                        genki: newGenki
                    }
                };
                return { spirits };
            }),

            toggleDebugFlag: (key: keyof import('./types').DebugFlags) => set((state) => {
                const currentFlags = state.gameProgress.debugFlags || {
                    showImages: false,
                    unlockAllGames: false,
                    unlockAllSpirits: false,
                    unlockAllItems: false,
                    unlockPremium: false,
                };

                return {
                    gameProgress: {
                        ...state.gameProgress,
                        debugFlags: {
                            ...currentFlags,
                            [key]: !currentFlags[key]
                        }
                    }
                };
            }),

            // デバッグ用: ゲーム解放数を強制セット
            setGamesUnlockedCount: (count: number) => set((state) => ({
                gameProgress: {
                    ...state.gameProgress,
                    gamesUnlockedCount: count
                }
            })),

            unlockSpirit: (id) => set((state) => ({
                spirits: state.spirits.map((s) => s.id === id ? { ...s, unlocked: true } : s)
            })),

            gainCrudeDrug: (drugId, count = 1) => set((state) => {
                const drug = state.crudeDrugs[drugId];
                if (!drug) return state;
                return {
                    crudeDrugs: {
                        ...state.crudeDrugs,
                        [drugId]: { ...drug, ownedCount: drug.ownedCount + count, discovered: true }
                    },
                    gameProgress: { ...state.gameProgress, hasNewCards: true }
                };
            }),

            healSpirit: (spiritId, formulaId) => set((state) => {
                const formula = state.formulas[formulaId];
                if (!formula || formula.ownedCount <= 0) return state;

                const spirits = [...state.spirits];
                const spiritIdx = spirits.findIndex(s => s.id === spiritId);
                if (spiritIdx === -1) return state;

                const spirit = spirits[spiritIdx];
                const isMatch = formula.element === spirit.element;
                const recoveryAmount = Math.floor(formula.effectValue * (isMatch ? 1.5 : 1.0));

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
                    formulas: {
                        ...state.formulas,
                        [formulaId]: { ...formula, ownedCount: formula.ownedCount - 1 }
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
                const drugIds = Object.keys(state.crudeDrugs).map(Number);
                for (let i = 0; i < cardCount; i++) {
                    const randomId = drugIds[Math.floor(Math.random() * drugIds.length)];
                    gainedCards.push(randomId);
                }

                const gainedExp = Math.floor(score / 60); // Max ~100 exp for 6000 pts

                set((current) => {
                    const newDrugs = { ...current.crudeDrugs };
                    gainedCards.forEach(id => {
                        if (newDrugs[id]) {
                            newDrugs[id] = {
                                ...newDrugs[id],
                                ownedCount: newDrugs[id].ownedCount + 1,
                                discovered: true
                            };
                        }
                    });

                    const relatedElement: Record<string, Element> = { chain: 'Wood', guard: 'Fire', sort: 'Earth' };
                    const spiritToUpdate = current.spirits.find(s => s.element === relatedElement[mode]) || current.spirits[0];

                    const newTotalSessions = current.gameProgress.totalSessionsPlayed + 1;
                    let newUnlockedCount = current.gameProgress.gamesUnlockedCount;
                    let newNotify = null;
                    let spiritToUnlockId: string | null = null;

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

                    // Spirit Unlocks (Every 2 sessions)
                    if (newTotalSessions === 2) {
                        spiritToUnlockId = 'ka';
                        newNotify = {
                            title: "新しい精霊！",
                            message: "火の精霊「カ」が目を覚ましたよ！熱い情熱が修行を助けてくれるはずだ。"
                        };
                    } else if (newTotalSessions === 4) {
                        spiritToUnlockId = 'do';
                        newNotify = {
                            title: "新しい精霊！",
                            message: "土の精霊「ド」が仲間になったよ！母なる大地の安定が君の力になる。"
                        };
                    } else if (newTotalSessions === 6) {
                        spiritToUnlockId = 'kon';
                        newNotify = {
                            title: "新しい精霊！",
                            message: "金の精霊「コン」が修行に加わったよ！鋭い感覚で万物を切り開こう。"
                        };
                    } else if (newTotalSessions === 8) {
                        spiritToUnlockId = 'sui';
                        newNotify = {
                            title: "精霊五行の集結！",
                            message: "水の精霊「スイ」も覚醒した！これで五行の精霊がすべて揃ったね。真の薬師への道が今、開かれた！"
                        };
                    }

                    const nextTotalJukuren = current.spirits.reduce((acc, s) => acc + s.stats.jukuren, 0) + gainedExp;

                    // Level Clear logic for Games
                    let newEasyClears = current.gameProgress.chainEasyClears;
                    let newMediumClears = current.gameProgress.chainMediumClears;
                    let newChainLevelsUnlocked = current.gameProgress.chainLevelsUnlocked;

                    let newGuardEasyClears = current.gameProgress.guardEasyClears;
                    let newGuardMediumClears = current.gameProgress.guardMediumClears;
                    let newGuardLevelsUnlocked = current.gameProgress.guardLevelsUnlocked;

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
                    } else if (mode === 'guard') {
                        if (level === 1) { // Easy
                            newGuardEasyClears += 1;
                            if (newGuardEasyClears === 1 && newGuardLevelsUnlocked < 2) {
                                newGuardLevelsUnlocked = 2;
                                newNotify = {
                                    title: "相克ガード・中級解放！",
                                    message: "お見事！相克の理が身についてきたね。中級では時折、五行の導きが消えることもあるよ。"
                                };
                            }
                        } else if (level === 2) { // Intermediate
                            newGuardMediumClears += 1;
                            if (newGuardMediumClears === 3 && newGuardLevelsUnlocked < 3) {
                                newGuardLevelsUnlocked = 3;
                                newNotify = {
                                    title: "相克ガード・上級解放！",
                                    message: "これぞ真の理！上級では五行の導きが完全に消え、君の知識のみが武器となる！"
                                };
                            }
                        }
                    }

                    return {
                        crudeDrugs: newDrugs,
                        spirits: current.spirits.map(s => {
                            let updated = s.id === spiritToUpdate.id ? { ...s, mood: newMood, stats: { ...s.stats, jukuren: s.stats.jukuren + gainedExp } } : s;
                            if (s.id === spiritToUnlockId) return { ...updated, unlocked: true };
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
                            guardEasyClears: newGuardEasyClears,
                            guardMediumClears: newGuardMediumClears,
                            chainLevelsUnlocked: newChainLevelsUnlocked,
                            guardLevelsUnlocked: newGuardLevelsUnlocked,
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

            toggleMasterMode: () => {
                const state = get();
                get().applyDebugPreset(state.gameProgress.isMasterMode ? 'RESET' : 'FULL');
            },

            applyDebugPreset: (preset) => set((state) => {
                // Base state for resets
                const initialCrudeDrugs = INITIAL_CRUDE_DRUGS.reduce((acc, drug) => {
                    acc[drug.id] = { ...drug, ownedCount: 0, usedCount: 0, discovered: false };
                    return acc;
                }, {} as Record<number, CrudeDrug>);
                const initialFormulas = INITIAL_FORMULAS.reduce((acc, formula) => {
                    acc[formula.id] = { ...formula, ownedCount: 0, usedCount: 0, discovered: false };
                    return acc;
                }, {} as Record<number, Formula>);

                switch (preset) {
                    case 'VISUAL':
                        return { gameProgress: { ...state.gameProgress, isMasterMode: true } };

                    case 'GAMES':
                        return {
                            gameProgress: {
                                ...state.gameProgress,
                                chainLevelsUnlocked: 3,
                                gamesUnlockedCount: 3,
                                isMasterMode: true
                            }
                        };

                    case 'SPIRITS':
                        return {
                            spirits: state.spirits.map(s => ({ ...s, unlocked: true })),
                            gameProgress: { ...state.gameProgress, isMasterMode: true }
                        };

                    case 'HALF_DRUGS': {
                        const drugIds = Object.keys(state.crudeDrugs).map(Number);
                        const halfIds = drugIds.slice(0, Math.ceil(drugIds.length / 2));
                        const newDrugs = { ...state.crudeDrugs };
                        halfIds.forEach(id => {
                            newDrugs[id] = { ...newDrugs[id], discovered: true, ownedCount: 5 };
                        });
                        return { crudeDrugs: newDrugs, gameProgress: { ...state.gameProgress, isMasterMode: true } };
                    }

                    case 'CRAFTING':
                        return {
                            crudeDrugs: Object.keys(state.crudeDrugs).reduce((acc, id) => {
                                const cid = Number(id);
                                acc[cid] = { ...state.crudeDrugs[cid], ownedCount: 10, discovered: true };
                                return acc;
                            }, {} as Record<number, CrudeDrug>),
                            gameProgress: { ...state.gameProgress, isPremiumUnlocked: true, isMasterMode: true }
                        };

                    case 'FULL':
                        return {
                            spirits: state.spirits.map(s => ({ ...s, unlocked: true })),
                            crudeDrugs: Object.keys(state.crudeDrugs).reduce((acc, id) => {
                                const cid = Number(id);
                                acc[cid] = { ...state.crudeDrugs[cid], ownedCount: 99, discovered: true };
                                return acc;
                            }, {} as Record<number, CrudeDrug>),
                            formulas: Object.keys(state.formulas).reduce((acc, id) => {
                                const fid = Number(id);
                                acc[fid] = { ...state.formulas[fid], ownedCount: 99, discovered: true };
                                return acc;
                            }, {} as Record<number, Formula>),
                            gameProgress: {
                                ...state.gameProgress,
                                isMasterMode: true,
                                isPremiumUnlocked: true,
                                chainLevelsUnlocked: 3,
                                gamesUnlockedCount: 3,
                                unlockedFormulaIds: Object.keys(state.formulas).map(Number),
                            }
                        };

                    case 'RESET':
                        return {
                            spirits: INITIAL_SPIRITS,
                            crudeDrugs: initialCrudeDrugs,
                            formulas: initialFormulas,
                            gameProgress: {
                                ...state.gameProgress,
                                isMasterMode: false,
                                isPremiumUnlocked: false,
                                chainLevelsUnlocked: 1,
                                gamesUnlockedCount: 1,
                                unlockedFormulaIds: [],
                            }
                        };

                    default:
                        return state;
                }
            }),

            purchasePremium: () => set((state) => ({
                gameProgress: { ...state.gameProgress, isPremiumUnlocked: true }
            })),

            craftFormula: (formulaId) => {
                const state = get();
                const formula = state.formulas[formulaId];
                if (!formula) return { success: false, message: "レシピが見つかりません" };

                const hasIngredients = formula.recipe.every(item =>
                    state.crudeDrugs[item.crudeDrugId] && state.crudeDrugs[item.crudeDrugId].ownedCount >= item.count
                );

                if (!hasIngredients) return { success: false, message: "生薬が足りません" };

                set(current => {
                    const newDrugs = { ...current.crudeDrugs };
                    formula.recipe.forEach(item => {
                        newDrugs[item.crudeDrugId].ownedCount -= item.count;
                    });

                    return {
                        crudeDrugs: newDrugs,
                        formulas: {
                            ...current.formulas,
                            [formulaId]: {
                                ...current.formulas[formulaId],
                                ownedCount: current.formulas[formulaId].ownedCount + 1,
                                discovered: true
                            }
                        }
                    };
                });

                return { success: true, message: `${formula.name} を調合しました！` };
            },

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
            name: 'gogyou-storage-v15',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                crudeDrugs: state.crudeDrugs,
                formulas: state.formulas,
                spirits: state.spirits,
                gameProgress: {
                    ...state.gameProgress,
                    unlockedWisdomIds: state.gameProgress.unlockedWisdomIds || [],
                    unlockedFormulaIds: state.gameProgress.unlockedFormulaIds || [],
                },
            }),
        }
    )
);
