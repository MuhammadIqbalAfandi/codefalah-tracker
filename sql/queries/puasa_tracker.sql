-- name: GetPuasaRecordByDate :one
SELECT
    id,
    record_date,
    puasa_type,
    is_completed,
    sahur_done,
    berbuka_done,
    notes,
    created_at,
    updated_at
FROM puasa_records
WHERE record_date = $1;

-- name: ListPuasaRecords :many
SELECT
    id,
    record_date,
    puasa_type,
    is_completed,
    sahur_done,
    berbuka_done,
    notes,
    created_at,
    updated_at
FROM puasa_records
ORDER BY record_date DESC;

-- name: CreatePuasaRecord :one
INSERT INTO puasa_records (
    record_date,
    puasa_type,
    is_completed,
    sahur_done,
    berbuka_done,
    notes
) VALUES (
    $1, $2, $3, $4, $5, $6
)
RETURNING
    id,
    record_date,
    puasa_type,
    is_completed,
    sahur_done,
    berbuka_done,
    notes,
    created_at,
    updated_at;

-- name: UpdatePuasaRecord :one
UPDATE puasa_records
SET
    puasa_type = $2,
    is_completed = $3,
    sahur_done = $4,
    berbuka_done = $5,
    notes = $6,
    updated_at = NOW()
WHERE record_date = $1
RETURNING
    id,
    record_date,
    puasa_type,
    is_completed,
    sahur_done,
    berbuka_done,
    notes,
    created_at,
    updated_at;

-- name: DeletePuasaRecordByDate :exec
DELETE FROM puasa_records
WHERE record_date = $1;
