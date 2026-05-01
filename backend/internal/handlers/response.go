package handlers

import (
	"encoding/json"
	"errors"
	"net/http"
	"reflect"
	"strings"

	"github.com/go-playground/validator/v10"
	"github.com/jackc/pgx/v5/pgconn"
)

type errorResponse struct {
	Error string `json:"error"`
}

func writeJSON(w http.ResponseWriter, status int, payload any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)

	if err := json.NewEncoder(w).Encode(payload); err != nil {
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
	}
}

func writeError(w http.ResponseWriter, status int, message string) {
	writeJSON(w, status, errorResponse{Error: message})
}

func writeCreateRecordError(w http.ResponseWriter, err error, duplicateMessage string, fallbackMessage string) {
	var pgError *pgconn.PgError
	if errors.As(err, &pgError) && pgError.Code == "23505" {
		writeError(w, http.StatusConflict, duplicateMessage)
		return
	}

	writeError(w, http.StatusInternalServerError, fallbackMessage)
}

func decodeJSON(r *http.Request, payload any) error {
	decoder := json.NewDecoder(r.Body)
	decoder.DisallowUnknownFields()

	if err := decoder.Decode(payload); err != nil {
		return err
	}

	if decoder.More() {
		return errors.New("request body must contain a single JSON object")
	}

	return nil
}

func writeValidationError(w http.ResponseWriter, err error, payload any) {
	var validationErrors validator.ValidationErrors
	if errors.As(err, &validationErrors) {
		writeError(w, http.StatusBadRequest, describeValidationError(validationErrors[0], payload))
		return
	}

	writeError(w, http.StatusBadRequest, "request validation failed")
}

func describeValidationError(validationError validator.FieldError, payload any) string {
	fieldName := jsonFieldName(payload, validationError.StructField())

	switch validationError.Tag() {
	case "required":
		return fieldName + " is required"
	case "max":
		return fieldName + " must be at most " + validationError.Param() + " characters"
	case "min":
		return fieldName + " must be at least " + validationError.Param()
	case "oneof":
		return fieldName + " must be one of: " + strings.ReplaceAll(validationError.Param(), " ", ", ")
	default:
		return fieldName + " is invalid"
	}
}

func jsonFieldName(payload any, structField string) string {
	payloadType := reflect.TypeOf(payload)
	if payloadType == nil {
		return strings.ToLower(structField)
	}

	if payloadType.Kind() == reflect.Ptr {
		payloadType = payloadType.Elem()
	}

	if payloadType.Kind() != reflect.Struct {
		return strings.ToLower(structField)
	}

	field, ok := payloadType.FieldByName(structField)
	if !ok {
		return strings.ToLower(structField)
	}

	jsonTag := field.Tag.Get("json")
	if jsonTag == "" {
		return strings.ToLower(structField)
	}

	name := strings.Split(jsonTag, ",")[0]
	if name == "" || name == "-" {
		return strings.ToLower(structField)
	}

	return name
}
