package db

import (
	"database/sql"
	"errors"

	"codefalah-tracker/pkg/config"
)

func Open(cfg config.Config) (*sql.DB, error) {
	if cfg.DatabaseURL == "" {
		return nil, errors.New("database url is required")
	}

	return sql.Open("postgres", cfg.DatabaseURL)
}
