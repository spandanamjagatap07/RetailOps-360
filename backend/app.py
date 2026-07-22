from fastapi import FastAPI,Body
from sqlalchemy import create_engine,text
from backend.database import engine
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "Retail Backend Running"}


@app.get("/stores")
def get_stores():

    with engine.connect() as conn:

        result = conn.execute(text("""
            SELECT *
            FROM gold.dim_store
        """))

        stores = []

        for row in result:
            stores.append(dict(row._mapping))

        return stores
    
@app.get("/stores/performance")
def get_store_performance():

    with engine.connect() as conn:

        result = conn.execute(text("""
            SELECT *
            FROM gold.vw_store_performance
        """))

        performance = [dict(row._mapping) for row in result]

    return performance

@app.get("/stores/{store_id}")
def get_store(store_id: str):

    with engine.connect() as conn:

        result = conn.execute(
            text("""
                SELECT *
                FROM gold.dim_store
                WHERE store_id = :store_id
            """),
            {"store_id": store_id}
        )

        row = result.fetchone()

        if row:
            return dict(row._mapping)
        return {"message": "Store not found"}

@app.get("/inventory")
def get_inventory():
    with engine.connect() as conn:
        result = conn.execute(text("""
            SELECT *
            FROM gold.fact_inventory
            LIMIT 100
        """))
        inventory = [dict(row._mapping) for row in result]
    return inventory

@app.get("/inventory/alerts")
def get_inventory_alerts():
    with engine.connect() as conn:
        result = conn.execute(text("""
            SELECT *
            FROM gold.inventory_alerts
            ORDER BY alert_time DESC
        """))
        alerts = [dict(row._mapping) for row in result]
    return alerts    


@app.post("/inventory/replenish")
def replenish_inventory(
    product_id: str = Body(...),
    warehouse: str = Body(...),
    quantity: int = Body(...)
):

    with engine.connect() as conn:

        conn.execute(
            text("""
                UPDATE gold.fact_inventory
                SET stock_level = stock_level + :quantity
                WHERE product_id = :product_id
                AND warehouse = :warehouse
            """),
            {
                "product_id": product_id,
                "warehouse": warehouse,
                "quantity": quantity
            }
        )

        conn.commit()

    return {"message": "Inventory replenished successfully"}

@app.get("/pricing")
def get_pricing():

    with engine.connect() as conn:

        result = conn.execute(text("""
            SELECT
                product_id,
                product_name,
                category,
                price,
                cost
            FROM gold.dim_product
            LIMIT 100
        """))

        pricing = [dict(row._mapping) for row in result]

    return pricing


@app.post("/pricing/recommendation")
def pricing_recommendation(
    product_id: str = Body(...)
):

    with engine.connect() as conn:

        result = conn.execute(
            text("""
                SELECT
                    p.product_id,
                    p.product_name,
                    p.price,
                    i.stock_level,
                    i.reorder_level
                FROM gold.dim_product p
                JOIN gold.fact_inventory i
                ON p.product_id = i.product_id
                WHERE p.product_id = :product_id
                LIMIT 1
            """),
            {"product_id": product_id}
        )

        row = result.fetchone()

    if row is None:
        return {"message": "Product not found"}

    current_price = float(row.price)

    if row.stock_level < row.reorder_level:
        recommended_price = round(current_price * 1.10, 2)
    else:
        recommended_price = current_price

    return {
        "product_id": row.product_id,
        "product_name": row.product_name,
        "current_price": current_price,
        "recommended_price": recommended_price
    }


@app.get("/promotions")
def get_promotions():

    with engine.connect() as conn:

        result = conn.execute(text("""
            SELECT
                promotion_id,
                campaign_name,
                discount_percentage,
                start_date,
                end_date,
                campaign_duration_days
            FROM gold.mv_promotion_performance
            LIMIT 100
        """))

        promotions = [
            dict(row._mapping)
            for row in result
        ]

    return promotions


# =======================================
# CUSTOMER APIs
# =======================================

@app.get("/customers")
def get_customers():

    with engine.connect() as conn:

        result = conn.execute(text("""
            SELECT *
            FROM gold.dim_customer
            LIMIT 100
        """))

        customers = [dict(row._mapping) for row in result]

    return customers


@app.get("/customers/loyalty")
def customer_loyalty():

    with engine.connect() as conn:

        result = conn.execute(text("""
            SELECT *
            FROM gold.mv_customer_summary
            ORDER BY lifetime_revenue DESC
            LIMIT 100
        """))

        loyalty = [dict(row._mapping) for row in result]

    return loyalty


@app.get("/customers/vip")
def vip_customers():

    with engine.connect() as conn:

        result = conn.execute(text("""
            SELECT *
            FROM gold.mv_customer_summary
            WHERE lifetime_revenue > 50000
            ORDER BY lifetime_revenue DESC
            LIMIT 100
        """))

        vip = [dict(row._mapping) for row in result]

    return vip


# =======================================
# WORKFORCE APIs
# =======================================

@app.get("/employees")
def get_employees():

    return {
        "message": "Employee table is not available in the provided dataset."
    }


@app.get("/productivity")
def productivity():

    return {
        "message": "Productivity data is not available in the provided dataset."
    }


@app.get("/store-operations")
def store_operations():

    with engine.connect() as conn:

        result = conn.execute(text("""
            SELECT *
            FROM gold.vw_store_performance
        """))

        operations = [dict(row._mapping) for row in result]

    return operations

