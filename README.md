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

Minimum values to set (example):

```
DATABASE_URL=postgresql://postgres:password@localhost:5432/ecommerce_db
SECRET_KEY=your_secret_key
```

---

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

This repository uses `mise` and `uv` to provide a reproducible runtime and Python environment. Follow these steps from the project root.

```bash
mise install
mise trust

# create and activate a reproducible venv using uv
cd backend
uv venv
source .venv/bin/activate

# install Python dependencies from lock (if available)
uv pip install


# start the backend
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
# optional: provision runtimes (mise) if config files exist

cd frontend
mise install
mise trust
pnpm install   
pnpm dev      
```
---



## License

This repository is provided for learning and development purposes.
