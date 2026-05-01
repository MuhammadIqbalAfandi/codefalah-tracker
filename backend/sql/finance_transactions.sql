-- name: CreateFinanceTransaction :one
INSERT INTO finance_transactions (
  transaction_date,
  transaction_type,
  category,
  amount,
  notes
) VALUES (
  $1, $2, $3, $4, $5
)
RETURNING *;

-- name: ListFinanceTransactions :many
SELECT *
FROM finance_transactions
ORDER BY transaction_date DESC, id DESC
LIMIT $1 OFFSET $2;

-- name: GetFinanceTransactionByID :one
SELECT *
FROM finance_transactions
WHERE id = $1;

-- name: UpdateFinanceTransaction :one
UPDATE finance_transactions
SET
  transaction_date = $2,
  transaction_type = $3,
  category = $4,
  amount = $5,
  notes = $6,
  updated_at = now()
WHERE id = $1
RETURNING *;

-- name: DeleteFinanceTransaction :exec
DELETE FROM finance_transactions
WHERE id = $1;

-- name: GetMonthlyFinanceSummary :one
SELECT
  COALESCE(SUM(amount) FILTER (WHERE transaction_type = 'income'), 0)::numeric(14, 2) AS income,
  COALESCE(SUM(amount) FILTER (WHERE transaction_type = 'expense'), 0)::numeric(14, 2) AS expense
FROM finance_transactions
WHERE transaction_date >= $1
  AND transaction_date < $2;
