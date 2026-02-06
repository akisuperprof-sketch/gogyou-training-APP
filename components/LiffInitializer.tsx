"use client";

import { useEffect, useRef } from "react";
import liff from "@line/liff";

export default function LiffInitializer() {
    const initialized = useRef(false);

    useEffect(() => {
        if (initialized.current) return;
        initialized.current = true;

        const initLiff = async () => {
            try {
                const liffId = process.env.NEXT_PUBLIC_LIFF_ID;
                if (!liffId) {
                    console.error("Error: NEXT_PUBLIC_LIFF_ID is not defined in environment variables.");
                    return;
                }

                // Initialize LIFF
                await liff.init({ liffId });
                console.log("LIFF initialized");

                // Check login status
                if (!liff.isLoggedIn()) {
                    console.log("User is not logged in. Redirecting to login...");
                    liff.login();
                    return;
                }

                // Get profile
                const profile = await liff.getProfile();

                // Output to Console as requested
                console.log("LINE userId:", profile.userId);
                console.log("LINE name:", profile.displayName);

                // Sync with Supabase (via Server API)
                try {
                    const response = await fetch('/api/users/upsert', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            lineUserId: profile.userId,
                            displayName: profile.displayName,
                        }),
                    });
                    const data = await response.json();

                    if (data.ok) {
                        console.log('users upsert ok', profile.userId);
                    } else {
                        console.error('users upsert failed', data.error);
                    }
                } catch (apiError) {
                    console.error('API call failed', apiError);
                }

            } catch (error) {
                console.error("LIFF execution failed:", error);
            }
        };

        initLiff();
    }, []);

    return null; // This component does not render anything
}
