import { useState, useEffect } from 'react';
import { useLiff } from '@/components/LiffProvider';

export interface UserStatus {
    isPremium: boolean;
    isAllowed: boolean;
    subscriptionStatus: string;
}

export function useSubscription() {
    const { lineProfile, isLoggedIn } = useLiff();
    const [status, setStatus] = useState<UserStatus>({
        isPremium: false,
        isAllowed: false, // デフォルトはfalse（APIで確認するまで）
        subscriptionStatus: 'unknown',
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!lineProfile?.userId) return;

        const fetchStatus = async () => {
            setLoading(true);
            try {
                const res = await fetch('/api/me', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ lineUserId: lineProfile.userId }),
                });
                if (res.ok) {
                    const data = await res.json();
                    setStatus({
                        isPremium: data.isPremium,
                        isAllowed: data.isAllowed,
                        subscriptionStatus: data.subscriptionStatus
                    });
                }
            } catch (e) {
                console.error('Failed to fetch subscription status', e);
            } finally {
                setLoading(false);
            }
        };

        fetchStatus();
    }, [lineProfile]);

    const checkout = async () => {
        if (!lineProfile?.userId) return;
        try {
            const res = await fetch('/api/stripe/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ lineUserId: lineProfile.userId }),
            });
            const { url } = await res.json();
            if (url) {
                window.location.href = url;
            }
        } catch (e) {
            console.error('Checkout error', e);
            alert('決済ページの作成に失敗しました');
        }
    };

    return { ...status, loading, checkout };
}
