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
}

export interface Formula {
    id: number;
    name: string;
    reading: string;
    element: Element;
    description: string;
    flavor: string; // Added
    effectValue: number;
    recipe: { crudeDrugId: number; count: number }[];
    ownedCount: number;
    usedCount: number; // Added
    discovered: boolean;
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
    lastPlayedDate: string; // ISO date
    currentRequest: SpiritRequest | null;
    hasSeenStory: boolean;
    hasNewCards: boolean;
    lastGenkiUpdate?: number;
    isMasterMode: boolean;
    chainLevelsUnlocked: number;
    guardLevelsUnlocked: number;
    gamesUnlockedCount: number;
    totalSessionsPlayed: number;
    chainEasyClears: number;
    chainMediumClears: number;
    guardEasyClears: number;
    guardMediumClears: number;
    unlockNotification: { title: string; message: string } | null;
    unlockedWisdomIds: string[];
    unlockedFormulaIds: number[];
    isPremiumUnlocked: boolean;
}

export interface DailyWisdom {
    id: string;
    element: Element | 'Balance';
    title: string;
    content: string;
    tag?: string; // e.g. 抑平, 相生, etc.
}
export type DebugPreset = 'VISUAL' | 'GAMES' | 'SPIRITS' | 'HALF_DRUGS' | 'CRAFTING' | 'FULL' | 'RESET';
