# Ecommerce Backend Application
This repository contains a full stack ecommerce application consisting of a Flask based backend, a PostgreSQL database, and a React frontend styled using Tailwind CSS. 
Docker is used to manage database services and ensure a consistent development environment.


---

# Tech Stack

1. Python  
2. Flask  
3. Flask SQLAlchemy  
4. PostgreSQL  
5. React  
6. Tailwind CSS  
7. Docker and Docker Compose  
8. pgAdmin  


---

## Prerequisites

Ensure the following are installed on your system.

1. Python 3.10 or higher  
2. Node.js and npm  
3. Docker  
4. Docker Compose  
5. Git  

---

## Environment Configuration

This project uses environment variables for configuration.

An example file is provided.

### Step 1 Create the environment file

From the backend directory, rename the example file.

```bash
cp .env.example .env
```
Rename as .env
Update values in .env if required.

## Python Virtual Environment Setup
A Python virtual environment is required to isolate dependencies.

### Step 2: Create and activate the virtual environment

From the backend directory.
```bash
python3 -m venv venv
source venv/bin/activate

```

### Step 3: Install python dependencies
```bash
pip install -r requirements.txt
```
## Database Setup Using Docker

PostgreSQL and pgAdmin are managed using Docker.

### Step 4: Start database services

From the project root.
```bash
docker compose up
```
This starts PostgreSQL and pgAdmin containers.

PostgreSQL runs on port 5432
pgAdmin runs on port 5050

## Running the Backend Application
### Step 5: Start the Flask application

From the backend directory with the virtual environment activated.
```bash
python3 main.py

```
On startup the application will:

- Connect to PostgreSQL
- Create database tables if they do not exist
- Automatically seed product data if the database is empty
- No manual seed command is required for development.

## Database Seeding Behavior

The application enforces a startup contract.
If the products table is empty, initial data from the CSV file is inserted automatically.
This guarantees that a fresh database always starts in a valid state.
An optional CLI command is also available.

```bash
flask seed-db
```
This can be used to reseed data manually if required.

## Verifying Data
You can verify seeded data using PostgreSQL.
```bash
SELECT COUNT(*) FROM products;
```
A non zero count confirms successful seeding.

## Frontend Setup

The frontend is built using React and styled with Tailwind CSS.

### Step 6: Install frontend dependencies

From the frontend directory.
```bash
npm install
```

### Step 7: Start the frontend application
```bash
npm run dev
```
The frontend will start and communicate with the Flask backend through API endpoints.

## Accessing pgAdmin

1. Open a browser at http://localhost:5050
2. Login using credentials from .env
3. Add a new server
4. Use host name db
5. Use port 5432
6. Use username and password from .env

## License

This project is intended for learning and development purposes.
