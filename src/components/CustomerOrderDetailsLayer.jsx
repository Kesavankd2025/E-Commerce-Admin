import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { Icon } from "@iconify/react/dist/iconify.js";
import OrderApi from "../Api/OrderApi";
import { formatDate } from "../helper/DateHelper";
import { Modal, Button } from "react-bootstrap";

const CustomerOrderDetailsLayer = () => {
    const { id } = useParams();
    const [orderData, setOrderData] = useState(null);
    const [customerData, setCustomerData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [newStatus, setNewStatus] = useState("");
    const [cancelReason, setCancelReason] = useState("");
    const [showCancelModal, setShowCancelModal] = useState(false);
    const billRef = useRef();

    const fetchDetails = async () => {
        setLoading(true);
        try {
            const res = await OrderApi.getOrderDetails(id);
            if (res.status && res.response) {
                setOrderData(res.response.data.order);
                setCustomerData(res.response.data.customer);
                setNewStatus(res.response.data.order.orderStatus);
                if (res.response.data.order.cancelReason) {
                    setCancelReason(res.response.data.order.cancelReason);
                }
            }
        } catch (error) {
            console.error("Error fetching order details:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDetails();
    }, [id]);

    const handleUpdateStatus = async () => {
        if (!newStatus) return;

        if (newStatus === "Cancelled" && !showCancelModal && !orderData.cancelReason) {
            setShowCancelModal(true);
            return;
        }

        setUpdating(true);
        try {
            const res = await OrderApi.updateOrderStatus(id, newStatus, cancelReason);
            if (res.status) {
                fetchDetails();
                setShowCancelModal(false);
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

    if (!orderData) return <div className="text-center py-100">Order not found.</div>;

    const statusSteps = ["Pending", "Packed", "Shipped", "Delivered"];
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
                    background: linear-gradient(90deg, #003366, #0055aa);
                    z-index: 2;
                    transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
                    border-radius: 10px;
                }
                .step-item {
                    position: relative;
                    z-index: 3;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 12px;
                    width: 120px;
                }
                .step-circle {
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    background: #fff;
                    border: 4px solid #f1f5f9;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s;
                    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
                }
                .step-item.active .step-circle {
                    border-color: #003366;
                    background: #003366;
                    color: #fff;
                    transform: scale(1.1);
                }
                .step-item.completed .step-circle {
                    border-color: #003366;
                    background: #003366;
                    color: #fff;
                }
                .step-label {
                    font-size: 13px;
                    font-weight: 700;
                    color: #64748b;
                    transition: color 0.3s;
                }
                .step-item.active .step-label, .step-item.completed .step-label {
                    color: #003366;
                }
                .pos-bill-container {
                    background: #fff;
                    padding: 30px;
                    border: 1px solid #e2e8f0;
                    border-radius: 0;
                    width: 100%;
                    max-width: 450px;
                    margin: 0 auto;
                    font-family: 'Inter', sans-serif;
                    box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05);
                }
                .bill-header-text {
                    text-align: center;
                    margin-bottom: 24px;
                    border-bottom: 2px dashed #cbd5e1;
                    padding-bottom: 20px;
                }
                .dashed-divider {
                    border-top: 1px dashed #cbd5e1;
                    margin: 16px 0;
                }
                @media print {
                    .no-print { display: none !important; }
                    .pos-bill-container { box-shadow: none; border: none; padding: 0; }
                }
            `}</style>

            <div className="col-12">
                <div className="card border-0 shadow-sm radius-12 p-32">
                    <div className="d-flex align-items-center justify-content-between mb-40">
                        <div className="d-flex align-items-center gap-3">
                            <Link to="/customer-orders" className="btn btn-outline-neutral-600 w-48-px h-48-px d-flex justify-content-center align-items-center rounded-circle">
                                <Icon icon="lucide:arrow-left" className="text-xl" />
                            </Link>
                            <div>
                                <h4 className="mb-1 fw-bold text-primary-600">Order #{(orderData.orderId || (orderData.id || orderData._id))?.toString().slice(-6).toUpperCase()}</h4>
                                <p className="text-sm text-secondary-light mb-0">Placed on {formatDate(orderData.createdAt)}</p>
                                {orderData.orderStatus === 'Cancelled' && orderData.cancelReason && (
                                    <p className="text-xs text-danger-600 mt-2 fw-bold italic">Reason: {orderData.cancelReason}</p>
                                )}
                            </div>
                        </div>
                        <span className={`badge radius-8 px-20 py-10 fw-black text-sm ${orderData.orderStatus === 'Delivered' ? 'bg-success-focus text-success-main' :
                            orderData.orderStatus === 'Cancelled' ? 'bg-danger-focus text-danger-main' : 'bg-warning-focus text-warning-main'
                            }`}>
                            {orderData.orderStatus.toUpperCase()}
                        </span>
                    </div>

                    {/* Stepper */}
                    <div className="order-stepper">
                        <div className="stepper-bg"></div>
                        <div className="stepper-progress" style={{ width: `${progressWidth}%` }}></div>
                        {statusSteps.map((step, index) => {
                            const isCompleted = index < currentStatusIndex;
                            const isActive = index === currentStatusIndex;
                            let icon = "solar:clock-circle-bold";
                            if (step === "Packed") icon = "solar:box-bold";
                            if (step === "Shipped") icon = "solar:delivery-bold";
                            if (step === "Delivered") icon = "solar:check-circle-bold text-success-main";

                            return (
                                <div key={step} className={`step-item ${isActive ? "active" : ""} ${isCompleted ? "completed" : ""}`}>
                                    <div className="step-circle">
                                        <Icon icon={isActive || isCompleted ? "solar:check-read-linear" : icon} className="text-2xl" />
                                    </div>
                                    <span className="step-label">{step}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="col-xl-8">
                {/* Billing details / Main Content */}
                <div className="card border-0 shadow-sm radius-12 p-32 h-100">
                    <div className="d-flex align-items-center justify-content-between mb-32">
                        <h6 className="mb-0 fw-bold text-primary-600 d-flex align-items-center gap-2">
                            <Icon icon="solar:bill-list-bold-duotone" className="text-2xl" />
                            Tax Invoice
                        </h6>
                        <button onClick={handlePrint} className="btn btn-primary-600 radius-8 px-24 py-11 fw-bold d-flex align-items-center gap-2">
                            <Icon icon="solar:printer-bold" className="text-xl" />
                            Print Bill
                        </button>
                    </div>

                    <div ref={billRef}>
                        <div className="pos-bill-container">
                            <div className="bill-header-text">
                                <h5 className="mb-1 fw-black text-primary-600">PRRAYASHA COLLECTIONS</h5>
                                <p className="text-xs text-secondary-500 mb-1">Provident Cosmo City, DR Abdul Kalam Road,</p>
                                <p className="text-xs text-secondary-500 mb-1">Pudhupakkam Village, Chengalpet 603103</p>
                                <p className="text-xs text-secondary-500 mb-0">PH: +91 91590 24967 | {orderData?.email || 'prayashacollections@gmail.com'}</p>
                                <div className="mt-12">
                                    <span className="badge bg-neutral-100 text-secondary-light px-16 py-6 radius-4 fw-bold text-xs uppercase letter-spacing-1">Order Invoice</span>
                                </div>
                            </div>

                            <div className="bill-info-grid">
                                <div className="d-flex justify-content-between mb-8">
                                    <span className="text-xs text-secondary-500 fw-medium">Order ID:</span>
                                    <span className="text-xs text-secondary-light fw-bold">#{(orderData.orderId || (orderData.id || orderData._id))?.toString().slice(-6).toUpperCase()}</span>
                                </div>
                                <div className="d-flex justify-content-between mb-8">
                                    <span className="text-xs text-secondary-500 fw-medium">Date:</span>
                                    <span className="text-xs text-secondary-light fw-bold">{formatDate(orderData.createdAt)}</span>
                                </div>
                                <div className="dashed-divider"></div>
                                <div className="mb-16">
                                    <span className="text-xs text-secondary-500 fw-medium d-block mb-4">Customer Details:</span>
                                    <h6 className="text-sm fw-black text-secondary-light mb-2">{orderData.address?.name}</h6>
                                    <p className="text-xs text-secondary-500 mb-0 leading-relaxed">
                                        {orderData.address?.doorNo}, {orderData.address?.street},<br />
                                        {orderData.address?.city} - {orderData.address?.pincode}
                                    </p>
                                    <p className="text-xs text-secondary-500 mt-4 fw-bold">Mob: {orderData.address?.phone}</p>
                                </div>
                            </div>

                            <table className="w-100 mb-16">
                                <thead className="border-bottom-2">
                                    <tr>
                                        <th className="text-xs text-secondary-light fw-black pb-8 text-start">Items</th>
                                        <th className="text-xs text-secondary-light fw-black pb-8 text-center" style={{ width: '60px' }}>Qty</th>
                                        <th className="text-xs text-secondary-light fw-black pb-8 text-end" style={{ width: '80px' }}>Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orderData.products.map((item, idx) => (
                                        <tr key={idx}>
                                            <td className="py-12 border-bottom-1">
                                                <span className="text-xs fw-bold text-secondary-light d-block">{item.productName}</span>
                                                <span className="text-xxxxs text-secondary-400">SKU: {item.sku}</span>
                                            </td>
                                            <td className="py-12 border-bottom-1 text-center">
                                                <span className="text-xs text-secondary-light fw-medium">{item.qty}</span>
                                            </td>
                                            <td className="py-12 border-bottom-1 text-end">
                                                <span className="text-xs fw-bold text-secondary-light">₹{item.total?.toLocaleString()}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <div className="bill-calculation">
                                <div className="d-flex justify-content-between mb-8">
                                    <span className="text-xs text-secondary-500 fw-medium">Subtotal</span>
                                    <span className="text-xs text-secondary-light fw-bold">₹{orderData.totalAmount?.toLocaleString()}</span>
                                </div>
                                <div className="d-flex justify-content-between mb-8">
                                    <span className="text-xs text-secondary-500 fw-medium">Tax</span>
                                    <span className="text-xs text-secondary-light fw-bold">₹{orderData.taxAmount?.toLocaleString()}</span>
                                </div>
                                <div className="d-flex justify-content-between mb-8">
                                    <span className="text-xs text-secondary-500 fw-medium">Shipping</span>
                                    <span className="text-xs text-secondary-light fw-bold">₹{orderData.shippingCharge?.toLocaleString()}</span>
                                </div>
                                <div className="dashed-divider"></div>
                                <div className="d-flex justify-content-between align-items-center">
                                    <span className="text-sm fw-black text-secondary-light">GRAND TOTAL</span>
                                    <span className="text-lg fw-black text-primary-600">₹{orderData.grandTotal?.toLocaleString()}</span>
                                </div>
                                <div className="mt-24 text-center">
                                    <p className="text-xxxxs text-secondary-400 fst-italic mb-4">Payment Method: {orderData.paymentMethod} | Status: {orderData.paymentStatus}</p>
                                    <p className="text-xxxxs fw-bold text-primary-600">*** Thank you for your business! ***</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-xl-4 no-print">
                <div className="d-flex flex-column gap-4">
                    {/* Status Update Card */}
                    <div className="card border-0 shadow-sm radius-12 p-32">
                        <h6 className="mb-16 fw-bold text-primary-600">Update Order Status</h6>
                        <div className="d-flex flex-column gap-3">
                            <select
                                className="form-select radius-8 h-48-px fw-medium text-secondary-light border-neutral-200"
                                value={newStatus}
                                onChange={(e) => setNewStatus(e.target.value)}
                            >
                                {statusSteps.map(s => <option key={s} value={s}>{s}</option>)}
                                <option value="Return">Return</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                            <button
                                onClick={handleUpdateStatus}
                                className="btn btn-primary-600 radius-8 h-48-px fw-bold d-flex align-items-center justify-content-center gap-2"
                                disabled={updating}
                            >
                                {updating ? <div className="spinner-border spinner-border-sm"></div> : <Icon icon="solar:refresh-circle-bold" className="text-xl" />}
                                Update Status
                            </button>
                        </div>
                    </div>

                    {/* Customer Info Card */}
                    <div className="card border-0 shadow-sm radius-12 p-32">
                        <h6 className="mb-20 fw-bold text-primary-600">Customer Statistics</h6>
                        {customerData ? (
                            <div className="d-flex flex-column gap-4">
                                <div className="d-flex align-items-center gap-3 p-16 radius-12 bg-neutral-50">
                                    <div className="w-48-px h-48-px rounded-circle bg-primary-100 d-flex align-items-center justify-content-center text-primary-600">
                                        <Icon icon="solar:user-bold" className="text-2xl" />
                                    </div>
                                    <div>
                                        <p className="text-xxxxs text-secondary-400 mb-0 fw-bold uppercase">Full Name</p>
                                        <h6 className="text-sm fw-bold text-secondary-light mb-0">{customerData.fullName}</h6>
                                    </div>
                                </div>

                                <div className="row g-3">
                                    <div className="col-6">
                                        <div className="p-16 radius-12 bg-success-50 h-100">
                                            <p className="text-xxxxs text-success-main mb-4 fw-bold uppercase">Total Orders</p>
                                            <h4 className="mb-0 fw-black text-success-main">{customerData.orderCount}</h4>
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className="p-16 radius-12 bg-info-50 h-100">
                                            <p className="text-xxxxs text-info-main mb-4 fw-bold uppercase">Lifetime Value</p>
                                            <h4 className="mb-0 fw-black text-info-main">₹{orderData.grandTotal?.toLocaleString()}</h4>
                                        </div>
                                    </div>
                                </div>

                                <div className="dashed-divider"></div>

                                <div className="d-flex flex-column gap-2">
                                    <div className="d-flex align-items-center gap-2">
                                        <Icon icon="solar:phone-bold" className="text-secondary-400 text-sm" />
                                        <span className="text-xs text-secondary-light fw-medium">{customerData.phoneNumber}</span>
                                    </div>
                                    <div className="d-flex align-items-center gap-2">
                                        <Icon icon="solar:letter-bold" className="text-secondary-400 text-sm" />
                                        <span className="text-xs text-secondary-light fw-medium">{customerData.email || 'No Email'}</span>
                                    </div>
                                    <div className="d-flex align-items-center gap-2">
                                        <Icon icon="solar:calendar-bold" className="text-secondary-400 text-sm" />
                                        <span className="text-xs text-secondary-light fw-medium">Joined {formatDate(customerData.createdAt)}</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-20 text-secondary-400 text-sm italic">No profile data available.</div>
                        )}
                    </div>
                </div>
            </div>

            <Modal show={showCancelModal} onHide={() => setShowCancelModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title className="text-lg fw-bold">Cancel Order</Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-24">
                    <p className="text-sm text-secondary-light mb-12">Please provide a reason for cancelling this order.</p>
                    <textarea
                        className="form-control radius-8"
                        rows="4"
                        placeholder="Enter reason here..."
                        value={cancelReason}
                        onChange={(e) => setCancelReason(e.target.value)}
                    ></textarea>
                </Modal.Body>
                <Modal.Footer className="border-0 p-24 pt-0">
                    <Button variant="outline-neutral-600" className="radius-8 px-24" onClick={() => setShowCancelModal(false)}>
                        Close
                    </Button>
                    <Button
                        variant="danger"
                        className="radius-8 px-24 fw-bold"
                        onClick={handleUpdateStatus}
                        disabled={updating || !cancelReason.trim()}
                    >
                        Confirm Cancellation
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default CustomerOrderDetailsLayer;
