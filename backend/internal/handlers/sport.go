package handlers

import (
	"net/http"

	trackerdb "codefalah-tracker/backend/internal/db"
)

type sportRecordRequest struct {
	RecordDate      string `json:"record_date" validate:"required"`
	SportType       string `json:"sport_type" validate:"required,max=100"`
	DurationMinutes int32  `json:"duration_minutes" validate:"min=0,max=1440"`
	Completed       bool   `json:"completed"`
	Notes           string `json:"notes" validate:"max=1000"`
}

func (h *RouterHandlers) listSportRecords(w http.ResponseWriter, r *http.Request) {
	limit := parsePositiveInt32(r.URL.Query().Get("limit"), 25)
	if limit > 100 {
		limit = 100
	}

	records, err := h.queries.ListSportRecords(r.Context(), trackerdb.ListSportRecordsParams{
		Limit:  limit,
		Offset: parsePositiveInt32(r.URL.Query().Get("offset"), 0),
	})
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to list sport records")
		return
	}

	writeJSON(w, http.StatusOK, records)
}

func (h *RouterHandlers) createSportRecord(w http.ResponseWriter, r *http.Request) {
	var payload sportRecordRequest
	if !decodeAndValidate(w, r, &payload) {
		return
	}

	recordDate, ok := parseRequestDate(w, payload.RecordDate)
	if !ok {
		return
	}

	record, err := h.queries.CreateSportRecord(r.Context(), trackerdb.CreateSportRecordParams{
		RecordDate:      recordDate,
		SportType:       payload.SportType,
		DurationMinutes: payload.DurationMinutes,
		Completed:       payload.Completed,
		Notes:           payload.Notes,
	})
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to create sport record")
		return
	}

	writeJSON(w, http.StatusCreated, record)
}

func (h *RouterHandlers) getSportRecord(w http.ResponseWriter, r *http.Request) {
	id, ok := parseIDParam(w, r)
	if !ok {
		return
	}

	record, err := h.queries.GetSportRecordByID(r.Context(), id)
	if err != nil {
		writeQueryError(w, err, "sport record not found", "failed to get sport record")
		return
	}

	writeJSON(w, http.StatusOK, record)
}

func (h *RouterHandlers) updateSportRecord(w http.ResponseWriter, r *http.Request) {
	id, ok := parseIDParam(w, r)
	if !ok {
		return
	}

	var payload sportRecordRequest
	if !decodeAndValidate(w, r, &payload) {
		return
	}

	recordDate, ok := parseRequestDate(w, payload.RecordDate)
	if !ok {
		return
	}

	record, err := h.queries.UpdateSportRecord(r.Context(), trackerdb.UpdateSportRecordParams{
		ID:              id,
		RecordDate:      recordDate,
		SportType:       payload.SportType,
		DurationMinutes: payload.DurationMinutes,
		Completed:       payload.Completed,
		Notes:           payload.Notes,
	})
	if err != nil {
		writeQueryError(w, err, "sport record not found", "failed to update sport record")
		return
	}

	writeJSON(w, http.StatusOK, record)
}

func (h *RouterHandlers) deleteSportRecord(w http.ResponseWriter, r *http.Request) {
	id, ok := parseIDParam(w, r)
	if !ok {
		return
	}

	if _, err := h.queries.GetSportRecordByID(r.Context(), id); err != nil {
		writeQueryError(w, err, "sport record not found", "failed to get sport record")
		return
	}

	if err := h.queries.DeleteSportRecord(r.Context(), id); err != nil {
		writeError(w, http.StatusInternalServerError, "failed to delete sport record")
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
