import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import ManualPaymentApi from "../Api/ManualPaymentApi";
import { toast } from "react-toastify";
import TablePagination from "./TablePagination";
import Select from "react-select";
import { selectStyles } from "../helper/SelectStyles";
import { Modal, Button } from "react-bootstrap";

const ManualPaymentListLayer = () => {
    const [loading, setLoading] = useState(false);
    const [orders, setOrders] = useState([]);

    // Filters
    const [paymentStatusFilter, setPaymentStatusFilter] = useState(null);
    const [orderFromFilter, setOrderFromFilter] = useState(null);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(10);
    const [total, setTotal] = useState(0);

    // Modal state
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [updateForm, setUpdateForm] = useState({
        amount: "",
        method: "Cash",
        paymentStatus: ""
    });

    // Debounce search
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search);
        }, 500);
        return () => clearTimeout(handler);
    }, [search]);

    useEffect(() => {
        fetchOrders();
    }, [page, limit, paymentStatusFilter, orderFromFilter, debouncedSearch]);

    const fetchOrders = async () => {
        setLoading(true);
        const res = await ManualPaymentApi.list(
            page,
            limit,
            paymentStatusFilter?.value || "",
            orderFromFilter?.value || "",
            debouncedSearch
        );
        if (res && res.status) {
            setOrders(res.response.data);
            setTotal(res.response.total);
        }
        setLoading(false);
    };

    const handleEditPayment = (order) => {
        setSelectedOrder(order);
        setUpdateForm({
            amount: "",
            method: (order.paymentMethod && order.paymentMethod !== "Multiple") ? order.paymentMethod : "Cash",
            paymentStatus: order.paymentStatus
        });
        setShowUpdateModal(true);
    };

    const handleUpdateSubmit = async () => {
        if (!updateForm.method) {
            toast.warning("Please select payment method");
            return;
        }

        const res = await ManualPaymentApi.update({
            orderId: selectedOrder._id || selectedOrder.id,
            amount: updateForm.amount,
            method: updateForm.method,
            paymentStatus: updateForm.paymentStatus
        });

        if (res && res.status) {
            setShowUpdateModal(false);
            fetchOrders();
        }
    };

    const paymentStatusOptions = [
        { value: "", label: "All Status" },
        { value: "Pending", label: "Pending" },
        { value: "Paid", label: "Paid" },
        { value: "Partially Paid", label: "Partially Paid" },
    ];

    const orderFromOptions = [
        { value: "", label: "All Sources" },
        { value: "POS", label: "POS" },
        { value: "Website", label: "Website" },
    ];

    const methodOptions = [
        { value: "Cash", label: "Cash" },
        { value: "Card", label: "Card" },
        { value: "GPay", label: "GPay" },
        { value: "Bank Transfer", label: "Bank Transfer" },
        { value: "Cheque", label: "Cheque" },
    ];

    return (
        <div className="card h-100 p-0 radius-12">
            <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center justify-content-between flex-wrap gap-3">
                <h6 className="text-primary-600 pb-2 mb-0">Manual Payment Update</h6>
            </div>

            <div className="card-body p-24">
                {/* Filters Row */}
                <div className="row g-3 mb-24 align-items-end">
                    <div className="col-md-3">
                        <label className="form-label fw-medium text-secondary-light">Search Order ID</label>
                        <div className="navbar-search" style={{ width: '100%', position: 'relative' }}>
                            <input
                                type="text"
                                className="bg-base h-40-px w-100"
                                placeholder="Search..."
                                value={search}
                                onChange={(e) => { setSearch(e.target.value); setPage(0); }}
                            />
                            <Icon icon="ion:search-outline" className="icon" style={{ position: 'absolute', right: '12px', top: '10px' }} />
                        </div>
                    </div>
                    <div className="col-md-3">
                        <label className="form-label fw-medium text-secondary-light">Status</label>
                        <Select
                            options={paymentStatusOptions}
                            isClearable
                            value={paymentStatusFilter}
                            onChange={(val) => { setPaymentStatusFilter(val); setPage(0); }}
                            placeholder="Select Status"
                            styles={selectStyles()}
                        />
                    </div>
                    <div className="col-md-3">
                        <label className="form-label fw-medium text-secondary-light">Order From</label>
                        <Select
                            options={orderFromOptions}
                            isClearable
                            value={orderFromFilter}
                            onChange={(val) => { setOrderFromFilter(val); setPage(0); }}
                            placeholder="Select Source"
                            styles={selectStyles()}
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="table-responsive border radius-8 overflow-hidden">
                    <table className="table bordered-table sm-table mb-0">
                        <thead>
                            <tr>
                                <th scope="col" style={{ color: "black" }}>Order ID</th>
                                <th scope="col" style={{ color: "black" }}>Source</th>
                                <th scope="col" style={{ color: "black" }}>Items</th>
                                <th scope="col" style={{ color: "black" }} className="text-right">Total</th>
                                <th scope="col" style={{ color: "black" }} className="text-right">Paid</th>
                                <th scope="col" style={{ color: "black" }} className="text-right">Balance</th>
                                <th scope="col" style={{ color: "black" }} className="text-center">Status</th>
                                <th scope="col" style={{ color: "black" }} className="text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="8" className="text-center py-40">Loading...</td></tr>
                            ) : orders.length > 0 ? orders.map((order, idx) => (
                                <tr key={idx}>
                                    <td className="py-16 px-24 fw-bold text-primary-600">{order.orderId}</td>
                                    <td className="py-16 px-24">
                                        <span className={`badge ${order.orderFrom === 'POS' ? 'bg-info-focus text-info-600' : 'bg-primary-focus text-primary-600'} px-24 py-4 radius-4 fw-medium text-sm`}>
                                            {order.orderFrom}
                                        </span>
                                    </td>
                                    <td className="py-16 px-24">{order.products?.length || 0}</td>
                                    <td className="py-16 px-24 text-right">₹{order.grandTotal?.toFixed(2)}</td>
                                    <td className="py-16 px-24 text-right fw-bold text-success-600">₹{order.receivedAmount?.toFixed(2)}</td>
                                    <td className="py-16 px-24 text-right fw-bold text-danger-600">₹{order.balanceAmount?.toFixed(2)}</td>
                                    <td className="py-16 px-24 text-center">
                                        <span className={`badge ${order.paymentStatus === 'Paid' ? 'bg-success-focus text-success-600' :
                                            order.paymentStatus === 'Partially Paid' ? 'bg-warning-focus text-warning-600' :
                                                'bg-danger-focus text-danger-600'
                                            } px-24 py-4 radius-4 fw-medium text-sm`}>
                                            {order.paymentStatus}
                                        </span>
                                    </td>
                                    <td className="py-16 px-24 text-center">
                                        <div className="d-flex justify-content-center">
                                            <button onClick={() => handleEditPayment(order)} className="bg-info-focus bg-hover-info-200 text-info-600 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle border-0" title="Edit Payment">
                                                <Icon icon="lucide:edit" className="menu-icon" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan="8" className="text-center py-40">No Orders Found</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {!loading && (
                    <TablePagination currentPage={page} totalPages={Math.ceil(total / limit)} onPageChange={setPage} rowsPerPage={limit} onRowsPerPageChange={(e) => { setLimit(parseInt(e.target.value)); setPage(0); }} totalRecords={total} />
                )}
            </div>

            {/* Update Modal */}
            <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)} centered size="md">
                <Modal.Header closeButton className="border-bottom bg-base py-16 px-24">
                    <Modal.Title className="text-primary-600 h6 mb-0">Update Payment - {selectedOrder?.orderId}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-24">
                    <div className="row g-4">
                        <div className="col-12">
                            <div className="d-flex justify-content-between p-16 radius-8 bg-neutral-50 mb-16">
                                <div>
                                    <p className="text-xs text-secondary-light mb-4">Grand Total</p>
                                    <h6 className="mb-0">₹{selectedOrder?.grandTotal?.toFixed(2)}</h6>
                                </div>
                                <div className="text-center">
                                    <p className="text-xs text-secondary-light mb-4">Paid</p>
                                    <h6 className="mb-0 text-success-600">₹{selectedOrder?.receivedAmount?.toFixed(2)}</h6>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-secondary-light mb-4">Balance</p>
                                    <h6 className="mb-0 text-danger-600">₹{selectedOrder?.balanceAmount?.toFixed(2)}</h6>
                                </div>
                            </div>
                        </div>
                        <div className="col-12">
                            <label className="form-label fw-bold">Add Payment Amount</label>
                            <input 
                                type="number" 
                                className="form-control" 
                                placeholder="Enter amount to pay..." 
                                value={updateForm.amount}
                                onChange={(e) => setUpdateForm({...updateForm, amount: e.target.value})}
                            />
                            <p className="text-xs text-secondary-400 mt-4">Leave empty if only changing status/method.</p>
                        </div>
                        <div className="col-md-6">
                            <label className="form-label fw-bold">Payment Mode</label>
                            <Select
                                options={methodOptions}
                                value={methodOptions.find(o => o.value === updateForm.method)}
                                onChange={(opt) => setUpdateForm({...updateForm, method: opt.value})}
                                styles={selectStyles()}
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label fw-bold">Payment Status</label>
                            <Select
                                options={paymentStatusOptions.filter(o => o.value !== "")}
                                value={paymentStatusOptions.find(o => o.value === updateForm.paymentStatus)}
                                onChange={(opt) => setUpdateForm({...updateForm, paymentStatus: opt.value})}
                                placeholder="Auto Calculation"
                                styles={selectStyles()}
                            />
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer className="border-top p-24">
                    <Button variant="outline-secondary" onClick={() => setShowUpdateModal(false)}>Cancel</Button>
                    <Button variant="primary" onClick={handleUpdateSubmit}>Update Payment</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ManualPaymentListLayer;
