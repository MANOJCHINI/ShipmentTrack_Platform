# ShipTrack Pro

<p align="center">
  <strong>Shipment & Logistics Management Platform</strong>
</p>

<p align="center">
  A full-stack logistics platform built with React and Spring Boot microservices.
</p>

---

## Overview

**ShipTrack Pro** is a full-stack shipment and logistics management platform designed to manage the complete shipment lifecycle, delivery operations, proof of delivery, notifications, route management, tracking, analytics, and reporting.

The platform follows a **microservice architecture** on the backend, with a centralized API Gateway and Eureka service discovery.

The frontend communicates with the backend through the API Gateway, while backend services communicate with each other through service discovery and internal APIs.

---

## Key Features

### Authentication & User Management

- User registration and login
- JWT-based authentication
- Refresh token support
- Role-based access control
- Password reset functionality
- User profile management
- Administrative user management

### Shipment Management

- Create and manage shipments
- Shipment status tracking
- Shipment lifecycle management
- Shipment history
- Shipment tracking information
- Business-scoped shipment access

### Delivery Management

- Driver management
- Driver assignment
- Delivery management
- Real-time delivery information
- Driver location monitoring

### Proof of Delivery

- Digital proof of delivery
- Signature and image handling
- Proof of delivery verification
- Cloudinary-based media storage

### Route & Journey Management

- Route management
- Route planning
- Hub management
- Journey management
- Navigation-related operations

### Notifications

- Application notifications
- Email notifications
- Shipment-related notifications
- Password reset emails

### Analytics & Reporting

- Dashboard analytics
- Shipment KPIs
- Delivery performance
- ETA information
- Analytics dashboards
- Role-based reports
- Report generation and export

### Real-Time Communication

- WebSocket support
- Real-time delivery updates
- Live driver tracking capabilities
- STOMP messaging

---

# System Architecture

ShipTrack Pro uses a distributed microservice architecture.

```text
                           ┌─────────────────────┐
                           │      Frontend       │
                           │    React + Vite     │
                           │      :5173          │
                           └──────────┬──────────┘
                                      │
                                      │ HTTP / HTTPS
                                      ▼
                           ┌─────────────────────┐
                           │    API Gateway      │
                           │  Spring Cloud       │
                           │      Gateway        │
                           │       :8080          │
                           └──────────┬──────────┘
                                      │
                         Service Discovery
                                      │
                                      ▼
                           ┌─────────────────────┐
                           │   Eureka Server     │
                           │  Service Discovery  │
                           │       :8761         │
                           └──────────┬──────────┘
                                      │
             ┌────────────────────────┼────────────────────────┐
             │                        │                        │
             ▼                        ▼                        ▼
      ┌─────────────┐          ┌─────────────┐          ┌─────────────┐
      │ Auth        │          │ Delivery    │          │ Notification│
      │ Service     │          │ Service     │          │ Service     │
      │ :8081       │          │ :8082       │          │ :8083       │
      └─────────────┘          └─────────────┘          └─────────────┘

             ┌────────────────────────┼────────────────────────┐
             │                        │                        │
             ▼                        ▼                        ▼
      ┌─────────────┐          ┌─────────────┐          ┌─────────────┐
      │ POD         │          │ Shipment    │          │ Analytics   │
      │ Service     │          │ Management  │          │ Service     │
      │ :8084       │          │ :8085       │          │ :8086       │
      └─────────────┘          └──────┬──────┘          └─────────────┘
                                      │
                                      ▼
                             ┌─────────────────┐
                             │   PostgreSQL    │
                             │    Database     │
                             └────────┬────────┘
                                      │
                                      ▼
                               ┌─────────────┐
                               │   Flyway    │
                               │ Migrations  │
                               └─────────────┘
```

---

# Microservices

| Service | Port | Responsibility |
|---|---:|---|
| Eureka Server | `8761` | Service discovery |
| API Gateway | `8080` | Central API entry point and routing |
| Auth Service | `8081` | Authentication and user management |
| Delivery Service | `8082` | Driver and delivery management |
| Notification Service | `8083` | Notifications and email |
| POD Service | `8084` | Proof of delivery |
| Shipment Management | `8085` | Shipments, routes, hubs, journeys and navigation |
| Analytics Service | `8086` | Analytics and reporting |

---

# Technology Stack

## Frontend

| Technology | Purpose |
|---|---|
| React | User interface |
| Vite | Development and build tooling |
| JavaScript / JSX | Application development |
| Tailwind CSS | UI styling |
| Axios | HTTP/API communication |
| React Context | Application state |
| WebSocket | Real-time communication |

