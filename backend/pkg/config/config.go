package config

import (
	"os"
	"strconv"
	"strings"
	"time"
)

type Config struct {
	Addr               string
	DatabaseURL        string
	CORSAllowedOrigins []string
	ReadTimeout        time.Duration
	WriteTimeout       time.Duration
	IdleTimeout        time.Duration
}

func Load() Config {
	loadDotEnvFiles(".env", "backend/.env")

	return Config{
		Addr:        getEnv("HTTP_ADDR", ":8080"),
		DatabaseURL: getEnv("DATABASE_URL", "postgres://admin:secret@localhost:5432/codefalah_tracker?sslmode=disable"),
		CORSAllowedOrigins: getListEnv("CORS_ALLOWED_ORIGINS", []string{
			"http://localhost:3000",
			"http://127.0.0.1:3000",
			"http://localhost:5173",
			"http://127.0.0.1:5173",
		}),
		ReadTimeout:  getDurationEnv("HTTP_READ_TIMEOUT", 5*time.Second),
		WriteTimeout: getDurationEnv("HTTP_WRITE_TIMEOUT", 10*time.Second),
		IdleTimeout:  getDurationEnv("HTTP_IDLE_TIMEOUT", 60*time.Second),
	}
}

func getEnv(key, fallback string) string {
	value := os.Getenv(key)
	if value == "" {
		return fallback
	}

	return value
}

func getDurationEnv(key string, fallback time.Duration) time.Duration {
	value := os.Getenv(key)
	if value == "" {
		return fallback
	}

	seconds, err := strconv.Atoi(value)
	if err != nil || seconds <= 0 {
		return fallback
	}

	return time.Duration(seconds) * time.Second
}

func getListEnv(key string, fallback []string) []string {
	value := os.Getenv(key)
	if strings.TrimSpace(value) == "" {
		return fallback
	}

	values := make([]string, 0)
	for _, item := range strings.Split(value, ",") {
		trimmedItem := strings.TrimSpace(item)
		if trimmedItem == "" {
			continue
		}

		values = append(values, trimmedItem)
	}

	if len(values) == 0 {
		return fallback
	}

	return values
}
