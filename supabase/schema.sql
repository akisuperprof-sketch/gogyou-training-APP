-- 1. ユーザーテーブル
CREATE TABLE IF NOT EXISTS public.users (
    line_user_id TEXT PRIMARY KEY,
    display_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. サブスクリプションテーブル
CREATE TABLE IF NOT EXISTS public.subscriptions (
    line_user_id TEXT PRIMARY KEY REFERENCES public.users(line_user_id) ON DELETE CASCADE,
    stripe_customer_id TEXT UNIQUE,
    stripe_subscription_id TEXT UNIQUE,
    status TEXT DEFAULT 'inactive', -- active, inactive, trialing, canceled
    current_period_end TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. 開発用 Allowlist (Allowlistテーブル)
CREATE TABLE IF NOT EXISTS public.allowlist (
    line_user_id TEXT PRIMARY KEY,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLSの設定
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.allowlist ENABLE ROW LEVEL SECURITY;

-- クライアント（anon key）からは、自分のデータのみ参照可能にするポリシー
-- ※実際にはAPI経由での操作が主ですが、安全のために設定
CREATE POLICY "Users can view own data" ON public.users
    FOR SELECT USING (line_user_id = auth.jwt() ->> 'sub');

CREATE POLICY "Users can view own subscription" ON public.subscriptions
    FOR SELECT USING (line_user_id = auth.jwt() ->> 'sub');

-- サーバー（service_role）はすべての操作が可能
