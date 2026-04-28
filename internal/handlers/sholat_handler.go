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

const sholatDateLayout = "2006-01-02"

type SholatHandler struct {
	service *services.SholatService
}

type createSholatRequest struct {
	RecordDate  string `json:"record_date" validate:"required"`
	SubuhDone   bool   `json:"subuh_done"`
	DzuhurDone  bool   `json:"dzuhur_done"`
	AsharDone   bool   `json:"ashar_done"`
	MaghribDone bool   `json:"maghrib_done"`
	IsyaDone    bool   `json:"isya_done"`
	Notes       string `json:"notes"`
}

type updateSholatRequest struct {
	SubuhDone   bool   `json:"subuh_done"`
	DzuhurDone  bool   `json:"dzuhur_done"`
	AsharDone   bool   `json:"ashar_done"`
	MaghribDone bool   `json:"maghrib_done"`
	IsyaDone    bool   `json:"isya_done"`
	Notes       string `json:"notes"`
}

func NewSholatHandler(service *services.SholatService) *SholatHandler {
	return &SholatHandler{service: service}
}

func (h *SholatHandler) List(w http.ResponseWriter, r *http.Request) {
	records, err := h.service.List(r.Context())
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to list sholat records")
		return
	}

	writeJSON(w, http.StatusOK, records)
}

func (h *SholatHandler) GetByDate(w http.ResponseWriter, r *http.Request) {
	recordDate, ok := parseSholatDateParam(w, r)
	if !ok {
		return
	}

	record, err := h.service.GetByDate(r.Context(), recordDate)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			writeError(w, http.StatusNotFound, "sholat record not found")
			return
		}

		writeError(w, http.StatusInternalServerError, "failed to get sholat record")
		return
	}

	writeJSON(w, http.StatusOK, record)
}

func (h *SholatHandler) Create(w http.ResponseWriter, r *http.Request) {
	var req createSholatRequest
	if err := decodeJSON(r, &req); err != nil {
		writeError(w, http.StatusBadRequest, err.Error())
		return
	}

	if details := validateRequest(req); details != nil {
		writeValidationError(w, details)
		return
	}

	recordDate, err := time.Parse(sholatDateLayout, req.RecordDate)
	if err != nil {
		writeError(w, http.StatusBadRequest, "record_date must use YYYY-MM-DD format")
		return
	}

	record, err := h.service.Create(r.Context(), sqlc.CreateSholatRecordParams{
		RecordDate:  recordDate,
		SubuhDone:   req.SubuhDone,
		DzuhurDone:  req.DzuhurDone,
		AsharDone:   req.AsharDone,
		MaghribDone: req.MaghribDone,
		IsyaDone:    req.IsyaDone,
		Notes:       req.Notes,
	})
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to create sholat record")
		return
	}

	writeJSON(w, http.StatusCreated, record)
}

func (h *SholatHandler) UpdateByDate(w http.ResponseWriter, r *http.Request) {
	recordDate, ok := parseSholatDateParam(w, r)
	if !ok {
		return
	}

	var req updateSholatRequest
	if err := decodeJSON(r, &req); err != nil {
		writeError(w, http.StatusBadRequest, err.Error())
		return
	}

	record, err := h.service.Update(r.Context(), sqlc.UpdateSholatRecordParams{
		RecordDate:  recordDate,
		SubuhDone:   req.SubuhDone,
		DzuhurDone:  req.DzuhurDone,
		AsharDone:   req.AsharDone,
		MaghribDone: req.MaghribDone,
		IsyaDone:    req.IsyaDone,
		Notes:       req.Notes,
	})
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			writeError(w, http.StatusNotFound, "sholat record not found")
			return
		}

		writeError(w, http.StatusInternalServerError, "failed to update sholat record")
		return
	}

	writeJSON(w, http.StatusOK, record)
}

func (h *SholatHandler) DeleteByDate(w http.ResponseWriter, r *http.Request) {
	recordDate, ok := parseSholatDateParam(w, r)
	if !ok {
		return
	}

	if err := h.service.DeleteByDate(r.Context(), recordDate); err != nil {
		writeError(w, http.StatusInternalServerError, "failed to delete sholat record")
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func parseSholatDateParam(w http.ResponseWriter, r *http.Request) (time.Time, bool) {
	recordDate, err := time.Parse(sholatDateLayout, chi.URLParam(r, "date"))
	if err != nil {
		writeError(w, http.StatusBadRequest, "date must use YYYY-MM-DD format")
		return time.Time{}, false
	}

	return recordDate, true
}