## Backend

| Technology | Purpose |
|---|---|
| Java | Backend development |
| Spring Boot | Microservice framework |
| Spring Web | REST APIs |
| Spring Data JPA | Database access |
| Spring Cloud Gateway | API Gateway |
| Spring Cloud Eureka | Service discovery |
| Spring Cloud OpenFeign | Service-to-service communication |
| Spring WebSocket | Real-time communication |
| Spring Security | Security and authentication |
| Maven | Dependency management and builds |

## Database & Infrastructure

| Technology | Purpose |
|---|---|
| PostgreSQL | Relational database |
| Flyway | Database migrations |
| Cloudinary | Image and media storage |
| SMTP | Email delivery |
| Docker | Containerization |

---

# Backend Architecture

The backend is divided into independent Spring Boot services.

```text
backend/
│
├── eureka-server/
│
├── api-gateway/
│
├── auth-service/
│
├── delivery-service/
│
├── notification-service/
│
├── pod-service/
│
├── shipmentManagement-service/
│
└── analytics-service/
```

Each service is independently buildable and deployable.

---

# API Gateway

The API Gateway provides a single entry point for frontend requests.

The current routing structure includes:

| Route | Service |
|---|---|
| `/api/auth/**` | Auth Service |
| `/api/admin/**` | Auth Service |
| `/api/password/**` | Auth Service |
| `/api/drivers/**` | Delivery Service |
| `/api/notifications/**` | Notification Service |
| `/api/pod/**` | POD Service |
| `/api/shipments/**` | Shipment Management |
| `/api/navigation/**` | Shipment Management |
| `/api/journey/**` | Shipment Management |
| `/api/routes/**` | Shipment Management |
| `/api/hubs/**` | Shipment Management |
| `/api/analytics/**` | Analytics Service |

The frontend therefore communicates with the Gateway rather than directly accessing every backend service.

---

# Database

ShipTrack Pro uses **PostgreSQL** as its relational database.

The current database migration responsibility is located in the **Shipment Management Service**.

Hibernate is configured to validate the existing schema rather than automatically modifying it.

```yaml
spring:
  jpa:
    hibernate:
      ddl-auto: validate
```

Database migrations are handled using Flyway.

```yaml
spring:
  flyway:
    enabled: true
    locations: classpath:db/migration
```

Migration files are located under:

```text
shipmentManagement-service/
└── src/
    └── main/
        └── resources/
            └── db/
                └── migration/
```

---

# Authentication & Security

The platform uses JWT-based authentication.

The general authentication flow is:

```text
User
  │
  ▼
React Frontend
  │
  ▼
API Gateway
  │
  ▼
Auth Service
  │
  ▼
JWT Authentication
  │
  ▼
Protected APIs
```

The Gateway and backend services use environment-based configuration for sensitive values such as JWT secrets, database credentials, email credentials, and Cloudinary credentials.

Sensitive credentials should never be committed to source control.

---

# Frontend Structure

The frontend is organized into reusable components, pages, services, contexts, hooks, routes, and utilities.

```text
frontend/
│
├── public/
│
├── src/
│   │
│   ├── assets/
│   │   ├── images/
│   │   └── styles/
│   │
│   ├── components/
│   │   ├── common/
│   │   ├── layout/
│   │   └── charts/
│   │
│   ├── pages/
│   │   ├── LoginPage
│   │   ├── RegisterPage
│   │   ├── DashboardPage
│   │   ├── ShipmentsPage
│   │   ├── TrackingPage
│   │   ├── MonitoringPage
│   │   ├── ETAPage
│   │   ├── RoutesPage
│   │   ├── PODPage
│   │   ├── NotificationsPage
│   │   ├── AnalyticsPage
│   │   ├── ReportsPage
│   │   ├── UsersPage
│   │   └── ProfilePage
│   │
│   ├── services/
│   │   ├── apiClient
│   │   ├── authService
│   │   ├── userService
│   │   ├── shipmentService
│   │   ├── trackingService
│   │   ├── monitoringService
│   │   ├── etaService
│   │   ├── routeService
│   │   ├── podService
│   │   ├── notificationService
│   │   ├── analyticsService
│   │   └── reportService
│   │
│   ├── context/
│   │
│   ├── hooks/
│   │
│   ├── routes/
│   │
│   └── utils/
│
├── package.json
└── README.md
```

---

# Local Development

## Prerequisites

Install the following before running the project:

- Java 25
- Maven
- Node.js
- npm
- PostgreSQL
- Docker Desktop
- Git

---

## Backend Configuration

The backend uses environment variables for configuration.

