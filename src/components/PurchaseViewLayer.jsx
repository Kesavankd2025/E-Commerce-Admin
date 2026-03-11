import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Icon } from "@iconify/react/dist/iconify.js";
import PurchaseApi from "../Api/PurchaseApi";
import { toast } from "react-toastify";

const PurchaseViewLayer = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [po, setPo] = useState(null);
    const [receivedItems, setReceivedItems] = useState([]);
    const [isUpdating, setIsUpdating] = useState(false);

    const [otherCharges, setOtherCharges] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState("Cash");
    const [paidAmount, setPaidAmount] = useState(0);

    useEffect(() => {
        if (id) fetchDetails();
    }, [id]);

    const fetchDetails = async () => {
        setLoading(true);
        const res = await PurchaseApi.getById(id);
        if (res.status) {
            const data = res.response.data || res.response;
            setPo(data);
            setOtherCharges(data.otherCharges || 0);
            setPaymentMethod(data.paymentMethod || "Cash");
            setPaidAmount(0); // Reset on fetch or default to 0 for new payment entry
            // Pre-fill received items state
            const items = (data.items || []).map(it => ({
                ...it,
                receivedQty: it.isReceived ? it.receivedQty : it.orderedQty,
                isMarked: it.isReceived || false
            }));
            setReceivedItems(items);
        }
        setLoading(false);
    };

    const handleMarkChange = (idx, value) => {
        let updated = [...receivedItems];
        updated[idx].isMarked = value;
        setReceivedItems(updated);
    };

    const handleQtyChange = (idx, value) => {
        let updated = [...receivedItems];
        updated[idx].receivedQty = Number(value);
        setReceivedItems(updated);
    };

    const handlePriceChange = (idx, value) => {
        let updated = [...receivedItems];
        updated[idx].purchasePrice = Number(value);
        setReceivedItems(updated);
    };

    const handleUpdateStock = async () => {
        const markedItems = receivedItems.filter(it => it.isMarked && !it.isReceived);
        if (markedItems.length === 0 && Number(paidAmount) === 0) return toast.info("No new items marked or payment entered.");

        setIsUpdating(true);
        const res = await PurchaseApi.updateReceived(id, {
            items: markedItems,
            otherCharges,
            paymentMethod,
            paidAmount: Number(paidAmount)
        });
        setIsUpdating(false);
        if (res.status) {
            fetchDetails();
        }
    };

    if (loading) return <div className="card-body p-40 text-center"><p>Loading details...</p></div>;
    if (!po) return <div className="card-body p-40 text-center text-danger"><p>Purchase order not found.</p></div>;

    const subTotal = receivedItems.reduce((acc, it) => acc + (it.receivedQty * (it.purchasePrice || 0)), 0);
    const grandTotal = subTotal + Number(otherCharges);

    return (
        <div className="card h-100 p-0 radius-12 overflow-hidden shadow-sm">
            <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center justify-content-between">
                <div>
                    <h6 className="text-primary-600 pb-2 mb-0">Purchase Order Details - <span className="text-dark fw-black">{po.orderId}</span></h6>
                    <span className={`badge mt-2 ${po.status === "Received" ? "bg-success-focus text-success-600" :
                        po.status === "Partially Received" ? "bg-warning-focus text-warning-600" :
                            "bg-neutral-focus text-neutral-600"
                        }`}>Status: {po.status}</span>
                </div>
                <div className="d-flex gap-2">
                    <button onClick={window.print} className="btn btn-outline-primary btn-sm d-flex align-items-center gap-2"><Icon icon="fluent:print-24-regular" /> Print Bill</button>
                    <Link to="/purchase-entry" className="btn btn-neutral btn-sm">Back to List</Link>
                </div>
            </div>

            <div className="card-body p-24">
                {/* Info Bar */}
                <div className="row g-4 mb-32 p-16 bg-neutral-50 radius-8">
                    <div className="col-md-3">
                        <label className="text-secondary-light text-xs uppercase fw-bold mb-4">Vendor Name</label>
                        <p className="mb-0 fw-bold">{po.vendorDetails?.name || "N/A"}</p>
                    </div>
                    <div className="col-md-3">
                        <label className="text-secondary-light text-xs uppercase fw-bold mb-4">Order Date</label>
                        <p className="mb-0 fw-bold">{new Date(po.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="col-md-3">
                        <label className="text-secondary-light text-xs uppercase fw-bold mb-4">Initial Total</label>
                        <p className="mb-0 fw-bold text-primary-600 text-lg">₹{po.totalAmount?.toFixed(2)}</p>
                    </div>
                    <div className="col-md-3">
                        <label className="text-secondary-light text-xs uppercase fw-bold mb-4">Remarks</label>
                        <p className="mb-0 text-secondary-light">{po.remarks || "-"}</p>
                    </div>
                </div>

                {/* Items Table - Receiving Mode */}
                <div className="table-responsive border radius-8 overflow-hidden mb-32">
                    <table className="table table-hover mb-0">
                        <thead className="bg-neutral-50">
                            <tr>
                                <th className="py-16 px-24 text-center">Receive</th>
                                <th className="py-16 px-24">Product Item</th>
                                <th className="py-16 px-24 text-center">Ordered Qty</th>
                                <th className="py-16 px-24 text-center">Received Qty</th>
                                <th className="py-16 px-24 text-center">Purchase Price</th>
                                <th className="py-16 px-24 text-right">Unit Total</th>
                                <th className="py-16 px-24 text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {receivedItems.map((it, idx) => {
                                const combo = (it.variantCombination || []).map(c => c.value).join(", ");
                                return (
                                    <tr key={idx} className={it.isReceived ? "bg-light-success-50" : ""}>
                                        <td className="py-16 px-24 text-center">
                                            {!it.isReceived ? (
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input border-2 cursor-pointer w-24-px h-24-px"
                                                    checked={it.isMarked}
                                                    onChange={(e) => handleMarkChange(idx, e.target.checked)}
                                                />
                                            ) : (
                                                <Icon icon="fluent:checkmark-circle-24-filled" className="text-success-600 text-xxl" />
                                            )}
                                        </td>
                                        <td className="py-16 px-24">
                                            <p className="mb-0 fw-bold">{it.productName}</p>
                                            <span className="text-secondary-light text-sm">({combo})</span>
                                        </td>
                                        <td className="py-16 px-24 text-center fw-bold">{it.orderedQty}</td>
                                        <td className="py-16 px-24 text-center">
                                            {!it.isReceived ? (
                                                <input
                                                    type="number"
                                                    className="form-control form-control-sm text-center mx-auto"
                                                    style={{ width: '80px' }}
                                                    value={it.receivedQty}
                                                    onChange={(e) => handleQtyChange(idx, e.target.value)}
                                                />
                                            ) : (
                                                <span className="fw-black text-success-600">{it.receivedQty}</span>
                                            )}
                                        </td>
                                        <td className="py-16 px-24 text-center">
                                            {!it.isReceived ? (
                                                <input
                                                    type="number"
                                                    className="form-control form-control-sm text-center mx-auto"
                                                    style={{ width: '100px' }}
                                                    value={it.purchasePrice}
                                                    onChange={(e) => handlePriceChange(idx, e.target.value)}
                                                />
                                            ) : (
                                                <span className="fw-black">₹{it.purchasePrice}</span>
                                            )}
                                        </td>
                                        <td className="py-16 px-24 text-right">₹{(it.receivedQty * it.purchasePrice).toFixed(2)}</td>
                                        <td className="py-16 px-24 text-right">
                                            {it.isReceived ? (
                                                <span className="text-success-600 text-sm fw-bold">Added to Stock</span>
                                            ) : (
                                                <span className="text-secondary-light text-sm italic">Not Received</span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                <div className="row justify-content-end mb-32">
                    <div className="col-md-4">
                        <div className="bg-neutral-50 p-24 radius-12 border">
                            <h6 className="mb-20 text-md">Payment & Charges</h6>
                            <div className="mb-16">
                                <label className="form-label fw-semibold">Other Charges (Delivery/Courier)</label>
                                <input
                                    type="number"
                                    className="form-control radius-8"
                                    value={otherCharges}
                                    onChange={(e) => setOtherCharges(e.target.value)}
                                    placeholder="0.00"
                                    disabled={po.status === "Received"}
                                />
                            </div>
                            <div className="mb-20">
                                <label className="form-label fw-semibold">Payment Method</label>
                                <select
                                    className="form-select radius-8"
                                    value={paymentMethod}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    disabled={po.paymentStatus === "Paid"}
                                >
                                    <option value="Cash">Cash</option>
                                    <option value="GPay">GPay</option>
                                    <option value="Bank Transfer">Bank Transfer</option>
                                    <option value="NEFT">NEFT</option>
                                    <option value="Cheque">Cheque</option>
                                </select>
                            </div>

                            <div className="mb-20">
                                <label className="form-label fw-bold text-success-600">Amount Paid Now (₹)</label>
                                <input
                                    type="number"
                                    className="form-control radius-8 border-success-600"
                                    value={paidAmount}
                                    onChange={(e) => setPaidAmount(e.target.value)}
                                    placeholder="0.00"
                                    disabled={po.paymentStatus === "Paid"}
                                />
                                <small className="text-secondary-light mt-1 d-block">Already Paid: ₹{po.paidAmount?.toFixed(2)}</small>
                            </div>

                            <hr />

                            <div className="d-flex justify-content-between mb-8">
                                <span className="text-secondary-light">Subtotal (Items):</span>
                                <span className="fw-bold">₹{subTotal.toFixed(2)}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-16">
                                <span className="text-secondary-light">Other Charges:</span>
                                <span className="fw-bold">₹{Number(otherCharges).toFixed(2)}</span>
                            </div>
                            <div className="d-flex justify-content-between border-top pt-16">
                                <span className="fw-bold text-lg">Grand Total:</span>
                                <span className="fw-black text-primary-600 text-xl">₹{grandTotal.toFixed(2)}</span>
                            </div>
                            <div className="d-flex justify-content-between mt-8">
                                <span className="fw-bold text-secondary-light">Balance Due:</span>
                                <span className="fw-black text-danger-600 text-lg">₹{(grandTotal - (po.paidAmount || 0) - Number(paidAmount)).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="d-flex justify-content-between align-items-center">
                    <p className="text-secondary-light text-sm italic mb-0">Note: Mark items as received and enter correct purchase price & qty to update inventory stock. Entering amount will create a payment record.</p>
                    {(po.status !== "Received" || po.paymentStatus !== "Paid") && (
                        <button
                            disabled={isUpdating}
                            onClick={handleUpdateStock}
                            className="btn btn-success px-32 py-12 radius-8 d-flex align-items-center gap-2"
                        >
                            {isUpdating ? "Updating..." : <><Icon icon="fluent:box-arrow-up-24-regular" className="text-xl" /> Update Stock & Record Payment</>}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PurchaseViewLayer;
