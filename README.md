# 🏢 Employee Management System (EMS)

A full-stack **Employee Management System** built with Spring Boot, featuring a complete **DevOps CI/CD pipeline** using Jenkins, Docker, SonarQube, Prometheus, and Grafana.

![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.1.4-brightgreen)
![Java](https://img.shields.io/badge/Java-17-orange)
![Docker](https://img.shields.io/badge/Docker-Enabled-blue)
![Jenkins](https://img.shields.io/badge/Jenkins-CI%2FCD-red)
![SonarQube](https://img.shields.io/badge/SonarQube-Code%20Quality-yellow)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Prerequisites](#-prerequisites)
- [Quick Start](#-quick-start)
- [API Endpoints](#-api-endpoints)
- [DevOps Pipeline](#-devops-pipeline)
- [Docker Commands](#-docker-commands)
- [Monitoring](#-monitoring)
- [Jenkins Setup](#-jenkins-setup)
- [Project Structure](#-project-structure)
- [Troubleshooting](#-troubleshooting)

---

## ✨ Features

- ✅ **CRUD Operations** - Create, Read, Update, Delete employees
- ✅ **RESTful API** - Clean REST endpoints with proper HTTP methods
- ✅ **H2 In-Memory Database** - Fast development with H2 console access
- ✅ **Docker Support** - Containerized application deployment
- ✅ **CI/CD Pipeline** - Automated Jenkins pipeline with 9 stages
- ✅ **Code Quality** - SonarQube integration for static analysis
- ✅ **Metrics & Monitoring** - Prometheus + Grafana dashboards
- ✅ **Health Checks** - Spring Actuator endpoints

---

## 🛠 Tech Stack

| Category | Technology |
|----------|------------|
| **Backend** | Spring Boot 3.1.4, Java 17, Spring Data JPA |
| **Database** | H2 (In-Memory), PostgreSQL (Optional) |
| **Build** | Maven 3.x |
| **Containerization** | Docker, Docker Compose |
| **CI/CD** | Jenkins (Declarative Pipeline) |
| **Code Quality** | SonarQube, JaCoCo (Code Coverage) |
| **Monitoring** | Prometheus, Grafana |
| **Registry** | Docker Hub |

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CI/CD PIPELINE                          │
├─────────────────────────────────────────────────────────────────┤
│  GitHub → Jenkins → Build → Test → SonarQube → Docker → Deploy │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      DEPLOYED SERVICES                          │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌────────────┐  ┌──────────┐  ┌───────────┐ │
│  │ Spring Boot  │  │ Prometheus │  │ Grafana  │  │ SonarQube │ │
│  │  App :8081   │  │   :9090    │  │  :3000   │  │   :9000   │ │
│  └──────────────┘  └────────────┘  └──────────┘  └───────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📦 Prerequisites

Ensure you have the following installed:

| Tool | Version | Purpose |
|------|---------|---------|
| Java JDK | 17+ | Runtime |
| Maven | 3.6+ | Build tool |
| Docker | 20.0+ | Containerization |
| Docker Compose | 2.0+ | Multi-container orchestration |
| Git | 2.0+ | Version control |

---

## 🚀 Quick Start

### Option 1: Run Locally with Maven

```bash
# Clone the repository
git clone https://github.com/khushalbhavsar/DevOps-EMS-Spring-Boot-Docker-Jenkins.git
cd DevOps-EMS-Spring-Boot-Docker-Jenkins

# Build the project
mvn clean package -DskipTests

# Run the application
mvn spring-boot:run
```

**Access:** http://localhost:8080

### Option 2: Run with Docker

```bash
# Build Docker image
docker build -t employee-management:latest .

# Run container
docker run -d -p 8081:8080 --name ems-app employee-management:latest
```

**Access:** http://localhost:8081

### Option 3: Run with Docker Compose

```bash
# Start only the application
docker compose up -d

# Start with monitoring stack
docker compose --profile with-monitoring up -d

# Start with all services (SonarQube + Monitoring)
docker compose --profile with-sonarqube --profile with-monitoring up -d
```

**Services:**
| Service | URL |
|---------|-----|
| Application | http://localhost:8081 |
| Prometheus | http://localhost:9090 |
| Grafana | http://localhost:3000 |
| SonarQube | http://localhost:9000 |

---

## 🔌 API Endpoints

### Base URL: `/api/employees`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/employees` | Get all employees |
| `GET` | `/api/employees/{id}` | Get employee by ID |
| `POST` | `/api/employees` | Create new employee |
| `PUT` | `/api/employees/{id}` | Update employee |
| `DELETE` | `/api/employees/{id}` | Delete employee |

### Example Requests

**Get All Employees:**
```bash
curl -X GET http://localhost:8081/api/employees
```

**Create Employee:**
```bash
curl -X POST http://localhost:8081/api/employees \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "role": "Developer"
  }'
```

**Update Employee:**
```bash
curl -X PUT http://localhost:8081/api/employees/1 \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Smith",
    "email": "john.smith@example.com",
    "role": "Senior Developer"
  }'
```

**Delete Employee:**
```bash
curl -X DELETE http://localhost:8081/api/employees/1
```

### Actuator Endpoints

| Endpoint | Description |
|----------|-------------|
| `/actuator/health` | Health check |
| `/actuator/info` | Application info |
| `/actuator/prometheus` | Prometheus metrics |
| `/actuator/metrics` | All metrics |

### H2 Database Console

- **URL:** http://localhost:8081/h2-console
- **JDBC URL:** `jdbc:h2:mem:employeedb`
- **Username:** `sa`
- **Password:** *(leave empty)*

---

## 🔄 DevOps Pipeline

The Jenkins pipeline consists of **9 stages**:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        JENKINS CI/CD PIPELINE                           │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌──────────┐   ┌───────────┐   ┌────────────┐   ┌─────────────────┐   │
│  │ Checkout │ → │   Maven   │ → │   Unit     │ → │   SonarQube     │   │
│  │  Source  │   │   Build   │   │   Tests    │   │   Analysis      │   │
│  └──────────┘   └───────────┘   └────────────┘   └─────────────────┘   │
│       ↓                                                                 │
│  ┌──────────┐   ┌───────────┐   ┌────────────┐   ┌─────────────────┐   │
│  │ Archive  │ → │  Docker   │ → │   Push to  │ → │     Deploy      │   │
│  │ Artifacts│   │   Build   │   │   Registry │   │   Application   │   │
│  └──────────┘   └───────────┘   └────────────┘   └─────────────────┘   │
│       ↓                                                                 │
│  ┌──────────┐                                                           │
│  │ Cleanup  │                                                           │
│  └──────────┘                                                           │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Pipeline Stages

| Stage | Description | Timeout |
|-------|-------------|---------|
| **Checkout Source** | Clone repository from GitHub | 10 min |
| **Maven Build** | Compile and package application | 60 min |
| **Unit Tests** | Execute JUnit tests with JaCoCo coverage | 30 min |
| **SonarQube Analysis** | Static code analysis and quality gates | 30 min |
| **Archive Artifacts** | Store JAR files in Jenkins | 10 min |
| **Docker Build** | Build Docker image | 30 min |
| **Push to Registry** | Push image to Docker Hub | 30 min |
| **Deploy Application** | Deploy with docker-compose | 15 min |
| **Cleanup** | Remove old Docker images | 10 min |

---

## 🐳 Docker Commands

### Build Commands

```bash
# Build image
docker build -t employee-management:latest .

# Build with specific tag
docker build -t employee-management:v1.0.0 .

# Build with no cache
docker build --no-cache -t employee-management:latest .
```

### Run Commands

```bash
# Run in foreground
docker run -p 8081:8080 employee-management:latest

# Run in background
docker run -d -p 8081:8080 --name ems-app employee-management:latest

# Run with environment variables
docker run -d -p 8081:8080 \
  -e SPRING_PROFILES_ACTIVE=prod \
  --name ems-app employee-management:latest
```

### Docker Compose Commands

```bash
# Start services
docker compose up -d

# Start with specific profile
docker compose --profile with-monitoring up -d

# View logs
docker compose logs -f

# View logs for specific service
docker compose logs -f employee-management

# Stop services
docker compose down

# Stop and remove volumes
docker compose down -v

# Rebuild and start
docker compose up -d --build
```

### Maintenance Commands

```bash
# List running containers
docker ps

# List all containers
docker ps -a

# Stop container
docker stop ems-app

# Remove container
docker rm ems-app

# Remove image
docker rmi employee-management:latest

# Clean up unused resources
docker system prune -f
```

---

## 📊 Monitoring

### Prometheus

Prometheus scrapes metrics from the Spring Boot application.

**Configuration:** `config/prometheus.yml`

**Metrics Endpoint:** http://localhost:8081/actuator/prometheus

**Key Metrics:**
- `http_server_requests_seconds` - HTTP request latency
- `jvm_memory_used_bytes` - JVM memory usage
- `process_cpu_usage` - CPU utilization
- `hikaricp_connections_active` - Database connections

### Grafana

Pre-configured dashboard for visualizing application metrics.

**Login:**
- URL: http://localhost:3000
- Username: `admin`
- Password: `admin`

**Dashboard:** `config/grafana-dashboard.json`

---

## ⚙️ Jenkins Setup

### Required Credentials

Configure these in **Jenkins → Manage Jenkins → Credentials**:

| Credential ID | Type | Description |
|---------------|------|-------------|
| `github-token` | Username with password | GitHub access token |
| `sonar-token` | Secret text | SonarQube authentication token |
| `dockerHubCreds` | Username with password | Docker Hub credentials |

### Required Tools

Configure in **Jenkins → Manage Jenkins → Global Tool Configuration**:

| Tool | Name | Version |
|------|------|---------|
| Maven | `myMaven` | 3.9.x |
| JDK | `JDK17` | OpenJDK 17 |

### Jenkins Pipeline Configuration

1. Create a new **Pipeline** job
2. Under **Pipeline**, select **Pipeline script from SCM**
3. Set SCM to **Git**
4. Enter repository URL: `https://github.com/khushalbhavsar/DevOps-EMS-Spring-Boot-Docker-Jenkins.git`
5. Set branch to `*/main`
6. Script Path: `Jenkinsfile`

---

## 📁 Project Structure

```
DevOps-EMS-Spring-Boot-Docker-Jenkins/
├── 📂 src/
│   ├── 📂 main/
│   │   ├── 📂 java/com/example/
│   │   │   ├── 📄 EmployeeManagementApplication.java   # Main class
│   │   │   ├── 📂 controller/
│   │   │   │   └── 📄 EmployeeController.java          # REST endpoints
│   │   │   ├── 📂 model/
│   │   │   │   └── 📄 Employee.java                    # Entity class
│   │   │   ├── 📂 repository/
│   │   │   │   └── 📄 EmployeeRepository.java          # JPA repository
│   │   │   └── 📂 service/
│   │   │       └── 📄 EmployeeService.java             # Business logic
│   │   └── 📂 resources/
│   │       ├── 📄 application.properties               # App configuration
│   │       └── 📂 static/                              # Frontend files
│   └── 📂 test/                                        # Unit tests
├── 📂 config/
│   ├── 📄 prometheus.yml                               # Prometheus config
│   ├── 📄 grafana-datasource.yml                       # Grafana datasource
│   └── 📄 grafana-dashboard.json                       # Grafana dashboard
├── 📄 Dockerfile                                       # Docker image definition
├── 📄 docker-compose.yml                               # Multi-container setup
├── 📄 Jenkinsfile                                      # CI/CD pipeline
├── 📄 pom.xml                                          # Maven configuration
└── 📄 README.md                                        # This file
```

---

## 🔧 Troubleshooting

### Common Issues

#### Port Already in Use

```bash
# Check which process is using a port
# Windows
netstat -ano | findstr :8081

# Linux/Mac
lsof -i :8081

# Kill process by PID (replace <PID>)
# Windows
taskkill /PID <PID> /F

# Linux/Mac
kill -9 <PID>
```

#### Docker Compose Port Conflicts

If standalone services (Jenkins, SonarQube, Prometheus, Grafana) are already running:

```bash
# Run only the application (default)
docker compose up -d

# This excludes SonarQube, Prometheus, Grafana (they're in optional profiles)
```

#### Maven Build Fails

```bash
# Clean Maven cache
mvn dependency:purge-local-repository

# Build with verbose output
mvn clean package -X

# Skip tests
mvn clean package -DskipTests
```

#### Docker Build Fails

```bash
# Ensure JAR exists
ls target/*.jar

# Rebuild from scratch
docker build --no-cache -t employee-management:latest .
```

#### Jenkins Pipeline Fails at SonarQube

1. Verify SonarQube is running: http://localhost:9000
2. Check `sonar-token` credential in Jenkins
3. Ensure project `employee-management` exists in SonarQube

---

## 🌐 Service URLs (Production)

| Service | URL |
|---------|-----|
| **Application** | http://YOUR-SERVER:8081 |
| **Jenkins** | http://YOUR-SERVER:8080 |
| **SonarQube** | http://YOUR-SERVER:9000 |
| **Prometheus** | http://YOUR-SERVER:9090 |
| **Grafana** | http://YOUR-SERVER:3000 |

---

## 📝 Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `SPRING_PROFILES_ACTIVE` | `default` | Active Spring profile |
| `SPRING_DATASOURCE_URL` | `jdbc:h2:mem:employeedb` | Database URL |
| `MANAGEMENT_ENDPOINTS_WEB_EXPOSURE_INCLUDE` | `health,info,metrics,prometheus` | Exposed actuator endpoints |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👤 Author

**Khushal Bhavsar**

- GitHub: [@khushalbhavsar](https://github.com/khushalbhavsar)

---

## ⭐ Show Your Support

Give a ⭐ if this project helped you!
