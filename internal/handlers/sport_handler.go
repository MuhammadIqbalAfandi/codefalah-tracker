package handlers

import (
	"database/sql"
	"errors"
	"net/http"
	"strconv"
	"time"

	"codefalah-tracker/internal/services"
	sqlc "codefalah-tracker/sql/generated"
	"github.com/go-chi/chi/v5"
)

const sportDateLayout = "2006-01-02"

type SportHandler struct {
	service *services.SportService
}

type createSportRequest struct {
	RecordDate      string `json:"record_date" validate:"required"`
	SportType       string `json:"sport_type" validate:"required"`
	DurationMinutes int32  `json:"duration_minutes"`
	IsCompleted     bool   `json:"is_completed"`
	Notes           string `json:"notes"`
}

type updateSportRequest struct {
	RecordDate      string `json:"record_date" validate:"required"`
	SportType       string `json:"sport_type" validate:"required"`
	DurationMinutes int32  `json:"duration_minutes"`
	IsCompleted     bool   `json:"is_completed"`
	Notes           string `json:"notes"`
}

func NewSportHandler(service *services.SportService) *SportHandler {
	return &SportHandler{service: service}
}

func (h *SportHandler) List(w http.ResponseWriter, r *http.Request) {
	records, err := h.service.List(r.Context())
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to list sport records")
		return
	}

	writeJSON(w, http.StatusOK, records)
}

func (h *SportHandler) GetByID(w http.ResponseWriter, r *http.Request) {
	id, ok := parseSportIDParam(w, r)
	if !ok {
		return
	}

	record, err := h.service.GetByID(r.Context(), id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			writeError(w, http.StatusNotFound, "sport record not found")
			return
		}

		writeError(w, http.StatusInternalServerError, "failed to get sport record")
		return
	}

	writeJSON(w, http.StatusOK, record)
}

func (h *SportHandler) Create(w http.ResponseWriter, r *http.Request) {
	var req createSportRequest
	if err := decodeJSON(r, &req); err != nil {
		writeError(w, http.StatusBadRequest, err.Error())
		return
	}

	if details := validateRequest(req); details != nil {
		writeValidationError(w, details)
		return
	}

	recordDate, err := time.Parse(sportDateLayout, req.RecordDate)
	if err != nil {
		writeError(w, http.StatusBadRequest, "record_date must use YYYY-MM-DD format")
		return
	}

	record, err := h.service.Create(r.Context(), sqlc.CreateSportRecordParams{
		RecordDate:      recordDate,
		SportType:       req.SportType,
		DurationMinutes: req.DurationMinutes,
		IsCompleted:     req.IsCompleted,
		Notes:           req.Notes,
	})
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to create sport record")
		return
	}

	writeJSON(w, http.StatusCreated, record)
}

func (h *SportHandler) UpdateByID(w http.ResponseWriter, r *http.Request) {
	id, ok := parseSportIDParam(w, r)
	if !ok {
		return
	}

	var req updateSportRequest
	if err := decodeJSON(r, &req); err != nil {
		writeError(w, http.StatusBadRequest, err.Error())
		return
	}

	if details := validateRequest(req); details != nil {
		writeValidationError(w, details)
		return
	}

	recordDate, err := time.Parse(sportDateLayout, req.RecordDate)
	if err != nil {
		writeError(w, http.StatusBadRequest, "record_date must use YYYY-MM-DD format")
		return
	}

	record, err := h.service.Update(r.Context(), sqlc.UpdateSportRecordParams{
		ID:              id,
		RecordDate:      recordDate,
		SportType:       req.SportType,
		DurationMinutes: req.DurationMinutes,
		IsCompleted:     req.IsCompleted,
		Notes:           req.Notes,
	})
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			writeError(w, http.StatusNotFound, "sport record not found")
			return
		}

		writeError(w, http.StatusInternalServerError, "failed to update sport record")
		return
	}

	writeJSON(w, http.StatusOK, record)
}

func (h *SportHandler) DeleteByID(w http.ResponseWriter, r *http.Request) {
	id, ok := parseSportIDParam(w, r)
	if !ok {
		return
	}

	if err := h.service.Delete(r.Context(), id); err != nil {
		writeError(w, http.StatusInternalServerError, "failed to delete sport record")
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func parseSportIDParam(w http.ResponseWriter, r *http.Request) (int64, bool) {
	id, err := strconv.ParseInt(chi.URLParam(r, "id"), 10, 64)
	if err != nil || id <= 0 {
		writeError(w, http.StatusBadRequest, "id must be a positive integer")
		return 0, false
	}

	return id, true
}
