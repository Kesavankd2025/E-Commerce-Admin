import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { Icon } from "@iconify/react/dist/iconify.js";
import OrderApi from "../Api/OrderApi";
import { formatDate } from "../helper/DateHelper";

const ReturnOrderDetailsLayer = () => {
    const { id } = useParams();
    const [orderData, setOrderData] = useState(null);
    const [customerData, setCustomerData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [newStatus, setNewStatus] = useState("");
    const billRef = useRef();

    const fetchDetails = async () => {
        setLoading(true);
        try {
            const res = await OrderApi.getReturnOrderDetails(id);
            if (res.status && res.response) {
                setOrderData(res.response.data.order);
                setCustomerData(res.response.data.customer);
                setNewStatus(res.response.data.order.orderStatus);
            }
        } catch (error) {
            console.error("Error fetching return order details:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDetails();
    }, [id]);

    const handleUpdateStatus = async () => {
        if (!newStatus) return;
        setUpdating(true);
        try {
            const res = await OrderApi.updateReturnOrderStatus(id, newStatus);
            if (res.status) {
                fetchDetails();
            }
        } finally {
            setUpdating(false);
        }
    };

    const handlePrint = () => {
        const printContent = billRef.current.innerHTML;
        const originalContent = document.body.innerHTML;
        document.body.innerHTML = printContent;
        window.print();
        document.body.innerHTML = originalContent;
        window.location.reload();
    };

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center py-100">
            <div className="spinner-border text-primary-600" role="status"></div>
        </div>
    );

    if (!orderData) return <div className="text-center py-100">Return order not found.</div>;

    const statusSteps = ["Return-Initiated", "Approved", "Pickedup", "Received to Warehouse"];
    const currentStatusIndex = statusSteps.indexOf(orderData.orderStatus);
    const progressWidth = (currentStatusIndex / (statusSteps.length - 1)) * 100;

    return (
        <div className="row g-4 pb-40">
            <style>{`
                .order-stepper {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    position: relative;
                    padding: 20px 0 40px;
                    max-width: 900px;
                    margin: 0 auto;
                }
                .stepper-bg {
                    position: absolute;
                    top: 42px;
                    left: 0;
                    right: 0;
                    height: 6px;
                    background: #f1f5f9;
                    z-index: 1;
                    border-radius: 10px;
                }
                .stepper-progress {
                    position: absolute;
                    top: 42px;
                    left: 0;
                    height: 6px;
                    background: linear-gradient(90deg, #6c5ce7, #a29bfe);
                    z-index: 2;
                    transition: width 0.8s;
                    border-radius: 10px;
                }
                .step-item {
                    position: relative;
                    z-index: 3;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 12px;
                    width: 140px;
                }
                .step-circle {
                    width: 48px;
                    height: 48px;
                    border-radius: 50%;
                    background: #fff;
                    border: 4px solid #f1f5f9;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s;
                }
                .step-item.active .step-circle, .step-item.completed .step-circle {
                    border-color: #6c5ce7;
                    background: #6c5ce7;
                    color: #fff;
                }
                .step-label {
                    font-size: 11px;
                    font-weight: 700;
                    color: #64748b;
                    text-align: center;
                }
                .step-item.active .step-label, .step-item.completed .step-label {
                    color: #6c5ce7;
                }
                .pos-bill-container {
                    background: #fff;
                    padding: 30px;
                    border: 1px solid #e2e8f0;
                    max-width: 450px;
                    margin: 0 auto;
                }
            `}</style>

            <div className="col-12">
                <div className="card border-0 shadow-sm radius-12 p-32">
                    <div className="d-flex align-items-center justify-content-between mb-40">
                        <div className="d-flex align-items-center gap-3">
                            <Link to="/return-orders" className="btn btn-outline-neutral-600 w-48-px h-48-px d-flex justify-content-center align-items-center rounded-circle text-xl">
                                <Icon icon="lucide:arrow-left" />
                            </Link>
                            <div>
                                <h4 className="mb-1 fw-bold text-primary-600">Return #{(orderData.id || orderData._id)?.toString().slice(-6).toUpperCase()}</h4>
                                <p className="text-sm text-secondary-light mb-0">Initiated on {formatDate(orderData.createdAt)}</p>
                                <p className="text-xs text-secondary-400 mt-1">Orig Order ID: <span className="fw-bold">#{orderData.orderIdString}</span></p>
                            </div>
                        </div>
                        <span className="badge radius-8 px-20 py-10 fw-black text-sm bg-info-focus text-info-main mt-0">
                            {orderData.orderStatus.toUpperCase()}
                        </span>
                    </div>

                    <div className="order-stepper">
                        <div className="stepper-bg"></div>
                        <div className="stepper-progress" style={{ width: `${progressWidth}%` }}></div>
                        {statusSteps.map((step, index) => {
                            const isCompleted = index < currentStatusIndex;
                            const isActive = index === currentStatusIndex;
                            return (
                                <div key={step} className={`step-item ${isActive ? "active" : ""} ${isCompleted ? "completed" : ""}`}>
                                    <div className="step-circle">
                                        <Icon icon={isActive || isCompleted ? "solar:check-read-linear" : "solar:reorder-bold"} className="text-2xl" />
                                    </div>
                                    <span className="step-label">{step}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="col-xl-8">
                <div className="card border-0 shadow-sm radius-12 p-32 h-100">
                    <div className="d-flex align-items-center justify-content-between mb-32">
                        <h6 className="mb-0 fw-bold text-primary-600 d-flex align-items-center gap-2">
                            <Icon icon="solar:bill-list-bold-duotone" className="text-2xl" />
                            Return Order Receipt
                        </h6>
                        <button onClick={handlePrint} className="btn btn-primary-600 radius-8 px-24 py-11 fw-bold d-flex align-items-center gap-2">
                            <Icon icon="solar:printer-bold" className="text-xl" />
                            Print Details
                        </button>
                    </div>

                    <div ref={billRef}>
                        <div className="pos-bill-container">
                            <div className="text-center mb-24 pb-20 border-bottom border-dashed">
                                <h5 className="mb-1 fw-black text-primary-600">RETURN INVOICE</h5>
                                <p className="text-xs text-secondary-500 mb-0">PRRAYASHA COLLECTIONS</p>
                            </div>

                            <div className="mb-16">
                                <div className="d-flex justify-content-between mb-8">
                                    <span className="text-xs text-secondary-500">Return ID:</span>
                                    <span className="text-xs fw-bold text-secondary-light">#{(orderData.id || orderData._id)?.toString().slice(-6).toUpperCase()}</span>
                                </div>
                                <div className="d-flex justify-content-between mb-8">
                                    <span className="text-xs text-secondary-500">Orig Order ID:</span>
                                    <span className="text-xs fw-bold text-secondary-light">#{orderData.orderIdString}</span>
                                </div>
                            </div>

                            <table className="w-100 mb-16">
                                <thead className="border-bottom pb-8">
                                    <tr>
                                        <th className="text-xs text-secondary-light fw-black pb-8">Product</th>
                                        <th className="text-xs text-secondary-light fw-black pb-8 text-center">Qty</th>
                                        <th className="text-xs text-secondary-light fw-black pb-8 text-end">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orderData.products.map((item, idx) => (
                                        <tr key={idx} className="border-bottom border-neutral-50">
                                            <td className="py-12">
                                                <span className="text-xs fw-bold text-secondary-light d-block">{item.productName}</span>
                                                <span className="text-xxxxs text-secondary-400">SKU: {item.sku}</span>
                                            </td>
                                            <td className="py-12 text-center text-xs">{item.qty}</td>
                                            <td className="py-12 text-end text-xs fw-bold">₹{item.total?.toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <div className="mt-16 pt-16 border-top border-dashed">
                                <div className="d-flex justify-content-between mb-8">
                                    <span className="text-sm fw-black text-secondary-light">TOTAL REFUNDABLE</span>
                                    <span className="text-lg fw-black text-primary-600">₹{orderData.grandTotal?.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-xl-4 no-print">
                <div className="d-flex flex-column gap-4">
                    <div className="card border-0 shadow-sm radius-12 p-32">
                        <h6 className="mb-16 fw-bold text-primary-600">Update Return Status</h6>
                        <div className="d-flex flex-column gap-3">
                            <select
                                className="form-select radius-8 h-48-px fw-medium text-secondary-light"
                                value={newStatus}
                                onChange={(e) => setNewStatus(e.target.value)}
                            >
                                {statusSteps.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                            <button
                                onClick={handleUpdateStatus}
                                className="btn btn-primary-600 radius-8 h-48-px fw-bold d-flex align-items-center justify-content-center gap-2"
                                disabled={updating}
                            >
                                {updating ? <div className="spinner-border spinner-border-sm"></div> : <Icon icon="solar:refresh-circle-bold" className="text-xl" />}
                                Update Return Status
                            </button>
                        </div>
                    </div>

                    <div className="card border-0 shadow-sm radius-12 p-32">
                        <h6 className="mb-20 fw-bold text-primary-600 d-flex align-items-center gap-2">
                            <Icon icon="solar:user-bold" className="text-xl" />
                            Customer Info
                        </h6>
                        {customerData && (
                            <div className="d-flex flex-column gap-4">
                                <div>
                                    <p className="text-xxxxs text-secondary-400 mb-4 fw-bold uppercase">Name</p>
                                    <h6 className="text-sm fw-bold text-secondary-light mb-0">{customerData.fullName}</h6>
                                </div>
                                <div className="dashed-divider my-4"></div>
                                <div>
                                    <p className="text-xxxxs text-secondary-400 mb-4 fw-bold uppercase">Phone</p>
                                    <h6 className="text-sm fw-bold text-secondary-light mb-0">{customerData.phoneNumber}</h6>
                                </div>
                                <div>
                                    <p className="text-xxxxs text-secondary-400 mb-4 fw-bold uppercase">Pickup Address</p>
                                    <p className="text-xs text-secondary-light mb-0 fw-medium">
                                        {orderData.address?.name}<br />
                                        {orderData.address?.doorNo}, {orderData.address?.street}<br />
                                        {orderData.address?.city} - {orderData.address?.pincode}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
export default ReturnOrderDetailsLayer;
