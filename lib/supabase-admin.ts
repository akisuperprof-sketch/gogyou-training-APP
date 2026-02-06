import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceRoleKey) {
    // 開発環境で環境変数が設定されていない場合の警告（本番ではエラーになるべき）
    console.warn('Supabase URL or Service Role Key is missing. Check your .env.local file.');
}

// サーバーサイド専用の管理者クライアント
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    },
});
