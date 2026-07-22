import { useEffect, useState } from "react";
import axios from "axios";
import SearchBar from "../components/SearchBar";
import InventoryKPICard from "../components/InventoryKPICard";
import LowStockCard from "../components/LowStockCard";
import InventoryTable from "../components/InventoryTable";

import {
    FaBoxes,
    FaWarehouse,
    FaExclamationTriangle,
    FaCheckCircle
} from "react-icons/fa";

import "../styles/dashboard.css";

function Inventory() {

    const [inventory, setInventory] = useState([]);
    const [search, setSearch] = useState("");
const [warehouse, setWarehouse] = useState("All");
const [status, setStatus] = useState("All");
    useEffect(() => {

        axios
            .get("http://127.0.0.1:8000/inventory")
            .then((response) => {
                setInventory(response.data);
            })
            .catch((error) => {
                console.error(error);
            });

    }, []);

    // ================= KPI Calculations =================

    const totalProducts = inventory.length;

    const totalWarehouses = new Set(
        inventory.map(item => item.warehouse)
    ).size;

    const lowStock = inventory.filter(
        item => Number(item.stock_level) < Number(item.reorder_level)
    ).length;

    const healthyInventory = totalProducts - lowStock;
    const lowStockItems = inventory
    .filter(
        item => Number(item.stock_level) < Number(item.reorder_level)
    )
    .slice(0, 4);
    const warehouses = [...new Set(inventory.map(i => i.warehouse))];
    const filteredInventory = inventory.filter(item => {

    const productMatch =
        item.product_id
            .toLowerCase()
            .includes(search.toLowerCase());

    const warehouseMatch =
        warehouse === "All" ||
        item.warehouse === warehouse;

    const low =
        Number(item.stock_level) <
        Number(item.reorder_level);

    const statusMatch =
        status === "All" ||
        (status === "Low" && low) ||
        (status === "Healthy" && !low);

    return productMatch && warehouseMatch && statusMatch;

});
    return (

        <div className="content">

            <h1 style={{ marginBottom: "25px" }}>
                Inventory Control Tower
            </h1>

            {/* KPI Cards */}

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                    gap: "20px",
                    marginBottom: "35px"
                }}
            >

                <InventoryKPICard
                    title="Total Products"
                    value={totalProducts}
                    icon={<FaBoxes />}
                    color="#2563eb"
                />

                <InventoryKPICard
                    title="Warehouses"
                    value={totalWarehouses}
                    icon={<FaWarehouse />}
                    color="#7c3aed"
                />

                <InventoryKPICard
                    title="Low Stock"
                    value={lowStock}
                    icon={<FaExclamationTriangle />}
                    color="#dc2626"
                />

                <InventoryKPICard
                    title="Healthy Inventory"
                    value={healthyInventory}
                    icon={<FaCheckCircle />}
                    color="#16a34a"
                />

            </div>

            <h2 style={{ marginBottom: "20px" }}>
    ⚠ Critical Stock Alerts
</h2>

<div
    style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
        gap: "20px",
        marginBottom: "40px"
    }}
>

    {lowStockItems.map((item,index)=>(

        <LowStockCard
            key={index}
            item={item}
        />

    ))}

</div>
            {/* Inventory Table */}
            <SearchBar

    search={search}
    setSearch={setSearch}

    warehouse={warehouse}
    setWarehouse={setWarehouse}

    status={status}
    setStatus={setStatus}

    warehouses={warehouses}

/>
<InventoryTable inventory={filteredInventory} />

        </div>

    );
}

export default Inventory;