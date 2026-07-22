import { useEffect, useState } from "react";
import "../styles/dashboard.css";

function LiveMonitoring() {

    const [totalOrders, setTotalOrders] = useState(0);
    const [ordersPerMinute, setOrdersPerMinute] = useState(0);
    const [revenuePerMinute, setRevenuePerMinute] = useState(0);

    const [delayedDeliveries, setDelayedDeliveries] = useState(0);
    const [warehouseBottlenecks, setWarehouseBottlenecks] = useState(0);
    const [slaViolations, setSLAViolations] = useState(0);

    const [lowStockProducts, setLowStockProducts] = useState([]);
    const [overstockProducts, setOverstockProducts] = useState([]);
    const [highDemandProducts, setHighDemandProducts] = useState([]);

    const loadData = () => {

        fetch("http://127.0.0.1:8000/live/total-orders")
            .then(res => res.json())
            .then(data => setTotalOrders(data[0].total_orders));

        fetch("http://127.0.0.1:8000/live/orders-per-minute")
            .then(res => res.json())
            .then(data => setOrdersPerMinute(data.orders_per_minute));

        fetch("http://127.0.0.1:8000/live/revenue-per-minute")
            .then(res => res.json())
            .then(data => setRevenuePerMinute(data.revenue_per_minute));

        fetch("http://127.0.0.1:8000/live/delayed-deliveries")
            .then(res => res.json())
            .then(data => setDelayedDeliveries(data[0].delayed_deliveries));

        fetch("http://127.0.0.1:8000/live/warehouse-bottlenecks")
            .then(res => res.json())
            .then(data => setWarehouseBottlenecks(data.warehouse_bottlenecks));

        fetch("http://127.0.0.1:8000/live/sla-violations")
            .then(res => res.json())
            .then(data => setSLAViolations(data.sla_violations));

        fetch("http://127.0.0.1:8000/live/low-stock")
            .then(res => res.json())
            .then(data => setLowStockProducts(data));

        fetch("http://127.0.0.1:8000/live/overstock")
            .then(res => res.json())
            .then(data => setOverstockProducts(data));

        fetch("http://127.0.0.1:8000/live/high-demand")
            .then(res => res.json())
            .then(data => setHighDemandProducts(data));
    };

    useEffect(() => {

        loadData();

        const interval = setInterval(loadData, 5000);

        return () => clearInterval(interval);

    }, []);

    const cardStyle = {
        flex: "1 1 280px",
        minWidth: "280px",
        background: "#ffffff",
        borderRadius: "12px",
        padding: "20px",
        textAlign: "center",
        boxShadow: "0 3px 10px rgba(0,0,0,0.12)"
    };

    return (

        <div
            className="content"
            style={{
                background: "#f5f7fb",
                minHeight: "100vh"
            }}
        >

            <h1
                style={{
                    textAlign: "center",
                    color: "#1f2937",
                    marginBottom: "30px"
                }}
            >
                🚀 Retail Live Monitoring Dashboard
            </h1>

            {/* ===========================
               Live Order Monitoring
            =========================== */}

            <div
                style={{
                    background: "white",
                    padding: "25px",
                    borderRadius: "12px",
                    marginBottom: "30px",
                    boxShadow: "0 3px 12px rgba(0,0,0,0.15)"
                }}
            >

                <h2>📦 Live Order Monitoring</h2>

                <div
                    style={{
                        display: "flex",
                        gap: "20px",
                        flexWrap: "wrap",
                        marginTop: "20px"
                    }}
                >

                    <div style={cardStyle}>

                        <h3>Total Orders</h3>

                        <h1>{totalOrders}</h1>

                        <p style={{ color: "green" }}>
                            🟢 Streaming Active
                        </p>

                    </div>

                    <div style={cardStyle}>

                        <h3>Orders / Minute</h3>

                        <h1>{ordersPerMinute}</h1>

                    </div>

                    <div style={cardStyle}>

                        <h3>Revenue / Minute</h3>

                        <h1>₹ {Number(revenuePerMinute).toLocaleString()}</h1>

                    </div>

                </div>

            </div>

            {/* ===========================
                Delivery Tracking
            =========================== */}

            <div
                style={{
                    background: "white",
                    padding: "25px",
                    borderRadius: "12px",
                    marginBottom: "30px",
                    boxShadow: "0 3px 12px rgba(0,0,0,0.15)"
                }}
            >

                <h2>🚚 Delivery Tracking</h2>

                <div
                    style={{
                        display: "flex",
                        gap: "20px",
                        flexWrap: "wrap",
                        marginTop: "20px"
                    }}
                >

                    <div style={cardStyle}>

                        <h3>Delayed Deliveries</h3>

                        <h1>{delayedDeliveries}</h1>

                        {
                            delayedDeliveries > 0 ?

                                <p style={{ color: "red" }}>
                                    ⚠ Delivery Delay Detected
                                </p>

                                :

                                <p style={{ color: "green" }}>
                                    ✅ No Delays
                                </p>
                        }

                    </div>

                    <div style={cardStyle}>

                        <h3>Warehouse Bottlenecks</h3>

                        <h1>{warehouseBottlenecks}</h1>

                    </div>

                    <div style={cardStyle}>

                        <h3>SLA Violations</h3>

                        <h1>{slaViolations}</h1>

                    </div>

                </div>

            </div>

            {/* Inventory Alerts starts here */}

            {/* ===========================
    Inventory Alerts
=========================== */}

<div
    style={{
        background: "white",
        padding: "25px",
        borderRadius: "12px",
        boxShadow: "0 3px 12px rgba(0,0,0,0.15)"
    }}
>

    <h2>📦 Inventory Alerts</h2>

    <div
        style={{
            display: "flex",
            gap: "20px",
            flexWrap: "wrap",
            marginTop: "20px"
        }}
    >

        {/* Low Stock */}

        <div style={cardStyle}>

            <h3>Low Stock Products</h3>

            <div
                style={{
                    overflowX: "auto",
                    marginTop: "15px"
                }}
            >

                <table
                    style={{
                        width: "100%",
                        borderCollapse: "collapse"
                    }}
                >

                    <thead>

                        <tr>
                            <th>Product</th>
                            <th>Warehouse</th>
                            <th>Stock</th>
                            <th>Alert</th>
                        </tr>

                    </thead>

                    <tbody>

                        {lowStockProducts.length > 0 ?

                            lowStockProducts.map((item) => (

                                <tr
                                    key={`${item.product_id}-${item.warehouse_id}`}
                                >

                                    <td>{item.product_id}</td>

                                    <td>{item.warehouse_id}</td>

                                    <td>{item.stock_level}</td>

                                    <td>{item.alert}</td>

                                </tr>

                            ))

                            :

                            <tr>

                                <td colSpan="4">

                                    No Low Stock Products

                                </td>

                            </tr>

                        }

                    </tbody>

                </table>

            </div>

        </div>

        {/* Overstock */}

        <div style={cardStyle}>

            <h3>Overstock Products</h3>

            <div
                style={{
                    overflowX: "auto",
                    marginTop: "15px"
                }}
            >

                <table
                    style={{
                        width: "100%",
                        borderCollapse: "collapse"
                    }}
                >

                    <thead>

                        <tr>
                            <th>Product</th>
                            <th>Warehouse</th>
                            <th>Stock</th>
                            <th>Alert</th>
                        </tr>

                    </thead>

                    <tbody>

                        {overstockProducts.length > 0 ?

                            overstockProducts.map((item) => (

                                <tr
                                    key={`${item.product_id}-${item.warehouse_id}`}
                                >

                                    <td>{item.product_id}</td>

                                    <td>{item.warehouse_id}</td>

                                    <td>{item.stock_level}</td>

                                    <td>{item.alert}</td>

                                </tr>

                            ))

                            :

                            <tr>

                                <td colSpan="4">

                                    No Overstock Products

                                </td>

                            </tr>

                        }

                    </tbody>

                </table>

            </div>

        </div>

        {/* High Demand */}

        <div style={cardStyle}>

            <h3>High Demand Products</h3>

            <div
                style={{
                    overflowX: "auto",
                    marginTop: "15px"
                }}
            >

                <table
                    style={{
                        width: "100%",
                        borderCollapse: "collapse"
                    }}
                >

                    <thead>

                        <tr>
                            <th>Product</th>
                            <th>Total Orders</th>
                            <th>Quantity Sold</th>
                        </tr>

                    </thead>

                    <tbody>

                        {highDemandProducts.length > 0 ?

                            highDemandProducts.map((item) => (

                                <tr key={item.product_id}>

                                    <td>{item.product_id}</td>

                                    <td>{item.total_orders}</td>

                                    <td>{item.quantity_sold}</td>

                                </tr>

                            ))

                            :

                            <tr>

                                <td colSpan="3">

                                    No High Demand Products

                                </td>

                            </tr>

                        }

                    </tbody>

                </table>

            </div>

        </div>

    </div>

</div>

</div>

);

}

export default LiveMonitoring;