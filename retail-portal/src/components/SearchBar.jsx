import { FaSearch } from "react-icons/fa";
import "./SearchBar.css";

function SearchBar({
    search,
    setSearch,
    warehouse,
    setWarehouse,
    status,
    setStatus,
    warehouses
}) {

    return (

        <div className="search-toolbar">

            <div className="search-box">

                <FaSearch className="search-icon"/>

                <input
                    type="text"
                    placeholder="Search Product..."
                    value={search}
                    onChange={(e)=>setSearch(e.target.value)}
                />

            </div>

            <select
                value={warehouse}
                onChange={(e)=>setWarehouse(e.target.value)}
            >

                <option value="All">All Warehouses</option>

                {warehouses.map((w,index)=>(

                    <option key={index} value={w}>
                        {w}
                    </option>

                ))}

            </select>

            <select
                value={status}
                onChange={(e)=>setStatus(e.target.value)}
            >

                <option value="All">All Status</option>
                <option value="Healthy">Healthy</option>
                <option value="Low">Low Stock</option>

            </select>

        </div>

    );

}

export default SearchBar;