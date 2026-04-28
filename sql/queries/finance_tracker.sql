-- name: GetFinanceTransactionByID :one
SELECT
    id,
    transaction_date,
    transaction_type,
    category,
    amount,
    notes,
    created_at,
    updated_at
FROM finance_transactions
WHERE id = $1;

-- name: ListFinanceTransactions :many
SELECT
    id,
    transaction_date,
    transaction_type,
    category,
    amount,
    notes,
    created_at,
    updated_at
FROM finance_transactions
ORDER BY transaction_date DESC, id DESC;

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
RETURNING
    id,
    transaction_date,
    transaction_type,
    category,
    amount,
    notes,
    created_at,
    updated_at;

-- name: UpdateFinanceTransaction :one
UPDATE finance_transactions
SET
    transaction_date = $2,
    transaction_type = $3,
    category = $4,
    amount = $5,
    notes = $6,
    updated_at = NOW()
WHERE id = $1
RETURNING
    id,
    transaction_date,
    transaction_type,
    category,
    amount,
    notes,
    created_at,
    updated_at;

-- name: DeleteFinanceTransaction :exec
DELETE FROM finance_transactions
WHERE id = $1;
