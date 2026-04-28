-- name: GetSholatRecordByDate :one
SELECT
    id,
    record_date,
    subuh_done,
    dzuhur_done,
    ashar_done,
    maghrib_done,
    isya_done,
    notes,
    created_at,
    updated_at
FROM sholat_records
WHERE record_date = $1;

-- name: ListSholatRecords :many
SELECT
    id,
    record_date,
    subuh_done,
    dzuhur_done,
    ashar_done,
    maghrib_done,
    isya_done,
    notes,
    created_at,
    updated_at
FROM sholat_records
ORDER BY record_date DESC;

-- name: CreateSholatRecord :one
INSERT INTO sholat_records (
    record_date,
    subuh_done,
    dzuhur_done,
    ashar_done,
    maghrib_done,
    isya_done,
    notes
) VALUES (
    $1, $2, $3, $4, $5, $6, $7
)
RETURNING
    id,
    record_date,
    subuh_done,
    dzuhur_done,
    ashar_done,
    maghrib_done,
    isya_done,
    notes,
    created_at,
    updated_at;

-- name: UpdateSholatRecord :one
UPDATE sholat_records
SET
    subuh_done = $2,
    dzuhur_done = $3,
    ashar_done = $4,
    maghrib_done = $5,
    isya_done = $6,
    notes = $7,
    updated_at = NOW()
WHERE record_date = $1
RETURNING
    id,
    record_date,
    subuh_done,
    dzuhur_done,
    ashar_done,
    maghrib_done,
    isya_done,
    notes,
    created_at,
    updated_at;

-- name: DeleteSholatRecordByDate :exec
DELETE FROM sholat_records
WHERE record_date = $1;
