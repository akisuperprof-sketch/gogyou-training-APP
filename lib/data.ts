import { Card, Element, Spirit, Mood } from './types';

export const ELEMENTS: Element[] = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];

export const ELEMENT_JP: Record<Element, string> = {
    Wood: '木',
    Fire: '火',
    Earth: '土',
    Metal: '金',
    Water: '水',
};

export const ELEMENT_READING: Record<Element, string> = {
    Wood: 'もく',
    Fire: 'か',
    Earth: 'ど',
    Metal: 'こん',
    Water: 'すい',
};

export const GAME_TYPE_NAME: Record<string, string> = {
    chain: '相生',
    guard: '相克',
    sort: '連想',
};

export const GAME_TYPE_READING: Record<string, string> = {
    chain: 'そうせい',
    guard: 'そうこく',
    sort: 'れんそう',
};

export const ELEMENT_COLORS: Record<Element, string> = {
    Wood: 'bg-green-500 text-white',
    Fire: 'bg-red-500 text-white',
    Earth: 'bg-yellow-600 text-white',
    Metal: 'bg-gray-400 text-white',
    Water: 'bg-blue-500 text-white',
};

export const MOOD_COLORS: Record<Mood, string> = {
    good: 'border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.5)]',
    normal: 'border-slate-100',
    bad: 'border-slate-300 grayscale-[0.3]',
};

export const SOUSEI: Record<Element, Element> = {
    Wood: 'Fire',
    Fire: 'Earth',
    Earth: 'Metal',
    Metal: 'Water',
    Water: 'Wood',
};

export const SOUKOKU: Record<Element, Element> = {
    Wood: 'Earth',
    Earth: 'Water',
    Water: 'Fire',
    Fire: 'Metal',
    Metal: 'Wood',
};

export const SPIRIT_DATA: Record<string, {
    moodLines: Record<Mood, string[]>;
    requestLines: Record<'chain' | 'guard' | 'sort', string>;
    reactions: { success: string[]; fail: string[] };
    illustration: string;
}> = {
    moku: {
        illustration: '/Users/akihironishi/.gemini/antigravity/brain/e66a4e1a-ff28-42e9-8247-e87d23d21f39/wood_spirit_illustration_1769307082312.png',
        moodLines: {
            good: ['絶好調だよ、どんどん行こう！', '風が気持ちいいね！'],
            normal: ['今日は何をしようか？', '準備はできてるよ。'],
            bad: ['ちょっと体が重いかも…', 'イライラしちゃいそう。'],
        },
        requestLines: {
            chain: '木の流れを整えたいな',
            guard: '暴走を抑える訓練をしたい',
            sort: '属性の知識を深めたい気分',
        },
        reactions: {
            success: ['さすが！いい流れだね', '完璧だよ！'],
            fail: ['次は絶対いけるよ', '焦らずにね'],
        }
    },
    ka: {
        illustration: '/Users/akihironishi/.gemini/antigravity/brain/e66a4e1a-ff28-42e9-8247-e87d23d21f39/fire_spirit_illustration_1769307104935.png',
        moodLines: {
            good: ['最高の気分！燃えてきた！', '遊びまくろうぜ！'],
            normal: ['次はどのゲームにする？', '準備万端だ！'],
            bad: ['火が消えそうだよ…', 'なんだか元気が出ないな。'],
        },
        requestLines: {
            chain: 'エネルギーを繋ぐ感覚が欲しい！',
            guard: 'この熱さをコントロールしたい',
            sort: '言葉の仕分けで整理整頓だ',
        },
        reactions: {
            success: ['最高だぜ！アツい！', 'この調子でいこう！'],
            fail: ['どんまい！次があるさ', '切り替えていこうぜ'],
        }
    },
    do: {
        illustration: '/Users/akihironishi/.gemini/antigravity/brain/e66a4e1a-ff28-42e9-8247-e87d23d21f39/earth_spirit_illustration_1769307119667.png',
        moodLines: {
            good: ['今日はとってもいい日だね', '心がぽかぽかするよ'],
            normal: ['ゆっくり、マイペースにいこう', 'お茶でも飲む？'],
            bad: ['少し横になりたいかも…', '悩み事があるのかな。'],
        },
        requestLines: {
            chain: 'みんなとの繋がりを大切にしたいな',
            guard: 'みんなを守る練習をしよう',
            sort: '落ち着いて言葉を分けたいんだ',
        },
        reactions: {
            success: ['優しい気持ちになれるね', '素晴らしいです'],
            fail: ['無理しなくていいんだよ', 'ゆっくり休もうね'],
        }
    },
    kon: {
        illustration: '/Users/akihironishi/.gemini/antigravity/brain/e66a4e1a-ff28-42e9-8247-e87d23d21f39/metal_spirit_illustration_1769307137461.png',
        moodLines: {
            good: ['鋭い感覚だ、何でも切れそうだよ', '輝きが増してきたかな'],
            normal: ['冷静に、確実にこなそう', '準備はできている'],
            bad: ['錆びついたような感覚だ…', '少し研ぎ澄まさなきゃね'],
        },
        requestLines: {
            chain: '金の精緻な流れを感じたい',
            guard: '守りの硬さを確かめよう',
            sort: '物事を明確に分ける修行を',
        },
        reactions: {
            success: ['見事な手際だ', '感服したよ'],
            fail: ['まだ磨きが足りないな', '次は研ぎ澄ましてゆこう'],
        }
    },
    sui: {
        illustration: '/Users/akihironishi/.gemini/antigravity/brain/e66a4e1a-ff28-42e9-8247-e87d23d21f39/water_spirit_illustration_1769307152833.png',
        moodLines: {
            good: ['澄み渡るような心地よさです', 'どこまでも流れていけそう'],
            normal: ['静かな波に身を任せて', '穏やかな一日ですね'],
            bad: ['水が濁ってしまったよう…', '今はじっとしていたいわ'],
        },
        requestLines: {
            chain: '水のしなやかな繋がりを',
            guard: '包み込むような守りを',
            sort: '属性の海を漂いたいわ',
        },
        reactions: {
            success: ['清らかな心を感じます', 'とても美しいわ'],
            fail: ['また波が落ち着いたら', '焦らなくて良いのよ'],
        }
    }
};

