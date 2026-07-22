# 🛍️ RetailOps 360 – Enterprise Retail Data Engineering & Analytics Platform

## 📌 Overview

RetailOps 360 is an end-to-end Retail Data Engineering and Analytics platform designed to process, analyze, and visualize enterprise retail data. The project combines batch ETL, real-time data streaming, interactive dashboards, REST APIs, and business intelligence to provide actionable insights for retail operations.

The platform implements a modern Medallion Architecture (Bronze, Silver, Gold), integrates Apache Airflow for orchestration, Apache Kafka for streaming, FastAPI for backend services, React for frontend dashboards, PostgreSQL as the data warehouse, Power BI for executive analytics, and Grafana for live monitoring.

---

# 🚀 Features

### Data Engineering
- Bronze, Silver, and Gold Layer Architecture
- Data Cleaning and Transformation
- Incremental ETL Processing
- Materialized Views
- Star Schema Data Warehouse
- Fact & Dimension Tables
- Audit Logging
- Stored Procedures
- SQL Analytics Queries

### Real-Time Streaming
- Apache Kafka Producer
- Apache Kafka Consumer
- Live Order Streaming
- Inventory Streaming
- Delivery Event Streaming
- Airflow Scheduled Streaming Jobs

### Backend
- FastAPI REST APIs
- PostgreSQL Integration
- SQLAlchemy
- Dynamic KPI Endpoints
- Store Analytics APIs
- Pricing Recommendation APIs

### Frontend
- React Dashboard
- Retail Command Center
- Inventory Dashboard
- Customer Dashboard
- Promotions Dashboard
- Store Operations Dashboard
- Live Monitoring Dashboard

### Business Intelligence
- Executive Dashboard
- Sales Dashboard
- Inventory Dashboard
- Customer Dashboard
- Store Operations Dashboard
- Interactive Power BI Reports
- Grafana Live Monitoring

---

# 🏗️ System Architecture

```
                    CSV Retail Datasets
                           │
                           ▼
                  Data Cleaning (Python)
                           │
                           ▼
                PostgreSQL Bronze Layer
                           │
                    ETL Transformations
                           │
                           ▼
                PostgreSQL Silver Layer
                           │
                Business Transformations
                           │
                           ▼
                 PostgreSQL Gold Layer
                           │
         ┌─────────────────┼──────────────────┐
         │                 │                  │
         ▼                 ▼                  ▼
    FastAPI APIs     Power BI Dashboards   Kafka Topics
         │                                   │
         ▼                                   ▼
 React Dashboard                    Kafka Producer
         │                                   │
         └──────────────► Kafka Consumer ◄───┘
                           │
                           ▼
                      PostgreSQL
                           │
                           ▼
                   Grafana Monitoring

```

---

# 🛠️ Tech Stack

| Category | Technologies |
|----------|--------------|
| Programming | Python, JavaScript |
| Backend | FastAPI |
| Frontend | React.js |
| Database | PostgreSQL |
| ETL | Python, SQL |
| Workflow | Apache Airflow |
| Streaming | Apache Kafka |
| Visualization | Power BI, Grafana |
| Containerization | Docker |
| Version Control | Git, GitHub |

---

# 📂 Project Structure

```
Retail Project/
│
├── airflow/
│
├── backend/
│
├── cleaned_dataset/
│
├── data/
│
├── RetailOps_Grafana/
│
├── RetailOps_Streaming/
│
├── retail-portal/
│
├── cleaning.py
│
├── dashboards.pbix
│
└── README.md
```

---

# 🗄️ Data Pipeline

```
Raw CSV Files
      │
      ▼
Python Data Cleaning
      │
      ▼
Bronze Layer
      │
      ▼
Silver Layer
      │
      ▼
Gold Layer
      │
      ├── Fact Tables
      ├── Dimension Tables
      └── Materialized Views
```

---

# 📊 Dashboards

## Executive Dashboard

- Revenue
- Profit Margin
- Store Health Score
- Customer Satisfaction
- Inventory Turnover

---

## Sales Dashboard

- Daily Sales
- Revenue Trends
- Basket Size
- Conversion Rate

---

## Inventory Dashboard

- Inventory Value
- Stock Availability
- Stockout Alerts
- Overstock Risk
- Reorder Status

---

## Customer Dashboard

- Customer Lifetime Value (CLV)
- Loyalty Score
- Retention Rate
- Churn Rate

---

## Store Operations Dashboard

- Footfall
- Workforce Productivity
- Queue Time
- Operational Efficiency

---

## Live Monitoring Dashboard

- Orders per Minute
- Revenue per Minute
- Delivery Tracking
- Inventory Alerts
- Warehouse Monitoring

---

# ⚡ Kafka Streaming

Topics Used

- orders
- inventory_events
- delivery_events

Streaming Components

- Kafka Producer
- Kafka Consumer
- Airflow Scheduler
- PostgreSQL Storage

---

# 📡 REST APIs

Example APIs

```
GET /
GET /stores
GET /stores/performance
GET /stores/{store_id}
GET /pricing
POST /pricing/recommendation
```

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/spandanamjagatap07/RetailOps-360.git
```

---

## Backend

```bash
cd backend

pip install -r requirements.txt

uvicorn app:app --reload
```

Backend URL

```
http://127.0.0.1:8000/docs
```

---

## Frontend

```bash
cd retail-portal

npm install

npm run dev
```

---

## Kafka

```bash
docker compose up -d
```

---

## Airflow

```bash
docker compose up airflow-init

docker compose up -d
```

---

## Power BI

Open

```
dashboards.pbix
```

using Microsoft Power BI Desktop.

---

# 📈 ETL Workflow

```
Raw Data
    │
Cleaning
    │
Bronze Layer
    │
Silver Layer
    │
Gold Layer
    │
Materialized Views
    │
Dashboards
```

---

# 📌 Key Highlights

- End-to-End Data Engineering Project
- Enterprise Data Warehouse
- Batch + Streaming Pipeline
- Real-Time Monitoring
- Interactive Dashboards
- REST API Services
- Business Intelligence
- Modern Medallion Architecture
- Dockerized Services
- Airflow Workflow Automation

---

# 👩‍💻 Author

**Spandana M Jagatap**

GitHub: https://github.com/spandanamjagatap07

---

# 📄 License

This project was developed for educational and hackathon purposes.
