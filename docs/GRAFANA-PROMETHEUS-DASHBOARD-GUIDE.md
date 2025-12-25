# 📊 Grafana & Prometheus Dashboard Creation Guide

A comprehensive guide to creating monitoring dashboards for the Employee Management System (EMS) Spring Boot application.

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Prerequisites](#-prerequisites)
- [Setting Up Prometheus](#-setting-up-prometheus)
- [Setting Up Grafana](#-setting-up-grafana)
- [Creating Data Source](#-creating-data-source)
- [Building Dashboard from Scratch](#-building-dashboard-from-scratch)
- [Essential Spring Boot Metrics](#-essential-spring-boot-metrics)
- [Advanced Dashboard Features](#-advanced-dashboard-features)
- [Alerting Setup](#-alerting-setup)
- [Best Practices](#-best-practices)
- [Troubleshooting](#-troubleshooting)

---

## 🎯 Overview

This guide walks you through creating comprehensive monitoring dashboards for your Spring Boot Employee Management System using:

- **Prometheus** - Metrics collection and storage
- **Grafana** - Visualization and dashboard creation
- **Spring Boot Actuator** - Application metrics exposure

The final result will be a professional dashboard showing JVM metrics, HTTP performance, database connections, and application health.

---

## 📦 Prerequisites

### Software Requirements

| Component | Version | Purpose |
|-----------|---------|---------|
| **Grafana** | 9.0+ | Dashboard visualization |
| **Prometheus** | 2.30+ | Metrics collection |
| **Spring Boot** | 3.1+ | Application with Actuator |
| **Docker** | 20.0+ | Containerized deployment |

### Application Configuration

Ensure your Spring Boot application has these dependencies in `pom.xml`:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>

<dependency>
    <groupId>io.micrometer</groupId>
    <artifactId>micrometer-registry-prometheus</artifactId>
</dependency>
```

And this configuration in `application.properties`:

```properties
# Actuator Configuration
management.endpoints.web.exposure.include=health,info,metrics,prometheus
management.endpoint.health.show-details=always
management.endpoint.prometheus.enabled=true
management.metrics.export.prometheus.enabled=true

# Optional: Custom metrics
management.metrics.tags.application=employee-management
```

---

## 📈 Setting Up Prometheus

### Step 1: Create Prometheus Configuration

Create `config/prometheus.yml`:

```yaml
# Prometheus Configuration
global:
  scrape_interval: 15s      # How often to scrape targets
  evaluation_interval: 15s  # How often to evaluate rules

scrape_configs:
  # Spring Boot Application Metrics
  - job_name: 'employee-management'
    metrics_path: '/actuator/prometheus'
    scrape_interval: 15s
    static_configs:
      - targets: ['employee-management:8080']
        labels:
          application: 'employee-management'
          environment: 'development'

  # Prometheus Self-Monitoring
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']
```

### Step 2: Start Prometheus

#### Using Docker Compose

```yaml
version: '3.8'
services:
  prometheus:
    image: prom/prometheus:latest
    ports:
      - "9090:9090"
    volumes:
      - ./config/prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
    networks:
      - monitoring

volumes:
  prometheus_data:

networks:
  monitoring:
    driver: bridge
```

#### Manual Installation

```bash
# Download and extract Prometheus
wget https://github.com/prometheus/prometheus/releases/download/v2.40.0/prometheus-2.40.0.linux-amd64.tar.gz
tar xvfz prometheus-2.40.0.linux-amd64.tar.gz
cd prometheus-2.40.0.linux-amd64

# Start Prometheus
./prometheus --config.file=prometheus.yml
```

### Step 3: Verify Prometheus

1. **Access Prometheus:** http://localhost:9090
2. **Check Status:** http://localhost:9090/status
3. **View Targets:** http://localhost:9090/targets
4. **Query Metrics:** http://localhost:9090/graph

---

## 📊 Setting Up Grafana

### Step 1: Start Grafana

#### Using Docker Compose

```yaml
version: '3.8'
services:
  grafana:
    image: grafana/grafana:latest
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_USER=admin
      - GF_SECURITY_ADMIN_PASSWORD=admin
      - GF_INSTALL_PLUGINS=grafana-piechart-panel
    volumes:
      - grafana_data:/var/lib/grafana
    networks:
      - monitoring

volumes:
  grafana_data:

networks:
  monitoring:
    driver: bridge
```

#### Manual Installation

```bash
# Download and install Grafana
wget https://dl.grafana.com/oss/release/grafana-9.3.0.linux-amd64.tar.gz
tar -zxvf grafana-9.3.0.linux-amd64.tar.gz
cd grafana-9.3.0

# Start Grafana
./bin/grafana-server
```

### Step 2: First Login

1. **URL:** http://localhost:3000
2. **Username:** `admin`
3. **Password:** `admin`
4. **Change password** when prompted

---

## 🔗 Creating Data Source

### Step 1: Add Prometheus Data Source

1. **Navigate:** Configuration → Data Sources
2. **Click:** "Add data source"
3. **Select:** Prometheus

### Step 2: Configure Connection

| Setting | Value |
|---------|-------|
| **Name** | `Prometheus` |
| **URL** | `http://prometheus:9090` (Docker) or `http://localhost:9090` (local) |
| **Access** | `Server` (for Docker) or `Browser` (for local) |
| **Scrape interval** | `15s` |

### Step 3: Test Connection

Click **"Save & Test"** - you should see "Data source is working"

---

## 🏗️ Building Dashboard from Scratch

### Step 1: Create New Dashboard

1. **Click:** "+" icon → "Dashboard"
2. **Click:** "Add a new panel"

### Step 2: Configure First Panel - JVM Memory

#### Panel Settings:
- **Title:** `JVM Memory Usage`
- **Visualization:** `Graph` (or `Time series` in newer versions)

#### Query Configuration:
```
Metric: jvm_memory_used_bytes{application="employee-management"}
Legend: {{area}} - {{id}}
```

#### Field Configuration:
- **Unit:** `bytes`
- **Min:** `0`
- **Display:** `Lines`

### Step 3: Add HTTP Request Rate Panel

#### Panel Settings:
- **Title:** `HTTP Request Rate`
- **Visualization:** `Graph`

#### Query Configuration:
```
Metric: rate(http_server_requests_seconds_count{application="employee-management"}[5m])
Legend: {{uri}} - {{method}}
```

#### Field Configuration:
- **Unit:** `reqps` (requests per second)
- **Min:** `0`

### Step 4: Add CPU Usage Panel

#### Panel Settings:
- **Title:** `CPU Usage`
- **Visualization:** `Graph`

#### Query Configuration:
```
Metric: process_cpu_usage{application="employee-management"}
Legend: CPU Usage
```

#### Field Configuration:
- **Unit:** `percent (0.0-1.0)`
- **Min:** `0`
- **Max:** `1`

### Step 5: Add Database Connections Panel

#### Panel Settings:
- **Title:** `Active Database Connections`
- **Visualization:** `Graph`

#### Query Configuration:
```
Metric: hikaricp_connections_active{application="employee-management"}
Legend: Active Connections
```

#### Field Configuration:
- **Unit:** `short` (number)
- **Min:** `0`

### Step 6: Dashboard Settings

#### General Settings:
- **Name:** `Employee Management - Application Metrics`
- **Tags:** `spring-boot`, `employee-management`
- **Timezone:** `Browser`
- **Refresh:** `10s`

#### Layout:
- **Grid:** 2 columns
- **Height:** 8 units per panel

---

## 📏 Essential Spring Boot Metrics

### JVM Metrics

| Metric | Description | Query |
|--------|-------------|-------|
| **Memory Usage** | Heap/Non-heap memory | `jvm_memory_used_bytes` |
| **Memory Max** | Maximum memory available | `jvm_memory_max_bytes` |
| **GC Count** | Garbage collection events | `jvm_gc_pause_seconds_count` |
| **GC Duration** | GC pause time | `jvm_gc_pause_seconds_sum` |
| **Threads** | Active thread count | `jvm_threads_live_threads` |
| **CPU Usage** | Process CPU utilization | `process_cpu_usage` |

### HTTP Metrics

| Metric | Description | Query |
|--------|-------------|-------|
| **Request Count** | Total HTTP requests | `http_server_requests_seconds_count` |
| **Request Rate** | Requests per second | `rate(http_server_requests_seconds_count[5m])` |
| **Response Time** | Request duration | `http_server_requests_seconds_sum` |
| **Status Codes** | Response status distribution | `http_server_requests_seconds_count{status="200"}` |

### Database Metrics

| Metric | Description | Query |
|--------|-------------|-------|
| **Active Connections** | Current DB connections | `hikaricp_connections_active` |
| **Idle Connections** | Available connections | `hikaricp_connections_idle` |
| **Connection Timeouts** | Failed connection attempts | `hikaricp_connections_timeout_total` |
| **Connection Usage** | Connection utilization | `hikaricp_connections_usage_seconds_sum` |

### Application Metrics

| Metric | Description | Query |
|--------|-------------|-------|
| **Health Status** | Application health | `up{application="employee-management"}` |
| **Uptime** | Application uptime | `process_uptime_seconds` |
| **Custom Metrics** | Business-specific metrics | `application_*` |

---

## 🚀 Advanced Dashboard Features

### Step 1: Add Variables

Create dashboard variables for dynamic filtering:

1. **Go to:** Dashboard Settings → Variables
2. **Add Variable:**
   - **Name:** `application`
   - **Type:** `Custom`
   - **Values:** `employee-management`
   - **Default:** `employee-management`

### Step 2: Add Thresholds

Set visual thresholds for panels:

```json
{
  "thresholds": {
    "mode": "absolute",
    "steps": [
      { "color": "green", "value": null },
      { "color": "red", "value": 80 }
    ]
  }
}
```

### Step 3: Add Annotations

Mark deployment events:

```promql
up{application="$application"} == 0
```

### Step 4: Create Table Panel

Show HTTP endpoints performance:

| Field | Query |
|-------|-------|
| **Endpoint** | `http_server_requests_seconds_count` |
| **Method** | `{{method}}` |
| **Status** | `{{status}}` |
| **Count** | `{{value}}` |

### Step 5: Add Gauge Panel

Visualize CPU usage:

- **Query:** `process_cpu_usage{application="$application"}`
- **Thresholds:** 0-70% (green), 70-90% (yellow), 90%+ (red)

---

## 🚨 Alerting Setup

### Step 1: Create Alert Rules

1. **Go to:** Alerting → Alert rules
2. **Create:** New alert rule

#### High CPU Usage Alert:
```
Name: High CPU Usage
Query: process_cpu_usage{application="employee-management"} > 0.8
For: 5m
Labels: severity=warning
```

#### Memory Usage Alert:
```
Name: High Memory Usage
Query: jvm_memory_used_bytes{area="heap", application="employee-management"} / jvm_memory_max_bytes{area="heap"} > 0.9
For: 5m
Labels: severity=critical
```

#### Application Down Alert:
```
Name: Application Down
Query: up{application="employee-management"} == 0
For: 1m
Labels: severity=critical
```

### Step 2: Configure Contact Points

1. **Go to:** Alerting → Contact points
2. **Add:** Email, Slack, or webhook notifications

### Step 3: Create Notification Policies

Set up escalation policies for different severity levels.

---

## 💡 Best Practices

### Dashboard Design

1. **Consistent Layout:** Use grid system (24 columns)
2. **Color Coding:** Green/Yellow/Red for status
3. **Time Ranges:** Default to 1h, 6h, 24h, 7d
4. **Refresh Rates:** 10s for real-time, 1m for overview
5. **Panel Heights:** 8 units standard, 16 for important metrics

### Query Optimization

1. **Use Rate Functions:** For counters, use `rate()` or `increase()`
2. **Add Time Ranges:** `[5m]`, `[1h]` for rate calculations
3. **Filter by Labels:** Use `{application="$application"}`
4. **Avoid High Cardinality:** Don't create too many time series

### Performance Tips

1. **Reduce Data Points:** Use `$_interval` in queries
2. **Use Recording Rules:** Pre-compute expensive queries
3. **Optimize Scrape Intervals:** Balance between freshness and performance
4. **Use Summaries:** For high-frequency metrics

### Security

1. **Secure Grafana:** Change default admin password
2. **Use HTTPS:** Enable SSL/TLS
3. **Access Control:** Configure users and roles
4. **Network Security:** Restrict access to monitoring ports

---

## 🔧 Troubleshooting

### Common Issues

#### "No Data" in Panels

1. **Check Prometheus targets:**
   ```bash
   curl http://localhost:9090/api/v1/targets
   ```

2. **Verify metrics endpoint:**
   ```bash
   curl http://localhost:8081/actuator/prometheus
   ```

3. **Check application health:**
   ```bash
   curl http://localhost:8081/actuator/health
   ```

#### Grafana Connection Issues

1. **Test data source:**
   - Go to Data Sources → Prometheus → "Save & Test"

2. **Check network connectivity:**
   ```bash
   curl http://localhost:9090/-/healthy
   ```

#### High Memory Usage

1. **Optimize Prometheus storage:**
   ```yaml
   storage.tsdb.retention.time: 30d
   storage.tsdb.retention.size: 10GB
   ```

2. **Reduce scrape intervals:**
   ```yaml
   global:
     scrape_interval: 30s
   ```

#### Slow Dashboard Loading

1. **Reduce time range** to last 1h
2. **Use lower resolution** (higher step values)
3. **Optimize queries** with recording rules

---

## 📚 Additional Resources

### Official Documentation

- [Grafana Documentation](https://grafana.com/docs/)
- [Prometheus Documentation](https://prometheus.io/docs/)
- [Spring Boot Metrics](https://docs.spring.io/spring-boot/docs/current/reference/html/actuator.html)

### Useful Queries

```promql
# 95th percentile response time
histogram_quantile(0.95, rate(http_server_requests_seconds_bucket[5m]))

# Error rate percentage
rate(http_server_requests_seconds_count{status=~"5.."}[5m]) / rate(http_server_requests_seconds_count[5m]) * 100

# Memory usage percentage
jvm_memory_used_bytes{area="heap"} / jvm_memory_max_bytes{area="heap"} * 100
```

### Community Dashboards

- [Spring Boot Dashboard](https://grafana.com/grafana/dashboards/11378)
- [JVM Dashboard](https://grafana.com/grafana/dashboards/4701)
- [Micrometer Dashboard](https://grafana.com/grafana/dashboards/4701)

---

## 🎯 Summary

Following this guide, you'll have created a comprehensive monitoring dashboard that provides:

- ✅ **Real-time JVM monitoring** (memory, CPU, threads)
- ✅ **HTTP performance metrics** (request rates, response times)
- ✅ **Database connection tracking**
- ✅ **Application health monitoring**
- ✅ **Alerting for critical issues**
- ✅ **Professional dashboard layout**

Your Employee Management System will now have enterprise-grade monitoring capabilities! 🚀

---

## 📞 Support

If you encounter issues:

1. Check the [Troubleshooting](#-troubleshooting) section
2. Verify your Spring Boot configuration
3. Ensure Prometheus can scrape your application
4. Check Grafana data source connectivity

For additional help, refer to the official documentation or community forums.