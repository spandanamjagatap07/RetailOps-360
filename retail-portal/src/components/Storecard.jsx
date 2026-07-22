import "./StoreCard.css";
import {
    FaMapMarkerAlt,
    FaDollarSign,
    FaShoppingCart,
    FaCheckCircle
} from "react-icons/fa";

function StoreCard({ store }) {

    return (

        <div className="store-card">

            <div className="store-header">

                <FaMapMarkerAlt className="location-icon" />

                <h2>{store.region}</h2>

            </div>

            <div className="store-item">

                <FaDollarSign className="money-icon"/>

                <div>

                    <p>Revenue</p>

                    <h3>
                        ₹ {Number(store.total_revenue).toLocaleString()}
                    </h3>

                </div>

            </div>

            <div className="store-item">

                <FaShoppingCart className="order-icon"/>

                <div>

                    <p>Orders</p>

                    <h3>
                        {Number(store.total_orders).toLocaleString()}
                    </h3>

                </div>

            </div>

            <div className="status">

                <FaCheckCircle/>

                Excellent Performance

            </div>

        </div>

    );

}

export default StoreCard;