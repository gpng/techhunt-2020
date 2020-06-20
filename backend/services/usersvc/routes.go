package usersvc

import (
	"github.com/go-chi/chi"
)

// Routes for app
func (s *Service) Routes() chi.Router {
	router := chi.NewRouter()

	router.Get("/", s.handleSearch())

	router.Post("/upload", s.handleUpload())

	router.Delete("/{employeeID}", s.handleDeleteEmployee())

	return router
}
