package handlers

import (
	"database/sql"
	"errors"
	"net/http"

	trackerdb "codefalah-tracker/backend/internal/db"
)

type puasaRecordRequest struct {
	RecordDate string `json:"record_date" validate:"required"`
	FastType   string `json:"fast_type" validate:"required,max=100"`
	Completed  bool   `json:"completed"`
	Sahur      bool   `json:"sahur"`
	Iftar      bool   `json:"iftar"`
	Notes      string `json:"notes" validate:"max=1000"`
}

type updatePuasaRecordRequest struct {
	FastType  string `json:"fast_type" validate:"required,max=100"`
	Completed bool   `json:"completed"`
	Sahur     bool   `json:"sahur"`
	Iftar     bool   `json:"iftar"`
	Notes     string `json:"notes" validate:"max=1000"`
}

func (h *RouterHandlers) listPuasaRecords(w http.ResponseWriter, r *http.Request) {
	limit := parsePositiveInt32(r.URL.Query().Get("limit"), 25)
	if limit > 100 {
		limit = 100
	}

	records, err := h.queries.ListPuasaRecords(r.Context(), trackerdb.ListPuasaRecordsParams{
		Limit:  limit,
		Offset: parsePositiveInt32(r.URL.Query().Get("offset"), 0),
	})
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to list puasa records")
		return
	}

	writeJSON(w, http.StatusOK, records)
}

func (h *RouterHandlers) createPuasaRecord(w http.ResponseWriter, r *http.Request) {
	var payload puasaRecordRequest
	if !decodeAndValidate(w, r, &payload) {
		return
	}

	recordDate, ok := parseRequestDate(w, payload.RecordDate)
	if !ok {
		return
	}

	if _, err := h.queries.GetPuasaRecordByDate(r.Context(), recordDate); err == nil {
		writeError(w, http.StatusConflict, "catatan puasa untuk tanggal ini sudah ada")
		return
	} else if !errors.Is(err, sql.ErrNoRows) {
		writeError(w, http.StatusInternalServerError, "failed to check puasa record")
		return
	}

	record, err := h.queries.CreatePuasaRecord(r.Context(), trackerdb.CreatePuasaRecordParams{
		RecordDate: recordDate,
		FastType:   payload.FastType,
		Completed:  payload.Completed,
		Sahur:      payload.Sahur,
		Iftar:      payload.Iftar,
		Notes:      payload.Notes,
	})
	if err != nil {
		writeCreateRecordError(w, err, "catatan puasa untuk tanggal ini sudah ada", "failed to create puasa record")
		return
	}

	writeJSON(w, http.StatusCreated, record)
}

func (h *RouterHandlers) getPuasaRecord(w http.ResponseWriter, r *http.Request) {
	id, ok := parseIDParam(w, r)
	if !ok {
		return
	}

	record, err := h.queries.GetPuasaRecordByID(r.Context(), id)
	if err != nil {
		writeQueryError(w, err, "puasa record not found", "failed to get puasa record")
		return
	}

	writeJSON(w, http.StatusOK, record)
}

func (h *RouterHandlers) updatePuasaRecord(w http.ResponseWriter, r *http.Request) {
	id, ok := parseIDParam(w, r)
	if !ok {
		return
	}

	var payload updatePuasaRecordRequest
	if !decodeAndValidate(w, r, &payload) {
		return
	}

	record, err := h.queries.UpdatePuasaRecord(r.Context(), trackerdb.UpdatePuasaRecordParams{
		ID:        id,
		FastType:  payload.FastType,
		Completed: payload.Completed,
		Sahur:     payload.Sahur,
		Iftar:     payload.Iftar,
		Notes:     payload.Notes,
	})
	if err != nil {
		writeQueryError(w, err, "puasa record not found", "failed to update puasa record")
		return
	}

	writeJSON(w, http.StatusOK, record)
}

func (h *RouterHandlers) deletePuasaRecord(w http.ResponseWriter, r *http.Request) {
	id, ok := parseIDParam(w, r)
	if !ok {
		return
	}

	if _, err := h.queries.GetPuasaRecordByID(r.Context(), id); err != nil {
		writeQueryError(w, err, "puasa record not found", "failed to get puasa record")
		return
	}

	if err := h.queries.DeletePuasaRecord(r.Context(), id); err != nil {
		writeError(w, http.StatusInternalServerError, "failed to delete puasa record")
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
