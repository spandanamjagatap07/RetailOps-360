import "./LowStockCard.css";
import {
    FaBoxOpen,
    FaWarehouse,
    FaExclamationCircle
} from "react-icons/fa";

function LowStockCard({ item }) {

    const stock = Number(item.stock_level);
    const reorder = Number(item.reorder_level);

    const critical = stock < reorder;

    return (

        <div className="low-stock-card">

            <div className="low-stock-header">

                <FaBoxOpen className="product-icon"/>

                <h3>{item.product_id}</h3>

            </div>

            <div className="low-stock-info">

                <FaWarehouse />

                <span>{item.warehouse}</span>

            </div>

            <div className="stock-row">

                <span>Current Stock</span>

                <strong>{stock}</strong>

            </div>

            <div className="stock-row">

                <span>Reorder Level</span>

                <strong>{reorder}</strong>

            </div>

            <div className={critical ? "critical" : "warning"}>

                <FaExclamationCircle />

                {critical ? "Critical Reorder" : "Reorder Soon"}

            </div>

        </div>

    );

}

export default LowStockCard;