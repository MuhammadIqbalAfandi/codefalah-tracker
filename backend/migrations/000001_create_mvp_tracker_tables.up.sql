CREATE TABLE sholat_records (
  id BIGSERIAL PRIMARY KEY,
  record_date DATE NOT NULL UNIQUE,
  subuh BOOLEAN NOT NULL DEFAULT FALSE,
  dzuhur BOOLEAN NOT NULL DEFAULT FALSE,
  ashar BOOLEAN NOT NULL DEFAULT FALSE,
  maghrib BOOLEAN NOT NULL DEFAULT FALSE,
  isya BOOLEAN NOT NULL DEFAULT FALSE,
  congregation_count INTEGER NOT NULL DEFAULT 0 CHECK (congregation_count >= 0 AND congregation_count <= 5),
  notes TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE puasa_records (
  id BIGSERIAL PRIMARY KEY,
  record_date DATE NOT NULL UNIQUE,
  fast_type TEXT NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  sahur BOOLEAN NOT NULL DEFAULT FALSE,
  iftar BOOLEAN NOT NULL DEFAULT FALSE,
  notes TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE finance_transactions (
  id BIGSERIAL PRIMARY KEY,
  transaction_date DATE NOT NULL,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('income', 'expense')),
  category TEXT NOT NULL,
  amount NUMERIC(14, 2) NOT NULL CHECK (amount > 0),
  notes TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE sport_records (
  id BIGSERIAL PRIMARY KEY,
  record_date DATE NOT NULL,
  sport_type TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL CHECK (duration_minutes >= 0),
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  notes TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE journal_entries (
  id BIGSERIAL PRIMARY KEY,
  entry_date DATE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  mood TEXT NOT NULL DEFAULT '',
  tags TEXT NOT NULL DEFAULT '',
  is_private BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_finance_transactions_date ON finance_transactions (transaction_date DESC);
CREATE INDEX idx_sport_records_date ON sport_records (record_date DESC);
CREATE INDEX idx_journal_entries_date ON journal_entries (entry_date DESC);
