# Codefalah Tracker

## Project Overview

Codefalah Tracker is a personal modular tracking app with a Go backend, a React Router frontend, and a PostgreSQL database. It tracks five daily-life modules in one place:

- `sholat`
- `puasa`
- `keuangan`
- `olahraga`
- `jurnal`

The app also includes dashboard endpoints that aggregate daily, weekly, monthly, and yearly contribution data across those modules.

## Preview

### Dashboard

![Dashboard](docs/screenshots/dashboard.png)

## Architecture

### High-Level Flow

```text
Frontend (React Router v7)
  -> fetch JSON over HTTP
Backend API (Go + chi)
  -> sqlc query layer
PostgreSQL
```

### Folder and File Structure

```text
.
├── ai/                         # Feature workflow docs, issues, plans, tasks, logs, reviews
├── backend/
│   ├── cmd/app/main.go         # API entrypoint
│   ├── internal/
│   │   ├── db/                 # sqlc-generated queries and models
│   │   └── handlers/           # HTTP handlers and routing
│   ├── migrations/             # SQL schema migrations
│   ├── pkg/
│   │   ├── config/             # Env/config loading
│   │   └── logger/             # App logger
│   ├── sql/                    # Source SQL queries for sqlc
│   └── .env.example            # Backend env template
├── frontend/
│   ├── app/
│   │   ├── components/         # Shared UI components
│   │   ├── lib/                # Helpers, env access, date/localization utilities
│   │   ├── routes/             # Route modules
│   │   └── services/           # API client
│   ├── public/                 # Static assets
│   ├── .env.example            # Frontend env template
│   └── package.json            # Frontend scripts and dependencies
└── README.md
```

## File Naming Conventions

- Directories and frontend files use `kebab-case`, for example `dashboard.tsx` and `delete-confirmation.tsx`.
- Go packages use short lowercase names such as `config`, `logger`, `handlers`, and `db`.
- API paths use `kebab-case` plurals, for example `/api/sholat-records`.
- JSON fields use `snake_case`, for example `record_date`, `transaction_type`, and `created_at`.
- Database tables use `snake_case` plurals, for example `finance_transactions` and `journal_entries`.
- SQL query source files match their table or feature, for example `sholat_records.sql` and `dashboard.sql`.

## API Documentation

### Base URLs

- Backend local base URL: `http://localhost:8080`
- Frontend local base URL: `http://localhost:5173`

### Common Rules

- Request and response bodies are JSON.
- Dates use `YYYY-MM-DD`.
- List endpoints support `limit` and `offset`.
- `DELETE` endpoints return `204 No Content`.
- Error responses use this format:

```json
{
  "error": "message here"
}
```

### Health

| Method | Endpoint  | Description          |
| ------ | --------- | -------------------- |
| `GET`  | `/health` | Service health check |

Response:

```json
{
  "status": "ok",
  "time": "2026-05-05T09:30:00Z"
}
```

### Resource Endpoints

Each module supports the same CRUD pattern:

| Module     | List                            | Create                           | Detail                               | Update                               | Delete                                  |
| ---------- | ------------------------------- | -------------------------------- | ------------------------------------ | ------------------------------------ | --------------------------------------- |
| `sholat`   | `GET /api/sholat-records`       | `POST /api/sholat-records`       | `GET /api/sholat-records/{id}`       | `PUT /api/sholat-records/{id}`       | `DELETE /api/sholat-records/{id}`       |
| `puasa`    | `GET /api/puasa-records`        | `POST /api/puasa-records`        | `GET /api/puasa-records/{id}`        | `PUT /api/puasa-records/{id}`        | `DELETE /api/puasa-records/{id}`        |
| `keuangan` | `GET /api/finance-transactions` | `POST /api/finance-transactions` | `GET /api/finance-transactions/{id}` | `PUT /api/finance-transactions/{id}` | `DELETE /api/finance-transactions/{id}` |
| `olahraga` | `GET /api/sport-records`        | `POST /api/sport-records`        | `GET /api/sport-records/{id}`        | `PUT /api/sport-records/{id}`        | `DELETE /api/sport-records/{id}`        |
| `jurnal`   | `GET /api/journal-entries`      | `POST /api/journal-entries`      | `GET /api/journal-entries/{id}`      | `PUT /api/journal-entries/{id}`      | `DELETE /api/journal-entries/{id}`      |

### Dashboard Endpoints

| Method | Endpoint                              | Query Params             | Description                      |
| ------ | ------------------------------------- | ------------------------ | -------------------------------- |
| `GET`  | `/api/dashboard/summary`              | `date`                   | Daily summary across all modules |
| `GET`  | `/api/dashboard/contribution-graph`   | `start_date`, `end_date` | Aggregated contribution graph    |
| `GET`  | `/api/dashboard/module-contributions` | `start_date`, `end_date` | Contribution series per module   |

### Request and Response Examples

#### Create Sholat Record

Request:

```http
POST /api/sholat-records
Content-Type: application/json
```

