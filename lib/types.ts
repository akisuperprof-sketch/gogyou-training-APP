export type Element = 'Wood' | 'Fire' | 'Earth' | 'Metal' | 'Water';
export type Mood = 'good' | 'normal' | 'bad';

export interface SpiritStats {
    genki: number; // 行動力
    chowa: number; // バランス
    jukuren: number; // レベル
    kizuna: number; // 絆
}

export interface Spirit {
    id: string;
    name: string;
    reading: string;
    element: Element;
    stats: SpiritStats;
    dialogueCode: string; // For greeting logic
    unlocked: boolean;
    evolutionLevel?: number; // 進化段階 (1:通常, 2:覚醒, 3:神格)
    currentOutfit?: string;  // 着せ替えID
    description?: string;
    mood: Mood;
}

export interface CrudeDrug {
    id: number;
    name: string;
    reading: string;
    element: Element;
    flavor: string;
    description: string;
    effectValue: number;
    ownedCount: number;
    usedCount: number;
    discovered: boolean;
    imageUrl?: string;
}

export interface Formula {
    id: number;
    name: string;
    reading: string;
    element: Element;
    flavor: string;
    description: string;
    effectValue: number;
    recipe: { crudeDrugId: number; count: number }[];
    ownedCount: number;
    usedCount: number;
    discovered: boolean;
    imageUrl?: string;
}

export interface SpiritRequest {
    id: string; // which spirit
    gameType: 'chain' | 'guard' | 'sort';
    text: string;
    expiryTime: number; // timestamp
}

export interface GameProgress {
    bestScores: {
        chain: number;
        guard: number;
        sort: number;
    };
    dailyStreak: number;
    lastPlayedDate: string;
    currentRequest: SpiritRequest | null;
    hasSeenStory: boolean;
    hasNewCards: boolean;
    lastGenkiUpdate: number;
    isMasterMode: boolean;
    chainLevelsUnlocked: number;
    guardLevelsUnlocked: number;
    gamesUnlockedCount: number;
    totalSessionsPlayed: number;
    chainEasyClears: number;
    chainMediumClears: number;
    guardEasyClears: number;
    guardMediumClears: number;
    unlockNotification: string | null;
    unlockedWisdomIds: number[];
    unlockedFormulaIds: number[];
    isPremiumUnlocked: boolean;
    isBuruBuruMode: boolean; // ぶるぶるモード (試験運用)
    isCareMode: boolean;     // お世話モード (試験運用: なでなで・お供え)
    isVoiceMode: boolean;    // 音響・振動モード (試験運用: SE・ボイス)
    isAiMode: boolean;       // 体質診断・AIモード (試験運用: Gemini診断)
    isEvolutionMode: boolean; // コレクション・進化モード (試験運用)
    isCampaignMode: boolean;  // キャンペーン・リアル連携モード (試験運用)
    debugFlags: DebugFlags;
}

export interface DebugFlags {
    showImages: boolean;
    unlockAllGames: boolean;
    unlockAllSpirits: boolean;
    unlockAllItems: boolean;
    unlockPremium: boolean;
}

export interface DailyWisdom {
    id: number;
    title: string;
    content: string;
    element: Element | 'Balance';
    tag: string;
}

export type DebugPreset = 'NONE' | 'BASIC' | 'VISUAL' | 'GAMES' | 'SPIRITS' | 'HALF_DRUGS' | 'CRAFTING' | 'FULL' | 'RESET';
