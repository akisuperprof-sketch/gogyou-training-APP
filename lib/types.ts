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

export interface Card {
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
}
