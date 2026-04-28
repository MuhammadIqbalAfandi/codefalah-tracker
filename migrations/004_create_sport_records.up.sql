CREATE TABLE sport_records (
    id BIGSERIAL PRIMARY KEY,
    record_date DATE NOT NULL,
    sport_type TEXT NOT NULL,
    duration_minutes INTEGER NOT NULL DEFAULT 0,
    is_completed BOOLEAN NOT NULL DEFAULT FALSE,
    notes TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
