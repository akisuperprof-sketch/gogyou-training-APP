import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

const LINE_CHANNEL_ID = process.env.LINE_CHANNEL_ID;

export async function POST(req: NextRequest) {
    try {
        const { idToken } = await req.json();

        if (!idToken) {
            return NextResponse.json({ error: 'Missing idToken' }, { status: 400 });
        }

        if (!LINE_CHANNEL_ID) {
            console.error('LINE_CHANNEL_ID is not defined');
            return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
        }

        // 1. LINEのAPIを叩いて id_token を検証
        const params = new URLSearchParams();
        params.append('id_token', idToken);
        params.append('client_id', LINE_CHANNEL_ID);

        const lineRes = await fetch('https://api.line.me/oauth2/v2.1/verify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params,
        });

        if (!lineRes.ok) {
            const errorData = await lineRes.json();
            console.error('LINE Verify Error:', errorData);
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        const lineData = await lineRes.json();
        const { sub: lineUserId, name: displayName, picture } = lineData;

        // 2. Allowlist チェック (開発中のみ有効化するロジックが必要であればここで実装)
        // 今回は要件に従い "開発中は allowlist 以外は準備中" の制御はフロント側で行うか、
        // ここで 403 を返しても良いが、UX的にはフロントで制御し、APIはデータ保存に徹する設計にする。

        // 3. Supabase users テーブルに Upsert
        const { error: upsertError } = await supabaseAdmin
            .from('users')
            .upsert({
                line_user_id: lineUserId,
                display_name: displayName,
                updated_at: new Date().toISOString(),
            })
            .select()
            .single();

        if (upsertError) {
            console.error('Supabase Upsert Error:', upsertError);
            return NextResponse.json({ error: 'Database error' }, { status: 500 });
        }

        // 4. トライアル用など初期サブスクリプションレコードの作成が必要ならここで行う
        // 今回はWebhookで管理するため、ここでは何もしない、または既存ステータス確認のみ

        return NextResponse.json({
            success: true,
            user: { lineUserId, displayName, picture }
        });

    } catch (error) {
        console.error('Auth API Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
