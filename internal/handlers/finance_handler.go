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

const financeDateLayout = "2006-01-02"

type FinanceHandler struct {
	service *services.FinanceService
}

type createFinanceRequest struct {
	TransactionDate string `json:"transaction_date" validate:"required"`
	TransactionType string `json:"transaction_type" validate:"required"`
	Category        string `json:"category" validate:"required"`
	Amount          int64  `json:"amount" validate:"required"`
	Notes           string `json:"notes"`
}

type updateFinanceRequest struct {
	TransactionDate string `json:"transaction_date" validate:"required"`
	TransactionType string `json:"transaction_type" validate:"required"`
	Category        string `json:"category" validate:"required"`
	Amount          int64  `json:"amount" validate:"required"`
	Notes           string `json:"notes"`
}

func NewFinanceHandler(service *services.FinanceService) *FinanceHandler {
	return &FinanceHandler{service: service}
}

func (h *FinanceHandler) List(w http.ResponseWriter, r *http.Request) {
	records, err := h.service.List(r.Context())
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to list finance transactions")
		return
	}

	writeJSON(w, http.StatusOK, records)
}

func (h *FinanceHandler) GetByID(w http.ResponseWriter, r *http.Request) {
	id, ok := parseFinanceIDParam(w, r)
	if !ok {
		return
	}

	record, err := h.service.GetByID(r.Context(), id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			writeError(w, http.StatusNotFound, "finance transaction not found")
			return
		}

		writeError(w, http.StatusInternalServerError, "failed to get finance transaction")
		return
	}

	writeJSON(w, http.StatusOK, record)
}

func (h *FinanceHandler) Create(w http.ResponseWriter, r *http.Request) {
	var req createFinanceRequest
	if err := decodeJSON(r, &req); err != nil {
		writeError(w, http.StatusBadRequest, err.Error())
		return
	}

	if details := validateRequest(req); details != nil {
		writeValidationError(w, details)
		return
	}

	transactionDate, err := time.Parse(financeDateLayout, req.TransactionDate)
	if err != nil {
		writeError(w, http.StatusBadRequest, "transaction_date must use YYYY-MM-DD format")
		return
	}

	record, err := h.service.Create(r.Context(), sqlc.CreateFinanceTransactionParams{
		TransactionDate: transactionDate,
		TransactionType: req.TransactionType,
		Category:        req.Category,
		Amount:          req.Amount,
		Notes:           req.Notes,
	})
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to create finance transaction")
		return
	}

	writeJSON(w, http.StatusCreated, record)
}

func (h *FinanceHandler) UpdateByID(w http.ResponseWriter, r *http.Request) {
	id, ok := parseFinanceIDParam(w, r)
	if !ok {
		return
	}

	var req updateFinanceRequest
	if err := decodeJSON(r, &req); err != nil {
		writeError(w, http.StatusBadRequest, err.Error())
		return
	}

	if details := validateRequest(req); details != nil {
		writeValidationError(w, details)
		return
	}

	transactionDate, err := time.Parse(financeDateLayout, req.TransactionDate)
	if err != nil {
		writeError(w, http.StatusBadRequest, "transaction_date must use YYYY-MM-DD format")
		return
	}

	record, err := h.service.Update(r.Context(), sqlc.UpdateFinanceTransactionParams{
		ID:              id,
		TransactionDate: transactionDate,
		TransactionType: req.TransactionType,
		Category:        req.Category,
		Amount:          req.Amount,
		Notes:           req.Notes,
	})
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			writeError(w, http.StatusNotFound, "finance transaction not found")
			return
		}

		writeError(w, http.StatusInternalServerError, "failed to update finance transaction")
		return
	}

	writeJSON(w, http.StatusOK, record)
}

func (h *FinanceHandler) DeleteByID(w http.ResponseWriter, r *http.Request) {
	id, ok := parseFinanceIDParam(w, r)
	if !ok {
		return
	}

	if err := h.service.Delete(r.Context(), id); err != nil {
		writeError(w, http.StatusInternalServerError, "failed to delete finance transaction")
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func parseFinanceIDParam(w http.ResponseWriter, r *http.Request) (int64, bool) {
	id, err := strconv.ParseInt(chi.URLParam(r, "id"), 10, 64)
	if err != nil || id <= 0 {
		writeError(w, http.StatusBadRequest, "id must be a positive integer")
		return 0, false
	}

	return id, true
}
