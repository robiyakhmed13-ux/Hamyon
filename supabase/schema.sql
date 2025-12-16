-- ============================================
-- HAMYON - SUPABASE DATABASE SCHEMA (SAFE / RE-RUNNABLE)
-- Keeps table name: public.users
-- ============================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1) CREATE TABLES (only if missing)
-- ============================================

CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  telegram_id BIGINT UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  balance BIGINT DEFAULT 0,
  timezone VARCHAR(50) DEFAULT 'Asia/Tashkent',
  language VARCHAR(10) DEFAULT 'uz',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  description TEXT NOT NULL,
  amount BIGINT NOT NULL,
  category_id VARCHAR(50) NOT NULL,
  source VARCHAR(20) DEFAULT 'text' CHECK (source IN ('voice','text','receipt','manual')),
  receipt_url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
  -- user_telegram_id may already exist or not; we add it safely below
);

CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id VARCHAR(50) NOT NULL,
  name VARCHAR(100) NOT NULL,
  emoji VARCHAR(10) NOT NULL,
  color VARCHAR(20) DEFAULT '#888888',
  type VARCHAR(20) NOT NULL CHECK (type IN ('expense','income','debt')),
  is_default BOOLEAN DEFAULT FALSE,
  is_hidden BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
  -- user_telegram_id may already exist or not; we add it safely below
);

CREATE TABLE IF NOT EXISTS public.limits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id VARCHAR(50) NOT NULL,
  limit_amount BIGINT NOT NULL,
  period VARCHAR(20) DEFAULT 'monthly',
  alert_threshold INT DEFAULT 90,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
  -- user_telegram_id may already exist or not; we add it safely below
);

CREATE TABLE IF NOT EXISTS public.goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  emoji VARCHAR(10) DEFAULT '🎯',
  target_amount BIGINT NOT NULL,
  current_amount BIGINT DEFAULT 0,
  color VARCHAR(20) DEFAULT '#22C55E',
  deadline DATE,
  is_completed BOOLEAN DEFAULT FALSE,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
  -- user_telegram_id may already exist or not; we add it safely below
);

CREATE TABLE IF NOT EXISTS public.debts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  person_name VARCHAR(255) NOT NULL,
  person_phone VARCHAR(20),
  amount BIGINT NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('borrowed','lent')),
  description TEXT,
  due_date DATE,
  is_settled BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
  -- user_telegram_id may already exist or not; we add it safely below
);

-- ============================================
-- 2) ENSURE REQUIRED COLUMNS EXIST (NO DATA LOSS)
-- ============================================

-- users (in case old users table missed some columns)
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS phone VARCHAR(20);
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS balance BIGINT DEFAULT 0;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS timezone VARCHAR(50) DEFAULT 'Asia/Tashkent';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS language VARCHAR(10) DEFAULT 'uz';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- transactions
ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS user_telegram_id BIGINT;
ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS receipt_url TEXT;
ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- categories
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS user_telegram_id BIGINT;
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS is_default BOOLEAN DEFAULT FALSE;
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS is_hidden BOOLEAN DEFAULT FALSE;
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

-- limits
ALTER TABLE public.limits ADD COLUMN IF NOT EXISTS user_telegram_id BIGINT;
ALTER TABLE public.limits ADD COLUMN IF NOT EXISTS period VARCHAR(20) DEFAULT 'monthly';
ALTER TABLE public.limits ADD COLUMN IF NOT EXISTS alert_threshold INT DEFAULT 90;
ALTER TABLE public.limits ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
ALTER TABLE public.limits ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

-- goals
ALTER TABLE public.goals ADD COLUMN IF NOT EXISTS user_telegram_id BIGINT;
ALTER TABLE public.goals ADD COLUMN IF NOT EXISTS emoji VARCHAR(10) DEFAULT '🎯';
ALTER TABLE public.goals ADD COLUMN IF NOT EXISTS current_amount BIGINT DEFAULT 0;
ALTER TABLE public.goals ADD COLUMN IF NOT EXISTS color VARCHAR(20) DEFAULT '#22C55E';
ALTER TABLE public.goals ADD COLUMN IF NOT EXISTS deadline DATE;
ALTER TABLE public.goals ADD COLUMN IF NOT EXISTS is_completed BOOLEAN DEFAULT FALSE;
ALTER TABLE public.goals ADD COLUMN IF NOT EXISTS is_primary BOOLEAN DEFAULT FALSE;
ALTER TABLE public.goals ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

