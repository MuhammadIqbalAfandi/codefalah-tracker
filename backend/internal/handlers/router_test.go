package handlers

import (
	"encoding/json"
	"io"
	"log/slog"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	trackerdb "codefalah-tracker/backend/internal/db"
)

func TestHealthEndpoint(t *testing.T) {
	router := NewRouter(slog.New(slog.NewTextHandler(io.Discard, nil)), trackerdb.New(nil))
	request := httptest.NewRequest(http.MethodGet, "/health", nil)
	response := httptest.NewRecorder()

	router.ServeHTTP(response, request)

	if response.Code != http.StatusOK {
		t.Fatalf("expected status %d, got %d", http.StatusOK, response.Code)
	}
}

func TestTrackerCreateEndpointsRejectInvalidJSON(t *testing.T) {
	router := NewRouter(slog.New(slog.NewTextHandler(io.Discard, nil)), trackerdb.New(nil))
	endpoints := []string{
		"/api/sholat-records",
		"/api/puasa-records",
		"/api/finance-transactions",
		"/api/sport-records",
		"/api/journal-entries",
	}

	for _, endpoint := range endpoints {
		t.Run(endpoint, func(t *testing.T) {
			request := httptest.NewRequest(http.MethodPost, endpoint, strings.NewReader("{"))
			request.Header.Set("Content-Type", "application/json")
			response := httptest.NewRecorder()

			router.ServeHTTP(response, request)

			if response.Code != http.StatusBadRequest {
				t.Fatalf("expected status %d, got %d", http.StatusBadRequest, response.Code)
			}
		})
	}
}

func TestTrackerIDEndpointsRejectInvalidID(t *testing.T) {
	router := NewRouter(slog.New(slog.NewTextHandler(io.Discard, nil)), trackerdb.New(nil))
	endpoints := []string{
		"/api/sholat-records/not-a-number",
		"/api/puasa-records/not-a-number",
		"/api/finance-transactions/not-a-number",
		"/api/sport-records/not-a-number",
		"/api/journal-entries/not-a-number",
	}

	for _, endpoint := range endpoints {
		t.Run(endpoint, func(t *testing.T) {
			request := httptest.NewRequest(http.MethodGet, endpoint, nil)
			response := httptest.NewRecorder()

			router.ServeHTTP(response, request)

			if response.Code != http.StatusBadRequest {
				t.Fatalf("expected status %d, got %d", http.StatusBadRequest, response.Code)
			}
		})
	}
}

func TestDashboardEndpointsRejectInvalidDates(t *testing.T) {
	router := NewRouter(slog.New(slog.NewTextHandler(io.Discard, nil)), trackerdb.New(nil))
	tests := []string{
		"/api/dashboard/summary?date=bad-date",
		"/api/dashboard/contribution-graph?start_date=bad-date",
		"/api/dashboard/contribution-graph?start_date=2026-05-02&end_date=2026-05-01",
	}

	for _, path := range tests {
		t.Run(path, func(t *testing.T) {
			request := httptest.NewRequest(http.MethodGet, path, nil)
			response := httptest.NewRecorder()

			router.ServeHTTP(response, request)

			if response.Code != http.StatusBadRequest {
				t.Fatalf("expected status %d, got %d", http.StatusBadRequest, response.Code)
			}
		})
	}
}

func TestTrackerCreateEndpointsReturnFieldSpecificValidationErrors(t *testing.T) {
	router := NewRouter(slog.New(slog.NewTextHandler(io.Discard, nil)), trackerdb.New(nil))

	request := httptest.NewRequest(http.MethodPost, "/api/puasa-records", strings.NewReader(`{"record_date":"2026-05-01"}`))
	request.Header.Set("Content-Type", "application/json")
	response := httptest.NewRecorder()

	router.ServeHTTP(response, request)

	if response.Code != http.StatusBadRequest {
		t.Fatalf("expected status %d, got %d", http.StatusBadRequest, response.Code)
	}

	var payload errorResponse
	if err := json.NewDecoder(response.Body).Decode(&payload); err != nil {
		t.Fatalf("decode error response: %v", err)
	}

	if payload.Error != "fast_type is required" {
		t.Fatalf("expected field-specific validation message, got %q", payload.Error)
	}
}
