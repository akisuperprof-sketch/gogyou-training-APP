import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import Stripe from 'stripe';

const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: NextRequest) {
    if (!STRIPE_WEBHOOK_SECRET) {
        console.error('STRIPE_WEBHOOK_SECRET is not set');
        return NextResponse.json({ error: 'Server config error' }, { status: 500 });
    }

    const body = await req.text();
    const signature = req.headers.get('stripe-signature') as string;

    let event: Stripe.Event;

    const stripe = getStripe();

    try {
        event = stripe.webhooks.constructEvent(body, signature, STRIPE_WEBHOOK_SECRET);
    } catch (err: any) {
        console.error(`Webhook signature verification failed: ${err.message}`);
        return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    try {
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object as Stripe.Checkout.Session;
                // metadata または client_reference_id から lineUserId を取得
                const lineUserId = session.metadata?.line_user_id || session.client_reference_id;
                const subscriptionId = session.subscription as string;
                const customerId = session.customer as string;

                if (lineUserId && subscriptionId) {
                    // サブスクリプション詳細を取得して期間終了日などを特定
                    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

                    await upsertSubscription(
                        lineUserId,
                        customerId,
                        subscriptionId,
                        subscription.status,
                        new Date((subscription as any).current_period_end * 1000)
                    );
                }
                break;
            }

            case 'customer.subscription.updated':
            case 'customer.subscription.deleted': {
                const subscription = event.data.object as Stripe.Subscription;
                const lineUserId = subscription.metadata?.line_user_id; // Subscription作成時にmetadataを入れている前提

                // もしmetadataがない場合、customer IDからuserを逆引きする必要があるが、
                // 今回はCheckout時に subscription_data.metadata も設定しているため入ってくるはず。

                if (lineUserId) {
                    await upsertSubscription(
                        lineUserId,
                        subscription.customer as string, // Cast to string to fix linter error
                        subscription.id,
                        subscription.status,
                        new Date((subscription as any).current_period_end * 1000)
                    );
                } else {
                    // fallback: customer_id からユーザーを探すロジックが必要になる可能性がある
                    console.warn('No line_user_id found in subscription metadata');
                }
                break;
            }

            default:
                // 他のイベントは無視
                break;
        }

        return NextResponse.json({ received: true });
    } catch (err) {
        console.error('Webhook handler failed:', err);
        return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
    }
}

async function upsertSubscription(
    lineUserId: string,
    stripeCustomerId: string,
    stripeSubscriptionId: string,
    status: string,
    currentPeriodEnd: Date
) {
    const supabaseAdmin = getSupabaseAdmin();
    const { error } = await supabaseAdmin
        .from('subscriptions')
        .upsert({
            line_user_id: lineUserId,
            stripe_customer_id: stripeCustomerId,
            stripe_subscription_id: stripeSubscriptionId,
            status: status,
            current_period_end: currentPeriodEnd.toISOString(),
            updated_at: new Date().toISOString(),
        });

    if (error) {
        console.error('Failed to upsert subscription:', error);
        throw error;
    }
}
