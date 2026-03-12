import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import Select from "react-select";
import { selectStyles } from "../helper/SelectStyles";
import PaymentHistoryApi from "../Api/PaymentHistoryApi";
import { Modal, Button } from "react-bootstrap";
import TablePagination from "./TablePagination";

const PaymentHistoryListLayer = () => {
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState([]);

    // Filters
    const [paymentMethodFilter, setPaymentMethodFilter] = useState(null);
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(10);
    const [total, setTotal] = useState(0);

    // Modal state
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    // Debounce search
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search);
        }, 500);
        return () => clearTimeout(handler);
    }, [search]);

    useEffect(() => {
        fetchHistory();
    }, [page, limit, paymentMethodFilter, fromDate, toDate, debouncedSearch]);

    const fetchHistory = async () => {
        setLoading(true);
        const res = await PaymentHistoryApi.list(
            page,
            limit,
            paymentMethodFilter?.value || "",
            fromDate,
            toDate,
            debouncedSearch
        );
        if (res && res.status) {
            setHistory(res.response.data);
            setTotal(res.response.total);
        }
        setLoading(false);
    };

    const handleViewDetails = (item) => {
        setSelectedItem(item);
        setShowDetailsModal(true);
    };

    const paymentMethodOptions = [
        { value: "", label: "All Modes" },
        { value: "Cash", label: "Cash" },
        { value: "Card", label: "Card" },
        { value: "GPay", label: "GPay" },
        { value: "Bank Transfer", label: "Bank Transfer" },
        { value: "Cheque", label: "Cheque" },
    ];

    return (
        <div className="card h-100 p-0 radius-12">
            <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center justify-content-between flex-wrap gap-3">
                <h6 className="text-primary-600 pb-2 mb-0">Payment History</h6>
            </div>

            <div className="card-body p-24">
                {/* Filters Row - Matching Purchase Entry Style */}
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
                        <label className="form-label fw-medium text-secondary-light">Payment Mode</label>
                        <Select
                            options={paymentMethodOptions}
                            isClearable
                            value={paymentMethodFilter}
                            onChange={(val) => { setPaymentMethodFilter(val); setPage(0); }}
                            placeholder="Select Mode"
                            styles={selectStyles()}
                        />
                    </div>
                    <div className="col-md-3">
                        <label className="form-label fw-medium text-secondary-light">From Date</label>
                        <input type="date" className="form-control" value={fromDate} onChange={(e) => { setFromDate(e.target.value); setPage(0); }} />
                    </div>
                    <div className="col-md-3">
                        <label className="form-label fw-medium text-secondary-light">To Date</label>
                        <input type="date" className="form-control" value={toDate} onChange={(e) => { setToDate(e.target.value); setPage(0); }} />
                    </div>
                </div>

                {/* Table */}
                <div className="table-responsive border radius-8 overflow-hidden">
                    <table className="table bordered-table sm-table mb-0">
                        <thead>
                            <tr>
                                <th scope="col" style={{ color: "black" }}>Type</th>
                                <th scope="col" style={{ color: "black" }}>Order ID</th>
                                <th scope="col" style={{ color: "black" }} className="text-center">Date</th>
                                <th scope="col" style={{ color: "black" }}>Who</th>
                                <th scope="col" style={{ color: "black" }} className="text-right">Amount</th>
                                <th scope="col" style={{ color: "black" }} className="text-center">Mode</th>
                                <th scope="col" style={{ color: "black" }} className="text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="7" className="text-center py-40">Loading...</td></tr>
                            ) : history.length > 0 ? history.map((h, idx) => (
                                <tr key={idx}>
                                    <td className="py-16 px-24">
                                        <span className={`badge ${h.type === 'POS' ? 'bg-info-focus text-info-600' :
                                            h.type === 'Website' ? 'bg-primary-focus text-primary-600' :
                                                'bg-warning-focus text-warning-600'
                                            } px-24 py-4 radius-4 fw-medium text-sm`}>
                                            {h.type}
                                        </span>
                                    </td>
                                    <td className="py-16 px-24 fw-bold text-primary-600">{h.orderId}</td>
                                    <td className="py-16 px-24 text-center">{new Date(h.date).toLocaleDateString()}</td>
                                    <td className="py-16 px-24"><span className="text-md mb-0 fw-normal text-secondary-light">{h.paidBy || "-"}</span></td>
                                    <td className="py-16 px-24 text-right fw-bold text-success-600">₹{h.amount?.toFixed(2)}</td>
                                    <td className="py-16 px-24 text-center">
                                        <span className="badge bg-neutral-100 text-secondary-light px-24 py-4 radius-4 fw-medium text-sm">{h.paymentMethod}</span>
                                    </td>
                                    <td className="py-16 px-24 text-center">
                                        <div className="d-flex justify-content-center">
                                            <button onClick={() => handleViewDetails(h)} className="bg-info-focus bg-hover-info-200 text-info-600 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle border-0">
                                                <Icon icon="majesticons:eye-line" className="menu-icon" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan="7" className="text-center py-40 text-secondary-light">No records found.</td></tr>
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

            {/* Details Modal */}
            <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)} centered size="lg">
                <Modal.Header closeButton>
                    <Modal.Title className="text-md fw-bold">Payment Details - {selectedItem?.orderId}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-24">
                    {selectedItem && (
                        <div className="row gy-4">
                            <div className="col-md-6">
                                <label className="text-secondary-light text-sm d-block">Transaction Type</label>
                                <span className="fw-bold">{selectedItem.type}</span>
                            </div>
                            <div className="col-md-6">
                                <label className="text-secondary-light text-sm d-block">Order ID</label>
                                <span className="fw-bold">{selectedItem.orderId}</span>
                            </div>
                            <div className="col-md-6">
                                <label className="text-secondary-light text-sm d-block">Date & Time</label>
                                <span className="fw-bold">{new Date(selectedItem.date).toLocaleString()}</span>
                            </div>
                            <div className="col-md-6">
                                <label className="text-secondary-light text-sm d-block">Amount</label>
                                <span className="fw-bold text-success-600">₹{selectedItem.amount?.toFixed(2)}</span>
                            </div>
                            <div className="col-md-6">
                                <label className="text-secondary-light text-sm d-block">Payment Method</label>
                                <span className="fw-bold badge bg-neutral-100 text-secondary-light">{selectedItem.paymentMethod}</span>
                            </div>
                            <div className="col-md-6">
                                <label className="text-secondary-light text-sm d-block">Paid By / For</label>
                                <span className="fw-bold">{selectedItem.paidBy}</span>
                            </div>

                            {selectedItem.type === "Vendor" && (
                                <div className="col-12 mt-16 border-top pt-16">
                                    <h6>Vendor Payment Details</h6>
                                    <label className="text-secondary-light text-sm d-block mt-8">Remarks</label>
                                    <p className="bg-neutral-50 p-12 radius-8">{selectedItem.details.remarks || "No remarks"}</p>
                                </div>
                            )}

                            {(selectedItem.type === "POS" || selectedItem.type === "Website") && (
                                <div className="col-12 mt-16 border-top pt-16">
                                    <h6>Order Products</h6>
                                    <div className="table-responsive mt-12 border radius-8">
                                        <table className="table table-sm mb-0">
                                            <thead className="bg-neutral-50">
                                                <tr>
                                                    <th className="px-16 py-8">Product</th>
                                                    <th className="px-16 py-8 text-center">Qty</th>
                                                    <th className="px-16 py-8 text-right">Price</th>
                                                    <th className="px-16 py-8 text-right">Total</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {selectedItem.details.products?.map((p, i) => (
                                                    <tr key={i}>
                                                        <td className="px-16 py-8 text-sm">{p.productName}</td>
                                                        <td className="px-16 py-8 text-center text-sm">{p.qty}</td>
                                                        <td className="px-16 py-8 text-right text-sm">₹{p.price?.toFixed(2)}</td>
                                                        <td className="px-16 py-8 text-right text-sm fw-bold">₹{p.total?.toFixed(2)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-neutral" onClick={() => setShowDetailsModal(false)}>Close</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default PaymentHistoryListLayer;
