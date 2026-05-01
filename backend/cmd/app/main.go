package main

import (
	"context"
	"errors"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	trackerdb "codefalah-tracker/backend/internal/db"
	"codefalah-tracker/backend/internal/handlers"
	"codefalah-tracker/backend/pkg/config"
	"codefalah-tracker/backend/pkg/logger"
)

func main() {
	cfg := config.Load()
	log := logger.New()

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	database, err := trackerdb.Open(ctx, cfg.DatabaseURL)
	if err != nil {
		log.Error("database connection failed", slog.Any("error", err))
		os.Exit(1)
	}
	defer database.Close()

	server := &http.Server{
		Addr:         cfg.Addr,
		Handler:      handlers.NewRouter(log, trackerdb.New(database)),
		ReadTimeout:  cfg.ReadTimeout,
		WriteTimeout: cfg.WriteTimeout,
		IdleTimeout:  cfg.IdleTimeout,
	}

	go func() {
		log.Info("starting server", slog.String("addr", cfg.Addr))
		if err := server.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			log.Error("server stopped unexpectedly", slog.Any("error", err))
			os.Exit(1)
		}
	}()

	shutdownCtx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	<-shutdownCtx.Done()
	log.Info("shutting down server")

	shutdownTimeoutCtx, shutdownCancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer shutdownCancel()

	if err := server.Shutdown(shutdownTimeoutCtx); err != nil {
		log.Error("server shutdown failed", slog.Any("error", err))
		os.Exit(1)
	}
}
