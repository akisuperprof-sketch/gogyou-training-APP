import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json().catch(() => ({}));
        const { lineUserId, displayName } = body || {};
        console.log("[upsert] received", { lineUserId, displayName });

        if (!lineUserId) {
            return NextResponse.json({ ok: false, error: "lineUserId required" }, { status: 400 });
        }

        const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!url || !serviceKey) {
            return NextResponse.json(
                { ok: false, error: "Missing env NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY" },
                { status: 500 }
            );
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
                updated_at: new Date().toISOString() // Update timestamp
            });

        if (error) {
            console.error("[upsert] supabase error", error);
            return NextResponse.json({ ok: false, error }, { status: 500 });
        }

        return NextResponse.json({ ok: true }, { status: 200 });
    } catch (e) {
        console.error("[upsert] exception", e);
        return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
    }
}
