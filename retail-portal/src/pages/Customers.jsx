import { useEffect, useState } from "react";
import axios from "axios";

import "../styles/dashboard.css";

function Customers() {

    const [customers, setCustomers] = useState([]);

    const [searchTerm, setSearchTerm] = useState("");
    const [segmentFilter, setSegmentFilter] = useState("All");

    const [currentPage, setCurrentPage] = useState(1);

    const customersPerPage = 10;

    // ================= FETCH CUSTOMER DATA =================

    useEffect(() => {

        axios
            .get("http://127.0.0.1:8000/customers/loyalty")
            .then((response) => {
                setCustomers(response.data);
            })
            .catch((error) => {
                console.log(error);
            });

    }, []);


    // ================= CUSTOMER SEGMENT =================

    const getCustomerSegment = (revenue) => {

        const lifetimeRevenue = Number(revenue || 0);

        if (lifetimeRevenue > 200000) {
            return "VIP";
        }

        if (lifetimeRevenue >= 50000) {
            return "Loyal";
        }

        if (lifetimeRevenue >= 20000) {
            return "Regular";
        }

        return "Standard";
    };


    // ================= FILTER CUSTOMERS =================

    const filteredCustomers = customers.filter((customer) => {

        const segment = getCustomerSegment(
            customer.lifetime_revenue
        );

        const search = searchTerm.toLowerCase();

        const matchesSearch =
            customer.customer_id
                ?.toLowerCase()
                .includes(search) ||

            customer.customer_name
                ?.toLowerCase()
                .includes(search);

        const matchesSegment =
            segmentFilter === "All" ||
            segment === segmentFilter;

        return matchesSearch && matchesSegment;

    });


    // ================= PAGINATION =================

    const indexOfLastCustomer =
        currentPage * customersPerPage;

    const indexOfFirstCustomer =
        indexOfLastCustomer - customersPerPage;

    const currentCustomers =
        filteredCustomers.slice(
            indexOfFirstCustomer,
            indexOfLastCustomer
        );

    const totalPages = Math.ceil(
        filteredCustomers.length / customersPerPage
    );


    // ================= CHANGE FILTER =================

    const handleSearch = (event) => {

        setSearchTerm(event.target.value);
        setCurrentPage(1);

    };

    const handleSegmentChange = (event) => {

        setSegmentFilter(event.target.value);
        setCurrentPage(1);

    };


    return (

        <div className="content customer-page">

            {/* ================= TITLE ================= */}

            <div className="customer-header">

                <div>

                    <h1>
                        Customer Intelligence Center
                    </h1>

                    <p className="customer-subtitle">
                        Analyze customer value, loyalty and purchasing behavior
                    </p>

                </div>

                <div className="customer-count">

                    {filteredCustomers.length} Customers

                </div>

            </div>


            {/* ================= SEARCH AND FILTER ================= */}

            <div className="customer-toolbar">

                <div className="customer-search">

                    <span className="search-icon">
                        🔍
                    </span>

                    <input
                        type="text"
                        placeholder="Search Customer ID or Name..."
                        value={searchTerm}
                        onChange={handleSearch}
                    />

                </div>


                <select
                    className="segment-filter"
                    value={segmentFilter}
                    onChange={handleSegmentChange}
                >

                    <option value="All">
                        All Segments
                    </option>

                    <option value="VIP">
                        VIP
                    </option>

                    <option value="Loyal">
                        Loyal
                    </option>

                    <option value="Regular">
                        Regular
                    </option>

                    <option value="Standard">
                        Standard
                    </option>

                </select>

            </div>


            {/* ================= CUSTOMER TABLE ================= */}

            <div className="customer-table-container">

                <table className="customer-table">

                    <thead>

                        <tr>

                            <th>
                                Customer ID
                            </th>

                            <th>
                                Customer Name
                            </th>

                            <th>
                                Total Orders
                            </th>

                            <th>
                                Lifetime Revenue
                            </th>

                            <th>
                                Average Order Value
                            </th>

                            <th>
                                Segment
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        {currentCustomers.length > 0 ? (

                            currentCustomers.map(
                                (customer, index) => {

                                    const segment =
                                        getCustomerSegment(
                                            customer.lifetime_revenue
                                        );

                                    return (

                                        <tr
                                            key={
                                                customer.customer_id ||
                                                index
                                            }
                                        >

                                            {/* CUSTOMER ID */}

                                            <td>

                                                <span className="customer-id-badge">

                                                    {
                                                        customer.customer_id
                                                    }

                                                </span>

                                            </td>


                                            {/* CUSTOMER NAME */}

                                            <td className="customer-name">

                                                {
                                                    customer.customer_name
                                                }

                                            </td>


                                            {/* TOTAL ORDERS */}

                                            <td className="customer-orders">

                                                {Number(
                                                    customer.total_orders || 0
                                                ).toLocaleString()}

                                            </td>


                                            {/* LIFETIME REVENUE */}

                                            <td className="customer-revenue">

                                                ₹{" "}

                                                {Number(
                                                    customer.lifetime_revenue || 0
                                                ).toLocaleString(
                                                    "en-IN",
                                                    {
                                                        minimumFractionDigits: 2,
                                                        maximumFractionDigits: 2
                                                    }
                                                )}

                                            </td>


                                            {/* AVERAGE ORDER VALUE */}

                                            <td className="customer-aov">

                                                ₹{" "}

                                                {Number(
                                                    customer.average_order_value || 0
                                                ).toLocaleString(
                                                    "en-IN",
                                                    {
                                                        minimumFractionDigits: 2,
                                                        maximumFractionDigits: 2
                                                    }
                                                )}

                                            </td>


                                            {/* SEGMENT */}

                                            <td>

                                                <span
                                                    className={
                                                        `segment-badge segment-${segment.toLowerCase()}`
                                                    }
                                                >

                                                    {segment}

                                                </span>

                                            </td>

                                        </tr>

                                    );

                                }
                            )

                        ) : (

                            <tr>

                                <td
                                    colSpan="6"
                                    className="no-customers"
                                >

                                    No customers found

                                </td>

                            </tr>

                        )}

                    </tbody>

                </table>

            </div>


            {/* ================= PAGINATION ================= */}

            <div className="customer-pagination">

                <span className="pagination-info">

                    Showing{" "}

                    {filteredCustomers.length === 0
                        ? 0
                        : indexOfFirstCustomer + 1}

                    {" - "}

                    {Math.min(
                        indexOfLastCustomer,
                        filteredCustomers.length
                    )}

                    {" of "}

                    {filteredCustomers.length}

                </span>


                <div className="pagination-buttons">

                    <button
                        onClick={() =>
                            setCurrentPage(
                                (page) =>
                                    Math.max(
                                        page - 1,
                                        1
                                    )
                            )
                        }
                        disabled={
                            currentPage === 1
                        }
                    >

                        Previous

                    </button>


                    <span className="page-number">

                        Page {currentPage} of{" "}

                        {totalPages || 1}

                    </span>


                    <button
                        onClick={() =>
                            setCurrentPage(
                                (page) =>
                                    Math.min(
                                        page + 1,
                                        totalPages
                                    )
                            )
                        }
                        disabled={
                            currentPage === totalPages ||
                            totalPages === 0
                        }
                    >

                        Next

                    </button>

                </div>

            </div>

        </div>

    );

}

export default Customers;