export const INITIAL_SPIRITS: Spirit[] = [
    {
        id: 'moku',
        name: 'モク',
        reading: 'もく',
        element: 'Wood',
        stats: { genki: 20, chowa: 10, jukuren: 1, kizuna: 0 },
        dialogueCode: 'impatient',
        unlocked: true,
        mood: 'bad',
    },
    {
        id: 'ka',
        name: 'カ',
        reading: 'か',
        element: 'Fire',
        stats: { genki: 30, chowa: 10, jukuren: 1, kizuna: 0 },
        dialogueCode: 'loud',
        unlocked: true,
        mood: 'bad',
    },
    {
        id: 'do',
        name: 'ド',
        reading: 'ど',
        element: 'Earth',
        stats: { genki: 10, chowa: 10, jukuren: 1, kizuna: 0 },
        dialogueCode: 'gentle',
        unlocked: true,
        mood: 'bad',
    },
    {
        id: 'kon',
        name: 'コン',
        reading: 'こん',
        element: 'Metal',
        stats: { genki: 10, chowa: 10, jukuren: 1, kizuna: 0 },
        dialogueCode: 'sharp',
        unlocked: false,
        mood: 'bad',
    },
    {
        id: 'sui',
        name: 'スイ',
        reading: 'すい',
        element: 'Water',
        stats: { genki: 10, chowa: 10, jukuren: 1, kizuna: 0 },
        dialogueCode: 'calm',
        unlocked: false,
        mood: 'bad',
    },
];

