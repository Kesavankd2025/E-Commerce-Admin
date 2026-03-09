import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react/dist/iconify.js";
import TablePagination from "./TablePagination";
import OrderApi from "../Api/OrderApi";
import { formatDate } from "../helper/DateHelper";

const CustomerOrderListLayer = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("Pending");
    const [currentPage, setCurrentPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);
    const [counts, setCounts] = useState({ Pending: 0, Packed: 0, Shipped: 0, Delivered: 0 });

    const tabs = ["Pending", "Packed", "Shipped", "Delivered"];

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await OrderApi.getOrderList(currentPage, rowsPerPage, activeTab);
            if (res.status && res.response) {
                const data = res.response.data; // This is the 'response.data.data' based on backend change
                setOrders(data.data || []);
                setTotalRecords(data.total || 0);
                if (data.counts) {
                    setCounts(data.counts);
                }
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
            setOrders([]);
            setTotalRecords(0);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [currentPage, rowsPerPage, activeTab]);

    const handlePageChange = (page) => setCurrentPage(page);
    const handleRowsPerPageChange = (e) => {
        setRowsPerPage(parseInt(e.target.value));
        setCurrentPage(0);
    };

    return (
        <div className="card h-100 p-0 radius-12 overflow-hidden shadow-sm border-0">
            <div className="card-header border-bottom bg-base py-20 px-24 d-flex align-items-center justify-content-between">
                <h6 className="text-lg fw-bold mb-0 text-primary-600">Customer Orders</h6>
            </div>
            <div className="card-body p-24">
                {/* Tabs */}
                <div className="d-flex align-items-center gap-3 mb-32 border-bottom pb-20">
                    <div className="row g-3 w-100">
                        {tabs.map((tab) => (
                            <div key={tab} className="col-md-3">
                                <button
                                    onClick={() => { setActiveTab(tab); setCurrentPage(0); }}
                                    className={`btn btn-sm radius-8 w-100 py-12 fw-bold transition-all d-flex align-items-center justify-content-center gap-2 ${activeTab === tab ? "btn-primary-600 shadow-sm" : "btn-outline-primary-600 border-0 text-secondary-light bg-hover-neutral-100"}`}
                                >
                                    <span>{tab}</span>
                                    <span className={`badge rounded-pill ${activeTab === tab ? "bg-white text-primary-600" : "bg-primary-100 text-primary-600"}`}>
                                        {counts[tab] || 0}
                                    </span>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="table-responsive">
                    <table className="table bordered-table mb-0 sm-table">
                        <thead>
                            <tr className="bg-neutral-50">
                                <th className="text-secondary-light fw-bold text-xs uppercase text-center px-16 py-16" style={{ width: '80px', backgroundColor: "#f8fafc" }}>S.No</th>
                                <th className="text-secondary-light fw-bold text-xs uppercase px-16 py-16" style={{ backgroundColor: "#f8fafc" }}>Date</th>
                                <th className="text-secondary-light fw-bold text-xs uppercase px-16 py-16" style={{ backgroundColor: "#f8fafc" }}>Customer Name</th>
                                <th className="text-secondary-light fw-bold text-xs uppercase px-16 py-16" style={{ backgroundColor: "#f8fafc" }}>Address</th>
                                <th className="text-secondary-light fw-bold text-xs uppercase px-16 py-16" style={{ backgroundColor: "#f8fafc" }}>Total Amount</th>
                                <th className="text-secondary-light fw-bold text-xs uppercase text-center px-16 py-16" style={{ width: '120px', backgroundColor: "#f8fafc" }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-60">
                                        <div className="d-flex flex-column align-items-center gap-2">
                                            <div className="spinner-border text-primary-600" role="status"></div>
                                            <span className="text-sm fw-medium text-secondary-light">Loading orders...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : orders.length > 0 ? (
                                orders.map((order, index) => (
                                    <tr key={order.id || order._id}>
                                        <td className="text-center">
                                            <span className="text-sm text-secondary-light fw-medium">
                                                {currentPage * rowsPerPage + index + 1}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="d-flex flex-column">
                                                <span className="text-sm fw-bold text-secondary-light">{formatDate(order.createdAt)}</span>
                                                <span className="text-xs text-secondary-400">#{order.orderId || (order.id || order._id)?.toString().slice(-6).toUpperCase()}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="d-flex align-items-center gap-2">
                                                <div className="w-32-px h-32-px rounded-circle bg-primary-100 d-flex align-items-center justify-content-center text-primary-600 fw-bold text-xs">
                                                    {(order.address?.name || "N")[0].toUpperCase()}
                                                </div>
                                                <span className="text-sm fw-bold text-secondary-light">{order.address?.name || "Anonymous"}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="d-flex flex-column" style={{ maxWidth: '280px' }}>
                                                <span className="text-xs text-secondary-light fw-medium text-truncate">
                                                    {order.address?.doorNo}, {order.address?.street}
                                                </span>
                                                <span className="text-xs text-secondary-400">
                                                    {order.address?.city}, {order.address?.pincode}
                                                </span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="text-md fw-black text-primary-600">₹{order.grandTotal?.toLocaleString()}</span>
                                        </td>
                                        <td className="text-center">
                                            <Link to={`/customer-orders/view/${order.id || order._id}`} className="bg-info-focus bg-hover-info-200 text-info-600 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle">
                                                <Icon icon="majesticons:eye-line" className="text-xl" />
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center py-80">
                                        <div className="d-flex flex-column align-items-center gap-3">
                                            <div className="bg-neutral-100 p-20 rounded-circle">
                                                <Icon icon="solar:box-minimalistic-broken" className="text-neutral-400 text-5xl" />
                                            </div>
                                            <div className="text-center">
                                                <h6 className="mb-1 text-md text-secondary-light">No {activeTab} Orders</h6>
                                                <p className="text-sm text-secondary-400 mb-0">Existing orders will appear here automatically.</p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="mt-32 pt-20 border-top">
                    <TablePagination
                        currentPage={currentPage}
                        totalPages={Math.ceil(totalRecords / rowsPerPage)}
                        onPageChange={handlePageChange}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={handleRowsPerPageChange}
                        totalRecords={totalRecords}
                    />
                </div>
            </div>
        </div>
    );
};

export default CustomerOrderListLayer;
