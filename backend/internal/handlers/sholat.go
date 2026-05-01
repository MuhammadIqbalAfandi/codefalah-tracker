package handlers

import (
	"database/sql"
	"errors"
	"net/http"
	"strconv"
	"time"

	trackerdb "codefalah-tracker/backend/internal/db"

	"github.com/go-chi/chi/v5"
)

type sholatRecordRequest struct {
	RecordDate        string `json:"record_date" validate:"required"`
	Subuh             bool   `json:"subuh"`
	Dzuhur            bool   `json:"dzuhur"`
	Ashar             bool   `json:"ashar"`
	Maghrib           bool   `json:"maghrib"`
	Isya              bool   `json:"isya"`
	CongregationCount int32  `json:"congregation_count" validate:"min=0,max=5"`
	Notes             string `json:"notes" validate:"max=1000"`
}

type updateSholatRecordRequest struct {
	Subuh             bool   `json:"subuh"`
	Dzuhur            bool   `json:"dzuhur"`
	Ashar             bool   `json:"ashar"`
	Maghrib           bool   `json:"maghrib"`
	Isya              bool   `json:"isya"`
	CongregationCount int32  `json:"congregation_count" validate:"min=0,max=5"`
	Notes             string `json:"notes" validate:"max=1000"`
}

func (h *RouterHandlers) listSholatRecords(w http.ResponseWriter, r *http.Request) {
	limit := parsePositiveInt32(r.URL.Query().Get("limit"), 25)
	if limit > 100 {
		limit = 100
	}

	records, err := h.queries.ListSholatRecords(r.Context(), trackerdb.ListSholatRecordsParams{
		Limit:  limit,
		Offset: parsePositiveInt32(r.URL.Query().Get("offset"), 0),
	})
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to list sholat records")
		return
	}

	writeJSON(w, http.StatusOK, records)
}

func (h *RouterHandlers) createSholatRecord(w http.ResponseWriter, r *http.Request) {
	var payload sholatRecordRequest
	if !decodeAndValidate(w, r, &payload) {
		return
	}

	recordDate, ok := parseRequestDate(w, payload.RecordDate)
	if !ok {
		return
	}

	if _, err := h.queries.GetSholatRecordByDate(r.Context(), recordDate); err == nil {
		writeError(w, http.StatusConflict, "catatan sholat untuk tanggal ini sudah ada")
		return
	} else if !errors.Is(err, sql.ErrNoRows) {
		writeError(w, http.StatusInternalServerError, "failed to check sholat record")
		return
	}

	record, err := h.queries.CreateSholatRecord(r.Context(), trackerdb.CreateSholatRecordParams{
		RecordDate:        recordDate,
		Subuh:             payload.Subuh,
		Dzuhur:            payload.Dzuhur,
		Ashar:             payload.Ashar,
		Maghrib:           payload.Maghrib,
		Isya:              payload.Isya,
		CongregationCount: payload.CongregationCount,
		Notes:             payload.Notes,
	})
	if err != nil {
		writeCreateRecordError(w, err, "catatan sholat untuk tanggal ini sudah ada", "failed to create sholat record")
		return
	}

	writeJSON(w, http.StatusCreated, record)
}

func (h *RouterHandlers) getSholatRecord(w http.ResponseWriter, r *http.Request) {
	id, ok := parseIDParam(w, r)
	if !ok {
		return
	}

	record, err := h.queries.GetSholatRecordByID(r.Context(), id)
	if err != nil {
		writeQueryError(w, err, "sholat record not found", "failed to get sholat record")
		return
	}

	writeJSON(w, http.StatusOK, record)
}

func (h *RouterHandlers) updateSholatRecord(w http.ResponseWriter, r *http.Request) {
	id, ok := parseIDParam(w, r)
	if !ok {
		return
	}

	var payload updateSholatRecordRequest
	if !decodeAndValidate(w, r, &payload) {
		return
	}

	record, err := h.queries.UpdateSholatRecord(r.Context(), trackerdb.UpdateSholatRecordParams{
		ID:                id,
		Subuh:             payload.Subuh,
		Dzuhur:            payload.Dzuhur,
		Ashar:             payload.Ashar,
		Maghrib:           payload.Maghrib,
		Isya:              payload.Isya,
		CongregationCount: payload.CongregationCount,
		Notes:             payload.Notes,
	})
	if err != nil {
		writeQueryError(w, err, "sholat record not found", "failed to update sholat record")
		return
	}

	writeJSON(w, http.StatusOK, record)
}

func (h *RouterHandlers) deleteSholatRecord(w http.ResponseWriter, r *http.Request) {
	id, ok := parseIDParam(w, r)
	if !ok {
		return
	}

	if _, err := h.queries.GetSholatRecordByID(r.Context(), id); err != nil {
		writeQueryError(w, err, "sholat record not found", "failed to get sholat record")
		return
	}

	if err := h.queries.DeleteSholatRecord(r.Context(), id); err != nil {
		writeError(w, http.StatusInternalServerError, "failed to delete sholat record")
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func decodeAndValidate(w http.ResponseWriter, r *http.Request, payload any) bool {
	if err := decodeJSON(r, payload); err != nil {
		writeError(w, http.StatusBadRequest, "invalid JSON request body")
		return false
	}

	if err := validateRequest(payload); err != nil {
		writeValidationError(w, err, payload)
		return false
	}

	return true
}

func parseIDParam(w http.ResponseWriter, r *http.Request) (int64, bool) {
	id, err := strconv.ParseInt(chi.URLParam(r, "id"), 10, 64)
	if err != nil || id <= 0 {
		writeError(w, http.StatusBadRequest, "invalid record id")
		return 0, false
	}

	return id, true
}

func parseRequestDate(w http.ResponseWriter, value string) (time.Time, bool) {
	date, err := time.Parse(time.DateOnly, value)
	if err != nil {
		writeError(w, http.StatusBadRequest, "record_date must use YYYY-MM-DD format")
		return time.Time{}, false
	}

	return date, true
}

func parsePositiveInt32(value string, fallback int32) int32 {
	if value == "" {
		return fallback
	}

	parsed, err := strconv.ParseInt(value, 10, 32)
	if err != nil || parsed < 0 {
		return fallback
	}

	return int32(parsed)
}

func writeQueryError(w http.ResponseWriter, err error, notFoundMessage string, fallbackMessage string) {
	if errors.Is(err, sql.ErrNoRows) {
		writeError(w, http.StatusNotFound, notFoundMessage)
		return
	}

	writeError(w, http.StatusInternalServerError, fallbackMessage)
}
