import { useEffect, useState } from "react";
import axios from "axios";

import {
    FaDollarSign,
    FaShoppingCart,
    FaMapMarkerAlt
} from "react-icons/fa";

import "../styles/dashboard.css";

function Operations() {

    const [operations, setOperations] = useState([]);

    useEffect(() => {

        axios
            .get("http://127.0.0.1:8000/store-operations")
            .then((response) => {
                setOperations(response.data);
            })
            .catch((error) => {
                console.log(error);
            });

    }, []);

    return (

        <div className="content">

            {/* PAGE TITLE */}

            <h1>Store Operations Center</h1>


            {/* STORE PERFORMANCE HEADER */}

            <div className="store-section-header">

                <h2>Store Performance</h2>

                <span>
                    {operations.length} Stores
                </span>

            </div>


            {/* STORE CARDS */}

            <div className="store-grid">

                {operations.map((store, index) => (

                    <div
                        className="store-card"
                        key={index}
                    >

                        {/* STORE NAME */}

                        <div className="store-title">

                            <FaMapMarkerAlt
                                className="location-icon"
                            />

                            <h2>
                                {store.region}
                            </h2>

                        </div>


                        {/* REVENUE */}

                        <div className="store-metric">

                            <FaDollarSign
                                className="revenue-icon"
                            />

                            <div>

                                <span>Revenue</span>

                                <strong>
                                    ₹ {Number(
                                        store.total_revenue
                                    ).toLocaleString()}
                                </strong>

                            </div>

                        </div>


                        {/* ORDERS */}

                        <div className="store-metric">

                            <FaShoppingCart
                                className="orders-icon"
                            />

                            <div>

                                <span>Orders</span>

                                <strong>
                                    {Number(
                                        store.total_orders
                                    ).toLocaleString()}
                                </strong>

                            </div>

                        </div>


                        {/* PERFORMANCE STATUS */}

                        <div className="performance-status">
                            ● Excellent Performance
                        </div>

                    </div>

                ))}

            </div>

        </div>

    );
}

export default Operations;