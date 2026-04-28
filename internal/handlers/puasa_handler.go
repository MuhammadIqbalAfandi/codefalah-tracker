package handlers

import (
	"database/sql"
	"errors"
	"net/http"
	"time"

	"codefalah-tracker/internal/services"
	sqlc "codefalah-tracker/sql/generated"
	"github.com/go-chi/chi/v5"
)

const puasaDateLayout = "2006-01-02"

type PuasaHandler struct {
	service *services.PuasaService
}

type createPuasaRequest struct {
	RecordDate  string `json:"record_date" validate:"required"`
	PuasaType   string `json:"puasa_type" validate:"required"`
	IsCompleted bool   `json:"is_completed"`
	SahurDone   bool   `json:"sahur_done"`
	BerbukaDone bool   `json:"berbuka_done"`
	Notes       string `json:"notes"`
}

type updatePuasaRequest struct {
	PuasaType   string `json:"puasa_type" validate:"required"`
	IsCompleted bool   `json:"is_completed"`
	SahurDone   bool   `json:"sahur_done"`
	BerbukaDone bool   `json:"berbuka_done"`
	Notes       string `json:"notes"`
}

func NewPuasaHandler(service *services.PuasaService) *PuasaHandler {
	return &PuasaHandler{service: service}
}

func (h *PuasaHandler) List(w http.ResponseWriter, r *http.Request) {
	records, err := h.service.List(r.Context())
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to list puasa records")
		return
	}

	writeJSON(w, http.StatusOK, records)
}

func (h *PuasaHandler) GetByDate(w http.ResponseWriter, r *http.Request) {
	recordDate, ok := parsePuasaDateParam(w, r)
	if !ok {
		return
	}

	record, err := h.service.GetByDate(r.Context(), recordDate)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			writeError(w, http.StatusNotFound, "puasa record not found")
			return
		}

		writeError(w, http.StatusInternalServerError, "failed to get puasa record")
		return
	}

	writeJSON(w, http.StatusOK, record)
}

func (h *PuasaHandler) Create(w http.ResponseWriter, r *http.Request) {
	var req createPuasaRequest
	if err := decodeJSON(r, &req); err != nil {
		writeError(w, http.StatusBadRequest, err.Error())
		return
	}

	if details := validateRequest(req); details != nil {
		writeValidationError(w, details)
		return
	}

	recordDate, err := time.Parse(puasaDateLayout, req.RecordDate)
	if err != nil {
		writeError(w, http.StatusBadRequest, "record_date must use YYYY-MM-DD format")
		return
	}

	record, err := h.service.Create(r.Context(), sqlc.CreatePuasaRecordParams{
		RecordDate:  recordDate,
		PuasaType:   req.PuasaType,
		IsCompleted: req.IsCompleted,
		SahurDone:   req.SahurDone,
		BerbukaDone: req.BerbukaDone,
		Notes:       req.Notes,
	})
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to create puasa record")
		return
	}

	writeJSON(w, http.StatusCreated, record)
}

func (h *PuasaHandler) UpdateByDate(w http.ResponseWriter, r *http.Request) {
	recordDate, ok := parsePuasaDateParam(w, r)
	if !ok {
		return
	}

	var req updatePuasaRequest
	if err := decodeJSON(r, &req); err != nil {
		writeError(w, http.StatusBadRequest, err.Error())
		return
	}

	if details := validateRequest(req); details != nil {
		writeValidationError(w, details)
		return
	}

	record, err := h.service.Update(r.Context(), sqlc.UpdatePuasaRecordParams{
		RecordDate:  recordDate,
		PuasaType:   req.PuasaType,
		IsCompleted: req.IsCompleted,
		SahurDone:   req.SahurDone,
		BerbukaDone: req.BerbukaDone,
		Notes:       req.Notes,
	})
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			writeError(w, http.StatusNotFound, "puasa record not found")
			return
		}

		writeError(w, http.StatusInternalServerError, "failed to update puasa record")
		return
	}

	writeJSON(w, http.StatusOK, record)
}

func (h *PuasaHandler) DeleteByDate(w http.ResponseWriter, r *http.Request) {
	recordDate, ok := parsePuasaDateParam(w, r)
	if !ok {
		return
	}

	if err := h.service.DeleteByDate(r.Context(), recordDate); err != nil {
		writeError(w, http.StatusInternalServerError, "failed to delete puasa record")
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func parsePuasaDateParam(w http.ResponseWriter, r *http.Request) (time.Time, bool) {
	recordDate, err := time.Parse(puasaDateLayout, chi.URLParam(r, "date"))
	if err != nil {
		writeError(w, http.StatusBadRequest, "date must use YYYY-MM-DD format")
		return time.Time{}, false
	}

	return recordDate, true
}
