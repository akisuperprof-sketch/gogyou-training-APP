import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

export async function POST(request: NextRequest) {
    try {
        const { lineUserId } = await request.json();

        if (!lineUserId) {
            return NextResponse.json({ error: 'Missing lineUserId' }, { status: 400 });
        }

        const supabaseAdmin = getSupabaseAdmin();

        // ユーザー情報の取得
        const { data: user, error: userError } = await supabaseAdmin
            .from('users')
            .select('line_user_id, display_name')
            .eq('line_user_id', lineUserId)
            .single();

        if (userError || !user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // サブスクリプション情報の取得
        const { data: subscription } = await supabaseAdmin
            .from('subscriptions')
            .select('status, current_period_end')
            .eq('line_user_id', lineUserId)
            .single();

        // Allowlistの確認
        const { data: allowed } = await supabaseAdmin
            .from('allowlist')
            .select('line_user_id')
            .eq('line_user_id', lineUserId)
            .single();

        const isPremium = subscription?.status === 'active' || subscription?.status === 'trialing';
        const isAllowed = !!allowed;

        return NextResponse.json({
            lineUserId: user.line_user_id,
            displayName: user.display_name,
            isPremium,
            isAllowed,
            subscriptionStatus: subscription?.status || 'free',
            subscriptionPeriodEnd: subscription?.current_period_end,
        });

    } catch (error) {
        console.error('Me API Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