-- debts
ALTER TABLE public.debts ADD COLUMN IF NOT EXISTS user_telegram_id BIGINT;
ALTER TABLE public.debts ADD COLUMN IF NOT EXISTS person_phone VARCHAR(20);
ALTER TABLE public.debts ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.debts ADD COLUMN IF NOT EXISTS due_date DATE;
ALTER TABLE public.debts ADD COLUMN IF NOT EXISTS is_settled BOOLEAN DEFAULT FALSE;
ALTER TABLE public.debts ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

-- ============================================
-- 3) BACKFILL user_telegram_id IF YOU HAD OLD COLUMNS
-- (runs only if those columns exist; otherwise does nothing)
-- ============================================

DO $$
BEGIN
  -- If transactions had telegram_id earlier
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema='public' AND table_name='transactions' AND column_name='telegram_id'
  ) THEN
    UPDATE public.transactions
    SET user_telegram_id = telegram_id
    WHERE user_telegram_id IS NULL;
  END IF;

  -- If transactions had user_id (UUID -> users.id)
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema='public' AND table_name='transactions' AND column_name='user_id'
  ) THEN
    UPDATE public.transactions t
    SET user_telegram_id = u.telegram_id
    FROM public.users u
    WHERE t.user_id = u.id
      AND t.user_telegram_id IS NULL;
  END IF;
END $$;

-- ============================================
-- 4) FOREIGN KEYS (only if missing)
-- ============================================

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='transactions_user_telegram_id_fkey') THEN
    ALTER TABLE public.transactions
    ADD CONSTRAINT transactions_user_telegram_id_fkey
    FOREIGN KEY (user_telegram_id) REFERENCES public.users(telegram_id) ON DELETE CASCADE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='categories_user_telegram_id_fkey') THEN
    ALTER TABLE public.categories
    ADD CONSTRAINT categories_user_telegram_id_fkey
    FOREIGN KEY (user_telegram_id) REFERENCES public.users(telegram_id) ON DELETE CASCADE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='limits_user_telegram_id_fkey') THEN
    ALTER TABLE public.limits
    ADD CONSTRAINT limits_user_telegram_id_fkey
    FOREIGN KEY (user_telegram_id) REFERENCES public.users(telegram_id) ON DELETE CASCADE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='goals_user_telegram_id_fkey') THEN
    ALTER TABLE public.goals
    ADD CONSTRAINT goals_user_telegram_id_fkey
    FOREIGN KEY (user_telegram_id) REFERENCES public.users(telegram_id) ON DELETE CASCADE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='debts_user_telegram_id_fkey') THEN
    ALTER TABLE public.debts
    ADD CONSTRAINT debts_user_telegram_id_fkey
    FOREIGN KEY (user_telegram_id) REFERENCES public.users(telegram_id) ON DELETE CASCADE;
  END IF;
END $$;

-- ============================================
-- 5) INDEXES (safe)
-- ============================================

CREATE INDEX IF NOT EXISTS idx_users_telegram_id ON public.users(telegram_id);

