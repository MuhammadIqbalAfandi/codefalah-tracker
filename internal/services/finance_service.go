package services

import (
	"context"

	sqlc "codefalah-tracker/sql/generated"
)

type FinanceService struct {
	queries *sqlc.Queries
}

func NewFinanceService(queries *sqlc.Queries) *FinanceService {
	return &FinanceService{queries: queries}
}

func (s *FinanceService) GetByID(ctx context.Context, id int64) (sqlc.FinanceTransaction, error) {
	return s.queries.GetFinanceTransactionByID(ctx, id)
}

func (s *FinanceService) List(ctx context.Context) ([]sqlc.FinanceTransaction, error) {
	return s.queries.ListFinanceTransactions(ctx)
}

func (s *FinanceService) Create(ctx context.Context, params sqlc.CreateFinanceTransactionParams) (sqlc.FinanceTransaction, error) {
	return s.queries.CreateFinanceTransaction(ctx, params)
}

func (s *FinanceService) Update(ctx context.Context, params sqlc.UpdateFinanceTransactionParams) (sqlc.FinanceTransaction, error) {
	return s.queries.UpdateFinanceTransaction(ctx, params)
}

func (s *FinanceService) Delete(ctx context.Context, id int64) error {
	return s.queries.DeleteFinanceTransaction(ctx, id)
}
