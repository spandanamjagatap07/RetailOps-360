import { BrowserRouter, Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import Customers from "./pages/Customers";
import Promotions from "./pages/Promotions";
import Operations from "./pages/Operations";
import LiveMonitoring from "./pages/LiveMonitoring";

function App() {
  return (
    <BrowserRouter>

      <Sidebar />

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/promotions" element={<Promotions />} />
        <Route path="/operations" element={<Operations />} />
        <Route path="/live-monitoring" element={<LiveMonitoring />} />
      </Routes>

    </BrowserRouter>
  );
}

export default App;