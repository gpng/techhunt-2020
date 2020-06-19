package usersvc

import (
	"github.com/gpng/techhunt-2020/backend/utils/render"
	vr "github.com/gpng/techhunt-2020/backend/utils/validator"
	"github.com/jinzhu/gorm"
)

// Service struct
type Service struct {
	db          *gorm.DB
	validator   *vr.Validator
	render      *render.Render
	isUploading bool
}

// New service
func New(
	db *gorm.DB,
	validator *vr.Validator,
	render *render.Render,
) *Service {
	return &Service{
		db,
		validator,
		render,
		false,
	}
}
