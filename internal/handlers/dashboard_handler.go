package handlers

import (
	"errors"
	"net/http"
	"time"

	"codefalah-tracker/internal/services"
)

const dashboardDateLayout = "2006-01-02"

type DashboardHandler struct {
	service *services.DashboardService
}

func NewDashboardHandler(service *services.DashboardService) *DashboardHandler {
	return &DashboardHandler{service: service}
}

func (h *DashboardHandler) GetSummary(w http.ResponseWriter, r *http.Request) {
	recordDate, err := parseDashboardDate(r)
	if err != nil {
		writeError(w, http.StatusBadRequest, err.Error())
		return
	}

	summary, err := h.service.GetSummary(r.Context(), recordDate)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to get dashboard summary")
		return
	}

	writeJSON(w, http.StatusOK, summary)
}

func parseDashboardDate(r *http.Request) (time.Time, error) {
	dateValue := r.URL.Query().Get("date")
	if dateValue == "" {
		now := time.Now()
		return time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, now.Location()), nil
	}

	recordDate, err := time.Parse(dashboardDateLayout, dateValue)
	if err != nil {
		return time.Time{}, errors.New("date must use YYYY-MM-DD format")
	}

	return recordDate, nil
}
