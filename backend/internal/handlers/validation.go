package handlers

import "github.com/go-playground/validator/v10"

var validate = validator.New(validator.WithRequiredStructEnabled())

func validateRequest(payload any) error {
	return validate.Struct(payload)
}
