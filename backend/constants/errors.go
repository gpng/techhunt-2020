package constants

// 0xx - General errors
const (
	ErrNotImplemented = 000
)

// 3xx - Authorization errors
const (
	ErrMissingToken          = 300
	ErrInvalidToken          = 301
	ErrInvalidInvitationCode = 302
	ErrUsernameExists        = 303
	ErrPasswordHashFailed    = 304
	ErrInvalidPassword       = 305
	ErrCreateTokenFailed     = 306
)

// 1xx - DB error
const (
	ErrDbConn           = 100
	ErrDbNoRowsReturned = 101
	ErrDbLookupFailed   = 102
	ErrDbCreateFailed   = 103
	ErrDbUpdateFailed   = 104
	ErrDbDeleteFailed   = 105

	ErrDbCacheLookupFailed = 110
	ErrDbCacheSetFailed    = 111
)

// 4xx - User request (validation) error
const (
	ErrRequestBadJSON          = 400
	ErrRequestValidationFailed = 401
	ErrMissingParam            = 402
	ErrDuplicateResource       = 403
	ErrInvalidImage            = 404
	ErrRequestBadFormData      = 405
	ErrInvalidFile             = 406
	ErrInvalidFileType         = 407
	ErrResourceNotFound        = 408
	ErrInvalidParam            = 409
)

// 5xx - Internal Error
const (
	ErrInternalServerError  = 500
	ErrUnauthorizedResource = 501
	ErrServerBusy           = 502
)

// 6xx - 3rd party error
const (
	ErrS3UploadFailed = 601
)

// 10xx - upload csv specific errors
const (
	ErrCsvInvalid = 1001
)

// error strings for checking for specific errors
const (
	ErrStringDbDuplicateEmployeeLogin = "pq: duplicate key value violates unique constraint \"employees_login_key\""
	ErrStringDbDeleteNoPK             = "Primary key required for delete"
)

// error strings for search params
const (
	ErrStringSearchMissingParams    = "missing params"
	ErrStringSearchInvalidSort      = "sort must be in the form +param (eg +name, -salary)"
	ErrStringSearchInvalidMinSalary = "minSalary must be a number greater or equal to 0"
	ErrStringSearchInvalidMaxSalary = "maxSalary must be a number greater or equal to 0, and greater than minSalary"
	ErrStringSearchInvalidOffset    = "offset must be a number greater or equal to 0"
	ErrStringSearchInvalidLimit     = "limit must be a number between 0 and 30"
)

// error strings for uploaded csv
const (
	ErrStringCsvNoData           = "No data found in csv"
	ErrStringCsvIncorrectColumns = "Incorrect number of columns found"
	ErrStringCsvInvalidSalary    = "Invalid salary found"
	ErrStringsCsvUploading       = "Another upload is taking place"
)
