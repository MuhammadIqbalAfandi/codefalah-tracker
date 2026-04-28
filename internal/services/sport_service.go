package services

import (
	"context"

	sqlc "codefalah-tracker/sql/generated"
)

type SportService struct {
	queries *sqlc.Queries
}

func NewSportService(queries *sqlc.Queries) *SportService {
	return &SportService{queries: queries}
}

func (s *SportService) GetByID(ctx context.Context, id int64) (sqlc.SportRecord, error) {
	return s.queries.GetSportRecordByID(ctx, id)
}

func (s *SportService) List(ctx context.Context) ([]sqlc.SportRecord, error) {
	return s.queries.ListSportRecords(ctx)
}

func (s *SportService) Create(ctx context.Context, params sqlc.CreateSportRecordParams) (sqlc.SportRecord, error) {
	return s.queries.CreateSportRecord(ctx, params)
}

func (s *SportService) Update(ctx context.Context, params sqlc.UpdateSportRecordParams) (sqlc.SportRecord, error) {
	return s.queries.UpdateSportRecord(ctx, params)
}

func (s *SportService) Delete(ctx context.Context, id int64) error {
	return s.queries.DeleteSportRecord(ctx, id)
}
