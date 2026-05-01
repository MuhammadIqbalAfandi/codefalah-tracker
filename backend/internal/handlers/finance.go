package handlers

import (
	"math/big"
	"net/http"
	"strings"

	trackerdb "codefalah-tracker/backend/internal/db"
)

type financeTransactionRequest struct {
	TransactionDate string `json:"transaction_date" validate:"required"`
	TransactionType string `json:"transaction_type" validate:"required,oneof=income expense"`
	Category        string `json:"category" validate:"required,max=100"`
	Amount          string `json:"amount" validate:"required"`
	Notes           string `json:"notes" validate:"max=1000"`
}

func (h *RouterHandlers) listFinanceTransactions(w http.ResponseWriter, r *http.Request) {
	limit := parsePositiveInt32(r.URL.Query().Get("limit"), 25)
	if limit > 100 {
		limit = 100
	}

	transactions, err := h.queries.ListFinanceTransactions(r.Context(), trackerdb.ListFinanceTransactionsParams{
		Limit:  limit,
		Offset: parsePositiveInt32(r.URL.Query().Get("offset"), 0),
	})
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to list finance transactions")
		return
	}

	writeJSON(w, http.StatusOK, transactions)
}

func (h *RouterHandlers) createFinanceTransaction(w http.ResponseWriter, r *http.Request) {
	var payload financeTransactionRequest
	if !decodeAndValidate(w, r, &payload) {
		return
	}

	transactionDate, ok := parseRequestDate(w, payload.TransactionDate)
	if !ok {
		return
	}

	amount, ok := parsePositiveAmount(w, payload.Amount)
	if !ok {
		return
	}

	transaction, err := h.queries.CreateFinanceTransaction(r.Context(), trackerdb.CreateFinanceTransactionParams{
		TransactionDate: transactionDate,
		TransactionType: payload.TransactionType,
		Category:        payload.Category,
		Amount:          amount,
		Notes:           payload.Notes,
	})
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to create finance transaction")
		return
	}

	writeJSON(w, http.StatusCreated, transaction)
}

func (h *RouterHandlers) getFinanceTransaction(w http.ResponseWriter, r *http.Request) {
	id, ok := parseIDParam(w, r)
	if !ok {
		return
	}

	transaction, err := h.queries.GetFinanceTransactionByID(r.Context(), id)
	if err != nil {
		writeQueryError(w, err, "finance transaction not found", "failed to get finance transaction")
		return
	}

	writeJSON(w, http.StatusOK, transaction)
}

func (h *RouterHandlers) updateFinanceTransaction(w http.ResponseWriter, r *http.Request) {
	id, ok := parseIDParam(w, r)
	if !ok {
		return
	}

	var payload financeTransactionRequest
	if !decodeAndValidate(w, r, &payload) {
		return
	}

	transactionDate, ok := parseRequestDate(w, payload.TransactionDate)
	if !ok {
		return
	}

	amount, ok := parsePositiveAmount(w, payload.Amount)
	if !ok {
		return
	}

	transaction, err := h.queries.UpdateFinanceTransaction(r.Context(), trackerdb.UpdateFinanceTransactionParams{
		ID:              id,
		TransactionDate: transactionDate,
		TransactionType: payload.TransactionType,
		Category:        payload.Category,
		Amount:          amount,
		Notes:           payload.Notes,
	})
	if err != nil {
		writeQueryError(w, err, "finance transaction not found", "failed to update finance transaction")
		return
	}

	writeJSON(w, http.StatusOK, transaction)
}

func (h *RouterHandlers) deleteFinanceTransaction(w http.ResponseWriter, r *http.Request) {
	id, ok := parseIDParam(w, r)
	if !ok {
		return
	}

	if _, err := h.queries.GetFinanceTransactionByID(r.Context(), id); err != nil {
		writeQueryError(w, err, "finance transaction not found", "failed to get finance transaction")
		return
	}

	if err := h.queries.DeleteFinanceTransaction(r.Context(), id); err != nil {
		writeError(w, http.StatusInternalServerError, "failed to delete finance transaction")
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func parsePositiveAmount(w http.ResponseWriter, value string) (string, bool) {
	amount := strings.TrimSpace(value)
	if amount == "" {
		writeError(w, http.StatusBadRequest, "amount is required")
		return "", false
	}

	parsed, ok := new(big.Rat).SetString(amount)
	if !ok || parsed.Sign() <= 0 {
		writeError(w, http.StatusBadRequest, "amount must be a positive decimal")
		return "", false
	}

	return amount, true
}
