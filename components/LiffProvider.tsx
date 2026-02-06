'use client';

import { useEffect, useState, createContext, useContext } from 'react';
import liff from '@line/liff';

interface LiffContextType {
    liff: typeof liff | null;
    lineProfile: { userId: string; displayName: string; pictureUrl?: string } | null;
    isLoggedIn: boolean;
    error: string | null;
    login: () => void;
    logout: () => void;
}

const LiffContext = createContext<LiffContextType>({
    liff: null,
    lineProfile: null,
    isLoggedIn: false,
    error: null,
    login: () => { },
    logout: () => { },
});

export const useLiff = () => useContext(LiffContext);

export const LiffProvider = ({ children, liffId }: { children: React.ReactNode; liffId: string }) => {
    const [liffObject, setLiffObject] = useState<typeof liff | null>(null);
    const [lineProfile, setLineProfile] = useState<LiffContextType['lineProfile']>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // SSR回避
        if (typeof window === 'undefined') return;

        // LIFF初期化
        liff
            .init({ liffId })
            .then(async () => {
                setLiffObject(liff);
                if (liff.isLoggedIn()) {
                    try {
                        const profile = await liff.getProfile();
                        setLineProfile(profile);

                        // Supabase Sync (Upsert)
                        upsertUser(profile.userId, profile.displayName);

                        // Optional Verify
                        verifyToken(liff.getIDToken());

                    } catch (e: any) {
                        console.error('LIFF getProfile error', e);
                        setError(e.toString());
                    }
                } else {
                    // Force login if not logged in
                    liff.login();
                    return;
                }
            })
            .catch((e: any) => {
                console.error('LIFF Init Error', e);
                setError(e.toString());
            });
    }, [liffId]);

    const upsertUser = async (lineUserId: string, displayName: string) => {
        try {
            const res = await fetch('/api/users/upsert', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ lineUserId, displayName }),
            });
            if (res.ok) {
                console.log('users upsert ok', lineUserId);
            } else {
                const err = await res.json();
                console.error('users upsert failed', err);
                if (process.env.NODE_ENV === 'development') {
                    window.alert(`User sync failed: ${JSON.stringify(err)}`);
                }
            }
        } catch (e) {
            console.error('users upsert exception', e);
        }
    };

    const verifyToken = async (idToken: string | null) => {
        if (!idToken) return;
        try {
            const res = await fetch('/api/auth/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idToken }),
            });
            if (!res.ok) {
                console.error('Token verification failed');
            }
        } catch (e) {
            console.error('Verify API error', e);
        }
    };

    const login = () => {
        if (liffObject && !liffObject.isLoggedIn()) {
            liffObject.login();
        }
    };

    const logout = () => {
        if (liffObject && liffObject.isLoggedIn()) {
            liffObject.logout();
            window.location.reload();
        }
    };

    return (
        <LiffContext.Provider
            value={{
                liff: liffObject,
                lineProfile,
                isLoggedIn: !!lineProfile,
                error,
                login,
                logout,
            }}
        >
            {children}
            {process.env.NODE_ENV === 'development' && (
                <div className="fixed bottom-1 left-1 z-[9999] opacity-50 hover:opacity-100 p-1 bg-black/80 rounded h-min text-[10px] text-white flex flex-col gap-1">
                    <div>DEV DEBUG</div>
                    <div>Logged In: {liffObject?.isLoggedIn() ? 'YES' : 'NO'}</div>
                    <button
                        onClick={() => upsertUser('U_MOCK_USER_12345', 'Mock User')}
                        className="bg-blue-600 px-2 py-1 rounded hover:bg-blue-500"
                    >
                        Force Upsert Mock
                    </button>
                </div>
            )}
        </LiffContext.Provider>
    );
};
