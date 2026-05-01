package config

import (
	"os"
	"strconv"
	"time"
)

type Config struct {
	Addr         string
	DatabaseURL  string
	ReadTimeout  time.Duration
	WriteTimeout time.Duration
	IdleTimeout  time.Duration
}

func Load() Config {
	return Config{
		Addr:         getEnv("HTTP_ADDR", ":8080"),
		DatabaseURL:  getEnv("DATABASE_URL", "postgres://admin:secret@localhost:5432/codefalah_tracker?sslmode=disable"),
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