```json
{
  "record_date": "2026-05-05",
  "subuh": true,
  "dzuhur": true,
  "ashar": false,
  "maghrib": true,
  "isya": true,
  "congregation_count": 3,
  "notes": "Masjid after work"
}
```

Response:

```json
{
  "id": 1,
  "record_date": "2026-05-05T00:00:00Z",
  "subuh": true,
  "dzuhur": true,
  "ashar": false,
  "maghrib": true,
  "isya": true,
  "congregation_count": 3,
  "notes": "Masjid after work",
  "created_at": "2026-05-05T09:00:00Z",
  "updated_at": "2026-05-05T09:00:00Z"
}
```

#### Create Finance Transaction

Request:

```json
{
  "transaction_date": "2026-05-05",
  "transaction_type": "expense",
  "category": "food",
  "amount": "25000.00",
  "notes": "Lunch"
}
```

Response:

```json
{
  "id": 12,
  "transaction_date": "2026-05-05T00:00:00Z",
  "transaction_type": "expense",
  "category": "food",
  "amount": "25000.00",
  "notes": "Lunch",
  "created_at": "2026-05-05T09:10:00Z",
  "updated_at": "2026-05-05T09:10:00Z"
}
```

#### Create Journal Entry

Request:

```json
{
  "entry_date": "2026-05-05",
  "title": "Shipping progress",
  "content": "Finished the dashboard polish work.",
  "mood": "focused",
  "tags": "work,tracker",
  "is_private": true
}
```

Response:

```json
{
  "id": 8,
  "entry_date": "2026-05-05T00:00:00Z",
  "title": "Shipping progress",
  "content": "Finished the dashboard polish work.",
  "mood": "focused",
  "tags": "work,tracker",
  "is_private": true,
  "created_at": "2026-05-05T09:20:00Z",
  "updated_at": "2026-05-05T09:20:00Z"
}
```

#### Dashboard Summary

Request:

```http
GET /api/dashboard/summary?date=2026-05-05
```

Response:

```json
{
  "date": "2026-05-05",
  "sholat": {
    "completed_count": 4,
    "total_count": 5
  },
  "puasa": {
    "fast_type": "sunnah",
    "completed": true
  },
  "finance": {
    "income": "1000000.00",
    "expense": "25000.00",
    "balance": "975000.00"
  },
  "sport": {
    "completed_count": 2,
    "completed_minutes": 90
  },
  "journal": {
    "written": true
  }
}
```

### Request Payload Reference

| Endpoint Group         | Required Fields                                              | Optional Fields                                                              |
| ---------------------- | ------------------------------------------------------------ | ---------------------------------------------------------------------------- |
| `sholat-records`       | `record_date` on create                                      | `subuh`, `dzuhur`, `ashar`, `maghrib`, `isya`, `congregation_count`, `notes` |
| `puasa-records`        | `record_date`, `fast_type` on create                         | `completed`, `sahur`, `iftar`, `notes`                                       |
| `finance-transactions` | `transaction_date`, `transaction_type`, `category`, `amount` | `notes`                                                                      |
| `sport-records`        | `record_date`, `sport_type`                                  | `duration_minutes`, `completed`, `notes`                                     |
| `journal-entries`      | `entry_date`, `title`, `content`                             | `mood`, `tags`, `is_private`                                                 |

## Database Schema

### Tables

#### `sholat_records`

| Column               | Type          | Notes                |
| -------------------- | ------------- | -------------------- |
| `id`                 | `BIGSERIAL`   | Primary key          |
| `record_date`        | `DATE`        | Unique per day       |
| `subuh`              | `BOOLEAN`     | Default `false`      |
| `dzuhur`             | `BOOLEAN`     | Default `false`      |
| `ashar`              | `BOOLEAN`     | Default `false`      |
| `maghrib`            | `BOOLEAN`     | Default `false`      |
| `isya`               | `BOOLEAN`     | Default `false`      |
| `congregation_count` | `INTEGER`     | `0..5`               |
| `notes`              | `TEXT`        | Default empty string |
| `created_at`         | `TIMESTAMPTZ` | Default `now()`      |
| `updated_at`         | `TIMESTAMPTZ` | Default `now()`      |

#### `puasa_records`

| Column        | Type          | Notes                |
| ------------- | ------------- | -------------------- |
| `id`          | `BIGSERIAL`   | Primary key          |
| `record_date` | `DATE`        | Unique per day       |
| `fast_type`   | `TEXT`        | Required             |
| `completed`   | `BOOLEAN`     | Default `false`      |
| `sahur`       | `BOOLEAN`     | Default `false`      |
| `iftar`       | `BOOLEAN`     | Default `false`      |
| `notes`       | `TEXT`        | Default empty string |
| `created_at`  | `TIMESTAMPTZ` | Default `now()`      |
| `updated_at`  | `TIMESTAMPTZ` | Default `now()`      |

#### `finance_transactions`

