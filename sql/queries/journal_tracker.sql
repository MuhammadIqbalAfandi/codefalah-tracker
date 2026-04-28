-- name: GetJournalEntryByDate :one
SELECT
    id,
    entry_date,
    title,
    content,
    mood,
    tags,
    is_private,
    created_at,
    updated_at
FROM journal_entries
WHERE entry_date = $1;

-- name: ListJournalEntries :many
SELECT
    id,
    entry_date,
    title,
    content,
    mood,
    tags,
    is_private,
    created_at,
    updated_at
FROM journal_entries
ORDER BY entry_date DESC;

-- name: CreateJournalEntry :one
INSERT INTO journal_entries (
    entry_date,
    title,
    content,
    mood,
    tags,
    is_private
) VALUES (
    $1, $2, $3, $4, $5, $6
)
RETURNING
    id,
    entry_date,
    title,
    content,
    mood,
    tags,
    is_private,
    created_at,
    updated_at;

-- name: UpdateJournalEntry :one
UPDATE journal_entries
SET
    title = $2,
    content = $3,
    mood = $4,
    tags = $5,
    is_private = $6,
    updated_at = NOW()
WHERE entry_date = $1
RETURNING
    id,
    entry_date,
    title,
    content,
    mood,
    tags,
    is_private,
    created_at,
    updated_at;

-- name: DeleteJournalEntryByDate :exec
DELETE FROM journal_entries
WHERE entry_date = $1;
