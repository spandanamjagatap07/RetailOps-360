import { Link } from "react-router-dom";
import "../styles/sidebar.css";

function Sidebar() {
  return (
    <div className="sidebar">

      <h2 className="logo">
    RetailOps
    <br />
    360
</h2>

      <Link to="/">Dashboard</Link>

      <Link to="/inventory">Inventory</Link>

      <Link to="/customers">Customers</Link>

      <Link to="/promotions">Promotions</Link>

      <Link to="/operations">Operations</Link>

      <Link to="/live-monitoring">Live Monitoring</Link>

    </div>
  );
}

export default Sidebar;