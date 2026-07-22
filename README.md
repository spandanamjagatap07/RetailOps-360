# RetailOps 360

RetailOps 360 is an enterprise retail operations and analytics platform that combines ETL, real-time Kafka streaming, REST APIs, operational dashboards, workflow automation, and business intelligence to enable data-driven retail decision making.

## Tech Stack

- Python
- Pandas
- PostgreSQL
- Apache Kafka
- Apache Airflow
- FastAPI
- React.js
- Power BI
- Docker

## System Architecture

<img width="800" height="600" alt="ChatGPT Image Jul 22, 2026, 10_39_06 AM" src="https://github.com/user-attachments/assets/69d1d610-0736-4b95-97db-c7f7d8c61a2b" />

## ETL Pipeline

Ten retail datasets are processed:

- Customers
- Orders
- Products
- Inventory
- Warehouses
- Promotions
- Clickstream
- Website Clickstream
- Delivery Tracking
- Employee Operations

The ETL pipeline performs data inspection, cleaning, standardization, duplicate removal, datetime conversion, validation, and loading into PostgreSQL.

## PostgreSQL

PostgreSQL contains:

- Bronze layer for raw retail data
- Silver layer for cleaned retail data
- Gold layer for analytical data
- Fact and Dimension tables
- Materialized Views
- Stored Procedures
- Triggers

## Apache Kafka

Kafka provides real-time retail streaming through multiple topics.

Topics include:

- orders
- inventory_events
- delivery_events

The Kafka producer reads retail data from PostgreSQL and publishes it to Kafka.

The Kafka consumer receives streaming messages and updates the database for real-time monitoring.

## Apache Airflow

Airflow orchestrates the complete ETL and streaming workflow.

Retail_ETL_Pipeline

→ Kafka Producer

→ Kafka Consumer

→ Materialized View Refresh

## FastAPI Backend

Provides REST APIs for:

- Retail Dashboard
- Store Performance
- Inventory Management
- Customer Analytics
- Promotions
- Live Monitoring
- Kafka Streaming

## React Frontend

The React dashboard includes:

- Retail Command Center
- Inventory Control Tower
- Customer Intelligence Center
- Promotion Analytics Center
- Store Operations Center
- Live Order Monitoring

## Power BI

Power BI provides business intelligence dashboards for:

- Executive Dashboard
- Sales Dashboard
- Inventory Dashboard
- Customer Dashboard
- Store Operations Dashboard

## Project Flow

CSV Retail Datasets

→ Python ETL

→ PostgreSQL Bronze Layer

→ PostgreSQL Silver Layer

→ PostgreSQL Gold Layer

→ Kafka

→ FastAPI

→ React Dashboard

PostgreSQL

→ Power BI Dashboards

Kafka

→ Live Monitoring

Airflow

→ ETL Automation & Kafka Streaming

## Key Features

- End-to-End ETL Pipeline
- Bronze, Silver & Gold Architecture
- PostgreSQL Data Warehouse
- Fact & Dimension Tables
- Materialized Views
- Real-Time Kafka Streaming
- Apache Airflow Workflow Automation
- FastAPI REST APIs
- React Monitoring Dashboard
- Power BI Business Intelligence
- Dockerized Services
- Retail Analytics & KPI Dashboards
