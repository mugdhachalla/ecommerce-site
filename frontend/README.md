# Full Stack Sample Ecommerce Project

## Overview

This repository contains a simple full stack application built for learning and experimentation purposes.  
The project demonstrates how a modern frontend integrates with a lightweight backend and a relational database, using realistic sample data and images.

The primary objective is to understand end to end flow rather than production scale optimization.

---

## Tech Stack

### Frontend
- React for component based UI development
- Tailwind CSS for utility first styling
- Vite as the frontend build and dev server

### Backend
- Flask as a lightweight REST API layer

### Database
- PostgreSQL as the relational database
- pgAdmin for database management and inspection

---

## Features

- Product listing fetched from backend APIs
- Individual product detail pages
- Cart functionality using browser localStorage
- Simple login UI 
- Responsive UI using Tailwind

---


## Development Setup

### Prerequisites
- Node.js installed
- Python installed
- PostgreSQL installed
- pgAdmin configured

---

### Frontend Setup

1. Navigate to the frontend folder  
2. Install dependencies  

```bash
npm install
```

3. Start a development server

```bash
npm run dev
```

Frontend runs on the Vite development server and proxies API calls to Flask.

### Backend Setup

1. Create and activate a virtual python environment in backend folder
2. Install dependencies
```bash
pip install -r backend/requirements.txt
```

3. Configure PostgreSQL connection details

4. Run flask server
```bash
python main.py
```