export const INITIAL_CARDS: Omit<Card, 'ownedCount' | 'usedCount' | 'discovered'>[] = [
    { id: 1, name: '葛根湯', reading: 'かっこんとう', element: 'Wood', flavor: '首の凝りに効きそう', description: '体を温め、風邪の初期症状や肩こりに用いられる。', effectValue: 20 },
    { id: 2, name: '小柴胡湯', reading: 'しょうさいことう', element: 'Wood', flavor: 'イライラによさげ', description: '胸脇苦満があり、食欲不振や吐き気がある時に。', effectValue: 20 },
    { id: 3, name: '抑肝散', reading: 'よくかんさん', element: 'Wood', flavor: '怒りを鎮める', description: '神経の高ぶりを抑え、イライラや不眠に。', effectValue: 25 },
    { id: 4, name: '桂枝湯', reading: 'けいしとう', element: 'Fire', flavor: '優しい風邪薬', description: '体力が低下した人の風邪の初期に。', effectValue: 20 },
    { id: 5, name: '黄連解毒湯', reading: 'おうれんげどくとう', element: 'Fire', flavor: '熱を冷ます', description: 'のぼせ気味で顔色が赤く、イライラする人に。', effectValue: 25 },
    { id: 6, name: '白虎湯', reading: 'びゃっことう', element: 'Fire', flavor: '激しい熱と渇きに', description: '高熱で口の渇きが激しい時に。', effectValue: 30 },
    { id: 7, name: '六君子湯', reading: 'りっくんしとう', element: 'Earth', flavor: '胃腸を元気に', description: '胃腸が弱く、食欲がなく、みぞおちがつかえる時に。', effectValue: 20 },
    { id: 8, name: '補中益気湯', reading: 'ほちゅうえっきとう', element: 'Earth', flavor: '元気を補う', description: '体力虚弱で、元気がなく、胃腸の働きが衰えている時に。', effectValue: 25 },
    { id: 9, name: '平胃散', reading: 'へいいさん', element: 'Earth', flavor: '食べ過ぎた時に', description: '胃がもたれて消化不良の時に。', effectValue: 15 },
    { id: 10, name: '当帰芍薬散', reading: 'とうきしゃくやくさん', element: 'Earth', flavor: '女性の味方', description: '月経不順や冷え性、貧血気味の女性に。', effectValue: 20 },
    { id: 11, name: '八味地黄丸', reading: 'はちみじおうがん', element: 'Water', flavor: '夜トイレに近いなら', description: '疲れやすく、手足が冷えやすい高齢者の頻尿などに。', effectValue: 25 },
    { id: 12, name: '六味地黄丸', reading: 'ろくみじおうがん', element: 'Water', flavor: '潤いを与える', description: '排尿困難やむくみ、かゆみなどに。', effectValue: 20 },
    { id: 13, name: '牛車腎気丸', reading: 'ごしゃじんきがん', element: 'Water', flavor: '足腰のしびれに', description: '疲れやすく、手足が冷えて、腰痛やしびれがある時に。', effectValue: 25 },
    { id: 14, name: '真武湯', reading: 'しんぶとう', element: 'Water', flavor: '冷えとめまいに', description: '新陳代謝が低下し、冷えやめまいがある時に。', effectValue: 20 },
    { id: 15, name: '麻黄湯', reading: 'まおうとう', element: 'Metal', flavor: 'ガツンと効く', description: '体力があり、寒気がして節々が痛む風邪に。', effectValue: 30 },
    { id: 16, name: '小青竜湯', reading: 'しょうせいりゅうとう', element: 'Metal', flavor: '鼻水が止まらない', description: 'うすい水様の鼻水が出る花粉症や鼻炎に。', effectValue: 20 },
    { id: 17, name: '五苓散', reading: 'ごれいさん', element: 'Water', flavor: '水の巡りを整える', description: '喉が渇いて尿量が少なく、頭痛やむくみがある時に。', effectValue: 20 },
    { id: 18, name: '防風通聖散', reading: 'ぼうふうつうしょうさん', element: 'Fire', flavor: 'お腹の脂肪に', description: '腹部に皮下脂肪が多く、便秘がちな人に。', effectValue: 25 },
    { id: 19, name: '半夏厚朴湯', reading: 'はんげこうぼくとう', element: 'Earth', flavor: '喉のつまりに', description: '気分がふさいで、喉に異物感がある時に。', effectValue: 20 },
    { id: 20, name: '十全大補湯', reading: 'じゅうぜんだいほとう', element: 'Earth', flavor: '全てを補う', description: '病後で体力が著しく低下している時に。', effectValue: 30 },
];
