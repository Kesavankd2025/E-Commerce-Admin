import React, { useState, useEffect } from "react";
import DashboardApi from "../../Api/DashboardApi";

const TopCustomersVendors = () => {
    const [customers, setCustomers] = useState([]);
    const [vendors, setVendors] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [custRes, vendRes] = await Promise.all([
                DashboardApi.getTopCustomers(),
                DashboardApi.getTopVendors()
            ]);
            if (custRes.status) setCustomers(custRes.response.data);
            if (vendRes.status) setVendors(vendRes.response.data);
        } catch (error) {
            console.error("Error fetching top customers/vendors:", error);
        }
    };

    return (
        <div className="row gy-4 mt-4">
            {/* Top Customers */}
            <div className="col-xxl-6">
                <div className="card radius-12 border-0 shadow-sm">
                    <div className="card-header border-bottom bg-base py-16 px-24">
                        <h6 className="text-lg fw-semibold mb-0">Top 5 Purchase Customers</h6>
                    </div>
                    <div className="card-body p-0">
                        <div className="table-responsive">
                            <table className="table margin-0-important mb-0">
                                <thead className="bg-light">
                                    <tr>
                                        <th className="px-24">Customer</th>
                                        <th>Total Purchase</th>
                                        <th>Orders</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {customers.length > 0 ? customers.map((c, i) => (
                                        <tr key={i}>
                                            <td className="px-24">
                                                <div className="d-flex flex-column">
                                                    <span className="fw-semibold text-secondary-light">{c.customerName || "Unknown"}</span>
                                                    <small className="text-muted">{c.phoneNumber}</small>
                                                </div>
                                            </td>
                                            <td>₹{c.totalPurchase.toLocaleString("en-IN")}</td>
                                            <td>{c.ordersCount}</td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan="3" className="text-center py-4">No data</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Top Vendors */}
            <div className="col-xxl-6">
                <div className="card radius-12 border-0 shadow-sm">
                    <div className="card-header border-bottom bg-base py-16 px-24">
                        <h6 className="text-lg fw-semibold mb-0">Top 5 Purchase Vendors</h6>
                    </div>
                    <div className="card-body p-0">
                        <div className="table-responsive">
                            <table className="table margin-0-important mb-0">
                                <thead className="bg-light">
                                    <tr>
                                        <th className="px-24">Vendor</th>
                                        <th>Total Purchase</th>
                                        <th>PO Count</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {vendors.length > 0 ? vendors.map((v, i) => (
                                        <tr key={i}>
                                            <td className="px-24">
                                                <span className="fw-semibold text-secondary-light">{v.vendorName}</span>
                                            </td>
                                            <td>₹{v.totalPurchase.toLocaleString("en-IN")}</td>
                                            <td>{v.ordersCount}</td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan="3" className="text-center py-4">No data</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TopCustomersVendors;
