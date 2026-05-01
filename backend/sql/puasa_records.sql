-- name: CreatePuasaRecord :one
INSERT INTO puasa_records (
  record_date,
  fast_type,
  completed,
  sahur,
  iftar,
  notes
) VALUES (
  $1, $2, $3, $4, $5, $6
)
RETURNING *;

-- name: ListPuasaRecords :many
SELECT *
FROM puasa_records
ORDER BY record_date DESC
LIMIT $1 OFFSET $2;

-- name: GetPuasaRecordByID :one
SELECT *
FROM puasa_records
WHERE id = $1;

-- name: GetPuasaRecordByDate :one
SELECT *
FROM puasa_records
WHERE record_date = $1;

-- name: UpdatePuasaRecord :one
UPDATE puasa_records
SET
  fast_type = $2,
  completed = $3,
  sahur = $4,
  iftar = $5,
  notes = $6,
  updated_at = now()
WHERE id = $1
RETURNING *;

-- name: DeletePuasaRecord :exec
DELETE FROM puasa_records
WHERE id = $1;
