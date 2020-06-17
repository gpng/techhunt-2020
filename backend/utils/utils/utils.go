package utils

import (
	"log"
	"mime/multipart"
	"net/http"
	"runtime"

	"golang.org/x/crypto/bcrypt"
)

// ContextKey is the unique key that represents a context value
type ContextKey string

func (c ContextKey) String() string {
	return "context key " + string(c)
}

// HashPassword will generate a bcrypt hash
func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	return string(bytes), err
}

// CheckPasswordHash will compare bcrypt hash with password
func CheckPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

// GetMimeType from file
func GetMimeType(file multipart.File) (string, error) {
	fileHeader := make([]byte, 512)
	if _, err := file.Read(fileHeader); err != nil {
		return "", err
	}

	if _, err := file.Seek(0, 0); err != nil {
		return "", err
	}

	return http.DetectContentType(fileHeader), nil
}

// NewTrue initialises a true bool in memory and returns the address
// for use in struct bool pointers
func NewTrue() *bool {
	b := true
	return &b
}

// IsStringInSlice to check if string present in slice of strings
func IsStringInSlice(str string, list []string) bool {
	for _, s := range list {
		if s == str {
			return true
		}
	}
	return false
}

// LogError to console
func LogError(err error) {
	// get function caller name
	pc, file, line, ok := runtime.Caller(1)
	details := runtime.FuncForPC(pc)
	if ok && details != nil {
		log.Printf("%s:%d:%s failed with error: %v", file, line, details.Name(), err)
	}
}
