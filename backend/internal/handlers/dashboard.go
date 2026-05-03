package handlers

import (
	"database/sql"
	"errors"
	"math/big"
	"net/http"
	"time"

	trackerdb "codefalah-tracker/backend/internal/db"
)

type dashboardSummaryResponse struct {
	Date    string                  `json:"date"`
	Sholat  dashboardSholatSummary  `json:"sholat"`
	Puasa   dashboardPuasaSummary   `json:"puasa"`
	Finance dashboardFinanceSummary `json:"finance"`
	Sport   dashboardSportSummary   `json:"sport"`
	Journal dashboardJournalSummary `json:"journal"`
}

type dashboardSholatSummary struct {
	CompletedCount int32 `json:"completed_count"`
	TotalCount     int32 `json:"total_count"`
}

type dashboardPuasaSummary struct {
	FastType  string `json:"fast_type"`
	Completed bool   `json:"completed"`
}

type dashboardFinanceSummary struct {
	Income  string `json:"income"`
	Expense string `json:"expense"`
	Balance string `json:"balance"`
}

type dashboardSportSummary struct {
	CompletedCount   int32 `json:"completed_count"`
	CompletedMinutes int32 `json:"completed_minutes"`
}

type dashboardJournalSummary struct {
	Written bool `json:"written"`
}

type contributionGraphResponse struct {
	StartDate string                 `json:"start_date"`
	EndDate   string                 `json:"end_date"`
	Days      []contributionGraphDay `json:"days"`
}

type moduleContributionResponse struct {
	StartDate string                     `json:"start_date"`
	EndDate   string                     `json:"end_date"`
	Modules   []moduleContributionSeries `json:"modules"`
}

type contributionGraphDay struct {
	Date  string `json:"date"`
	Score int32  `json:"score"`
}

type moduleContributionSeries struct {
	Module string                 `json:"module"`
	Label  string                 `json:"label"`
	Days   []contributionGraphDay `json:"days"`
}

func (h *RouterHandlers) getDashboardSummary(w http.ResponseWriter, r *http.Request) {
	date, ok := parseOptionalDateQuery(w, r, "date", todayUTC())
	if !ok {
		return
	}

	sholatCompleted, err := h.queries.GetTodaySholatSummary(r.Context(), date)
	if err != nil && !errors.Is(err, sql.ErrNoRows) {
		writeError(w, http.StatusInternalServerError, "failed to get sholat summary")
		return
	}

	puasa, err := h.queries.GetTodayPuasaSummary(r.Context(), date)
	if err != nil && !errors.Is(err, sql.ErrNoRows) {
		writeError(w, http.StatusInternalServerError, "failed to get puasa summary")
		return
	}

	monthStart := time.Date(date.Year(), date.Month(), 1, 0, 0, 0, 0, time.UTC)
	finance, err := h.queries.GetMonthlyFinanceSummary(r.Context(), trackerdb.GetMonthlyFinanceSummaryParams{
		TransactionDate:   monthStart,
		TransactionDate_2: monthStart.AddDate(0, 1, 0),
	})
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to get finance summary")
		return
	}

	weekStart := startOfWeek(date)
	sport, err := h.queries.GetWeeklySportSummary(r.Context(), trackerdb.GetWeeklySportSummaryParams{
		RecordDate:   weekStart,
		RecordDate_2: weekStart.AddDate(0, 0, 7),
	})
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to get sport summary")
		return
	}

	journalWritten, err := h.queries.GetTodayJournalSummary(r.Context(), date)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to get journal summary")
		return
	}

	writeJSON(w, http.StatusOK, dashboardSummaryResponse{
		Date: date.Format(time.DateOnly),
		Sholat: dashboardSholatSummary{
			CompletedCount: sholatCompleted,
			TotalCount:     5,
		},
		Puasa: dashboardPuasaSummary{
			FastType:  puasa.FastType,
			Completed: puasa.Completed,
		},
		Finance: dashboardFinanceSummary{
			Income:  finance.Income,
			Expense: finance.Expense,
			Balance: decimalStringSubtract(finance.Income, finance.Expense),
		},
		Sport: dashboardSportSummary{
			CompletedCount:   sport.CompletedCount,
			CompletedMinutes: sport.CompletedMinutes,
		},
		Journal: dashboardJournalSummary{
			Written: journalWritten,
		},
	})
}

