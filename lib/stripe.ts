import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || '';

if (!stripeSecretKey) {
    console.warn('Stripe Secret Key is missing. Check your .env.local file.');
}

export const stripe = new Stripe(stripeSecretKey, {
    apiVersion: '2026-01-28.clover' as any, // Cast to any if strictly typed to ensure compatibility pending type updates
    typescript: true,
});
