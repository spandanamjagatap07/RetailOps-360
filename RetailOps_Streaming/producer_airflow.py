from airflow_config import DB_CONFIG, KAFKA_DOCKER
from kafka import KafkaProducer
import psycopg2
import json
import time

# PostgreSQL Connection
conn = psycopg2.connect(**DB_CONFIG)
cursor = conn.cursor()

# Kafka Producer
producer = KafkaProducer(
    bootstrap_servers=KAFKA_DOCKER,
    value_serializer=lambda v: json.dumps(v, default=str).encode("utf-8")
)

print("=" * 60)
print("Airflow Producer Started")
print("=" * 60)

# ---------------------------------------------------
# ORDERS
# ---------------------------------------------------

cursor.execute("""
SELECT
    order_id,
    customer_id,
    product_id,
    quantity,
    revenue,
    region,
    order_timestamp
FROM silver.orders
LIMIT 30;
""")

orders = cursor.fetchall()

for row in orders:

    order = {
        "order_id": row[0],
        "customer_id": row[1],
        "product_id": row[2],
        "quantity": row[3],
        "revenue": float(row[4]),
        "region": row[5],
        "order_time": str(row[6])
    }

    producer.send("orders", order)
    print("Order Sent :", order["order_id"])

# ---------------------------------------------------
# DELIVERY EVENTS
# ---------------------------------------------------

cursor.execute("""
SELECT
    delivery_id,
    order_id,
    estimated_days,
    actual_days,
    delivery_status
FROM silver.delivery_tracking
LIMIT 30;
""")

deliveries = cursor.fetchall()

for row in deliveries:

    delivery = {
        "delivery_id": row[0],
        "order_id": row[1],
        "estimated_days": row[2],
        "actual_days": row[3],
        "delivery_status": row[4]
    }

    producer.send("delivery_events", delivery)
    print("Delivery Sent :", delivery["delivery_id"])

# ---------------------------------------------------
# INVENTORY EVENTS
# ---------------------------------------------------

cursor.execute("""
SELECT
    inventory_id,
    product_id,
    warehouse,
    stock_level,
    reorder_level,
    last_updated
FROM silver.inventory
LIMIT 30;
""")

inventory = cursor.fetchall()

for row in inventory:

    stock = row[3]

    if stock < 20:
        alert = "Low Stock"
    elif stock > 80:
        alert = "Overstock"
    else:
        alert = "Normal"

    inventory_event = {
        "inventory_id": row[0],
        "product_id": row[1],
        "warehouse_id": row[2],
        "stock_level": stock,
        "reorder_level": row[4],
        "last_updated": str(row[5]),
        "alert": alert
    }

    producer.send("inventory_events", inventory_event)
    print("Inventory Sent :", inventory_event["inventory_id"])

# ---------------------------------------------------

producer.flush()

print("=" * 60)
print("Streaming Completed Successfully")
print("=" * 60)

producer.close()
cursor.close()
conn.close()