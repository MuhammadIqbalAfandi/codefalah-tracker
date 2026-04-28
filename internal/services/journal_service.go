package services

import (
	"context"
	"time"

	sqlc "codefalah-tracker/sql/generated"
)

type JournalService struct {
	queries *sqlc.Queries
}

func NewJournalService(queries *sqlc.Queries) *JournalService {
	return &JournalService{queries: queries}
}

func (s *JournalService) GetByDate(ctx context.Context, entryDate time.Time) (sqlc.JournalEntry, error) {
	return s.queries.GetJournalEntryByDate(ctx, entryDate)
}

func (s *JournalService) List(ctx context.Context) ([]sqlc.JournalEntry, error) {
	return s.queries.ListJournalEntries(ctx)
}

func (s *JournalService) Create(ctx context.Context, params sqlc.CreateJournalEntryParams) (sqlc.JournalEntry, error) {
	return s.queries.CreateJournalEntry(ctx, params)
}

func (s *JournalService) Update(ctx context.Context, params sqlc.UpdateJournalEntryParams) (sqlc.JournalEntry, error) {
	return s.queries.UpdateJournalEntry(ctx, params)
}

func (s *JournalService) DeleteByDate(ctx context.Context, entryDate time.Time) error {
	return s.queries.DeleteJournalEntryByDate(ctx, entryDate)
}
