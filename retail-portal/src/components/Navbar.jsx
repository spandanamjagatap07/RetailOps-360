import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav style={{ padding: "15px", background: "#1976d2" }}>
      <Link to="/">Dashboard</Link>{" | "}
      <Link to="/inventory">Inventory</Link>{" | "}
      <Link to="/customers">Customers</Link>{" | "}
      <Link to="/promotions">Promotions</Link>{" | "}
      <Link to="/operations">Operations</Link>{" | "}
      <Link to="/live-monitoring">Live Monitoring</Link>
    </nav>
  );
}

export default Navbar;