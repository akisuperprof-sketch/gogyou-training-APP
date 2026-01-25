import { CrudeDrug, Formula, Element, Spirit, Mood } from './types';

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
        illustration: '/spirit_moku.png',
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
        illustration: '/spirit_ka.png',
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
        illustration: '/spirit_do.png',
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
        illustration: '/spirit_kon.png',
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
        illustration: '/spirit_moku.png', // Placeholder or add Water if provided
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
        unlocked: false,
        mood: 'bad',
    },
    {
        id: 'do',
        name: 'ド',
        reading: 'ど',
        element: 'Earth',
        stats: { genki: 10, chowa: 10, jukuren: 1, kizuna: 0 },
        dialogueCode: 'gentle',
        unlocked: false,
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

export const INITIAL_CRUDE_DRUGS: Omit<CrudeDrug, 'ownedCount' | 'usedCount' | 'discovered'>[] = [
    // Wood
    { id: 1, name: '柴胡', reading: 'さいこ', element: 'Wood', flavor: 'イライラを流す', description: '肝の気の滞りを解消し、ストレスや炎症を和らげる。', effectValue: 5 },
    { id: 2, name: '芍薬', reading: 'しゃくやく', element: 'Wood', flavor: '筋肉の緊張をほぐす', description: '血を養い、痛みや筋肉のこわばりを和らげる。', effectValue: 5 },
    { id: 3, name: '当帰', reading: 'とうき', element: 'Wood', flavor: '血を巡らせる', description: '血を補い、巡りを良くする女性の強い味方。', effectValue: 5 },
    { id: 4, name: '川キュウ', reading: 'せんきゅう', element: 'Wood', flavor: '頭の巡りを良くする', description: '血行を促進し、頭痛や月経トラブルに用いられる。', effectValue: 5 },
    { id: 5, name: '薄荷', reading: 'はっか', element: 'Wood', flavor: 'スッと通りを良くする', description: '体表の熱を飛ばし、気の巡りを改善する。', effectValue: 3 },

    // Fire
    { id: 6, name: '桂枝', reading: 'けいし', element: 'Fire', flavor: '体を芯から温める', description: '発汗を促し、血行を良くして冷えを除く。', effectValue: 5 },
    { id: 7, name: '黄連', reading: 'おうれん', element: 'Fire', flavor: '強い熱を冷ます', description: '心火を鎮め、イライラや不眠、炎症を抑える。', effectValue: 8 },
    { id: 8, name: '黄ゴン', reading: 'おうごん', element: 'Fire', flavor: '熱と湿りを除く', description: '上半身の熱を冷まし、解毒を助ける。', effectValue: 5 },
    { id: 9, name: '山梔子', reading: 'さんしし', element: 'Fire', flavor: 'イライラの熱を消す', description: '精神的な興奮や充血、炎症を鎮める。', effectValue: 5 },
    { id: 10, name: '生姜', reading: 'しょうきょう', element: 'Fire', flavor: 'お腹を温める', description: '胃腸を温め、吐き気を止める。', effectValue: 3 },

    // Earth
    { id: 11, name: '人参', reading: 'にんじん', element: 'Earth', flavor: '元気を強力に補う', description: '消化器を丈夫にし、エネルギーを全身に満たす。', effectValue: 10 },
    { id: 12, name: '甘草', reading: 'かんぞう', element: 'Earth', flavor: '調和の要', description: '諸薬の毒を和らげ、全体のバランスを整える。', effectValue: 2 },
    { id: 13, name: '大棗', reading: 'たいそう', element: 'Earth', flavor: '胃腸に優しい甘み', description: '胃を保護し、精神を安定させるナツメの実。', effectValue: 3 },
    { id: 14, name: '白朮', reading: 'びゃくじゅつ', element: 'Earth', flavor: '湿気を取り除く', description: '胃腸を丈夫にし、体内の余分な水分を排出する。', effectValue: 5 },
    { id: 15, name: '陳皮', reading: 'ちんぴ', element: 'Earth', flavor: '気の巡りを助ける', description: '胃腸の働きを助け、吐き気や痰を除く。', effectValue: 4 },

    // Metal
    { id: 16, name: '麻黄', reading: 'まおう', element: 'Metal', flavor: 'ガツンと汗を出す', description: '寒気を飛ばし、喘息や関節の痛みを和らげる。', effectValue: 8 },
    { id: 17, name: '杏仁', reading: 'きょうにん', element: 'Metal', flavor: '咳を鎮める', description: '肺を潤し、咳や痰を止める。', effectValue: 5 },
    { id: 18, name: '桔梗', reading: 'ききょう', element: 'Metal', flavor: '喉の通りを良くする', description: '喉の痛みを和らげ、排膿を促す。', effectValue: 5 },
    { id: 19, name: '葛根', reading: 'かっこん', element: 'Metal', flavor: '筋肉のこわばりに', description: '首筋や背中のこわばりをほぐし、熱を下げる。', effectValue: 5 },
    { id: 20, name: '石膏', reading: 'せっこう', element: 'Metal', flavor: '強烈な熱を鎮める', description: '肺や胃の激しい熱を冷まし、喉の渇きを止める。', effectValue: 7 },

    // Water
    { id: 21, name: '地黄', reading: 'じおう', element: 'Water', flavor: '生命の源を潤す', description: '精を強め、体液や血を補う。', effectValue: 8 },
    { id: 22, name: '茯苓', reading: 'ぶくりょう', element: 'Water', flavor: '水の配分を整える', description: '水分の巡りを良くし、心を穏やかにする。', effectValue: 5 },
    { id: 23, name: '沢瀉', reading: 'たくしゃ', element: 'Water', flavor: 'むくみを流す', description: '余分な水分を尿として出し、めまいを抑える。', effectValue: 5 },
    { id: 24, name: '山薬', reading: 'さんやく', element: 'Water', flavor: '滋養強壮', description: '消化器を助け、腎のエネルギーを蓄える。', effectValue: 6 },
    { id: 25, name: '杜仲', reading: 'とちゅう', element: 'Water', flavor: '足腰を丈夫に', description: '筋骨を強くし、老化による足腰の弱りを防ぐ。', effectValue: 6 },
];

export const INITIAL_FORMULAS: Omit<Formula, 'ownedCount' | 'usedCount' | 'discovered'>[] = [
    {
        id: 101,
        name: '葛根湯',
        reading: 'かっこんとう',
        element: 'Metal',
        description: '背筋のぞくぞくする風邪の初期に。',
        flavor: '風を払う鋭い力',
        effectValue: 40,
        recipe: [
            { crudeDrugId: 19, count: 2 }, // 葛根
            { crudeDrugId: 16, count: 2 }, // 麻黄
            { crudeDrugId: 6, count: 1 },  // 桂枝
            { crudeDrugId: 2, count: 1 },  // 芍薬
            { crudeDrugId: 12, count: 1 }, // 甘草
            { crudeDrugId: 10, count: 1 }, // 生姜
            { crudeDrugId: 13, count: 1 }, // 大棗
        ]
    },
    {
        id: 102,
        name: '補中益気湯',
        reading: 'ほちゅうえっきとう',
        element: 'Earth',
        description: '胃腸が弱く、元気が乏しい時に。',
        flavor: '大地を潤す恵み',
        effectValue: 45,
        recipe: [
            { crudeDrugId: 11, count: 2 }, // 人参
            { crudeDrugId: 14, count: 1 }, // 白朮
            { crudeDrugId: 12, count: 1 }, // 甘草
            { crudeDrugId: 3, count: 1 },  // 当帰
            { crudeDrugId: 15, count: 1 }, // 陳皮
            { crudeDrugId: 1, count: 1 },  // 柴胡
        ]
    },
    {
        id: 103,
        name: '黄連解毒湯',
        reading: 'おうれんげどくとう',
        element: 'Fire',
        description: 'イライラ、のぼせ、炎症に。',
        flavor: '静まる火の情動',
        effectValue: 35,
        recipe: [
            { crudeDrugId: 7, count: 1 }, // 黄連
            { crudeDrugId: 8, count: 1 }, // 黄ゴン
            { crudeDrugId: 9, count: 1 }, // 山梔子
        ]
    },
    {
        id: 104,
        name: '六味丸',
        reading: 'ろくみがん',
        element: 'Water',
        description: '体内の潤いが不足し、火照る時に。',
        flavor: '静謐な水の癒やし',
        effectValue: 40,
        recipe: [
            { crudeDrugId: 21, count: 2 }, // 地黄
            { crudeDrugId: 24, count: 1 }, // 山薬
            { crudeDrugId: 12, count: 1 }, // 甘草
            { crudeDrugId: 23, count: 1 }, // 沢瀉
            { crudeDrugId: 22, count: 1 }, // 茯苓
        ]
    },
    {
        id: 105,
        name: '四物湯',
        reading: 'しもつとう',
        element: 'Wood',
        description: '血を補い、巡りを整える基本。',
        flavor: '伸びゆく芽の生命力',
        effectValue: 35,
        recipe: [
            { crudeDrugId: 21, count: 1 }, // 地黄
            { crudeDrugId: 2, count: 1 },  // 芍薬
            { crudeDrugId: 4, count: 1 },  // 川キュウ
            { crudeDrugId: 3, count: 1 },  // 当帰
        ]
    },
    {
        id: 106,
        name: '加味逍遙散',
        reading: 'かみしょうようさん',
        element: 'Wood',
        description: 'イライラや不安、更年期の不調に。',
        flavor: 'たなびく雲のような解放感',
        effectValue: 50,
        recipe: [
            { crudeDrugId: 1, count: 1 },  // 柴胡
            { crudeDrugId: 2, count: 1 },  // 芍薬
            { crudeDrugId: 3, count: 1 },  // 当帰
            { crudeDrugId: 14, count: 1 }, // 白朮
            { crudeDrugId: 22, count: 1 }, // 茯苓
            { crudeDrugId: 12, count: 1 }, // 甘草
            { crudeDrugId: 9, count: 1 },  // 山梔子
            { crudeDrugId: 5, count: 1 },  // 薄荷
        ]
    },
    {
        id: 107,
        name: '桂枝湯',
        reading: 'けいしとう',
        element: 'Fire',
        description: '風邪のひきはじめ、寒気がする時に。',
        flavor: 'ぽかぽかと灯る火の粉',
        effectValue: 30,
        recipe: [
            { crudeDrugId: 6, count: 2 },  // 桂枝
            { crudeDrugId: 2, count: 2 },  // 芍薬
            { crudeDrugId: 10, count: 1 }, // 生姜
            { crudeDrugId: 13, count: 1 }, // 大棗
            { crudeDrugId: 12, count: 1 }, // 甘草
        ]
    },
    {
        id: 108,
        name: '四君子湯',
        reading: 'しくんしとう',
        element: 'Earth',
        description: '胃腸が弱く、疲れやすい基本。',
        flavor: '大地を支える四柱',
        effectValue: 35,
        recipe: [
            { crudeDrugId: 11, count: 1 }, // 人参
            { crudeDrugId: 14, count: 1 }, // 白朮
            { crudeDrugId: 22, count: 1 }, // 茯苓
            { crudeDrugId: 12, count: 1 }, // 甘草
            { crudeDrugId: 10, count: 1 }, // 生姜
            { crudeDrugId: 13, count: 1 }, // 大棗
        ]
    },
    {
        id: 109,
        name: '麻杏甘石湯',
        reading: 'まきょうかんせきとう',
        element: 'Metal',
        description: '咳が激しく、喉が渇く時に。',
        flavor: '熱を吸い込む白銀の風',
        effectValue: 45,
        recipe: [
            { crudeDrugId: 16, count: 2 }, // 麻黄
            { crudeDrugId: 17, count: 2 }, // 杏仁
            { crudeDrugId: 12, count: 1 }, // 甘草
            { crudeDrugId: 20, count: 2 }, // 石膏
        ]
    },
    {
        id: 110,
        name: '五苓散',
        reading: 'ごれいさん',
        element: 'Water',
        description: 'むくみ、頭痛、二日酔いに。',
        flavor: '清らかに澄み渡る水系',
        effectValue: 35,
        recipe: [
            { crudeDrugId: 23, count: 2 }, // 沢瀉
            { crudeDrugId: 22, count: 1 }, // 茯苓
            { crudeDrugId: 14, count: 1 }, // 白朮
            { crudeDrugId: 6, count: 1 },  // 桂枝
        ]
    },
    {
        id: 111,
        name: '十全大補湯',
        reading: 'じゅうぜんだいほとう',
        element: 'Earth',
        description: '気血ともに衰え、衰弱した時に。',
        flavor: '万物を満たす黄金の輝き',
        effectValue: 60,
        recipe: [
            { crudeDrugId: 11, count: 2 }, // 人参
            { crudeDrugId: 14, count: 1 }, // 白朮
            { crudeDrugId: 22, count: 1 }, // 茯苓
            { crudeDrugId: 12, count: 1 }, // 甘草
            { crudeDrugId: 3, count: 2 },  // 当帰
            { crudeDrugId: 4, count: 1 },  // 川キュウ
            { crudeDrugId: 2, count: 1 },  // 芍薬
            { crudeDrugId: 21, count: 1 }, // 地黄
            { crudeDrugId: 6, count: 1 },  // 桂枝
        ]
    },
    {
        id: 112,
        name: '六君子湯',
        reading: 'りっくんしとう',
        element: 'Earth',
        description: '胃腸が弱く、食欲不振、痰が多い時に。',
        flavor: '穏やかに整う土の気',
        effectValue: 45,
        recipe: [
            { crudeDrugId: 11, count: 1 }, // 人参
            { crudeDrugId: 14, count: 1 }, // 白朮
            { crudeDrugId: 22, count: 1 }, // 茯苓
            { crudeDrugId: 12, count: 1 }, // 甘草
            { crudeDrugId: 15, count: 1 }, // 陳皮
            { crudeDrugId: 10, count: 1 }, // 生姜
            { crudeDrugId: 13, count: 1 }, // 大棗
        ]
    },
    {
        id: 113,
        name: '桔梗湯',
        reading: 'ききょうとう',
        element: 'Metal',
        description: '喉の痛みや腫れ、声がれに。',
        flavor: '喉を通る涼やかな癒やし',
        effectValue: 25,
        recipe: [
            { crudeDrugId: 18, count: 3 }, // 桔梗
            { crudeDrugId: 12, count: 2 }, // 甘草
        ]
    },
    {
        id: 114,
        name: '芍薬甘草湯',
        reading: 'しゃくやくかんぞうとう',
        element: 'Wood',
        description: '急な筋肉の痙攣や足のつりに。',
        flavor: '緊張を解く春の雨',
        effectValue: 30,
        recipe: [
            { crudeDrugId: 2, count: 3 },  // 芍薬
            { crudeDrugId: 12, count: 3 }, // 甘草
        ]
    },
    {
        id: 115,
        name: '葛根湯加川キュウ辛夷',
        reading: 'かっこんとうかせんきゅうしんい',
        element: 'Metal',
        description: '鼻づまりや蓄膿、鼻炎に。',
        flavor: '通り抜ける冬の銀雪',
        effectValue: 45,
        recipe: [
            { crudeDrugId: 19, count: 2 }, // 葛根
            { crudeDrugId: 16, count: 1 }, // 麻黄
            { crudeDrugId: 6, count: 1 },  // 桂枝
            { crudeDrugId: 2, count: 1 },  // 芍薬
            { crudeDrugId: 12, count: 1 }, // 甘草
            { crudeDrugId: 10, count: 1 }, // 生姜
            { crudeDrugId: 13, count: 1 }, // 大棗
            { crudeDrugId: 4, count: 2 },  // 川キュウ
        ]
    }
];
