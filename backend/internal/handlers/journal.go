package handlers

import (
	"net/http"

	trackerdb "codefalah-tracker/backend/internal/db"
)

type journalEntryRequest struct {
	EntryDate string `json:"entry_date" validate:"required"`
	Title     string `json:"title" validate:"required,max=200"`
	Content   string `json:"content" validate:"required,max=10000"`
	Mood      string `json:"mood" validate:"max=100"`
	Tags      string `json:"tags" validate:"max=500"`
	IsPrivate bool   `json:"is_private"`
}

func (h *RouterHandlers) listJournalEntries(w http.ResponseWriter, r *http.Request) {
	limit := parsePositiveInt32(r.URL.Query().Get("limit"), 25)
	if limit > 100 {
		limit = 100
	}

	entries, err := h.queries.ListJournalEntries(r.Context(), trackerdb.ListJournalEntriesParams{
		Limit:  limit,
		Offset: parsePositiveInt32(r.URL.Query().Get("offset"), 0),
	})
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to list journal entries")
		return
	}

	writeJSON(w, http.StatusOK, entries)
}

func (h *RouterHandlers) createJournalEntry(w http.ResponseWriter, r *http.Request) {
	var payload journalEntryRequest
	if !decodeAndValidate(w, r, &payload) {
		return
	}

	entryDate, ok := parseRequestDate(w, payload.EntryDate)
	if !ok {
		return
	}

	entry, err := h.queries.CreateJournalEntry(r.Context(), trackerdb.CreateJournalEntryParams{
		EntryDate: entryDate,
		Title:     payload.Title,
		Content:   payload.Content,
		Mood:      payload.Mood,
		Tags:      payload.Tags,
		IsPrivate: payload.IsPrivate,
	})
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to create journal entry")
		return
	}

	writeJSON(w, http.StatusCreated, entry)
}

func (h *RouterHandlers) getJournalEntry(w http.ResponseWriter, r *http.Request) {
	id, ok := parseIDParam(w, r)
	if !ok {
		return
	}

	entry, err := h.queries.GetJournalEntryByID(r.Context(), id)
	if err != nil {
		writeQueryError(w, err, "journal entry not found", "failed to get journal entry")
		return
	}

	writeJSON(w, http.StatusOK, entry)
}

func (h *RouterHandlers) updateJournalEntry(w http.ResponseWriter, r *http.Request) {
	id, ok := parseIDParam(w, r)
	if !ok {
		return
	}

	var payload journalEntryRequest
	if !decodeAndValidate(w, r, &payload) {
		return
	}

	entryDate, ok := parseRequestDate(w, payload.EntryDate)
	if !ok {
		return
	}

	entry, err := h.queries.UpdateJournalEntry(r.Context(), trackerdb.UpdateJournalEntryParams{
		ID:        id,
		EntryDate: entryDate,
		Title:     payload.Title,
		Content:   payload.Content,
		Mood:      payload.Mood,
		Tags:      payload.Tags,
		IsPrivate: payload.IsPrivate,
	})
	if err != nil {
		writeQueryError(w, err, "journal entry not found", "failed to update journal entry")
		return
	}

	writeJSON(w, http.StatusOK, entry)
}

func (h *RouterHandlers) deleteJournalEntry(w http.ResponseWriter, r *http.Request) {
	id, ok := parseIDParam(w, r)
	if !ok {
		return
	}

	if err := h.queries.DeleteJournalEntry(r.Context(), id); err != nil {
		writeError(w, http.StatusInternalServerError, "failed to delete journal entry")
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
