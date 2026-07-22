from config import KAFKA_LOCAL
from kafka import KafkaProducer
import psycopg2
import json
import time
from datetime import datetime

# ---------------- PostgreSQL Connection ----------------

conn = psycopg2.connect(
    host="localhost",
    database="retailops360",
    user="postgres",
    password="spandu",
    port="5432"
)

cursor = conn.cursor()

# ---------------- Kafka Producer ----------------

producer = KafkaProducer(
    bootstrap_servers=KAFKA_LOCAL,
    value_serializer=lambda v: json.dumps(v).encode("utf-8")
)

# =====================================================
# ORDERS
# =====================================================

cursor.execute("""
SELECT
    order_id,
    customer_id,
    product_id,
    quantity,
    revenue,
    region,
    order_timestamp
FROM gold.fact_sales
LIMIT 30;
""")

sales_rows = cursor.fetchall()

for row in sales_rows:

    order = {
        "order_id": row[0],
        "customer_id": row[1],
        "product_id": row[2],
        "quantity": row[3],
        "revenue": float(row[4]),
        "region": row[5],
        "order_time": row[6].strftime("%Y-%m-%d %H:%M:%S")
    }

    producer.send("orders", order)
    producer.flush()

    print(f"Order Sent : {order['order_id']}")

    time.sleep(1)

# =====================================================
# DELIVERY
# =====================================================

cursor.execute("""
SELECT
    delivery_id,
    order_id,
    estimated_days,
    actual_days,
    delivery_status
FROM gold.fact_delivery
LIMIT 30;
""")

delivery_rows = cursor.fetchall()

for row in delivery_rows:

    delivery = {
        "delivery_id": row[0],
        "order_id": row[1],
        "estimated_days": row[2],
        "actual_days": row[3],
        "delivery_status": row[4]
    }

    producer.send("delivery_events", delivery)
    producer.flush()

    print(f"Delivery Sent : {delivery['delivery_id']}")

    time.sleep(1)

# =====================================================
# INVENTORY
# =====================================================

cursor.execute("""
SELECT
    product_id,
    warehouse,
    stock_level,
    reorder_level
FROM gold.fact_inventory
LIMIT 30;
""")

inventory_rows = cursor.fetchall()

for row in inventory_rows:

    stock = row[2]
    reorder = row[3]

    if stock < reorder:
        alert = "Low Stock"
    elif stock > reorder * 2:
        alert = "Overstock"
    else:
        alert = "Normal"

    inventory = {
        "product_id": row[0],
        "warehouse_id": row[1],
        "stock_level": stock,
        "alert": alert
    }

    producer.send("inventory_events", inventory)
    producer.flush()

    print(f"Inventory Sent : {inventory['product_id']}")

    time.sleep(1)

# ---------------- Cleanup ----------------

cursor.close()
conn.close()

producer.close()

print("Streaming Completed Successfully")