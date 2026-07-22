from config import DB_CONFIG, KAFKA_LOCAL
import psycopg2
from kafka import KafkaConsumer
import json

# -------------------------------------------------
# PostgreSQL Connection
# -------------------------------------------------

conn = psycopg2.connect(**DB_CONFIG)
cursor = conn.cursor()

# -------------------------------------------------
# Kafka Consumer
# -------------------------------------------------

consumer = KafkaConsumer(
    "orders",
    "delivery_events",
    "inventory_events",
    bootstrap_servers=KAFKA_LOCAL,
    auto_offset_reset="latest",
    enable_auto_commit=True,
    group_id=None,   # <-- important
    value_deserializer=lambda x: json.loads(x.decode("utf-8"))
)
print("Connected to Kafka...")
print("=" * 60)
print("Windows Consumer Started")
print("=" * 60)

for message in consumer:

    data = message.value

    print("\n================================")
    print("Topic :", message.topic)
    print(data)
    print("================================")

    try:

        # ---------------------------------------
        # ORDERS
        # ---------------------------------------

        if message.topic == "orders":

            cursor.execute("""
                INSERT INTO stream_orders
                (
                    order_id,
                    customer_id,
                    product_id,
                    quantity,
                    revenue,
                    region,
                    order_time
                )
                VALUES (%s,%s,%s,%s,%s,%s,%s);
            """,
            (
                data["order_id"],
                data["customer_id"],
                data["product_id"],
                data["quantity"],
                data["revenue"],
                data["region"],
                data["order_time"]
            ))

            conn.commit()

            print("Order Inserted")

        # ---------------------------------------
        # DELIVERY
        # ---------------------------------------

        elif message.topic == "delivery_events":

            cursor.execute("""
                INSERT INTO stream_delivery
                (
                    delivery_id,
                    order_id,
                    estimated_days,
                    actual_days,
                    delivery_status
                )
                VALUES (%s,%s,%s,%s,%s);
            """,
            (
                data["delivery_id"],
                data["order_id"],
                data["estimated_days"],
                data["actual_days"],
                data["delivery_status"]
            ))

            conn.commit()

            print("Delivery Inserted")

        # ---------------------------------------
        # INVENTORY
        # ---------------------------------------

        elif message.topic == "inventory_events":

            cursor.execute("""
                INSERT INTO stream_inventory
                (
                    product_id,
                    warehouse_id,
                    stock_level,
                    alert
                )
                VALUES (%s,%s,%s,%s);
                
            """,
            (
                
                data["product_id"],
                data["warehouse_id"],
                data["stock_level"],
                data["alert"]
            ))

            conn.commit()

            print("Inventory Inserted")

    except Exception as e:

        conn.rollback()

        print("Database Error")
        print(e)

consumer.close()
cursor.close()
conn.close()

print("=" * 60)
print("Consumer Finished")
print("=" * 60)