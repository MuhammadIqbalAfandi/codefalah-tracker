package handlers

import (
	"errors"
	"net/http"
	"time"

	"codefalah-tracker/internal/services"
)

const contributionDateLayout = "2006-01-02"

type ContributionHandler struct {
	service *services.ContributionService
}

func NewContributionHandler(service *services.ContributionService) *ContributionHandler {
	return &ContributionHandler{service: service}
}

func (h *ContributionHandler) GetGraph(w http.ResponseWriter, r *http.Request) {
	startDate, endDate, err := parseContributionRange(r)
	if err != nil {
		writeError(w, http.StatusBadRequest, err.Error())
		return
	}

	graph, err := h.service.GetGraph(r.Context(), startDate, endDate)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to get contribution graph")
		return
	}

	writeJSON(w, http.StatusOK, graph)
}

func parseContributionRange(r *http.Request) (time.Time, time.Time, error) {
	startValue := r.URL.Query().Get("start_date")
	endValue := r.URL.Query().Get("end_date")

	if startValue == "" && endValue == "" {
		now := time.Now()
		endDate := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, now.Location())
		startDate := endDate.AddDate(0, 0, -29)
		return startDate, endDate, nil
	}

	if startValue == "" || endValue == "" {
		return time.Time{}, time.Time{}, errors.New("start_date and end_date must both be provided")
	}

	startDate, err := time.Parse(contributionDateLayout, startValue)
	if err != nil {
		return time.Time{}, time.Time{}, errors.New("start_date must use YYYY-MM-DD format")
	}

	endDate, err := time.Parse(contributionDateLayout, endValue)
	if err != nil {
		return time.Time{}, time.Time{}, errors.New("end_date must use YYYY-MM-DD format")
	}

	if endDate.Before(startDate) {
		return time.Time{}, time.Time{}, errors.New("end_date must be on or after start_date")
	}

	return startDate, endDate, nil
}
