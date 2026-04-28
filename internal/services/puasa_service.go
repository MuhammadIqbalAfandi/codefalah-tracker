package services

import (
	"context"
	"time"

	sqlc "codefalah-tracker/sql/generated"
)

type PuasaService struct {
	queries *sqlc.Queries
}

func NewPuasaService(queries *sqlc.Queries) *PuasaService {
	return &PuasaService{queries: queries}
}

func (s *PuasaService) GetByDate(ctx context.Context, recordDate time.Time) (sqlc.PuasaRecord, error) {
	return s.queries.GetPuasaRecordByDate(ctx, recordDate)
}

func (s *PuasaService) List(ctx context.Context) ([]sqlc.PuasaRecord, error) {
	return s.queries.ListPuasaRecords(ctx)
}

func (s *PuasaService) Create(ctx context.Context, params sqlc.CreatePuasaRecordParams) (sqlc.PuasaRecord, error) {
	return s.queries.CreatePuasaRecord(ctx, params)
}

func (s *PuasaService) Update(ctx context.Context, params sqlc.UpdatePuasaRecordParams) (sqlc.PuasaRecord, error) {
	return s.queries.UpdatePuasaRecord(ctx, params)
}

func (s *PuasaService) DeleteByDate(ctx context.Context, recordDate time.Time) error {
	return s.queries.DeletePuasaRecordByDate(ctx, recordDate)
}
