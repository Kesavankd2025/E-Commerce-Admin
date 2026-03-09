import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react/dist/iconify.js";
import OrderApi from "../Api/OrderApi";
import { formatDate } from "../helper/DateHelper";
import TablePagination from "./TablePagination";

const CancelledOrderListLayer = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await OrderApi.getCancelledOrderList(currentPage, rowsPerPage);
            if (res.status && res.response) {
                setOrders(res.response.data || []);
                setTotalRecords(res.response.total || 0);
            }
        } catch (error) {
            console.error("Error fetching cancelled orders:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [currentPage, rowsPerPage]);

    return (
        <div className="card h-100 p-0 radius-12 overflow-hidden shadow-sm border-0">
            <div className="card-header border-bottom bg-base py-20 px-24">
                <h6 className="text-lg fw-bold mb-0 text-danger-600 d-flex align-items-center gap-2">
                    <Icon icon="solar:close-circle-bold" className="text-2xl" />
                    Cancelled Orders
                </h6>
            </div>
            <div className="card-body p-24">
                <div className="table-responsive">
                    <table className="table bordered-table sm-table mb-0">
                        <thead>
                            <tr className="bg-neutral-50">
                                <th scope="col" className="text-center py-16" style={{ width: '80px' }}>S.No</th>
                                <th scope="col" className="py-16">Date & Order ID</th>
                                <th scope="col" className="py-16">Customer Name</th>
                                <th scope="col" className="py-16">Address</th>
                                <th scope="col" className="py-16 text-end">Total Amount</th>
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
                                                <span className="text-xs text-danger-400 fw-bold">#{order.orderId || (order.id || order._id)?.toString().slice(-6).toUpperCase()}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="d-flex align-items-center gap-3">
                                                <div className="w-32-px h-32-px rounded-circle bg-neutral-100 d-flex align-items-center justify-content-center text-secondary-light fw-bold text-xs uppercase">
                                                    {order.address?.name?.charAt(0)}
                                                </div>
                                                <span className="text-sm fw-bold text-secondary-light">{order.address?.name}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="d-flex flex-column" style={{ maxWidth: '250px' }}>
                                                <span className="text-xs text-secondary-light text-truncate" title={`${order.address?.doorNo}, ${order.address?.street}`}>
                                                    {order.address?.doorNo}, {order.address?.street}
                                                </span>
                                                <span className="text-xxxxs text-secondary-400">{order.address?.city}, {order.address?.pincode}</span>
                                            </div>
                                        </td>
                                        <td className="text-end">
                                            <span className="text-md fw-black text-danger-600">₹{order.grandTotal?.toLocaleString()}</span>
                                        </td>
                                        <td className="text-center">
                                            <Link
                                                to={`/customer-orders/view/${order.id || order._id}`}
                                                className="bg-info-focus bg-hover-info-200 text-info-600 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle mx-auto"
                                            >
                                                <Icon icon="majesticons:eye-line" className="text-xl" />
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center py-100 italic text-secondary-400">
                                        No cancelled orders found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {!loading && totalRecords > 0 && (
                    <div className="mt-24 px-24">
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

export default CancelledOrderListLayer;
