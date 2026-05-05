package handlers

import (
	"log/slog"
	"net/http"
	"time"

	trackerdb "codefalah-tracker/backend/internal/db"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

type RouterHandlers struct {
	logger  *slog.Logger
	queries *trackerdb.Queries
}

func NewRouter(
	logger *slog.Logger,
	queries *trackerdb.Queries,
	allowedOrigins ...string,
) http.Handler {
	routerHandlers := &RouterHandlers{
		logger:  logger,
		queries: queries,
	}

	r := chi.NewRouter()
	r.Use(middleware.RequestID)
	r.Use(middleware.RealIP)
	r.Use(middleware.Recoverer)
	r.Use(corsMiddleware(allowedOrigins))

	r.Options("/*", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusNoContent)
	})

	r.Get("/health", routerHandlers.health)
	r.Route("/api/sholat-records", func(r chi.Router) {
		r.Get("/", routerHandlers.listSholatRecords)
		r.Post("/", routerHandlers.createSholatRecord)
		r.Get("/{id}", routerHandlers.getSholatRecord)
		r.Put("/{id}", routerHandlers.updateSholatRecord)
		r.Delete("/{id}", routerHandlers.deleteSholatRecord)
	})
	r.Route("/api/puasa-records", func(r chi.Router) {
		r.Get("/", routerHandlers.listPuasaRecords)
		r.Post("/", routerHandlers.createPuasaRecord)
		r.Get("/{id}", routerHandlers.getPuasaRecord)
		r.Put("/{id}", routerHandlers.updatePuasaRecord)
		r.Delete("/{id}", routerHandlers.deletePuasaRecord)
	})
	r.Route("/api/finance-transactions", func(r chi.Router) {
		r.Get("/", routerHandlers.listFinanceTransactions)
		r.Post("/", routerHandlers.createFinanceTransaction)
		r.Get("/{id}", routerHandlers.getFinanceTransaction)
		r.Put("/{id}", routerHandlers.updateFinanceTransaction)
		r.Delete("/{id}", routerHandlers.deleteFinanceTransaction)
	})
	r.Route("/api/sport-records", func(r chi.Router) {
		r.Get("/", routerHandlers.listSportRecords)
		r.Post("/", routerHandlers.createSportRecord)
		r.Get("/{id}", routerHandlers.getSportRecord)
		r.Put("/{id}", routerHandlers.updateSportRecord)
		r.Delete("/{id}", routerHandlers.deleteSportRecord)
	})
	r.Route("/api/journal-entries", func(r chi.Router) {
		r.Get("/", routerHandlers.listJournalEntries)
		r.Post("/", routerHandlers.createJournalEntry)
		r.Get("/{id}", routerHandlers.getJournalEntry)
		r.Put("/{id}", routerHandlers.updateJournalEntry)
		r.Delete("/{id}", routerHandlers.deleteJournalEntry)
	})
	r.Get("/api/dashboard/summary", routerHandlers.getDashboardSummary)
	r.Get("/api/dashboard/contribution-graph", routerHandlers.getContributionGraph)
	r.Get("/api/dashboard/module-contributions", routerHandlers.getModuleContributions)

	return r
}

func corsMiddleware(origins []string) func(http.Handler) http.Handler {
	allowedOrigins := allowedOriginsSet(origins)

	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS")
			w.Header().Set("Access-Control-Allow-Headers", "Content-Type,Authorization")
			w.Header().Set("Vary", "Origin")

			origin := r.Header.Get("Origin")
			if origin != "" && allowedOrigins[origin] {
				w.Header().Set("Access-Control-Allow-Origin", origin)
			}

			if r.Method == http.MethodOptions {
				if origin != "" && !allowedOrigins[origin] {
					w.WriteHeader(http.StatusForbidden)
					return
				}

				w.WriteHeader(http.StatusNoContent)
				return
			}

			next.ServeHTTP(w, r)
		})
	}
}

func allowedOriginsSet(origins []string) map[string]bool {
	allowedOrigins := make(map[string]bool)
	for _, origin := range origins {
		if origin == "" {
			continue
		}

		allowedOrigins[origin] = true
	}

	return allowedOrigins
}

func (h *RouterHandlers) health(w http.ResponseWriter, r *http.Request) {
	writeJSON(w, http.StatusOK, map[string]string{
		"status": "ok",
		"time":   time.Now().UTC().Format(time.RFC3339),
	})
}
