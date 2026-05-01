-- name: CreateSholatRecord :one
INSERT INTO sholat_records (
  record_date,
  subuh,
  dzuhur,
  ashar,
  maghrib,
  isya,
  congregation_count,
  notes
) VALUES (
  $1, $2, $3, $4, $5, $6, $7, $8
)
RETURNING *;

-- name: ListSholatRecords :many
SELECT *
FROM sholat_records
ORDER BY record_date DESC
LIMIT $1 OFFSET $2;

-- name: GetSholatRecordByID :one
SELECT *
FROM sholat_records
WHERE id = $1;

-- name: GetSholatRecordByDate :one
SELECT *
FROM sholat_records
WHERE record_date = $1;

-- name: UpdateSholatRecord :one
UPDATE sholat_records
SET
  subuh = $2,
  dzuhur = $3,
  ashar = $4,
  maghrib = $5,
  isya = $6,
  congregation_count = $7,
  notes = $8,
  updated_at = now()
WHERE id = $1
RETURNING *;

-- name: DeleteSholatRecord :exec
DELETE FROM sholat_records
WHERE id = $1;
