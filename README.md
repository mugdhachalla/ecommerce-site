# Ecommerce Application

This repository contains a full stack ecommerce application with a Flask based backend, a PostgreSQL database, and a React frontend styled using Tailwind CSS.  
Docker is used to manage database services, while modern tooling is used to ensure a deterministic and reproducible development environment.

The project is designed as a learning driven but production oriented codebase and is actively evolving.

---

## Tech Stack

### Backend
1. Python  
2. Flask  
3. Flask SQLAlchemy  
4. PostgreSQL  
5. psycopg v3  

### Frontend
6. React  
7. Tailwind CSS  
8. Vite  

### Tooling and Infrastructure
9. Docker and Docker Compose  
10. pgAdmin  
11. mise for runtime version management  
12. uv for Python dependency management  
13. pnpm for frontend package management  

---

## Project Status

This project is under active development.  
Features, refactors, and improvements are continuously added as part of structured learning and iteration.

---

## Prerequisites

Ensure the following are installed on your system.

1. Docker  
2. Docker Compose  
3. Git  

All runtime versions for Python and Node.js are managed using **mise**, so no global installations are required beyond Docker.

---

## Runtime Version Management

This project uses **mise** to ensure consistent runtime versions across machines.

### Backend runtime
- Python version is locked using `backend/mise.toml`

### Frontend runtime
- Node.js and pnpm versions are locked using `frontend/mise.toml`

After cloning the repository, run the following inside both `backend` and `frontend` directories.

```bash
mise install
mise trust
```

---

## Environment Configuration

All environment variables are defined in a single backend scoped file.

# Backend environment file

From the backend directory:

```bash
cp .env.example .env
```


Update values in backend/.env as required.

This file is used by:

- The Flask backend
- PostgreSQL and pgAdmin containers via Docker Compose

There is no .env file in the project root.

## Python Dependency Setup

Python dependencies are managed using uv and pyproject.toml.

# Backend setup

From the backend directory:
```bash
uv venv
source .venv/bin/activate
uv pip install -r uv.lock
```


This creates an isolated virtual environment and installs locked dependencies.

## Database Setup Using Docker

PostgreSQL and pgAdmin are managed using Docker Compose.

# Start database services

From the project root:
```bash
docker compose up -d
```


Services started:
- PostgreSQL on port 5432
- pgAdmin on port 5050

PostgreSQL data is persisted using Docker volumes.

## Running the Backend Application

From the backend directory with the virtual environment activated:

```bash
python main.py
```

On startup, the backend will:

- Connect to PostgreSQL
- Create database tables if they do not exist
- Automatically seed product data if the database is empty

No manual seed command is required during normal development.

## Database Seeding Behavior

The application enforces a startup contract.

If the products table is empty:

1. Initial data is loaded automatically from a CSV file
2. The database always starts in a valid state
An optional CLI command is also available:
```bash
flask seed-db
```
## Verifying Database Data

You can verify seeded data directly in PostgreSQL.

```bash
SELECT COUNT(*) FROM products;
```

A non zero count confirms successful seeding.

### Frontend Setup

The frontend is built using React, Tailwind CSS, and Vite.

Install frontend dependencies

From the frontend directory:
```bash
pnpm install
```

Start the frontend development server
```bash
pnpm dev
```


The frontend runs locally and communicates with the Flask backend through API endpoints.

## Accessing pgAdmin

1. Open a browser at http://localhost:5050

2. Log in using credentials from backend/.env

3. Add a new server

4. Use localhost as the host name

5. Use port 5432

6. Use database credentials from backend/.env

# Repository Notes
- package.json and pnpm-lock.yaml are committed
- node_modules and virtual environments are not committed
- Docker volumes persist database state between runs
- Removing volumes will reset the database

## License

This project is intended for learning and development purposes and is not production licensed.