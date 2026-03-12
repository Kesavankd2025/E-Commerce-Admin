import React, { useState, useEffect } from "react";
import DashboardApi from "../../Api/DashboardApi";

const TopSellingProductsTable = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetchTopProducts();
    }, []);

    const fetchTopProducts = async () => {
        try {
            const res = await DashboardApi.getTopSellingProducts();
            if (res.status && res.response.data) {
                setProducts(res.response.data);
            }
        } catch (error) {
            console.error("Error fetching top selling products:", error);
        }
    };

    return (
        <div className="card radius-12 border-0 shadow-sm mt-4">
            <div className="card-header border-bottom bg-base py-16 px-24">
                <h6 className="text-lg fw-semibold mb-0">Top 10 Selling Products</h6>
            </div>
            <div className="card-body p-0">
                <div className="table-responsive">
                    <table className="table margin-0-important mb-0">
                        <thead className="bg-light">
                            <tr>
                                <th className="px-24">Product</th>
                                <th>SKU</th>
                                <th>Quantity Sold</th>
                                <th>Revenue</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.length > 0 ? products.map((product, index) => (
                                <tr key={index}>
                                    <td className="px-24">
                                        <div className="d-flex align-items-center gap-2">
                                            <span className="fw-semibold text-secondary-light">{product.productName}</span>
                                        </div>
                                    </td>
                                    <td>{product.sku}</td>
                                    <td>{product.quantitySold}</td>
                                    <td>₹{product.revenue.toLocaleString("en-IN")}</td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="4" className="text-center py-4">No data available</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default TopSellingProductsTable;
