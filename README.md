# Ecommerce Application
This repository contains a full stack ecommerce application with a Flask based backend, a PostgreSQL database, and a React + Vite frontend styled using Tailwind CSS.
Docker is used to manage database services, while modern tooling is used to ensure a deterministic and reproducible development environment.

The project is designed for learning and is constantly being updated.

---

### Project Status

This project is under active development.  
Features, refactors, and improvements are continuously added as part of structured learning and iteration.

---

## Tech stack

- Backend: Python, Flask, Flask‑SQLAlchemy
- Database: PostgreSQL (Docker)
- Frontend: React + Vite, Tailwind CSS
- Tooling: Docker / Docker Compose, pnpm 

---
## Features

- Product catalog
  - Category listing and individual product pages
  - Product metadata (price, images, stock)
- Shopping cart (server-backed)
  - Add / update / remove items
  - Endpoints: POST /cart/add, POST /cart/update, POST /cart/remove, GET /cart, POST /cart/clear
  - Cart persisted per authenticated user (server-side); frontend keeps UI state in sync
- Authentication
  - Signup / Login using JWT tokens
  - Protected routes for cart, orders and profile actions
- Orders
  - Place orders via POST /orders/place
  - List and view order details: GET /orders and GET /orders/:id
  - Order confirmation page (OrderPlaced) and OrderDetails view
- Frontend
  - React + Vite single-page app
  - Tailwind CSS for styling and responsive UI
- Developer tooling & reproducibility
  - Docker Compose for Postgres and pgAdmin
  - mise + uv for reproducible runtime & Python environment
  - pnpm for frontend package management

---
## Prerequisites

- Docker & Docker Compose
- Git
- Python 3.8+ (for backend)
- Node.js and a package manager (pnpm) for frontend

---

## Environment

Create a backend environment file from the example and edit values as needed:

```bash
cd backend
cp .env.example .env
# then edit backend/.env or project .env to point DATABASE_URL to your Postgres
```

### Minimum environment configuration

At a minimum, the backend requires the following environment variables to be set.

```env
DATABASE_URL=postgresql+psycopg://postgres:password@localhost:5432/ecommerce_db
SECRET_KEY=change_this_to_a_secure_random_string


```

## Database (Docker)

Start Postgres (and pgAdmin) used by the project:

```bash
docker compose up -d
```

Default service ports:
- Postgres: 5432
- pgAdmin: 5050

Stop and remove containers:

```bash
docker compose down
```

To remove volumes (reset DB data):

```bash
docker compose down -v
```

---

## Backend setup & run

This project uses **mise** for runtime version management and **uv** for modern, reproducible Python dependency management.

The frontend and backend each have their **own `mise.toml` file**, allowing them to manage tool versions independently.

Follow these steps from the **project root**.

---

### 1. Install and trust tool versions

```bash
mise install
mise trust
```
This reads the nearest mise.toml files and installs the required runtimes.
The backend and frontend runtimes are managed separately.

### 2. Create and activate a uv managed virtual environment
```bash
cd backend
uv venv
source .venv/bin/activate
```
The virtual environment is created at backend/.venv and is not tracked in Git.

### 3. Install Python dependencies using uv

If this is the first time setting up the backend or after dependencies change:
```bash
uv pip compile pyproject.toml -o uv.lock
uv pip sync uv.lock

```
On subsequent runs or fresh clones where uv.lock already exists:
```bash
uv pip sync uv.lock
```
This guarantees identical dependency versions across machines.

### 4. Start the backend

Ensure the PostgreSQL Docker containers are running before starting the backend server.
Command to start the docker containers:
```bash
docker compose up -d
```
Start the backend:
```bash
python main.py
```
Notes:
- On first run the app creates database tables and will auto‑seed products if the products table is empty.
- A CLI seed command is available if you prefer to seed manually:

```bash
flask seed-db
```

---

## Frontend setup & run

1. Install dependencies and start dev server:

```bash
cd frontend
mise install
mise trust
pnpm install   
pnpm dev      
```
---

## License

This repository is provided for learning and development purposes.
