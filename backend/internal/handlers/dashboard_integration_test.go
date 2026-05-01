package handlers

import (
	"context"
	"database/sql"
	"encoding/json"
	"io"
	"log/slog"
	"net"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"strings"
	"testing"
	"time"

	trackerdb "codefalah-tracker/backend/internal/db"

	embeddedpostgres "github.com/fergusstrange/embedded-postgres"
)

func TestDashboardSummaryReflectsStoredRecords(t *testing.T) {
	t.Parallel()

	ctx := context.Background()
	database := openEmbeddedDatabase(t, ctx)
	queries := trackerdb.New(database)
	router := NewRouter(slog.New(slog.NewTextHandler(io.Discard, nil)), queries)
	targetDate := time.Date(2026, time.May, 18, 0, 0, 0, 0, time.UTC)

	initial := fetchDashboardSummary(t, router, targetDate)
	if initial.Date != "2026-05-18" {
		t.Fatalf("expected initial date 2026-05-18, got %q", initial.Date)
	}
	if initial.Sholat.CompletedCount != 0 || initial.Sholat.TotalCount != 5 {
		t.Fatalf("expected empty sholat summary, got %+v", initial.Sholat)
	}
	if initial.Puasa.FastType != "" || initial.Puasa.Completed {
		t.Fatalf("expected empty puasa summary, got %+v", initial.Puasa)
	}
	if initial.Finance.Income != "0.00" || initial.Finance.Expense != "0.00" || initial.Finance.Balance != "0.00" {
		t.Fatalf("expected empty finance summary, got %+v", initial.Finance)
	}
	if initial.Sport.CompletedCount != 0 || initial.Sport.CompletedMinutes != 0 {
		t.Fatalf("expected empty sport summary, got %+v", initial.Sport)
	}
	if initial.Journal.Written {
		t.Fatalf("expected empty journal summary, got %+v", initial.Journal)
	}

	seedDashboardRecords(t, ctx, database, targetDate)

	updated := fetchDashboardSummary(t, router, targetDate)
	if updated.Date != "2026-05-18" {
		t.Fatalf("expected updated date 2026-05-18, got %q", updated.Date)
	}
	if updated.Sholat.CompletedCount != 4 || updated.Sholat.TotalCount != 5 {
		t.Fatalf("expected sholat summary 4/5, got %+v", updated.Sholat)
	}
	if updated.Puasa.FastType != "sunnah" || !updated.Puasa.Completed {
		t.Fatalf("expected completed sunnah puasa summary, got %+v", updated.Puasa)
	}
	if updated.Finance.Income != "1000.00" || updated.Finance.Expense != "250.00" || updated.Finance.Balance != "750.00" {
		t.Fatalf("expected finance summary income=1000.00 expense=250.00 balance=750.00, got %+v", updated.Finance)
	}
	if updated.Sport.CompletedCount != 1 || updated.Sport.CompletedMinutes != 45 {
		t.Fatalf("expected sport summary count=1 minutes=45, got %+v", updated.Sport)
	}
	if !updated.Journal.Written {
		t.Fatalf("expected journal summary written=true, got %+v", updated.Journal)
	}
}

func TestCreateSholatRecordDuplicateDateReturnsConflict(t *testing.T) {
	t.Parallel()

	ctx := context.Background()
	database := openEmbeddedDatabase(t, ctx)
	router := NewRouter(slog.New(slog.NewTextHandler(io.Discard, nil)), trackerdb.New(database))
	body := `{"record_date":"2026-05-18","subuh":true,"dzuhur":true,"ashar":false,"maghrib":true,"isya":true,"congregation_count":3,"notes":"first"}`

	firstRequest := httptest.NewRequest(http.MethodPost, "/api/sholat-records", strings.NewReader(body))
	firstRequest.Header.Set("Content-Type", "application/json")
	firstResponse := httptest.NewRecorder()
	router.ServeHTTP(firstResponse, firstRequest)

	if firstResponse.Code != http.StatusCreated {
		t.Fatalf("expected first create status %d, got %d with body %s", http.StatusCreated, firstResponse.Code, firstResponse.Body.String())
	}

	secondRequest := httptest.NewRequest(http.MethodPost, "/api/sholat-records", strings.NewReader(body))
	secondRequest.Header.Set("Content-Type", "application/json")
	secondResponse := httptest.NewRecorder()
	router.ServeHTTP(secondResponse, secondRequest)

	if secondResponse.Code != http.StatusConflict {
		t.Fatalf("expected duplicate create status %d, got %d with body %s", http.StatusConflict, secondResponse.Code, secondResponse.Body.String())
	}
}

func TestCreatePuasaRecordDuplicateDateReturnsConflict(t *testing.T) {
	t.Parallel()

	ctx := context.Background()
	database := openEmbeddedDatabase(t, ctx)
	router := NewRouter(slog.New(slog.NewTextHandler(io.Discard, nil)), trackerdb.New(database))
	body := `{"record_date":"2026-05-18","fast_type":"sunnah","completed":true,"sahur":true,"iftar":true,"notes":"first"}`

	firstRequest := httptest.NewRequest(http.MethodPost, "/api/puasa-records", strings.NewReader(body))
	firstRequest.Header.Set("Content-Type", "application/json")
	firstResponse := httptest.NewRecorder()
	router.ServeHTTP(firstResponse, firstRequest)

	if firstResponse.Code != http.StatusCreated {
		t.Fatalf("expected first create status %d, got %d with body %s", http.StatusCreated, firstResponse.Code, firstResponse.Body.String())
	}

	secondRequest := httptest.NewRequest(http.MethodPost, "/api/puasa-records", strings.NewReader(body))
	secondRequest.Header.Set("Content-Type", "application/json")
	secondResponse := httptest.NewRecorder()
	router.ServeHTTP(secondResponse, secondRequest)

	if secondResponse.Code != http.StatusConflict {
		t.Fatalf("expected duplicate create status %d, got %d with body %s", http.StatusConflict, secondResponse.Code, secondResponse.Body.String())
	}
}

