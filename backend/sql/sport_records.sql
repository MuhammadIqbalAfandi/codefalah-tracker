-- name: CreateSportRecord :one
INSERT INTO sport_records (
  record_date,
  sport_type,
  duration_minutes,
  completed,
  notes
) VALUES (
  $1, $2, $3, $4, $5
)
RETURNING *;

-- name: ListSportRecords :many
SELECT *
FROM sport_records
ORDER BY record_date DESC, id DESC
LIMIT $1 OFFSET $2;

-- name: GetSportRecordByID :one
SELECT *
FROM sport_records
WHERE id = $1;

-- name: UpdateSportRecord :one
UPDATE sport_records
SET
  record_date = $2,
  sport_type = $3,
  duration_minutes = $4,
  completed = $5,
  notes = $6,
  updated_at = now()
WHERE id = $1
RETURNING *;

-- name: DeleteSportRecord :exec
DELETE FROM sport_records
WHERE id = $1;
