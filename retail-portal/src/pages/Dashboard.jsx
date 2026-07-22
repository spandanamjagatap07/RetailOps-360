import { useEffect, useState } from "react";
import axios from "axios";

import {
    FaDollarSign,
    FaShoppingCart,
    FaStore
} from "react-icons/fa";

import "../styles/dashboard.css";

function Dashboard() {

    const [stores, setStores] = useState([]);

    useEffect(() => {

        axios
            .get("http://127.0.0.1:8000/stores/performance")
            .then((response) => {
                setStores(response.data);
            })
            .catch((error) => {
                console.log(error);
            });

    }, []);


    // ================= KPIs =================

    const totalRevenue = stores.reduce(
        (sum, store) =>
            sum + Number(store.total_revenue || 0),
        0
    );

    const totalOrders = stores.reduce(
        (sum, store) =>
            sum + Number(store.total_orders || 0),
        0
    );

    const totalStores = stores.length;


    return (

        <div className="content">

            {/* PAGE TITLE */}

            <h1 className="dashboard-title">
                Retail Command Center
            </h1>


            {/* KPI CARDS */}

            <div className="dashboard-kpi-grid">


                {/* TOTAL REVENUE */}

                <div className="dashboard-kpi-card revenue-kpi">

                    <div className="dashboard-kpi-icon">

                        <FaDollarSign />

                    </div>

                    <div className="dashboard-kpi-info">

                        <span className="dashboard-kpi-title">
                            TOTAL REVENUE
                        </span>

                        <h2>
                            ₹ {totalRevenue.toLocaleString()}
                        </h2>

                        <p>
                            Overall Revenue
                        </p>

                    </div>

                </div>


                {/* TOTAL ORDERS */}

                <div className="dashboard-kpi-card orders-kpi">

                    <div className="dashboard-kpi-icon">

                        <FaShoppingCart />

                    </div>

                    <div className="dashboard-kpi-info">

                        <span className="dashboard-kpi-title">
                            TOTAL ORDERS
                        </span>

                        <h2>
                            {totalOrders.toLocaleString()}
                        </h2>

                        <p>
                            Orders Processed
                        </p>

                    </div>

                </div>


                {/* TOTAL STORES */}

                <div className="dashboard-kpi-card stores-kpi">

                    <div className="dashboard-kpi-icon">

                        <FaStore />

                    </div>

                    <div className="dashboard-kpi-info">

                        <span className="dashboard-kpi-title">
                            TOTAL STORES
                        </span>

                        <h2>
                            {totalStores}
                        </h2>

                        <p>
                            Active Stores
                        </p>

                    </div>

                </div>


            </div>

        </div>

    );

}

export default Dashboard;