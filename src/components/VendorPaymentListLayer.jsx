import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import Select from "react-select";
import { selectStyles } from "../helper/SelectStyles";
import VendorApi from "../Api/VendorApi";
import VendorPaymentApi from "../Api/VendorPaymentApi";
import { toast } from "react-toastify";
import { Modal, Button } from "react-bootstrap";
import TablePagination from "./TablePagination";

const VendorPaymentListLayer = () => {
    const [loading, setLoading] = useState(false);
    const [vendors, setVendors] = useState([]);
    const [orders, setOrders] = useState([]);

    // Filters
    const [vendorFilter, setVendorFilter] = useState(null);
    const [statusFilter, setStatusFilter] = useState({ value: "Pending", label: "Pending" });
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(10);
    const [total, setTotal] = useState(0);

    // Modal state
    const [showPayModal, setShowPayModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [payAmount, setPayAmount] = useState(0);
    const [payMethod, setPayMethod] = useState("Cash");
    const [payDate, setPayDate] = useState(new Date().toISOString().split('T')[0]);
    const [payRemarks, setPayRemarks] = useState("");

    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [history, setHistory] = useState([]);

    useEffect(() => {
        fetchVendors();
        fetchOrders();
    }, [page, vendorFilter, statusFilter, fromDate, toDate]);

    const fetchVendors = async () => {
        const res = await VendorApi.getAll(0, 100);
        if (res.status) setVendors(res.response.data.map(v => ({ value: v._id, label: v.name })));
    };

    const fetchOrders = async () => {
        setLoading(true);
        const res = await VendorPaymentApi.list(
            page,
            limit,
            vendorFilter?.value || "",
            statusFilter?.value || "",
            fromDate,
            toDate
        );
        if (res.status) {
            setOrders(res.response.data);
            setTotal(res.response.total);
        }
        setLoading(false);
    };

    const handlePayClick = (order) => {
        setSelectedOrder(order);
        setPayAmount(order.grandTotal - order.paidAmount);
        setShowPayModal(true);
    };

    const handleHistoryClick = async (order) => {
        setSelectedOrder(order);
        const res = await VendorPaymentApi.getHistory(order._id);
        if (res.status) {
            setHistory(res.response.data || res.response);
            setShowHistoryModal(true);
        }
    };

    const handleSubmitPayment = async () => {
        if (!payAmount || payAmount <= 0) return toast.error("Please enter a valid amount");

        const res = await VendorPaymentApi.create({
            purchaseOrderId: selectedOrder._id,
            amount: payAmount,
            paymentMethod: payMethod,
            paymentDate: payDate,
            remarks: payRemarks
        });

        if (res.status) {
            toast.success("Payment recorded successfully");
            setShowPayModal(false);
            fetchOrders();
            // Reset
            setPayAmount(0);
            setPayRemarks("");
        } else {
            toast.error(res.error);
        }
    };

    const statusOptions = [
        { value: "", label: "All Status" },
        { value: "Pending", label: "Pending" },
        { value: "Partially Paid", label: "Partially Paid" },
        { value: "Paid", label: "Paid" }
    ];

    return (
        <div className="card h-100 p-0 radius-12 overflow-hidden shadow-sm">
            <div className="card-body p-24">
                {/* Filters Row */}
                <div className="row gy-4 mb-24 align-items-end">
                    <div className="col-md-3">
                        <label className="form-label fw-bold">Vendor</label>
                        <Select
                            options={vendors}
                            isClearable
                            value={vendorFilter}
                            onChange={setVendorFilter}
                            placeholder="All Vendors"
                            styles={selectStyles()}
                        />
                    </div>
                    <div className="col-md-2">
                        <label className="form-label fw-bold">Payment Status</label>
                        <Select
                            options={statusOptions}
                            value={statusFilter}
                            onChange={setStatusFilter}
                            styles={selectStyles()}
                        />
                    </div>
                    <div className="col-md-2">
                        <label className="form-label fw-bold">From Date</label>
                        <input type="date" className="form-control" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
                    </div>
                    <div className="col-md-2">
                        <label className="form-label fw-bold">To Date</label>
                        <input type="date" className="form-control" value={toDate} onChange={(e) => setToDate(e.target.value)} />
                    </div>
                    <div className="col-md-1">
                        <button className="btn btn-primary w-100 py-10" onClick={() => { setPage(0); fetchOrders(); }}>Filter</button>
                    </div>
                </div>

                {/* Table */}
                <div className="table-responsive border radius-8 overflow-hidden">
                    <table className="table table-hover mb-0">
                        <thead className="bg-neutral-50 text-secondary-light">
                            <tr>
                                <th className="py-16 px-24">Vendor Name</th>
                                <th className="py-16 px-24">Order ID</th>
                                <th className="py-16 px-24 text-center">Date</th>
                                <th className="py-16 px-24 text-right">Bill Amount</th>
                                <th className="py-16 px-24 text-right">Paid</th>
                                <th className="py-16 px-24 text-right">Balance</th>
                                <th className="py-16 px-24 text-center">Status</th>
                                <th className="py-16 px-24 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="8" className="text-center py-40">Loading...</td></tr>
                            ) : orders.length > 0 ? orders.map((o, idx) => (
                                <tr key={idx}>
                                    <td className="py-16 px-24 fw-bold text-primary-600">{o.vendorData?.name}</td>
                                    <td className="py-16 px-24">{o.orderId}</td>
                                    <td className="py-16 px-24 text-center">{new Date(o.createdAt).toLocaleDateString()}</td>
                                    <td className="py-16 px-24 text-right fw-bold">₹{o.grandTotal?.toFixed(2)}</td>
                                    <td className="py-16 px-24 text-right text-success-600">₹{o.paidAmount?.toFixed(2)}</td>
                                    <td className="py-16 px-24 text-right text-danger-600 fw-black">₹{(o.grandTotal - o.paidAmount).toFixed(2)}</td>
                                    <td className="py-16 px-24 text-center">
                                        <span className={`badge ${o.paymentStatus === "Paid" ? "bg-success-focus text-success-600" :
                                            o.paymentStatus === "Partially Paid" ? "bg-warning-focus text-warning-600" :
                                                "bg-danger-focus text-danger-600"
                                            }`}>{o.paymentStatus}</span>
                                    </td>
                                    <td className="py-16 px-24 text-center">
                                        <div className="d-flex justify-content-center gap-2">
                                            {o.paymentStatus !== "Paid" && (
                                                <button onClick={() => handlePayClick(o)} className="btn btn-sm btn-primary-600 radius-8 px-12 py-6 d-flex align-items-center gap-1">
                                                    <Icon icon="solar:wallet-outline" /> Pay
                                                </button>
                                            )}
                                            <button onClick={() => handleHistoryClick(o)} className="btn btn-sm btn-outline-neutral radius-8 px-12 py-6 d-flex align-items-center gap-1">
                                                <Icon icon="solar:history-outline" /> Details
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan="8" className="text-center py-40 text-secondary-light">No records found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <TablePagination
                    currentPage={page}
                    totalPages={Math.ceil(total / limit)}
                    onPageChange={setPage}
                    rowsPerPage={limit}
                    totalRecords={total}
                    onRowsPerPageChange={(e) => { setLimit(parseInt(e.target.value)); setPage(0); }}
                />
            </div>

            {/* Payment Modal */}
            <Modal show={showPayModal} onHide={() => setShowPayModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title className="text-md fw-bold">Make Payment - {selectedOrder?.orderId}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-24">
                    <div className="d-flex justify-content-between mb-24 p-16 bg-neutral-50 radius-8">
                        <div>
                            <small className="text-secondary-light d-block">Grand Total</small>
                            <span className="fw-bold">₹{selectedOrder?.grandTotal?.toFixed(2)}</span>
                        </div>
                        <div className="text-end">
                            <small className="text-secondary-light d-block">Balance Due</small>
                            <span className="fw-black text-danger-600">₹{(selectedOrder?.grandTotal - selectedOrder?.paidAmount).toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="row gy-4">
                        <div className="col-12">
                            <label className="form-label fw-bold">Amount to Pay <span className="text-danger">*</span></label>
                            <div className="input-group">
                                <span className="input-group-text bg-neutral-100">₹</span>
                                <input type="number" className="form-control" value={payAmount} onChange={(e) => setPayAmount(e.target.value)} />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <label className="form-label fw-bold">Payment Method</label>
                            <select className="form-select" value={payMethod} onChange={(e) => setPayMethod(e.target.value)}>
                                <option value="Cash">Cash</option>
                                <option value="GPay">GPay</option>
                                <option value="Bank Transfer">Bank Transfer</option>
                                <option value="NEFT">NEFT</option>
                                <option value="Cheque">Cheque</option>
                            </select>
                        </div>
                        <div className="col-md-6">
                            <label className="form-label fw-bold">Payment Date</label>
                            <input type="date" className="form-control" value={payDate} onChange={(e) => setPayDate(e.target.value)} />
                        </div>
                        <div className="col-12">
                            <label className="form-label fw-bold">Remarks</label>
                            <textarea className="form-control" rows="2" value={payRemarks} onChange={(e) => setPayRemarks(e.target.value)} placeholder="TID, Ref No, etc."></textarea>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowPayModal(false)}>Cancel</Button>
                    <Button variant="primary" onClick={handleSubmitPayment}>Submit Payment</Button>
                </Modal.Footer>
            </Modal>

            {/* History Modal */}
            <Modal show={showHistoryModal} onHide={() => setShowHistoryModal(false)} centered size="lg">
                <Modal.Header closeButton>
                    <Modal.Title className="text-md fw-bold">Payment History - {selectedOrder?.orderId}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-0">
                    <div className="table-responsive">
                        <table className="table table-hover mb-0">
                            <thead className="bg-neutral-50">
                                <tr>
                                    <th className="py-12 px-24">Date</th>
                                    <th className="py-12 px-24">Method</th>
                                    <th className="py-12 px-24 text-right">Amount</th>
                                    <th className="py-12 px-24">Remarks</th>
                                </tr>
                            </thead>
                            <tbody>
                                {history.length > 0 ? history.map((h, i) => (
                                    <tr key={i}>
                                        <td className="py-12 px-24">{new Date(h.paymentDate).toLocaleDateString()}</td>
                                        <td className="py-12 px-24"><span className="badge bg-neutral-100 text-secondary-light">{h.paymentMethod}</span></td>
                                        <td className="py-12 px-24 text-right fw-bold text-success-600">₹{h.amount?.toFixed(2)}</td>
                                        <td className="py-12 px-24 text-sm text-secondary-light">{h.remarks || "-"}</td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan="4" className="text-center py-24 text-secondary-light">No payments made yet.</td></tr>
                                )}
                            </tbody>
                            <tfoot className="bg-neutral-50 fw-black">
                                <tr>
                                    <td colSpan="2" className="text-end py-12 px-24">Total Paid:</td>
                                    <td className="text-right py-12 px-24 text-success-600">₹{selectedOrder?.paidAmount?.toFixed(2)}</td>
                                    <td></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowHistoryModal(false)}>Close</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default VendorPaymentListLayer;