| Column             | Type            | Notes                 |
| ------------------ | --------------- | --------------------- |
| `id`               | `BIGSERIAL`     | Primary key           |
| `transaction_date` | `DATE`          | Indexed               |
| `transaction_type` | `TEXT`          | `income` or `expense` |
| `category`         | `TEXT`          | Required              |
| `amount`           | `NUMERIC(14,2)` | Must be positive      |
| `notes`            | `TEXT`          | Default empty string  |
| `created_at`       | `TIMESTAMPTZ`   | Default `now()`       |
| `updated_at`       | `TIMESTAMPTZ`   | Default `now()`       |

#### `sport_records`

| Column             | Type          | Notes                |
| ------------------ | ------------- | -------------------- |
| `id`               | `BIGSERIAL`   | Primary key          |
| `record_date`      | `DATE`        | Indexed              |
| `sport_type`       | `TEXT`        | Required             |
| `duration_minutes` | `INTEGER`     | Must be `>= 0`       |
| `completed`        | `BOOLEAN`     | Default `false`      |
| `notes`            | `TEXT`        | Default empty string |
| `created_at`       | `TIMESTAMPTZ` | Default `now()`      |
| `updated_at`       | `TIMESTAMPTZ` | Default `now()`      |

#### `journal_entries`

| Column       | Type          | Notes                |
| ------------ | ------------- | -------------------- |
| `id`         | `BIGSERIAL`   | Primary key          |
| `entry_date` | `DATE`        | Indexed              |
| `title`      | `TEXT`        | Required             |
| `content`    | `TEXT`        | Required             |
| `mood`       | `TEXT`        | Default empty string |
| `tags`       | `TEXT`        | Default empty string |
| `is_private` | `BOOLEAN`     | Default `true`       |
| `created_at` | `TIMESTAMPTZ` | Default `now()`      |
| `updated_at` | `TIMESTAMPTZ` | Default `now()`      |

### Relationships

- There are currently no foreign-key relationships between the five main tables.
- Cross-module relationships are handled at the query and dashboard aggregation layer.
- Dashboard data is derived from the module tables, not stored in a separate dashboard table.

## Setup and Installation

### Prerequisites

- Go `1.26.2`
- Node.js `22+`
- npm
- PostgreSQL

### 1. Clone and Install Dependencies

```bash
git clone <your-repo-url>
cd codefalah-tracker
cd backend && go mod download
cd ../frontend && npm install
```

### 2. Configure Environment Variables

Backend:

```bash
cp backend/.env.example backend/.env
```

Frontend:

```bash
cp frontend/.env.example frontend/.env
```

Key backend variables:

- `HTTP_ADDR=:8080`
- `DATABASE_URL=postgres://admin:secret@localhost:5432/codefalah_tracker?sslmode=disable`
- `CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173,...`

Key frontend variables:

- `VITE_API_BASE_URL=http://localhost:8080`
- `VITE_APP_TIME_ZONE=Asia/Jakarta`

### 3. Create the Database Schema

Create the database first, then apply the migration:

```bash
createdb codefalah_tracker
psql "postgres://admin:secret@localhost:5432/codefalah_tracker?sslmode=disable" \
  -f backend/migrations/000001_create_mvp_tracker_tables.up.sql
```

## How to Run the App

Run the backend in one terminal:

```bash
cd backend
go run ./cmd/app
```

Run the frontend in another terminal:

```bash
cd frontend
npm run dev
```

Open:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8080`

## How to Test the App

Backend tests:

```bash
cd backend
go test ./...
```

Frontend type checks:

```bash
cd frontend
npm run typecheck
```

Useful focused backend test:

```bash
cd backend
go test ./internal/handlers/...
```

## Screenshots

Simpan screenshot di folder `docs/screenshots/` agar path tetap konsisten dan mudah direview.

Contoh struktur file:

```text
docs/
└── screenshots/
    ├── dashboard.png
    ├── sholat.png
    ├── puasa.png
    ├── keuangan.png
    ├── olahraga.png
    └── jurnal.png
```

Screenshot yang sudah tersedia saat ini:

### Dashboard

![Dashboard](docs/screenshots/dashboard.png)

Nama file yang direkomendasikan untuk screenshot berikutnya:

- `docs/screenshots/sholat.png`
- `docs/screenshots/puasa.png`
- `docs/screenshots/keuangan.png`
- `docs/screenshots/olahraga.png`
- `docs/screenshots/jurnal.png`

## Tech Stack and Libraries Used

### Backend

- Go
- `net/http`
- `github.com/go-chi/chi/v5`
- PostgreSQL
- `github.com/jackc/pgx/v5/stdlib`
- `sqlc`
- `github.com/go-playground/validator/v10`

### Frontend

- React `19`
- React Router `7`
- TypeScript
- Vite
- Tailwind CSS `4`
- Radix UI
- `lucide-react`
- `class-variance-authority`
- `clsx`
- `tailwind-merge`

### Development Workflow

- AI workflow docs under `ai/`
- Generated SQL access layer in `backend/internal/db`
- Environment-based frontend and backend configuration
