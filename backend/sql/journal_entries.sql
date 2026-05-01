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
RETURNING *;

-- name: ListJournalEntries :many
SELECT *
FROM journal_entries
ORDER BY entry_date DESC, id DESC
LIMIT $1 OFFSET $2;

-- name: GetJournalEntryByID :one
SELECT *
FROM journal_entries
WHERE id = $1;

-- name: UpdateJournalEntry :one
UPDATE journal_entries
SET
  entry_date = $2,
  title = $3,
  content = $4,
  mood = $5,
  tags = $6,
  is_private = $7,
  updated_at = now()
WHERE id = $1
RETURNING *;

-- name: DeleteJournalEntry :exec
DELETE FROM journal_entries
WHERE id = $1;