@app.post("/workflow/inventory-replenishment")
def inventory_replenishment():

    with engine.connect() as conn:

        result = conn.execute(text("""
            SELECT product_id,
                   warehouse,
                   stock_level,
                   reorder_level
            FROM gold.fact_inventory
            WHERE stock_level < reorder_level
            LIMIT 20
        """))

        products = [dict(row._mapping) for row in result]

    return {
        "status": "Purchase Order Generated",
        "notification": "Procurement Team Notified",
        "products": products
    }

@app.post("/workflow/promotion-optimization")
def promotion_optimization():

    with engine.connect() as conn:

        result = conn.execute(text("""
            SELECT
                promotion_id,
                campaign_name,
                discount_percentage,
                campaign_duration_days
            FROM gold.mv_promotion_performance
            WHERE discount_percentage < 15
            LIMIT 20
        """))

        campaigns = [dict(row._mapping) for row in result]

    return {
        "status": "New Discount Recommended",
        "notification": "Marketing Team Notified",
        "campaigns": campaigns
    }

@app.post("/workflow/customer-retention")
def customer_retention():

    with engine.connect() as conn:

        result = conn.execute(text("""
            SELECT
                customer_id,
                customer_name,
                total_orders,
                lifetime_revenue
            FROM gold.mv_customer_summary
            WHERE total_orders < 5
            LIMIT 20
        """))

        customers = [dict(row._mapping) for row in result]

    return {
        "status": "Retention Offer Generated",
        "notification": "Retention Campaign Sent",
        "customers": customers
    }

@app.post("/workflow/store-performance")
def store_performance():

    with engine.connect() as conn:

        result = conn.execute(text("""
            SELECT *
            FROM gold.vw_store_performance
            WHERE total_revenue < 1000000000
            LIMIT 20
        """))

        stores = [dict(row._mapping) for row in result]

    return {
        "status": "Store Manager Alerted",
        "action_plan": "Performance Improvement Plan Created",
        "stores": stores
    }

@app.post("/workflow/customer-complaint")
def customer_complaint():

    with engine.connect() as conn:

        result = conn.execute(text("""
            SELECT *
            FROM complaints
            WHERE severity = 'High'
        """))

        complaints = [dict(row._mapping) for row in result]

    return {
        "status": "Support Ticket Created",
        "notification": "Escalated to Operations Team",
        "complaints": complaints
    }

@app.get("/live/total-orders")
def total_orders():

    with engine.connect() as conn:

        result = conn.execute(text("""
            SELECT COUNT(*) AS total_orders
            FROM stream_orders
        """))

        return [dict(row._mapping) for row in result]
    
@app.get("/live/delayed-deliveries")
def delayed_deliveries():

    with engine.connect() as conn:

        result = conn.execute(text("""
            SELECT COUNT(*) AS delayed_deliveries
FROM stream_delivery
WHERE actual_days > estimated_days;
        """))

        return [dict(row._mapping) for row in result]
    
@app.get("/live/low-stock")
def low_stock():

    with engine.connect() as conn:

        result = conn.execute(text("""
          SELECT DISTINCT ON (product_id)
    product_id,
    warehouse_id,
    stock_level,
    alert
FROM stream_inventory
WHERE alert = 'Low Stock'
ORDER BY product_id DESC
LIMIT 10;
        """))

        rows = [dict(row._mapping) for row in result]

    return rows
    
@app.get("/live/overstock")
def overstock():

    with engine.connect() as conn:

        result = conn.execute(text("""
              SELECT DISTINCT ON (product_id)
    product_id,
    warehouse_id,
    stock_level,
    alert
FROM stream_inventory
WHERE alert = 'Overstock'
ORDER BY product_id 
LIMIT 10;
        """))

        rows = [dict(row._mapping) for row in result]

    return rows
    
@app.get("/live/orders-per-minute")
def orders_per_minute():

    with engine.connect() as conn:

        result = conn.execute(text("""
            SELECT COUNT(*) AS orders_per_minute
FROM stream_orders
WHERE order_time >= CURRENT_DATE - INTERVAL '365 days';
        """))

        row = result.fetchone()

        return {"orders_per_minute": row.orders_per_minute}
    
@app.get("/live/revenue-per-minute")
def revenue_per_minute():

    with engine.connect() as conn:

        result = conn.execute(text("""
            SELECT COALESCE(SUM(revenue),0) AS revenue_per_minute
FROM stream_orders
WHERE order_time >= CURRENT_DATE - INTERVAL '365 days';
        """))

        row = result.fetchone()

        return {"revenue_per_minute": float(row.revenue_per_minute)}
    
@app.get("/live/warehouse-bottlenecks")
def warehouse_bottlenecks():

    with engine.connect() as conn:

        result = conn.execute(text("""
            SELECT COUNT(DISTINCT warehouse_id) AS warehouse_bottlenecks
FROM stream_inventory
WHERE stock_level < 20
   OR alert = 'Low Stock'
   OR alert = 'Overstock';
        """))

        row = result.fetchone()

        return {"warehouse_bottlenecks": row.warehouse_bottlenecks}
    
@app.get("/live/sla-violations")
def sla_violations():

    with engine.connect() as conn:

        result = conn.execute(text("""
            SELECT COUNT(*) AS sla_violations
            FROM stream_delivery
            WHERE actual_days > estimated_days+2
        """))

        row = result.fetchone()

        return {"sla_violations": row.sla_violations}
    
@app.get("/live/high-demand")
def high_demand():

    with engine.connect() as conn:

        result = conn.execute(text("""
            SELECT
    product_id,
    COUNT(*) AS total_orders,
    SUM(quantity) AS quantity_sold
FROM stream_orders
GROUP BY product_id
ORDER BY quantity_sold DESC
LIMIT 10;
        """))

        rows = [dict(row._mapping) for row in result]

    return rows