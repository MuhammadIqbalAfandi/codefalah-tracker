-- name: GetSportRecordByID :one
SELECT
    id,
    record_date,
    sport_type,
    duration_minutes,
    is_completed,
    notes,
    created_at,
    updated_at
FROM sport_records
WHERE id = $1;

-- name: ListSportRecords :many
SELECT
    id,
    record_date,
    sport_type,
    duration_minutes,
    is_completed,
    notes,
    created_at,
    updated_at
FROM sport_records
ORDER BY record_date DESC, id DESC;

-- name: CreateSportRecord :one
INSERT INTO sport_records (
    record_date,
    sport_type,
    duration_minutes,
    is_completed,
    notes
) VALUES (
    $1, $2, $3, $4, $5
)
RETURNING
    id,
    record_date,
    sport_type,
    duration_minutes,
    is_completed,
    notes,
    created_at,
    updated_at;

-- name: UpdateSportRecord :one
UPDATE sport_records
SET
    record_date = $2,
    sport_type = $3,
    duration_minutes = $4,
    is_completed = $5,
    notes = $6,
    updated_at = NOW()
WHERE id = $1
RETURNING
    id,
    record_date,
    sport_type,
    duration_minutes,
    is_completed,
    notes,
    created_at,
    updated_at;

-- name: DeleteSportRecord :exec
DELETE FROM sport_records
WHERE id = $1;
