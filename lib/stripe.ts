import Stripe from 'stripe';

// export const stripe = new Stripe(stripeSecretKey, ...);
export const getStripe = () => {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
        throw new Error('Stripe Secret Key is missing. Check your .env.local file.');
    }
    return new Stripe(secretKey, {
        apiVersion: '2026-01-28.clover' as any,
        typescript: true,
    });
};
