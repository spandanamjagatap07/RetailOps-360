from airflow_config import DB_CONFIG, KAFKA_DOCKER
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
    bootstrap_servers=KAFKA_DOCKER,
    auto_offset_reset="latest",
    enable_auto_commit=True,
    group_id="retailops_stream",
    value_deserializer=lambda x: json.loads(x.decode("utf-8"))
)

print("=" * 60)
print("Kafka Consumer Started")
print("=" * 60)

message_count = 0
MAX_MESSAGES = 120

empty_polls = 0
MAX_EMPTY_POLLS = 5

while message_count < MAX_MESSAGES:

    records = consumer.poll(timeout_ms=2000)

    if not records:
        empty_polls += 1

        if empty_polls >= MAX_EMPTY_POLLS:
            print("No more messages.")
            break

        continue

    empty_polls = 0

    for tp, messages in records.items():

        for message in messages:

            data = message.value

            print("\n===================================")
            print("Topic :", message.topic)
            print(data)
            print("===================================")

            # -------------------------------------------------
            # ORDERS
            # -------------------------------------------------

            if message.topic == "orders":

                cursor.execute("""
                    INSERT INTO public.stream_orders
                    (
                        order_id,
                        customer_id,
                        product_id,
                        quantity,
                        revenue,
                        region,
                        order_time
                    )
                    VALUES (%s,%s,%s,%s,%s,%s,%s)
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

            # -------------------------------------------------
            # DELIVERY
            # -------------------------------------------------

            elif message.topic == "delivery_events":

                cursor.execute("""
                    INSERT INTO public.stream_delivery
                    (
                        delivery_id,
                        order_id,
                        estimated_days,
                        actual_days,
                        delivery_status
                    )
                    VALUES (%s,%s,%s,%s,%s)
                """,
                (
                    data["delivery_id"],
                    data["order_id"],
                    data["estimated_days"],
                    data["actual_days"],
                    data["delivery_status"]
                ))

            # -------------------------------------------------
            # INVENTORY
            # -------------------------------------------------

            elif message.topic == "inventory_events":

                cursor.execute("""
                    INSERT INTO public.stream_inventory
                    (
                        inventory_id,
                        product_id,
                        warehouse_id,
                        stock_level,
                        reorder_level,
                        last_updated,
                        alert
                    )
                    VALUES (%s,%s,%s,%s,%s,%s,%s)
                """,
                (
                    data["inventory_id"],
                    data["product_id"],
                    data["warehouse_id"],
                    data["stock_level"],
                    data["reorder_level"],
                    data["last_updated"],
                    data["alert"]
                ))

            conn.commit()

            message_count += 1

            if message_count >= MAX_MESSAGES:
                break

        if message_count >= MAX_MESSAGES:
            break

consumer.close()
cursor.close()
conn.close()

print("=" * 60)
print(f"Processed {message_count} messages")
print("Consumer Finished")
print("=" * 60)