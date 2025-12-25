# Employee Management System (EMS) - Spring Boot Application

A comprehensive Employee Management System built with Spring Boot 3.1.4, featuring complete CI/CD pipeline integration with Docker, Jenkins, Prometheus, Grafana, and SonarQube for monitoring and code quality analysis.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Running the Application](#running-the-application)
- [Building the Application](#building-the-application)
- [Docker Deployment](#docker-deployment)
- [Jenkins CI/CD Pipeline](#jenkins-cicd-pipeline)
- [Monitoring with Prometheus & Grafana](#monitoring-with-prometheus--grafana)
- [SonarQube Code Quality Analysis](#sonarqube-code-quality-analysis)
- [API Endpoints](#api-endpoints)
- [Database Configuration](#database-configuration)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Project Overview

The Employee Management System is a full-stack Spring Boot application designed to manage employee records with the following features:

- **REST API** for CRUD operations on employee data
- **Web UI** with HTML/CSS/JavaScript frontend
- **H2 Database** for in-memory data persistence
- **Spring Data JPA** for database operations
- **Docker & Kubernetes** ready deployment
- **CI/CD Pipeline** with Jenkins
- **Real-time Monitoring** with Prometheus and Grafana
- **Code Quality Analysis** with SonarQube
- **Automated Testing** with JUnit and Maven

## 🛠 Technology Stack

| Component | Version |
|-----------|---------|
| **Java** | 17 (LTS) - Upgradeable to 21 |
| **Spring Boot** | 3.1.4 |
| **Maven** | 3.8.x (via Maven Wrapper) |
| **Database** | H2 (In-memory) |
| **Build** | Maven |
| **Containerization** | Docker |
| **CI/CD** | Jenkins |
| **Monitoring** | Prometheus, Grafana |
| **Code Quality** | SonarQube |
| **Testing** | JUnit 5, Spring Boot Test |

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

### Required
- **Java Development Kit (JDK) 17+** or **Java 21 LTS**
  - Download: https://www.oracle.com/java/technologies/downloads/
  - Or use OpenJDK: https://adoptium.net/
- **Git** for version control
- **Maven** (optional - Maven Wrapper included)

### Optional (for DevOps features)
- **Docker** (v20.10+) - For containerization
- **Docker Compose** - For multi-container orchestration
- **Jenkins** - For CI/CD pipeline
- **Prometheus** - For metrics collection
- **Grafana** - For visualization
- **SonarQube** - For code quality

## 📂 Project Structure

```
.
├── src/
│   ├── main/
│   │   ├── java/com/example/
│   │   │   ├── EmployeeManagementApplication.java    # Spring Boot Entry Point
│   │   │   ├── controller/
│   │   │   │   └── EmployeeController.java           # REST API Endpoints
│   │   │   ├── model/
│   │   │   │   └── Employee.java                     # Entity Model
│   │   │   ├── repository/
│   │   │   │   └── EmployeeRepository.java           # Data Access Layer
│   │   │   └── service/
│   │   │       └── EmployeeService.java              # Business Logic
│   │   └── resources/
│   │       ├── application.properties                 # App Configuration
│   │       └── static/
│   │           ├── index.html                         # Web UI
│   │           ├── script.js                          # Frontend Logic
│   │           └── styles.css                         # Styling
│   └── test/
│       └── java/com/example/
│           └── EmployeeManagementApplicationTests.java # Unit Tests
├── Dockerfile                                          # Docker Container Config
├── docker-compose.yml                                  # Multi-container Setup
├── Jenkinsfile                                         # CI/CD Pipeline
├── pom.xml                                             # Maven Dependencies
├── mvnw / mvnw.cmd                                     # Maven Wrapper
├── prometheus.yml                                      # Prometheus Config
├── grafana-datasource.yml                              # Grafana Setup
├── grafana-dashboard.json                              # Dashboard Config
├── EC2-SETUP-*.md                                      # AWS EC2 Setup Guide
├── INTEGRATION-GUIDE.md                                # Integration Guide
└── README.md                                           # This File
```

## 🚀 Installation & Setup

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd DevOps-EMS-Spring-Boot--Docker--Jenkins
```

### Step 2: Verify Java Installation

```bash
# Check Java version
java -version

# Check compiler version
javac -version
```

**Expected Output:**
```
java version "17.0.x" (or "21.x.x")
```

### Step 3: Verify Maven Setup

```bash
# Check Maven Wrapper (Windows)
mvnw.cmd -version

# Or on Linux/Mac
./mvnw -version
```

### Step 4: Install Dependencies

```bash
# Windows
mvnw.cmd clean install

# Linux/Mac
./mvnw clean install
```

This will:
- Clean previous builds
- Download all dependencies from Maven Central
- Compile source code
- Run unit tests
- Package the application

## ▶️ Running the Application

### Method 1: Using Maven (Development)

```bash
# Windows
mvnw.cmd spring-boot:run

# Linux/Mac
./mvnw spring-boot:run
```

### Method 2: Using JAR File (Production)

```bash
# Build the JAR
mvnw.cmd clean package

# Run the JAR
java -jar target/employee-management-0.0.1-SNAPSHOT.jar
```

### Method 3: Using IDE (IntelliJ IDEA / Eclipse)

1. Open the project in your IDE
2. Right-click on `EmployeeManagementApplication.java`
3. Select **Run** or **Run as Spring Boot App**

### Method 4: Using Docker

```bash
# Build Docker image
docker build -t employee-management:latest .

# Run container
docker run -p 8080:8080 --name ems-app employee-management:latest
```

### Verification

Once started, the application will log:

```
Started EmployeeManagementApplication in X.XXX seconds
```

Access the application at: **http://localhost:8080**

## 🏗️ Building the Application

### Clean Build

```bash
mvnw.cmd clean package
```

### Build with Tests

```bash
mvnw.cmd clean verify
```

### Build with Code Coverage (JaCoCo)

```bash
mvnw.cmd clean install
# Coverage report at: target/site/jacoco/index.html
```

### Build Output

- **JAR File**: `target/employee-management-0.0.1-SNAPSHOT.jar`
- **Test Results**: `target/surefire-reports/`
- **Code Coverage**: `target/site/jacoco/`
- **Classes**: `target/classes/`

## 🐳 Docker Deployment

### Build Docker Image

```bash
# Build image with tag
docker build -t employee-management:1.0.0 .

# Tag as latest
docker tag employee-management:1.0.0 employee-management:latest
```

### Run Single Container

```bash
# Run with port mapping
docker run -d \
  --name ems-app \
  -p 8080:8080 \
  -e JAVA_OPTS="-Xmx512m -Xms256m" \
  employee-management:latest

# View logs
docker logs -f ems-app

# Stop container
docker stop ems-app

# Remove container
docker rm ems-app
```

### Docker Compose (Multi-container)

```bash
# Start services
docker-compose up -d

# View services
docker-compose ps

# View logs
docker-compose logs -f app

# Stop services
docker-compose down
```

Services in docker-compose.yml:
- **app**: Spring Boot Application (port 8080)
- **prometheus**: Metrics collection (port 9090)
- **grafana**: Visualization (port 3000)
- **jenkins**: CI/CD (port 8081)

## 🔄 Jenkins CI/CD Pipeline

### Prerequisites

```bash
# Start Jenkins on EC2
docker run -d \
  --name jenkins \
  -p 8080:8080 \
  -p 50000:50000 \
  -v /var/run/docker.sock:/var/run/docker.sock \
  jenkins/jenkins:latest
```

### Jenkinsfile Stages

1. **Checkout** - Clone repository
2. **Build** - Compile with Maven
3. **Test** - Run unit tests
4. **Code Quality** - SonarQube analysis
5. **Docker Build** - Create Docker image
6. **Push** - Push to registry
7. **Deploy** - Deploy to target environment

### Running Pipeline

1. Create new Pipeline job in Jenkins
2. Point to repository URL
3. Set `Jenkinsfile` as pipeline script
4. Configure webhooks for auto-trigger
5. Run pipeline

### Monitor Pipeline

- Jenkins Dashboard: http://your-jenkins-host:8080
- Build Logs: Jenkins UI > Job > Build > Console Output

## 📊 Monitoring with Prometheus & Grafana

### Prometheus

**Configuration**: `prometheus.yml`

```bash
# Start Prometheus
docker run -d \
  --name prometheus \
  -p 9090:9090 \
  -v $(pwd)/prometheus.yml:/etc/prometheus/prometheus.yml \
  prom/prometheus
```

Access: http://localhost:9090

**Metrics Endpoints:**
- Application Metrics: http://localhost:8080/actuator/prometheus
- Health Check: http://localhost:8080/actuator/health

### Grafana

**Configuration**: `grafana-datasource.yml`, `grafana-dashboard.json`

```bash
# Start Grafana
docker run -d \
  --name grafana \
  -p 3000:3000 \
  -e GF_SECURITY_ADMIN_PASSWORD=admin \
  grafana/grafana
```

Access: http://localhost:3000 (admin/admin)

**Setup Steps:**
1. Add Prometheus datasource
2. Import dashboard from `grafana-dashboard.json`
3. Configure alerts
4. View real-time metrics

### Key Metrics Monitored

- **JVM Memory**: Heap usage, garbage collection
- **HTTP Requests**: Request rate, response time
- **Database Connections**: Active connections, pool status
- **Application Health**: Uptime, error rates

## 🔍 SonarQube Code Quality Analysis

### Installation

```bash
# Start SonarQube
docker run -d \
  --name sonarqube \
  -p 9000:9000 \
  sonarqube:latest
```

Access: http://localhost:9000 (admin/admin)

### Run Analysis

```bash
# Run SonarQube scan
mvnw.cmd clean verify sonar:sonar \
  -Dsonar.projectKey=employee-management \
  -Dsonar.sources=src/main/java \
  -Dsonar.host.url=http://localhost:9000 \
  -Dsonar.login=<sonar-token>
```

### Code Quality Gates

- **Coverage**: Minimum 80%
- **Duplications**: Maximum 3%
- **Code Smells**: Max 10
- **Bugs**: Zero critical
- **Security Issues**: Zero high/critical

## 📡 API Endpoints

### Employee Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| **GET** | `/api/employees` | Get all employees |
| **GET** | `/api/employees/{id}` | Get employee by ID |
| **POST** | `/api/employees` | Create new employee |
| **PUT** | `/api/employees/{id}` | Update employee |
| **DELETE** | `/api/employees/{id}` | Delete employee |

### Example Requests

**Get All Employees**
```bash
curl -X GET http://localhost:8080/api/employees
```

**Create Employee**
```bash
curl -X POST http://localhost:8080/api/employees \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "department": "Engineering",
    "salary": 75000
  }'
```

**Get Employee by ID**
```bash
curl -X GET http://localhost:8080/api/employees/1
```

**Update Employee**
```bash
curl -X PUT http://localhost:8080/api/employees/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "email": "jane@example.com",
    "department": "Management",
    "salary": 85000
  }'
```

**Delete Employee**
```bash
curl -X DELETE http://localhost:8080/api/employees/1
```

### Health & Actuator Endpoints

| Endpoint | Description |
|----------|-------------|
| `/actuator` | Available endpoints |
| `/actuator/health` | Application health |
| `/actuator/metrics` | JVM metrics |
| `/actuator/prometheus` | Prometheus metrics |
| `/h2-console` | H2 database console |

## 🗄️ Database Configuration

### H2 Database

**Configuration** in `application.properties`:

```properties
spring.datasource.url=jdbc:h2:mem:employeedb
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=

spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.jpa.hibernate.ddl-auto=create-drop
spring.h2.console.enabled=true
```

### Access H2 Console

1. Navigate to: http://localhost:8080/h2-console
2. **JDBC URL**: `jdbc:h2:mem:employeedb`
3. **User Name**: `sa`
4. **Password**: (leave empty)
5. Click **Connect**

### Switching to PostgreSQL (Optional)

**Add Dependency** in `pom.xml`:
```xml
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
    <scope>runtime</scope>
</dependency>
```

**Update** `application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/employeedb
spring.datasource.username=postgres
spring.datasource.password=password
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
```

## 🧪 Testing

### Run All Tests

```bash
# Windows
mvnw.cmd test

# Linux/Mac
./mvnw test
```

### Run Specific Test Class

```bash
mvnw.cmd test -Dtest=EmployeeControllerTest
```

### Run with Code Coverage

```bash
mvnw.cmd clean test jacoco:report
# Report: target/site/jacoco/index.html
```

### Test Results

- **Reports**: `target/surefire-reports/`
- **HTML Report**: `target/site/jacoco/index.html`

## 🐛 Troubleshooting

### Issue: "mvnw: command not found" (Linux/Mac)

**Solution:**
```bash
chmod +x mvnw
./mvnw clean install
```

### Issue: Port 8080 already in use

**Solution:**
```bash
# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :8080
kill -9 <PID>

# Or use different port
java -Dserver.port=8081 -jar target/employee-management-0.0.1-SNAPSHOT.jar
```

### Issue: Java version mismatch

**Solution:**
```bash
# Check installed JDK
java -version

# Set JAVA_HOME (Windows)
set JAVA_HOME=C:\Program Files\Java\jdk-17

# Set JAVA_HOME (Linux/Mac)
export JAVA_HOME=/usr/libexec/java_home -v 17
```

### Issue: Docker build fails

**Solution:**
```bash
# Clean Docker system
docker system prune -a

# Rebuild image
docker build --no-cache -t employee-management:latest .
```

### Issue: H2 Console not accessible

**Solution:** Ensure `spring.h2.console.enabled=true` in `application.properties`

### Issue: Prometheus not scraping metrics

**Solution:** Check `prometheus.yml` for correct endpoints:
```yaml
targets: ['localhost:8080']
```

### Issue: Gradle/Maven lock file conflicts

**Solution:**
```bash
mvnw.cmd clean install -U
```

The `-U` flag forces update of dependencies.

## 🔧 Upgrading to Java 21 LTS

### Update pom.xml

```xml
<properties>
    <java.version>21</java.version>
    <maven.compiler.source>${java.version}</maven.compiler.source>
    <maven.compiler.target>${java.version}</maven.compiler.target>
</properties>
```

### Clean Build

```bash
mvnw.cmd clean package
```

### Verify

```bash
java -version
```

## 📚 Additional Resources

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Spring Data JPA Guide](https://spring.io/projects/spring-data-jpa)
- [Docker Documentation](https://docs.docker.com/)
- [Jenkins Documentation](https://www.jenkins.io/doc/)
- [Prometheus Setup](https://prometheus.io/docs/prometheus/latest/getting_started/)
- [Grafana Tutorials](https://grafana.com/tutorials/)
- [SonarQube Setup](https://docs.sonarqube.org/latest/)

## 📝 Configuration Files

### application.properties

Main configuration file for Spring Boot application:
```properties
# Server
server.port=8080
spring.application.name=employee-management

# Database
spring.datasource.url=jdbc:h2:mem:employeedb
spring.jpa.hibernate.ddl-auto=create-drop

# H2 Console
spring.h2.console.enabled=true

# Actuator
management.endpoints.web.exposure.include=*
management.endpoint.health.show-details=always
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

## 👤 Author

- **Khushal Bhavsar**
- GitHub: [@khushalbhavsar](https://github.com/khushalbhavsar)

## ❓ FAQ

**Q: Can I use a different database?**  
A: Yes! The application is designed to work with any relational database. Update dependencies and connection strings in `application.properties`.

**Q: How do I deploy to production?**  
A: Use Docker containers and orchestrate with Kubernetes or deploy to AWS ECS, Azure Container Instances, or similar.

**Q: Is load balancing supported?**  
A: Yes, containerize the app and place behind a load balancer (nginx, HAProxy, or cloud-native solutions).

**Q: Can I integrate with a microservices architecture?**  
A: Yes, the RESTful API design makes it suitable for microservices with proper API gateway configuration.

**Q: How do I monitor in production?**  
A: Use Prometheus for metrics collection and Grafana for visualization, or integrate with cloud monitoring services.

---

**Last Updated**: December 25, 2025  
**Version**: 1.0.0
