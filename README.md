# Asset Management System (AMS)

A full-stack Asset Management System built using **Java Play Framework** and **React** to streamline the lifecycle of organizational assets. The system provides secure authentication, role-based authorization, asset allocation, maintenance management, and request workflows.

## Features

### Authentication & Authorization

* JWT-based authentication
* Role-Based Access Control (RBAC)
* Protected REST APIs
* Role-based access to resources and operations

### Asset Management

* Create, update, and delete assets
* View complete asset inventory
* Search and filter assets
* Track asset availability and allocation status

### Asset Allocation

* Admin assignes assets to Manager and Employee
* Asset assignment history
* Prevent duplicate or invalid allocations

### Maintenance Management

* Employees can raise maintenance requests
* Managers can approve maintenance requests
* Track request lifecycle
* Resolve completed maintenance requests
* View maintenance history

### User Management

* User registration and management
* Role assignment
* Active/inactive user handling

### Security

* JWT authentication
* Password hashing
* Centralized exception handling
* Request authorization filters
* CORS configuration
* Security headers

### Logging

* Structured request logging
* MDC-based contextual logging
* Centralized error handling

## Tech Stack

### Backend

* Java
* Play Framework
* Ebean ORM
* MySQL
* JWT
* Guice Dependency Injection
* Redis (Rate Limiting)

### Frontend

* React
* React Router
* Tailwind CSS
* Axios

## Project Structure

```text
AMS/
├── ams_client/        # React Frontend
└── ams_server/        # Java Play Backend
```

## Getting Started

### Prerequisites

* Java 11+
* Node.js
* npm
* MySQL
* sbt

### Clone Repository

```bash
git clone <repository-url>
cd AMS
```

## Backend Setup

Navigate to the backend:

```bash
cd ams_server
```

Update `conf/application.conf` before running:

```conf
db.default.url="jdbc:mysql://localhost:3306/ams"
db.default.username="YOUR_DB_USERNAME"
db.default.password="YOUR_DB_PASSWORD"

jwt.secret="CHANGE_ME_BEFORE_RUNNING"
```

Create a MySQL database:

```sql
CREATE DATABASE ams;
```

Run the backend:

```bash
sbt run
```

The backend runs on:

```
http://localhost:9000
```

## Frontend Setup

Navigate to the frontend:

```bash
cd ams_client
```

Install dependencies:

```bash
npm install
```

Configure your `.env` file if required.

Start the development server:

```bash
npm run dev
```

The frontend runs on:

```
http://localhost:5173
```

## API Features

* Authentication APIs
* User Management APIs
* Asset CRUD APIs
* Asset Request APIs
* Maintenance Request APIs

## Future Improvements

* Dashboard analytics
* Email notifications
* File/image upload for assets
* Audit logs
* Asset depreciation tracking
* Automated testing

## Notes

Sensitive information such as database credentials and JWT secrets have been replaced with placeholder values. Configure your own credentials before running the application locally.

## License

This project is released for educational purposes.
