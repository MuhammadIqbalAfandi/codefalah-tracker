package services

import (
	"context"
	"time"

	sqlc "codefalah-tracker/sql/generated"
)

type SholatService struct {
	queries *sqlc.Queries
}

func NewSholatService(queries *sqlc.Queries) *SholatService {
	return &SholatService{queries: queries}
}

func (s *SholatService) GetByDate(ctx context.Context, recordDate time.Time) (sqlc.SholatRecord, error) {
	return s.queries.GetSholatRecordByDate(ctx, recordDate)
}

func (s *SholatService) List(ctx context.Context) ([]sqlc.SholatRecord, error) {
	return s.queries.ListSholatRecords(ctx)
}

func (s *SholatService) Create(ctx context.Context, params sqlc.CreateSholatRecordParams) (sqlc.SholatRecord, error) {
	return s.queries.CreateSholatRecord(ctx, params)
}

func (s *SholatService) Update(ctx context.Context, params sqlc.UpdateSholatRecordParams) (sqlc.SholatRecord, error) {
	return s.queries.UpdateSholatRecord(ctx, params)
}

func (s *SholatService) DeleteByDate(ctx context.Context, recordDate time.Time) error {
	return s.queries.DeleteSholatRecordByDate(ctx, recordDate)
}
