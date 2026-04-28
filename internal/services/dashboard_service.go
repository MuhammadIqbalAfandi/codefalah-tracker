package services

import (
	"context"
	"fmt"
	"strconv"
	"time"

	sqlc "codefalah-tracker/sql/generated"
)

type DashboardService struct {
	queries *sqlc.Queries
}

type DashboardSummary struct {
	RecordDate              time.Time `json:"record_date"`
	SholatCompletedCount    int64     `json:"sholat_completed_count"`
	PuasaCompletedCount     int64     `json:"puasa_completed_count"`
	MonthIncomeTotal        int64     `json:"month_income_total"`
	MonthExpenseTotal       int64     `json:"month_expense_total"`
	WeekSportCompletedCount int64     `json:"week_sport_completed_count"`
	HasJournalEntry         bool      `json:"has_journal_entry"`
}

func NewDashboardService(queries *sqlc.Queries) *DashboardService {
	return &DashboardService{queries: queries}
}

func (s *DashboardService) GetSummary(ctx context.Context, recordDate time.Time) (DashboardSummary, error) {
	row, err := s.queries.GetDashboardSummary(ctx, recordDate)
	if err != nil {
		return DashboardSummary{}, err
	}

	sholatCount, err := int64Value(row.SholatCompletedCount)
	if err != nil {
		return DashboardSummary{}, fmt.Errorf("convert sholat count: %w", err)
	}

	puasaCount, err := int64Value(row.PuasaCompletedCount)
	if err != nil {
		return DashboardSummary{}, fmt.Errorf("convert puasa count: %w", err)
	}

	incomeTotal, err := int64Value(row.MonthIncomeTotal)
	if err != nil {
		return DashboardSummary{}, fmt.Errorf("convert month income total: %w", err)
	}

	expenseTotal, err := int64Value(row.MonthExpenseTotal)
	if err != nil {
		return DashboardSummary{}, fmt.Errorf("convert month expense total: %w", err)
	}

	sportCount, err := int64Value(row.WeekSportCompletedCount)
	if err != nil {
		return DashboardSummary{}, fmt.Errorf("convert week sport count: %w", err)
	}

	return DashboardSummary{
		RecordDate:              recordDate,
		SholatCompletedCount:    sholatCount,
		PuasaCompletedCount:     puasaCount,
		MonthIncomeTotal:        incomeTotal,
		MonthExpenseTotal:       expenseTotal,
		WeekSportCompletedCount: sportCount,
		HasJournalEntry:         row.HasJournalEntry,
	}, nil
}

func int64Value(value any) (int64, error) {
	switch v := value.(type) {
	case nil:
		return 0, nil
	case int64:
		return v, nil
	case int32:
		return int64(v), nil
	case int:
		return int64(v), nil
	case float64:
		return int64(v), nil
	case []byte:
		return strconv.ParseInt(string(v), 10, 64)
	case string:
		return strconv.ParseInt(v, 10, 64)
	default:
		return 0, fmt.Errorf("unsupported value type %T", value)
	}
}
