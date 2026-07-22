import "./InventoryKPICard.css";

function InventoryKPICard({ title, value, icon, color }) {
    return (
        <div className="inventory-kpi-card">
            <div
                className="inventory-kpi-icon"
                style={{ backgroundColor: color }}
            >
                {icon}
            </div>

            <div className="inventory-kpi-content">
                <p>{title}</p>
                <h2>{value}</h2>
            </div>
        </div>
    );
}

export default InventoryKPICard;