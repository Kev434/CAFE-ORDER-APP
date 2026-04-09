# Cafe Order App - Backend

Spring Boot REST API for the Cafe Order App.

## Prerequisites

- Java 17+
- Maven
- Supabase account (for PostgreSQL database and auth)

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/Kev434/CAFE-ORDER-APP.git
   cd CAFE-ORDER-APP
   ```

2. Set the following environment variables:
   ```bash
   export SUPABASE_DB_URL=jdbc:postgresql://<your-supabase-host>:5432/postgres
   export SUPABASE_DB_USER=postgres
   export SUPABASE_DB_PASSWORD=<your-db-password>
   export SUPABASE_URL=<your-supabase-project-url>
   ```

3. Run the application:
   ```bash
   ./mvnw spring-boot:run
   ```

The server starts on `http://localhost:8080`.

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /api/menu` | Browse menu items |
| `POST /api/orders` | Place an order (guest or authenticated) |
| `GET /api/loyalty` | View loyalty points (authenticated) |
