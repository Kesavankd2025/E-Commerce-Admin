import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react/dist/iconify.js";
import OrderApi from "../Api/OrderApi";
import { formatDate } from "../helper/DateHelper";
import TablePagination from "./TablePagination";

const ReturnOrderListLayer = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);
    const [activeTab, setActiveTab] = useState("Return-Initiated");
    const [counts, setCounts] = useState({ "Return-Initiated": 0, "Approved": 0, "Pickedup": 0, "Received to Warehouse": 0 });

    const tabs = ["Return-Initiated", "Approved", "Pickedup", "Received to Warehouse"];

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await OrderApi.getReturnOrderList(currentPage, rowsPerPage, activeTab);
            if (res.status && res.response) {
                const data = res.response.data;
                setOrders(data.data || []);
                setTotalRecords(data.total || 0);
                if (data.counts) {
                    setCounts(data.counts);
                }
            }
        } catch (error) {
            console.error("Error fetching return orders:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [currentPage, rowsPerPage, activeTab]);

    return (
        <div className="card h-100 p-0 radius-12 overflow-hidden shadow-sm border-0">
            <div className="card-header border-bottom bg-base py-20 px-24 d-flex align-items-center justify-content-between">
                <h6 className="text-lg fw-bold mb-0 text-primary-600">Return Orders</h6>
            </div>
            <div className="card-body p-24">
                {/* Tabs */}
                <div className="row g-3 w-100 mb-32 border-bottom pb-20 mx-0">
                    {tabs.map((tab) => (
                        <div key={tab} className="col-md-3">
                            <button
                                onClick={() => { setActiveTab(tab); setCurrentPage(0); }}
                                className={`btn btn-sm radius-8 w-100 py-12 fw-bold transition-all d-flex align-items-center justify-content-center gap-2 ${activeTab === tab ? "btn-primary-600 shadow-sm text-white" : "btn-outline-primary-600 border-0 text-secondary-light bg-hover-neutral-100"}`}
                            >
                                <span className="text-xs whitespace-nowrap">{tab}</span>
                                <span className={`badge rounded-pill ${activeTab === tab ? "bg-white text-primary-600" : "bg-primary-100 text-primary-600"}`}>
                                    {counts[tab] || 0}
                                </span>
                            </button>
                        </div>
                    ))}
                </div>

                <div className="table-responsive">
                    <table className="table bordered-table sm-table mb-0">
                        <thead>
                            <tr className="bg-neutral-50">
                                <th scope="col" className="text-center py-16" style={{ width: '80px' }}>S.No</th>
                                <th scope="col" className="py-16">Date & Original Order ID</th>
                                <th scope="col" className="py-16">Customer Name</th>
                                <th scope="col" className="py-16">Address</th>
                                <th scope="col" className="py-16 text-end">Grand Total</th>
                                <th scope="col" className="text-center py-16">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-100">
                                        <div className="spinner-border text-primary-600" role="status"></div>
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
                                                <span className="text-xs text-secondary-400">Orig: #{order.orderIdString || (order.id || order._id)?.toString().slice(-6).toUpperCase()}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="d-flex align-items-center gap-2">
                                                <div className="w-32-px h-32-px rounded-circle bg-neutral-100 d-flex align-items-center justify-content-center text-secondary-light fw-bold text-xs uppercase">
                                                    {order.address?.name?.charAt(0)}
                                                </div>
                                                <span className="text-sm fw-bold text-secondary-light">{order.address?.name}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="d-flex flex-column" style={{ maxWidth: '250px' }}>
                                                <span className="text-xs text-secondary-light text-truncate">
                                                    {order.address?.doorNo}, {order.address?.street}
                                                </span>
                                                <span className="text-xxxxs text-secondary-400">{order.address?.city}</span>
                                            </div>
                                        </td>
                                        <td className="text-end">
                                            <span className="text-md fw-black text-primary-600">₹{order.grandTotal?.toLocaleString()}</span>
                                        </td>
                                        <td className="text-center">
                                            <Link
                                                to={`/return-orders/view/${order.id || order._id}`}
                                                className="bg-info-focus bg-hover-info-200 text-info-600 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle mx-auto"
                                            >
                                                <Icon icon="majesticons:eye-line" className="text-xl" />
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center py-100 italic text-secondary-400 text-sm">
                                        No return orders in {activeTab}.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {!loading && totalRecords > 0 && (
                    <div className="mt-24 px-24 pb-12">
                        <TablePagination
                            currentPage={currentPage}
                            totalPages={Math.ceil(totalRecords / rowsPerPage)}
                            onPageChange={setCurrentPage}
                            rowsPerPage={rowsPerPage}
                            onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value)); setCurrentPage(0); }}
                            totalRecords={totalRecords}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReturnOrderListLayer;
