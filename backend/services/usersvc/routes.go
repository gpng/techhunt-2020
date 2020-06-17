package usersvc

import (
	"github.com/go-chi/chi"
)

// Routes for app
func (s *Service) Routes() chi.Router {
	router := chi.NewRouter()

	router.Get("/", s.handleStatus())

	router.Post("/upload", s.handleUpload())

	return router
}
