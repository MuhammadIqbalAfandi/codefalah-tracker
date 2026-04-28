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

const journalDateLayout = "2006-01-02"

type JournalHandler struct {
	service *services.JournalService
}

type createJournalRequest struct {
	EntryDate string   `json:"entry_date" validate:"required"`
	Title     string   `json:"title" validate:"required"`
	Content   string   `json:"content" validate:"required"`
	Mood      string   `json:"mood"`
	Tags      []string `json:"tags"`
	IsPrivate bool     `json:"is_private"`
}

type updateJournalRequest struct {
	Title     string   `json:"title" validate:"required"`
	Content   string   `json:"content" validate:"required"`
	Mood      string   `json:"mood"`
	Tags      []string `json:"tags"`
	IsPrivate bool     `json:"is_private"`
}

func NewJournalHandler(service *services.JournalService) *JournalHandler {
	return &JournalHandler{service: service}
}

func (h *JournalHandler) List(w http.ResponseWriter, r *http.Request) {
	records, err := h.service.List(r.Context())
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to list journal entries")
		return
	}

	writeJSON(w, http.StatusOK, records)
}

func (h *JournalHandler) GetByDate(w http.ResponseWriter, r *http.Request) {
	entryDate, ok := parseJournalDateParam(w, r)
	if !ok {
		return
	}

	record, err := h.service.GetByDate(r.Context(), entryDate)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			writeError(w, http.StatusNotFound, "journal entry not found")
			return
		}

		writeError(w, http.StatusInternalServerError, "failed to get journal entry")
		return
	}

	writeJSON(w, http.StatusOK, record)
}

func (h *JournalHandler) Create(w http.ResponseWriter, r *http.Request) {
	var req createJournalRequest
	if err := decodeJSON(r, &req); err != nil {
		writeError(w, http.StatusBadRequest, err.Error())
		return
	}

	if details := validateRequest(req); details != nil {
		writeValidationError(w, details)
		return
	}

	entryDate, err := time.Parse(journalDateLayout, req.EntryDate)
	if err != nil {
		writeError(w, http.StatusBadRequest, "entry_date must use YYYY-MM-DD format")
		return
	}

	record, err := h.service.Create(r.Context(), sqlc.CreateJournalEntryParams{
		EntryDate: entryDate,
		Title:     req.Title,
		Content:   req.Content,
		Mood:      req.Mood,
		Tags:      req.Tags,
		IsPrivate: req.IsPrivate,
	})
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to create journal entry")
		return
	}

	writeJSON(w, http.StatusCreated, record)
}

func (h *JournalHandler) UpdateByDate(w http.ResponseWriter, r *http.Request) {
	entryDate, ok := parseJournalDateParam(w, r)
	if !ok {
		return
	}

	var req updateJournalRequest
	if err := decodeJSON(r, &req); err != nil {
		writeError(w, http.StatusBadRequest, err.Error())
		return
	}

	if details := validateRequest(req); details != nil {
		writeValidationError(w, details)
		return
	}

	record, err := h.service.Update(r.Context(), sqlc.UpdateJournalEntryParams{
		EntryDate: entryDate,
		Title:     req.Title,
		Content:   req.Content,
		Mood:      req.Mood,
		Tags:      req.Tags,
		IsPrivate: req.IsPrivate,
	})
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			writeError(w, http.StatusNotFound, "journal entry not found")
			return
		}

		writeError(w, http.StatusInternalServerError, "failed to update journal entry")
		return
	}

	writeJSON(w, http.StatusOK, record)
}

func (h *JournalHandler) DeleteByDate(w http.ResponseWriter, r *http.Request) {
	entryDate, ok := parseJournalDateParam(w, r)
	if !ok {
		return
	}

	if err := h.service.DeleteByDate(r.Context(), entryDate); err != nil {
		writeError(w, http.StatusInternalServerError, "failed to delete journal entry")
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func parseJournalDateParam(w http.ResponseWriter, r *http.Request) (time.Time, bool) {
	entryDate, err := time.Parse(journalDateLayout, chi.URLParam(r, "date"))
	if err != nil {
		writeError(w, http.StatusBadRequest, "date must use YYYY-MM-DD format")
		return time.Time{}, false
	}

	return entryDate, true
}
