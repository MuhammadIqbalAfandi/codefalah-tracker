CREATE TABLE finance_transactions (
    id BIGSERIAL PRIMARY KEY,
    transaction_date DATE NOT NULL,
    transaction_type TEXT NOT NULL,
    category TEXT NOT NULL,
    amount BIGINT NOT NULL,
    notes TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
