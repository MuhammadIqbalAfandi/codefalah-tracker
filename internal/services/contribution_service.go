package services

import (
	"context"
	"time"

	sqlc "codefalah-tracker/sql/generated"
)

type ContributionService struct {
	queries *sqlc.Queries
}

type ContributionDay struct {
	Day            time.Time `json:"day"`
	CompletedCount int32     `json:"completed_count"`
}

type ContributionGraph struct {
	StartDate time.Time         `json:"start_date"`
	EndDate   time.Time         `json:"end_date"`
	Days      []ContributionDay `json:"days"`
}

func NewContributionService(queries *sqlc.Queries) *ContributionService {
	return &ContributionService{queries: queries}
}

func (s *ContributionService) GetGraph(ctx context.Context, startDate, endDate time.Time) (ContributionGraph, error) {
	rows, err := s.queries.GetContributionGraph(ctx, sqlc.GetContributionGraphParams{
		Column1: startDate,
		Column2: endDate,
	})
	if err != nil {
		return ContributionGraph{}, err
	}

	days := make([]ContributionDay, 0, len(rows))
	for _, row := range rows {
		days = append(days, ContributionDay{
			Day:            row.Day,
			CompletedCount: row.CompletedCount,
		})
	}

	return ContributionGraph{
		StartDate: startDate,
		EndDate:   endDate,
		Days:      days,
	}, nil
}
