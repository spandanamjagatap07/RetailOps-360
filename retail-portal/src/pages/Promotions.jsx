import { useEffect, useState } from "react";
import axios from "axios";

import "../styles/dashboard.css";


function Promotions() {

    const [promotions, setPromotions] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = 10;


    // ==========================================
    // FETCH PROMOTIONS
    // ==========================================

    useEffect(() => {

        axios
            .get("http://127.0.0.1:8000/promotions")
            .then((response) => {

                console.log("Promotions:", response.data);

                setPromotions(response.data);

            })
            .catch((error) => {

                console.error("Error fetching promotions:", error);

            });

    }, []);


    // ==========================================
    // GET CAMPAIGN STATUS
    // ==========================================

    const getStatus = (startDate, endDate) => {

        const today = new Date();

        const start = new Date(startDate);
        const end = new Date(endDate);

        // Remove time portion for accurate comparison

        today.setHours(0, 0, 0, 0);
        start.setHours(0, 0, 0, 0);
        end.setHours(0, 0, 0, 0);


        if (today < start) {

            return "Upcoming";

        }

        if (today > end) {

            return "Expired";

        }

        return "Active";

    };


    // ==========================================
    // FILTER PROMOTIONS
    // ==========================================

    const filteredPromotions = promotions.filter((promotion) => {

        const promotionId =
            promotion.promotion_id?.toString().toLowerCase() || "";

        const campaignName =
            promotion.campaign_name?.toString().toLowerCase() || "";

        const search =
            searchTerm.toLowerCase();


        // Search filter

        const matchesSearch =
            promotionId.includes(search) ||
            campaignName.includes(search);


        // Calculate status

        const status = getStatus(
            promotion.start_date,
            promotion.end_date
        );


        // Status filter

        const matchesStatus =
            statusFilter === "All" ||
            status === statusFilter;


        return matchesSearch && matchesStatus;

    });


    // ==========================================
    // PAGINATION
    // ==========================================

    const totalPages = Math.max(
        1,
        Math.ceil(filteredPromotions.length / itemsPerPage)
    );


    const startIndex =
        (currentPage - 1) * itemsPerPage;


    const endIndex =
        startIndex + itemsPerPage;


    const currentPromotions =
        filteredPromotions.slice(
            startIndex,
            endIndex
        );


    // ==========================================
    // SEARCH HANDLER
    // ==========================================

    const handleSearch = (event) => {

        setSearchTerm(event.target.value);

        // Return to first page after search

        setCurrentPage(1);

    };


    // ==========================================
    // STATUS FILTER HANDLER
    // ==========================================

    const handleStatusFilter = (event) => {

        setStatusFilter(event.target.value);

        // Return to first page after filter

        setCurrentPage(1);

    };


    return (

        <div className="content promotion-page">


            {/* =====================================
                PAGE HEADER
            ===================================== */}

            <div className="promotion-header">

                <div>

                    <h1>
                        Promotion Analytics Center
                    </h1>

                    <p>
                        Monitor campaigns, discounts and promotion activity
                    </p>

                </div>


                <div className="promotion-count">

                    {promotions.length} Campaigns

                </div>

            </div>


            {/* =====================================
                SEARCH AND FILTER
            ===================================== */}

            <div className="promotion-controls">


                {/* SEARCH */}

                <div className="promotion-search">

                    <span className="promotion-search-icon">
                        🔍
                    </span>

                    <input
                        type="text"
                        placeholder="Search Promotion ID or Campaign..."
                        value={searchTerm}
                        onChange={handleSearch}
                    />

                </div>


                {/* STATUS FILTER */}

                <select
                    className="promotion-filter"
                    value={statusFilter}
                    onChange={handleStatusFilter}
                >

                    <option value="All">
                        All Status
                    </option>

                    <option value="Active">
                        Active
                    </option>

                    <option value="Upcoming">
                        Upcoming
                    </option>

                    <option value="Expired">
                        Expired
                    </option>

                </select>


            </div>


            {/* =====================================
                PROMOTION TABLE
            ===================================== */}

            <div className="promotion-table-container">

                <table className="promotion-table">

                    <thead>

                        <tr>

                            <th>
                                Campaign
                            </th>

                            <th>
                                Discount
                            </th>

                            <th>
                                Duration
                            </th>

                            <th>
                                Start Date
                            </th>

                            <th>
                                End Date
                            </th>

                            <th>
                                Status
                            </th>

                        </tr>

                    </thead>


                    <tbody>


                        {currentPromotions.length > 0 ? (

                            currentPromotions.map(
                                (promotion, index) => {

                                    const status =
                                        getStatus(
                                            promotion.start_date,
                                            promotion.end_date
                                        );


                                    return (

                                        <tr
                                            key={
                                                promotion.promotion_id ||
                                                index
                                            }
                                        >


                                            {/* CAMPAIGN */}

                                            <td>

                                                <span className="campaign-name">

                                                    {
                                                        promotion.campaign_name
                                                    }

                                                </span>

                                            </td>


                                            {/* DISCOUNT */}

                                            <td>

                                                <span className="discount-badge">

                                                    {
                                                        Number(
                                                            promotion.discount_percentage
                                                        ).toFixed(2)
                                                    }%

                                                </span>

                                            </td>


                                            {/* DURATION */}

                                            <td>

                                                <span className="promotion-duration">

                                                    {
                                                        promotion.campaign_duration_days
                                                    } Days

                                                </span>

                                            </td>


                                            {/* START DATE */}

                                            <td>

                                                <span className="promotion-date">

                                                    {
                                                        promotion.start_date
                                                    }

                                                </span>

                                            </td>


                                            {/* END DATE */}

                                            <td>

                                                <span className="promotion-date">

                                                    {
                                                        promotion.end_date
                                                    }

                                                </span>

                                            </td>


                                            {/* STATUS */}

                                            <td>

                                                <span
                                                    className={
                                                        `promotion-status ${status.toLowerCase()}`
                                                    }
                                                >

                                                    {status}

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
                                    className="no-promotions"
                                >

                                    No campaigns found

                                </td>

                            </tr>

                        )}


                    </tbody>

                </table>

            </div>


            {/* =====================================
                PAGINATION
            ===================================== */}

            <div className="promotion-pagination">


                {/* RECORD COUNT */}

                <div className="pagination-info">

                    {filteredPromotions.length > 0
                        ? `Showing ${startIndex + 1} - ${Math.min(
                            endIndex,
                            filteredPromotions.length
                        )} of ${filteredPromotions.length}`
                        : "Showing 0 campaigns"
                    }

                </div>


                {/* PAGINATION BUTTONS */}

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


                    <span>

                        Page {currentPage} of {totalPages}

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
                            currentPage ===
                            totalPages
                        }
                    >

                        Next

                    </button>


                </div>

            </div>


        </div>

    );

}

export default Promotions;