Example:

```env
SHIPTRACK_DB_URL=jdbc:postgresql://localhost:5432/shipment_db
SHIPTRACK_DB_USERNAME=postgres
SHIPTRACK_DB_PASSWORD=your_password

SHIPTRACK_JWT_SECRET=your_jwt_secret

SHIPTRACK_EMAIL_HOST=smtp.example.com
SHIPTRACK_EMAIL_PORT=587
SHIPTRACK_EMAIL_USERNAME=your_email
SHIPTRACK_EMAIL_PASSWORD=your_password

SHIPTRACK_CLOUDINARY_CLOUD_NAME=your_cloud_name
SHIPTRACK_CLOUDINARY_API_KEY=your_api_key
SHIPTRACK_CLOUDINARY_API_SECRET=your_api_secret
```

> Do not commit real credentials to GitHub.

---

# Running the Backend

Each backend service is a separate Maven project.

Example:

```bash
cd backend/shipmentManagement-service
```

Build the service:

```bash
mvn clean package
```

Run the service:

```bash
mvn spring-boot:run
```

The same approach can be used for the other Spring Boot services.

---

# Running the Frontend

Navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend runs locally on:

```text
http://localhost:5173
```

---

# Docker

The project is designed to be containerized for consistent local development and deployment.

The intended container architecture is:

```text
Frontend
    │
    ▼
API Gateway
    │
    ├── Auth Service
    ├── Delivery Service
    ├── Notification Service
    ├── POD Service
    ├── Shipment Management
    └── Analytics Service
             │
             ▼
         PostgreSQL
```

Docker Compose can be used to run the backend infrastructure as a complete system.

```bash
docker compose up --build
```

To stop the containers:

```bash
docker compose down
```

> Docker configuration will be maintained as the deployment architecture is finalized.

---

# Deployment

The planned production architecture separates the frontend and backend deployments.

```text
                     Internet
                        │
                        ▼
              ┌─────────────────┐
              │     Vercel      │
              │ React Frontend  │
              └────────┬────────┘
                       │
                       ▼
              ┌─────────────────┐
              │  API Gateway    │
              │ Spring Cloud    │
              │    Gateway      │
              └────────┬────────┘
                       │
          ┌────────────┼────────────┐
          ▼            ▼            ▼
       Services      Services     Services
          │            │            │
          └────────────┼────────────┘
                       ▼
                  PostgreSQL
```

The frontend and backend can be deployed independently.

Production credentials and configuration should be supplied through the hosting platform's environment-variable system.

---

# Environment & Configuration

The following types of values should be configured through environment variables:

- Database URL
- Database username
- Database password
- JWT secret
- Email server configuration
- Cloudinary credentials
- Production service URLs
- Frontend API URL
- Other environment-specific configuration

Never commit production secrets directly into the repository.

---

# Project Status

ShipTrack Pro currently contains the following major modules:

- Authentication
- User management
- Shipment management
- Delivery management
- Driver management
- Tracking
- Monitoring
- ETA
- Route management
- Journey management
- Hub management
- Proof of delivery
- Notifications
- Analytics
- Reports
- Profile management
- JWT authentication
- Eureka service discovery
- API Gateway
- WebSocket communication
- PostgreSQL persistence
- Flyway database migrations
- Cloudinary media storage

---

# Future Improvements

Planned improvements may include:

- Production container deployment
- CI/CD pipeline
- Centralized logging
- Distributed tracing
- Service health monitoring
- Improved observability
- Automated integration testing
- Horizontal service scaling
- Production database infrastructure
- Additional analytics capabilities

---

# Repository Structure

```text
SHIPTRACK_PRO/
│
├── frontend/
│
├── backend/
│   ├── eureka-server/
│   ├── api-gateway/
│   ├── auth-service/
│   ├── delivery-service/
│   ├── notification-service/
│   ├── pod-service/
│   ├── shipmentManagement-service/
│   └── analytics-service/
│
├── docker-compose.yml
│
├── README.md
│
└── .gitignore
```

---

# Contributing

Contributions, improvements, and bug fixes are welcome.

When contributing:

1. Create a dedicated branch.
2. Make focused changes.
3. Test the affected service.
4. Verify that existing functionality is not broken.
5. Submit a pull request with a clear description of the changes.

---

# License

This project is currently maintained as a private project.

A formal open-source license can be added if the project is made publicly available for open-source contribution.

---

## ShipTrack Pro

**Shipment management. Delivery operations. Tracking. Analytics.**

Built with React, Spring Boot, Spring Cloud, PostgreSQL, and Docker.