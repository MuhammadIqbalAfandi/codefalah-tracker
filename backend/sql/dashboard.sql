-- name: GetTodaySholatSummary :one
SELECT
  COALESCE((subuh::int + dzuhur::int + ashar::int + maghrib::int + isya::int), 0)::int AS completed_count
FROM sholat_records
WHERE record_date = $1;

-- name: GetTodayPuasaSummary :one
SELECT
  fast_type,
  completed
FROM puasa_records
WHERE record_date = $1;

-- name: GetWeeklySportSummary :one
SELECT
  COALESCE(COUNT(*) FILTER (WHERE completed), 0)::int AS completed_count,
  COALESCE(SUM(duration_minutes) FILTER (WHERE completed), 0)::int AS completed_minutes
FROM sport_records
WHERE record_date >= $1
  AND record_date < $2;

-- name: GetTodayJournalSummary :one
SELECT
  EXISTS(
    SELECT 1
    FROM journal_entries
    WHERE entry_date = $1
  ) AS written;

-- name: ListContributionDays :many
SELECT activity_date, SUM(score)::int AS score
FROM (
  SELECT sholat_records.record_date AS activity_date, (subuh::int + dzuhur::int + ashar::int + maghrib::int + isya::int) AS score
  FROM sholat_records
  WHERE sholat_records.record_date >= $1::date AND sholat_records.record_date < $2::date
  UNION ALL
  SELECT puasa_records.record_date AS activity_date, completed::int AS score
  FROM puasa_records
  WHERE puasa_records.record_date >= $1::date AND puasa_records.record_date < $2::date
  UNION ALL
  SELECT sport_records.record_date AS activity_date, completed::int AS score
  FROM sport_records
  WHERE sport_records.record_date >= $1::date AND sport_records.record_date < $2::date
  UNION ALL
  SELECT journal_entries.entry_date AS activity_date, 1 AS score
  FROM journal_entries
  WHERE journal_entries.entry_date >= $1::date AND journal_entries.entry_date < $2::date
) activity
GROUP BY activity_date
ORDER BY activity_date;
