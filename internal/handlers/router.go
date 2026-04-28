package handlers

import (
	"net/http"

	"github.com/go-chi/chi/v5"
)

type RouterHandlers struct {
	Sholat       *SholatHandler
	Puasa        *PuasaHandler
	Finance      *FinanceHandler
	Sport        *SportHandler
	Journal      *JournalHandler
	Dashboard    *DashboardHandler
	Contribution *ContributionHandler
}

func NewRouter(handlers RouterHandlers) http.Handler {
	router := chi.NewRouter()
	router.Get("/health", handleHealth)
	router.Route("/api", func(router chi.Router) {
		router.Get("/dashboard/summary", handlers.Dashboard.GetSummary)
		router.Get("/dashboard/contribution-graph", handlers.Contribution.GetGraph)

		router.Route("/sholat-records", func(router chi.Router) {
			router.Get("/", handlers.Sholat.List)
			router.Post("/", handlers.Sholat.Create)
			router.Get("/{date}", handlers.Sholat.GetByDate)
			router.Put("/{date}", handlers.Sholat.UpdateByDate)
			router.Delete("/{date}", handlers.Sholat.DeleteByDate)
		})

		router.Route("/puasa-records", func(router chi.Router) {
			router.Get("/", handlers.Puasa.List)
			router.Post("/", handlers.Puasa.Create)
			router.Get("/{date}", handlers.Puasa.GetByDate)
			router.Put("/{date}", handlers.Puasa.UpdateByDate)
			router.Delete("/{date}", handlers.Puasa.DeleteByDate)
		})

		router.Route("/finance-transactions", func(router chi.Router) {
			router.Get("/", handlers.Finance.List)
			router.Post("/", handlers.Finance.Create)
			router.Get("/{id}", handlers.Finance.GetByID)
			router.Put("/{id}", handlers.Finance.UpdateByID)
			router.Delete("/{id}", handlers.Finance.DeleteByID)
		})

		router.Route("/sport-records", func(router chi.Router) {
			router.Get("/", handlers.Sport.List)
			router.Post("/", handlers.Sport.Create)
			router.Get("/{id}", handlers.Sport.GetByID)
			router.Put("/{id}", handlers.Sport.UpdateByID)
			router.Delete("/{id}", handlers.Sport.DeleteByID)
		})

		router.Route("/journal-entries", func(router chi.Router) {
			router.Get("/", handlers.Journal.List)
			router.Post("/", handlers.Journal.Create)
			router.Get("/{date}", handlers.Journal.GetByDate)
			router.Put("/{date}", handlers.Journal.UpdateByDate)
			router.Delete("/{date}", handlers.Journal.DeleteByDate)
		})
	})

	return router
}
