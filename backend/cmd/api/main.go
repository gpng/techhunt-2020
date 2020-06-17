// @title TechHunt 2020 Backend
// @version 0.0.1
// @description REST API for TechHunt2020 Task - HR Employee Salary Management

// @contact.name Developers
// @contact.email geraldpng@gmail.com

// @host localhost:4000
// @BasePath /
package main

import (
	"log"
	"net/http"

	"github.com/gpng/techhunt-2020/backend/config"
	"github.com/gpng/techhunt-2020/backend/connections/database"
	"github.com/gpng/techhunt-2020/backend/services/usersvc"
	rr "github.com/gpng/techhunt-2020/backend/utils/render"
	u "github.com/gpng/techhunt-2020/backend/utils/utils"
	vr "github.com/gpng/techhunt-2020/backend/utils/validator"

	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
	"github.com/go-chi/cors"
	httpSwagger "github.com/swaggo/http-swagger"

	_ "github.com/gpng/techhunt-2020/backend/docs"

	"go.uber.org/zap"
)

func main() {
	appConfig := config.New()

	// initialise utils
	validator := vr.New()

	// initialise logger
	loggerConfig := zap.Config{
		Level:       zap.NewAtomicLevelAt(zap.InfoLevel),
		Development: false,
		Sampling: &zap.SamplingConfig{
			Initial:    100,
			Thereafter: 100,
		},
		Encoding:          "json",
		EncoderConfig:     zap.NewProductionEncoderConfig(),
		DisableStacktrace: true,
		OutputPaths:       []string{"stderr"},
		ErrorOutputPaths:  []string{"stderr"},
	}
	logger, err := loggerConfig.Build(zap.AddStacktrace(zap.PanicLevel))
	if err != nil {
		log.Fatalf("Failed to initialise zap logger with err: %v", err)
	}
	defer logger.Sync()

	// initialise renderer to handle api response
	render := rr.New(logger)

	// initialise dependencies for service
	// postgres
	db, err := database.New(appConfig)
	if err != nil {
		u.LogError(err)
		return
	}

	usersService := usersvc.New(db, validator, render)

	// initialise main router with basic middlewares, cors settings etc
	router := mainRouter(appConfig.Docs)

	// mount services
	router.Mount("/users", usersService.Routes())

	log.Println("Listening on port", appConfig.Server.Port)
	err = http.ListenAndServe(":"+appConfig.Server.Port, router)
	if err != nil {
		log.Print(err)
	}
}

func mainRouter(docs bool) chi.Router {
	router := chi.NewRouter()

	// A good base middleware stack
	router.Use(middleware.RequestID)
	router.Use(middleware.RealIP)
	router.Use(middleware.Logger)
	router.Use(middleware.Recoverer)

	c := cors.New(cors.Options{
		AllowedHeaders: []string{"*"},
		AllowedMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
	})
	router.Use(c.Handler)

	if docs {
		router.Get("/docs", func(w http.ResponseWriter, r *http.Request) {
			http.Redirect(w, r, "/docs/index.html", http.StatusMovedPermanently)
		})
		router.Get("/docs/*", httpSwagger.Handler())
		log.Println("API docs available at /docs")
	}

	// stop crawlers
	router.Get("/robots.txt", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("User-agent: *\nDisallow: /"))
	})

	return router
}
