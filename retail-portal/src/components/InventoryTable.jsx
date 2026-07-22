import "./InventoryTable.css";

function InventoryTable({ inventory }) {

    return (

        <table className="inventory-table">

            <thead>

                <tr>

                    <th>Product</th>
                    <th>Warehouse</th>
                    <th>Stock</th>
                    <th>Reorder Level</th>
                    <th>Status</th>

                </tr>

            </thead>

            <tbody>

                {inventory.map((item, index) => {

                    const stock = Number(item.stock_level);
                    const reorder = Number(item.reorder_level);

                    const percentage = Math.min(
                        (stock / reorder) * 100,
                        100
                    );

                    const low = stock < reorder;

                    return (

                        <tr key={index}>

                            <td>{item.product_id}</td>

                            <td>{item.warehouse}</td>

                            <td>

                                <div className="progress-wrapper">

                                    <div className="progress">

                                        <div
                                            className={
                                                low
                                                    ? "progress-fill danger"
                                                    : "progress-fill success"
                                            }
                                            style={{
                                                width: `${percentage}%`
                                            }}
                                        />

                                    </div>

                                    <span>{stock}</span>

                                </div>

                            </td>

                            <td>{reorder}</td>

                            <td>

                                <span
                                    className={
                                        low
                                            ? "status low"
                                            : "status healthy"
                                    }
                                >
                                    {low ? "Low Stock" : "Healthy"}
                                </span>

                            </td>

                        </tr>

                    );

                })}

            </tbody>

        </table>

    );

}

export default InventoryTable;