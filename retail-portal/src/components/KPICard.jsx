import "./KPICard.css";

function KPICard({ title, value, icon }) {

    return (

        <div className="kpi-card">

            <div className="kpi-icon">
                {icon}
            </div>

            <div>

                <h4>{title}</h4>

                <h2>{value}</h2>

            </div>

        </div>

    );

}

export default KPICard;