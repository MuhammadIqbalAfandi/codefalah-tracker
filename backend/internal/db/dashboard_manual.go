package db

import (
	"context"
	"time"
)

const listModuleContributionDays = `
SELECT module_name, activity_date, SUM(score)::int AS score
FROM (
  SELECT 'sholat'::text AS module_name, sholat_records.record_date AS activity_date, (subuh::int + dzuhur::int + ashar::int + maghrib::int + isya::int) AS score
  FROM sholat_records
  WHERE sholat_records.record_date >= $1::date AND sholat_records.record_date < $2::date
  UNION ALL
  SELECT 'puasa'::text AS module_name, puasa_records.record_date AS activity_date, completed::int AS score
  FROM puasa_records
  WHERE puasa_records.record_date >= $1::date AND puasa_records.record_date < $2::date
  UNION ALL
  SELECT 'keuangan'::text AS module_name, finance_transactions.transaction_date AS activity_date, COUNT(*)::int AS score
  FROM finance_transactions
  WHERE finance_transactions.transaction_date >= $1::date AND finance_transactions.transaction_date < $2::date
  GROUP BY finance_transactions.transaction_date
  UNION ALL
  SELECT 'olahraga'::text AS module_name, sport_records.record_date AS activity_date, completed::int AS score
  FROM sport_records
  WHERE sport_records.record_date >= $1::date AND sport_records.record_date < $2::date
  UNION ALL
  SELECT 'jurnal'::text AS module_name, journal_entries.entry_date AS activity_date, 1 AS score
  FROM journal_entries
  WHERE journal_entries.entry_date >= $1::date AND journal_entries.entry_date < $2::date
) activity
GROUP BY module_name, activity_date
ORDER BY module_name, activity_date
`

type ListModuleContributionDaysParams struct {
	StartDate time.Time
	EndDate   time.Time
}

type ListModuleContributionDaysRow struct {
	ModuleName   string
	ActivityDate time.Time
	Score        int32
}

func (q *Queries) ListModuleContributionDays(ctx context.Context, arg ListModuleContributionDaysParams) ([]ListModuleContributionDaysRow, error) {
	rows, err := q.db.QueryContext(ctx, listModuleContributionDays, arg.StartDate, arg.EndDate)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	items := []ListModuleContributionDaysRow{}
	for rows.Next() {
		var item ListModuleContributionDaysRow
		if err := rows.Scan(&item.ModuleName, &item.ActivityDate, &item.Score); err != nil {
			return nil, err
		}

		items = append(items, item)
	}

	if err := rows.Close(); err != nil {
		return nil, err
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return items, nil
}
