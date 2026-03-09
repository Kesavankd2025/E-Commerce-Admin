import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import PosApi from "../Api/PosApi";
import { formatDate } from "../helper/DateHelper";
import TablePagination from "./TablePagination";
import { Link } from "react-router-dom";

const PosHistoryLayer = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const res = await PosApi.getPosHistory(currentPage, rowsPerPage);
            if (res.status && res.response) {
                setOrders(res.response.data || []);
                setTotalRecords(res.response.total || 0);
            }
        } catch (error) {
            console.error("Error fetching POS history:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, [currentPage, rowsPerPage]);

    return (
        <div className="card h-100 p-0 radius-12 overflow-hidden shadow-sm border-0">
            <div className="card-header border-bottom bg-base py-20 px-24 d-flex align-items-center justify-content-between">
                <h6 className="text-lg fw-bold mb-0 text-primary-600 d-flex align-items-center gap-2">
                    <Icon icon="solar:history-bold-duotone" className="text-2xl" />
                    POS Order History
                </h6>
            </div>
            <div className="card-body p-24">
                <div className="table-responsive">
                    <table className="table bordered-table sm-table mb-0">
                        <thead>
                            <tr className="bg-neutral-50 text-uppercase text-xxxxs">
                                <th scope="col" className="text-center py-16">S.No</th>
                                <th scope="col" className="py-16">Date</th>
                                <th scope="col" className="py-16">Order ID</th>
                                <th scope="col" className="py-16">Customer</th>
                                <th scope="col" className="py-16">Items</th>
                                <th scope="col" className="text-end py-16">Total Amount</th>
                                <th scope="col" className="text-center py-16">Payment</th>
                                <th scope="col" className="text-center py-16">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="8" className="text-center py-100">
                                        <div className="spinner-border text-primary-600" role="status"></div>
                                    </td>
                                </tr>
                            ) : orders.length > 0 ? (
                                orders.map((order, index) => (
                                    <tr key={order.id || order._id}>
                                        <td className="text-center text-sm fw-medium text-secondary-light">
                                            {currentPage * rowsPerPage + index + 1}
                                        </td>
                                        <td>
                                            <span className="text-sm text-secondary-light fw-medium">{formatDate(order.createdAt)}</span>
                                        </td>
                                        <td>
                                            <span className="text-xs fw-bold text-primary-600">{order.orderId}</span>
                                        </td>
                                        <td>
                                            <div className="d-flex flex-column">
                                                <span className="text-sm fw-bold text-secondary-light">{order.address?.name || "Guest"}</span>
                                                <span className="text-xxxxs text-secondary-light italic">{order.address?.phone}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="text-sm text-secondary-light fw-medium">{order.products?.length} Items</span>
                                        </td>
                                        <td className="text-end">
                                            <span className="text-sm fw-bold text-secondary-light">₹{order.grandTotal?.toFixed(2)}</span>
                                        </td>
                                        <td className="text-center">
                                            <span className="badge px-8 py-2 radius-4 fw-black text-xxxxs uppercase bg-success-focus text-success-main font-bold">
                                                {order.paymentMethod}
                                            </span>
                                        </td>
                                        <td className="text-center">
                                            <Link to={`/customer-orders/view/${order.id || order._id}`} className="btn btn-neutral p-6 text-primary-600 bg-primary-50 hover-bg-primary-100">
                                                <Icon icon="solar:eye-bold" />
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="text-center py-100 italic text-secondary-400">
                                        No POS orders found.
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

export default PosHistoryLayer;