CREATE INDEX IF NOT EXISTS idx_transactions_user ON public.transactions(user_telegram_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON public.transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_user_date ON public.transactions(user_telegram_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_categories_user ON public.categories(user_telegram_id, type);
CREATE INDEX IF NOT EXISTS idx_limits_user ON public.limits(user_telegram_id);
CREATE INDEX IF NOT EXISTS idx_goals_user ON public.goals(user_telegram_id);
CREATE INDEX IF NOT EXISTS idx_debts_user ON public.debts(user_telegram_id);

-- ============================================
-- 6) FUNCTIONS
-- ============================================

CREATE OR REPLACE FUNCTION public.update_balance(p_telegram_id BIGINT, p_amount BIGINT)
RETURNS VOID AS $$
BEGIN
  UPDATE public.users
  SET balance = balance + p_amount,
      updated_at = NOW()
  WHERE telegram_id = p_telegram_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.get_today_stats(p_telegram_id BIGINT)
RETURNS TABLE (total_expenses BIGINT, total_income BIGINT, transaction_count INT) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COALESCE(SUM(CASE WHEN amount < 0 THEN ABS(amount) ELSE 0 END), 0)::BIGINT,
    COALESCE(SUM(CASE WHEN amount > 0 THEN amount ELSE 0 END), 0)::BIGINT,
    COUNT(*)::INT
  FROM public.transactions
  WHERE user_telegram_id = p_telegram_id
    AND DATE(created_at) = CURRENT_DATE;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.get_category_spending(p_telegram_id BIGINT, p_category_id VARCHAR(50))
RETURNS BIGINT AS $$
DECLARE v_total BIGINT;
BEGIN
  SELECT COALESCE(SUM(ABS(amount)), 0) INTO v_total
  FROM public.transactions
  WHERE user_telegram_id = p_telegram_id
    AND category_id = p_category_id
    AND amount < 0
    AND created_at >= DATE_TRUNC('month', CURRENT_DATE);

  RETURN v_total;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 7) TRIGGERS (safe re-run)
-- ============================================

CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS users_updated_at ON public.users;
DROP TRIGGER IF EXISTS transactions_updated_at ON public.transactions;

CREATE TRIGGER users_updated_at
BEFORE UPDATE ON public.users
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER transactions_updated_at
BEFORE UPDATE ON public.transactions
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ============================================
-- 8) RLS + POLICIES (safe re-run)
-- ============================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.debts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all" ON public.users;
DROP POLICY IF EXISTS "Allow all" ON public.transactions;
DROP POLICY IF EXISTS "Allow all" ON public.categories;
DROP POLICY IF EXISTS "Allow all" ON public.limits;
DROP POLICY IF EXISTS "Allow all" ON public.goals;
DROP POLICY IF EXISTS "Allow all" ON public.debts;

CREATE POLICY "Allow all" ON public.users FOR ALL USING (true);
CREATE POLICY "Allow all" ON public.transactions FOR ALL USING (true);
CREATE POLICY "Allow all" ON public.categories FOR ALL USING (true);
CREATE POLICY "Allow all" ON public.limits FOR ALL USING (true);
CREATE POLICY "Allow all" ON public.goals FOR ALL USING (true);
CREATE POLICY "Allow all" ON public.debts FOR ALL USING (true);

-- ============================================
-- 9) REALTIME (safe re-run)
-- ============================================

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname='supabase_realtime') THEN

    IF NOT EXISTS (
      SELECT 1 FROM pg_publication_tables
      WHERE pubname='supabase_realtime' AND schemaname='public' AND tablename='transactions'
    ) THEN
      ALTER PUBLICATION supabase_realtime ADD TABLE public.transactions;
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM pg_publication_tables
      WHERE pubname='supabase_realtime' AND schemaname='public' AND tablename='users'
    ) THEN
      ALTER PUBLICATION supabase_realtime ADD TABLE public.users;
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM pg_publication_tables
      WHERE pubname='supabase_realtime' AND schemaname='public' AND tablename='limits'
    ) THEN
      ALTER PUBLICATION supabase_realtime ADD TABLE public.limits;
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM pg_publication_tables
      WHERE pubname='supabase_realtime' AND schemaname='public' AND tablename='goals'
    ) THEN
      ALTER PUBLICATION supabase_realtime ADD TABLE public.goals;
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM pg_publication_tables
      WHERE pubname='supabase_realtime' AND schemaname='public' AND tablename='debts'
    ) THEN
      ALTER PUBLICATION supabase_realtime ADD TABLE public.debts;
    END IF;

  END IF;
END $$;
