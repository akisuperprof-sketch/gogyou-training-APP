import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase-admin';

const STRIPE_PRICE_ID_MONTHLY = process.env.STRIPE_PRICE_ID_MONTHLY;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export async function POST(req: NextRequest) {
    try {
        const { lineUserId } = await req.json();

        if (!lineUserId) {
            return NextResponse.json({ error: 'Missing lineUserId' }, { status: 400 });
        }

        if (!STRIPE_PRICE_ID_MONTHLY) {
            console.error('STRIPE_PRICE_ID_MONTHLY is not configured');
            return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
        }

        // 既存の顧客IDがあるか確認
        const { data: subscription } = await supabaseAdmin
            .from('subscriptions')
            .select('stripe_customer_id')
            .eq('line_user_id', lineUserId)
            .single();

        let customerId = subscription?.stripe_customer_id;

        // 新規顧客作成（まだない場合）
        // ※ 実際には Checkout Session 作成時に customer_email を渡すと自動作成されるオプションもあるが、
        // ここではLINE IDと紐付けるため明示的に管理しても良い。あるいは session作成時に metadata を渡すだけでも可。
        // 今回はシンプルに、Checkout Session作成時にメタデータを付与し、Webhookで顧客ID保存を行うフローとする。

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price: STRIPE_PRICE_ID_MONTHLY,
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: `${APP_URL}?payment_status=success`,
            cancel_url: `${APP_URL}?payment_status=canceled`,
            customer: customerId || undefined, // 既存顧客がいれば指定
            client_reference_id: lineUserId, // Webhookで参照するために重要
            metadata: {
                line_user_id: lineUserId,
            },
            subscription_data: {
                metadata: {
                    line_user_id: lineUserId,
                },
            },
        });

        if (!session.url) {
            throw new Error('Failed to create session URL');
        }

        return NextResponse.json({ url: session.url });

    } catch (error) {
        console.error('Stripe Checkout Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