func openEmbeddedDatabase(t *testing.T, ctx context.Context) *sql.DB {
	t.Helper()

	tempDir := t.TempDir()
	port := freePort(t)
	config := embeddedpostgres.DefaultConfig().
		Port(port).
		Database("tracker_test").
		Username("tracker").
		Password("tracker").
		RuntimePath(filepath.Join(tempDir, "runtime")).
		DataPath(filepath.Join(tempDir, "data")).
		BinariesPath(filepath.Join(tempDir, "bin")).
		CachePath(filepath.Join(tempDir, "cache")).
		StartTimeout(2 * time.Minute).
		Logger(io.Discard)

	postgres := embeddedpostgres.NewDatabase(config)
	if err := postgres.Start(); err != nil {
		t.Fatalf("start embedded postgres: %v", err)
	}

	t.Cleanup(func() {
		if err := postgres.Stop(); err != nil {
			t.Fatalf("stop embedded postgres: %v", err)
		}
	})

	database, err := trackerdb.Open(ctx, config.GetConnectionURL())
	if err != nil {
		t.Fatalf("open embedded database: %v", err)
	}

	t.Cleanup(func() {
		if err := database.Close(); err != nil {
			t.Fatalf("close embedded database: %v", err)
		}
	})

	applyMigration(t, ctx, database, filepath.Join("..", "..", "migrations", "000001_create_mvp_tracker_tables.up.sql"))

	return database
}

func applyMigration(t *testing.T, ctx context.Context, database *sql.DB, migrationPath string) {
	t.Helper()

	sqlBytes, err := os.ReadFile(migrationPath)
	if err != nil {
		t.Fatalf("read migration: %v", err)
	}

	if _, err := database.ExecContext(ctx, string(sqlBytes)); err != nil {
		t.Fatalf("apply migration: %v", err)
	}
}

func seedDashboardRecords(t *testing.T, ctx context.Context, database *sql.DB, targetDate time.Time) {
	t.Helper()

	queries := []struct {
		statement string
		args      []any
	}{
		{
			statement: `INSERT INTO sholat_records (
				record_date, subuh, dzuhur, ashar, maghrib, isya, congregation_count, notes
			) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
			args: []any{targetDate, true, true, false, true, true, 3, "dashboard verification"},
		},
		{
			statement: `INSERT INTO puasa_records (
				record_date, fast_type, completed, sahur, iftar, notes
			) VALUES ($1, $2, $3, $4, $5, $6)`,
			args: []any{targetDate, "sunnah", true, true, true, "dashboard verification"},
		},
		{
			statement: `INSERT INTO finance_transactions (
				transaction_date, transaction_type, category, amount, notes
			) VALUES ($1, $2, $3, $4, $5)`,
			args: []any{targetDate, "income", "salary", "1000.00", "current month income"},
		},
		{
			statement: `INSERT INTO finance_transactions (
				transaction_date, transaction_type, category, amount, notes
			) VALUES ($1, $2, $3, $4, $5)`,
			args: []any{targetDate, "expense", "food", "250.00", "current month expense"},
		},
		{
			statement: `INSERT INTO finance_transactions (
				transaction_date, transaction_type, category, amount, notes
			) VALUES ($1, $2, $3, $4, $5)`,
			args: []any{targetDate.AddDate(0, -1, 0), "income", "old", "9999.00", "previous month ignored"},
		},
		{
			statement: `INSERT INTO sport_records (
				record_date, sport_type, duration_minutes, completed, notes
			) VALUES ($1, $2, $3, $4, $5)`,
			args: []any{targetDate, "running", 45, true, "current week completed"},
		},
		{
			statement: `INSERT INTO sport_records (
				record_date, sport_type, duration_minutes, completed, notes
			) VALUES ($1, $2, $3, $4, $5)`,
			args: []any{targetDate.AddDate(0, 0, -1), "cycling", 60, true, "previous week ignored"},
		},
		{
			statement: `INSERT INTO journal_entries (
				entry_date, title, content, mood, tags, is_private
			) VALUES ($1, $2, $3, $4, $5, $6)`,
			args: []any{targetDate, "Today", "Dashboard verification entry", "focused", "test", true},
		},
	}

	for _, query := range queries {
		if _, err := database.ExecContext(ctx, query.statement, query.args...); err != nil {
			t.Fatalf("seed dashboard records: %v", err)
		}
	}
}

func fetchDashboardSummary(t *testing.T, router http.Handler, targetDate time.Time) dashboardSummaryResponse {
	t.Helper()

	request := httptest.NewRequest(http.MethodGet, "/api/dashboard/summary?date="+targetDate.Format(time.DateOnly), nil)
	response := httptest.NewRecorder()

	router.ServeHTTP(response, request)

	if response.Code != http.StatusOK {
		t.Fatalf("expected status %d, got %d with body %s", http.StatusOK, response.Code, response.Body.String())
	}

	var summary dashboardSummaryResponse
	if err := json.NewDecoder(strings.NewReader(response.Body.String())).Decode(&summary); err != nil {
		t.Fatalf("decode dashboard summary: %v", err)
	}

	return summary
}

func freePort(t *testing.T) uint32 {
	t.Helper()

	listener, err := net.Listen("tcp", "127.0.0.1:0")
	if err != nil {
		t.Fatalf("find free port: %v", err)
	}
	defer listener.Close()

	return uint32(listener.Addr().(*net.TCPAddr).Port)
}
