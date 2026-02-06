import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
    try {
        const { message, spiritElement } = await req.json();

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
あなたは東洋医学と五行思想（木・火・土・金・水）に精通した精霊アドバイザーです。
現在は「${spiritElement}」の属性を持つ精霊として、ユーザーに寄り添ったアドバイスをしてください。

ユーザーの状況：
${message}

指示：
1. 五行のバランス（どの要素が強く、どの要素が足りないか）を考察してください。
2. 日常生活や食事（薬膳）で取り入れられる具体的なアクションを1つ提案してください。
3. 文末は精霊らしい可愛らしくも賢い口調（〜だよ、〜だね、など）にしてください。
4. 返答は150文字以内で簡潔に。
`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return NextResponse.json({ text });
    } catch (error) {
        console.error("Diagnosis Error:", error);
        return NextResponse.json({ error: "診断に失敗しました。" }, { status: 500 });
    }
}
