from airflow import DAG
from airflow.providers.postgres.operators.postgres import PostgresOperator
from airflow.operators.bash import BashOperator
from airflow.operators.empty import EmptyOperator
from datetime import datetime

default_args = {
    "owner": "Spandana"
}

with DAG(
    dag_id="Retail_ETL_Pipeline",
    start_date=datetime(2026, 7, 1),
    schedule_interval=None,
    catchup=False,
    default_args=default_args,
    tags=["RetailOps360"]
) as dag:

    start = EmptyOperator(
        task_id="Start"
    )

    producer = BashOperator(
    task_id="Run_Kafka_Producer",
    bash_command="python /opt/airflow/streaming/producer_airflow.py"
    )

    run_consumer = BashOperator(
    task_id="Run_Kafka_Consumer",
    bash_command="python /opt/airflow/streaming/consumer_airflow.py"
    )

    sales = PostgresOperator(
        task_id="Refresh_Sales",
        postgres_conn_id="retail_postgres",
        sql="REFRESH MATERIALIZED VIEW gold.mv_sales_summary;"
    )

    inventory = PostgresOperator(
        task_id="Refresh_Inventory",
        postgres_conn_id="retail_postgres",
        sql="REFRESH MATERIALIZED VIEW gold.mv_inventory_summary;"
    )

    customer = PostgresOperator(
        task_id="Refresh_Customer",
        postgres_conn_id="retail_postgres",
        sql="REFRESH MATERIALIZED VIEW gold.mv_customer_summary;"
    )

    promotion = PostgresOperator(
        task_id="Refresh_Promotion",
        postgres_conn_id="retail_postgres",
        sql="REFRESH MATERIALIZED VIEW gold.mv_promotion_performance;"
    )

    store = PostgresOperator(
        task_id="Refresh_Store",
        postgres_conn_id="retail_postgres",
        sql="REFRESH MATERIALIZED VIEW gold.mv_store_health_dashboard;"
    )

    end = EmptyOperator(
        task_id="End"
    )

    start >> producer >> run_consumer >> sales >> inventory >> customer >> promotion >> store >> end