func (h *RouterHandlers) getContributionGraph(w http.ResponseWriter, r *http.Request) {
	defaultEnd := todayUTC().AddDate(0, 0, 1)
	endDate, ok := parseOptionalDateQuery(w, r, "end_date", defaultEnd)
	if !ok {
		return
	}

	startDate, ok := parseOptionalDateQuery(w, r, "start_date", endDate.AddDate(0, 0, -90))
	if !ok {
		return
	}

	if !startDate.Before(endDate) {
		writeError(w, http.StatusBadRequest, "start_date must be before end_date")
		return
	}

	rows, err := h.queries.ListContributionDays(r.Context(), trackerdb.ListContributionDaysParams{
		Column1: startDate,
		Column2: endDate,
	})
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to get contribution graph")
		return
	}

	days := make([]contributionGraphDay, 0, len(rows))
	for _, row := range rows {
		days = append(days, contributionGraphDay{
			Date:  row.ActivityDate.Format(time.DateOnly),
			Score: row.Score,
		})
	}

	writeJSON(w, http.StatusOK, contributionGraphResponse{
		StartDate: startDate.Format(time.DateOnly),
		EndDate:   endDate.Format(time.DateOnly),
		Days:      days,
	})
}

func (h *RouterHandlers) getModuleContributions(w http.ResponseWriter, r *http.Request) {
	defaultEnd := todayUTC().AddDate(0, 0, 1)
	endDate, ok := parseOptionalDateQuery(w, r, "end_date", defaultEnd)
	if !ok {
		return
	}

	startDate, ok := parseOptionalDateQuery(w, r, "start_date", endDate.AddDate(-1, 0, 0))
	if !ok {
		return
	}

	if !startDate.Before(endDate) {
		writeError(w, http.StatusBadRequest, "start_date must be before end_date")
		return
	}

	rows, err := h.queries.ListModuleContributionDays(r.Context(), trackerdb.ListModuleContributionDaysParams{
		StartDate: startDate,
		EndDate:   endDate,
	})
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to get module contributions")
		return
	}

	modules := []moduleContributionSeries{
		{Module: "sholat", Label: "Sholat", Days: []contributionGraphDay{}},
		{Module: "puasa", Label: "Puasa", Days: []contributionGraphDay{}},
		{Module: "keuangan", Label: "Keuangan", Days: []contributionGraphDay{}},
		{Module: "olahraga", Label: "Olahraga", Days: []contributionGraphDay{}},
		{Module: "jurnal", Label: "Jurnal", Days: []contributionGraphDay{}},
	}

	moduleIndex := make(map[string]int, len(modules))
	for index, module := range modules {
		moduleIndex[module.Module] = index
	}

	for _, row := range rows {
		index, exists := moduleIndex[row.ModuleName]
		if !exists {
			continue
		}

		modules[index].Days = append(modules[index].Days, contributionGraphDay{
			Date:  row.ActivityDate.Format(time.DateOnly),
			Score: row.Score,
		})
	}

	writeJSON(w, http.StatusOK, moduleContributionResponse{
		StartDate: startDate.Format(time.DateOnly),
		EndDate:   endDate.Format(time.DateOnly),
		Modules:   modules,
	})
}

func parseOptionalDateQuery(w http.ResponseWriter, r *http.Request, key string, fallback time.Time) (time.Time, bool) {
	value := r.URL.Query().Get(key)
	if value == "" {
		return normalizeDate(fallback), true
	}

	date, err := time.Parse(time.DateOnly, value)
	if err != nil {
		writeError(w, http.StatusBadRequest, key+" must use YYYY-MM-DD format")
		return time.Time{}, false
	}

	return normalizeDate(date), true
}

func todayUTC() time.Time {
	return normalizeDate(time.Now().UTC())
}

func normalizeDate(date time.Time) time.Time {
	return time.Date(date.Year(), date.Month(), date.Day(), 0, 0, 0, 0, time.UTC)
}

func startOfWeek(date time.Time) time.Time {
	normalized := normalizeDate(date)
	offset := (int(normalized.Weekday()) + 6) % 7
	return normalized.AddDate(0, 0, -offset)
}

func decimalStringSubtract(left string, right string) string {
	leftValue, ok := parseDecimalString(left)
	if !ok {
		return "0"
	}

	rightValue, ok := parseDecimalString(right)
	if !ok {
		return "0"
	}

	return new(big.Rat).Sub(leftValue, rightValue).FloatString(2)
}

func parseDecimalString(value string) (*big.Rat, bool) {
	parsed, ok := new(big.Rat).SetString(value)
	return parsed, ok
}
