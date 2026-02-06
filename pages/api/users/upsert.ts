import { createClient } from "@supabase/supabase-js";
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") return res.status(405).json({ ok: false });

    try {
        const { lineUserId, displayName } = req.body || {};
        console.log("[upsert pages] received", { lineUserId, displayName });

        if (!lineUserId) return res.status(400).json({ ok: false, error: "lineUserId required" });

        const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!url || !serviceKey) {
            return res.status(500).json({ ok: false, error: "Missing env NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY" });
        }

        const supabase = createClient(url, serviceKey, {
            auth: {
                persistSession: false,
                autoRefreshToken: false,
            }
        });

        const { error } = await supabase
            .from("users")
            .upsert({
                line_user_id: lineUserId,
                display_name: displayName,
                updated_at: new Date().toISOString()
            });

        if (error) {
            console.error("[upsert pages] supabase error", error);
            return res.status(500).json({ ok: false, error });
        }

        return res.json({ ok: true });
    } catch (e) {
        console.error("[upsert pages] exception", e);
        return res.status(500).json({ ok: false, error: String(e) });
    }
}
