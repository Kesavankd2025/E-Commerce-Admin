import React, { useState, useEffect, useRef } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import PosApi from "../Api/PosApi";
import { Modal, Button } from "react-bootstrap";

const PosOrderLayer = () => {
    // Custom Styles for POS Terminal
    const posStyles = `
        .pos-terminal-wrapper {
            background-color: #f8f9fa;
        }
        .pos-terminal-wrapper .card {
            border-radius: 12px;
            box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
        }
        .pos-terminal-wrapper .sm-table th {
            font-size: 10px;
            font-weight: 800;
            letter-spacing: 0.5px;
            color: #6c757d;
        }
        .pos-terminal-wrapper .sticky-top {
            z-index: 10;
        }
        .pos-terminal-wrapper .avatar-md {
            width: 48px;
            height: 48px;
        }
        .pos-terminal-wrapper .avatar-lg {
            width: 60px;
            height: 60px;
        }
        .pos-terminal-wrapper .line-height-1.2 {
            line-height: 1.2;
        }
        .pos-terminal-wrapper .uppercase {
            text-transform: uppercase;
        }
        .pos-terminal-wrapper .tracking-wider {
            letter-spacing: 0.05em;
        }
        .pos-terminal-wrapper .overflow-auto::-webkit-scrollbar {
            width: 5px;
        }
        .pos-terminal-wrapper .overflow-auto::-webkit-scrollbar-thumb {
            background: #dee2e6;
            border-radius: 10px;
        }
        .pos-terminal-wrapper .form-control-lg {
            font-weight: 500;
        }
    `;

    // State management
    const [customerSearch, setCustomerSearch] = useState("");
    const [customers, setCustomers] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [showCustomerModal, setShowCustomerModal] = useState(false);
    const [newCustomer, setNewCustomer] = useState({ fullName: "", phoneNumber: "", email: "" });

    const [productSearch, setProductSearch] = useState("");
    const [products, setProducts] = useState([]);
    const [selectedProductForVariant, setSelectedProductForVariant] = useState(null);
    const [showVariantModal, setShowVariantModal] = useState(false);

    const [cart, setCart] = useState([]);

    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [overallDiscount, setOverallDiscount] = useState(0);
    const [payments, setPayments] = useState([{ method: "Cash", amount: 0 }]);
    const [orderType, setOrderType] = useState("Takeaway/Packing");
    const [savedOrder, setSavedOrder] = useState(null);
    const [showBillModal, setShowBillModal] = useState(false);

    // Refs for dropdowns
    const customerDropdownRef = useRef(null);
    const productDropdownRef = useRef(null);
    const billRef = useRef(null);

    // Totals
    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
    const tax = subtotal * 0.18; // Assuming 18% tax for demo
    const grandTotal = Math.max(0, subtotal + tax - overallDiscount);

    const billStyles = `
        @media print {
            body * {
                visibility: hidden;
            }
            #printable-bill, #printable-bill * {
                visibility: visible;
            }
            #printable-bill {
                position: absolute;
                left: 0;
                top: 0;
                width: 80mm; /* Standard POS thermal paper width */
                padding: 5mm;
                margin: 0;
                font-family: 'Courier New', Courier, monospace;
                color: #000;
            }
            .no-print {
                display: none !important;
            }
        }
        .bill-preview {
            max-width: 400px;
            margin: 0 auto;
            background: #fff;
            padding: 20px;
            font-family: 'Courier New', Courier, monospace;
            border: 1px solid #eee;
            color: #000;
        }
        .bill-header { text-align: center; margin-bottom: 20px; }
        .bill-header h4 { margin: 0; font-weight: bold; font-size: 18px; }
        .bill-header p { margin: 2px 0; font-size: 11px; }
        .bill-divider { border-top: 1px dashed #000; margin: 10px 0; }
        .bill-row { display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 4px; }
        .bill-table { width: 100%; border-collapse: collapse; font-size: 12px; }
        .bill-table th { border-top: 1px dashed #000; border-bottom: 1px dashed #000; padding: 5px 0; text-align: left; }
        .bill-table td { padding: 5px 0; vertical-align: top; }
        .bill-footer { margin-top: 20px; font-size: 12px; }
        .bill-footer-row { display: flex; justify-content: space-between; margin-bottom: 5px; }
        .bill-footer-total { font-weight: bold; font-size: 14px; border-top: 1px solid #000; padding-top: 5px; }
    `;

    // Search Customers
    useEffect(() => {
        if (customerSearch.length >= 1) {
            const delay = setTimeout(async () => {
                const res = await PosApi.searchCustomers(customerSearch);
                if (res.status) setCustomers(res.response.data || []);
            }, 300);
            return () => clearTimeout(delay);
        } else {
            setCustomers([]);
        }
    }, [customerSearch]);

    // Search Products
    useEffect(() => {
        if (productSearch.length >= 1) {
            const delay = setTimeout(async () => {
                const res = await PosApi.searchProducts(productSearch);
                if (res.status) setProducts(res.response.data || []);
            }, 300);
            return () => clearTimeout(delay);
        } else {
            setProducts([]);
        }
    }, [productSearch]);

    const handleAddCustomer = async () => {
        const res = await PosApi.addCustomer(newCustomer);
        if (res.status) {
            setSelectedCustomer(res.response.data);
            setShowCustomerModal(false);
            setNewCustomer({ fullName: "", phoneNumber: "", email: "" });
            setCustomerSearch("");
        }
    };

    const addToCart = (product, variant = null) => {
        const productId = product.id || product._id;
        const cartId = variant ? `${productId}-${variant.sku}` : productId;

        const existing = cart.find(item => item.cartId === cartId);
        if (existing) {
            setCart(cart.map(item => item.cartId === cartId ? { ...item, qty: item.qty + 1 } : item));
        } else {
            setCart([...cart, {
                cartId: cartId,
                productId: productId,
                productName: product.name,
                sku: variant ? variant.sku : product.sku,
                combination: variant ? variant.combination : null,
                price: variant ? (Number(variant.price) || product.price || 0) : (product.price || 0),
                mrp: variant ? (Number(variant.mrp) || product.mrp || 0) : (product.mrp || 0),
                qty: 1,
                image: product.productImage || product.image
            }]);
        }
        setProductSearch("");
        setProducts([]);
        setShowVariantModal(false);
    };

    const handleProductSelect = (product) => {
        if (product.attributes && product.attributes.length > 0) {
            setSelectedProductForVariant(product);
            setShowVariantModal(true);
        } else {
            addToCart(product);
        }
    };

    const updateQty = (id, delta) => {
        setCart(cart.map(item => {
            if (item.cartId === id) {
                const newQty = Math.max(1, item.qty + delta);
                return { ...item, qty: newQty };
            }
            return item;
        }));
    };

    const removeFromCart = (id) => {
        setCart(cart.filter(item => item.cartId !== id));
    };

    const handlePayment = async () => {
        if (!selectedCustomer) return alert("Please select a customer");
        if (cart.length === 0) return alert("Cart is empty");

        const payload = {
            userId: selectedCustomer.id || selectedCustomer._id,
            products: cart,
            totalAmount: subtotal,
            taxAmount: tax,
            grandTotal: grandTotal,
            payments: payments,
            overallDiscount: overallDiscount,
            address: {
                name: selectedCustomer.fullName,
                phone: selectedCustomer.phoneNumber,
                doorNo: "N/A",
                street: "POS Billing",
                city: "Local",
                state: "POS",
                pincode: "000000"
            }
        };

        const res = await PosApi.createOrder(payload);
        if (res.status) {
            setSavedOrder(res.response.data);
            setShowBillModal(true);
            setShowPaymentModal(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const closeBill = () => {
        setCart([]);
        setSelectedCustomer(null);
        setOverallDiscount(0);
        setSavedOrder(null);
        setShowBillModal(false);
    };

    return (
        <div className="pos-terminal-wrapper p-0">
            <style>{posStyles}</style>
            <style>{billStyles}</style>
            <div className="row g-4 overflow-hidden" style={{ minHeight: 'calc(100vh - 180px)' }}>
                {/* Left Column: Cart Details */}
                <div className="col-xxl-8 col-xl-7">
                    <div className="card h-100 radius-12 shadow-sm border-0 d-flex flex-column">
                        <div className="card-header bg-white border-bottom py-20 px-24 d-flex align-items-center justify-content-between">
                            <h6 className="mb-0 fw-bold d-flex align-items-center gap-2 text-primary-600">
                                <Icon icon="solar:cart-large-linear" className="text-xl" />
                                Current Order Items
                            </h6>
                            <span className="badge bg-primary-50 text-primary-600 px-12 py-6 radius-4 fw-bold">
                                {cart.length} Items Selected
                            </span>
                        </div>
                        <div className="card-body p-0 flex-grow-1 overflow-auto">
                            <div className="table-responsive">
                                <table className="table sm-table mb-0">
                                    <thead className="bg-neutral-50 sticky-top">
                                        <tr>
                                            <th className="text-xxxxs text-secondary-light py-16 ps-24">ITEM DETAILS</th>
                                            <th className="text-xxxxs text-secondary-light py-16 text-center" style={{ width: '120px' }}>QTY</th>
                                            <th className="text-xxxxs text-secondary-light py-16 text-end">PRICE</th>
                                            <th className="text-xxxxs text-secondary-light py-16 text-end pe-24">TOTAL</th>
                                            <th className="text-xxxxs text-secondary-light py-16 text-center"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cart.length > 0 ? cart.map((item, idx) => (
                                            <tr key={item.cartId} className="align-middle border-bottom">
                                                <td className="ps-24 py-16">
                                                    <div className="d-flex align-items-center gap-3">
                                                        <div className="avatar-md flex-shrink-0 bg-neutral-100 p-1 radius-4">
                                                            <img src={process.env.REACT_APP_IMG_URL + item.image?.path} alt="" className="w-100 h-100 object-fit-cover radius-4" />
                                                        </div>
                                                        <div className="flex-grow-1">
                                                            <p className="mb-0 fw-bold text-sm text-secondary-light line-height-1.2">{item.productName}</p>
                                                            {item.combination ? (
                                                                <div className="d-flex gap-1 mt-4">
                                                                    {item.combination.map((c, i) => (
                                                                        <span key={i} className="badge bg-primary-100 text-primary-700 text-xxxxs px-6 py-2 radius-4">{c.value}</span>
                                                                    ))}
                                                                </div>
                                                            ) : (
                                                                <p className="mb-0 text-xxxxs text-secondary-light mt-4">SKU: {item.sku}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="d-flex align-items-center justify-content-center bg-neutral-100 radius-24 p-2 mx-auto" style={{ width: '90px' }}>
                                                        <button className="btn btn-sm btn-white rounded-circle shadow-sm p-4 d-flex align-items-center justify-content-center" style={{ width: '24px', height: '24px' }} onClick={() => updateQty(item.cartId, -1)}>
                                                            <Icon icon="solar:minus-linear" width="14" />
                                                        </button>
                                                        <span className="flex-grow-1 text-center text-xs fw-bold px-4">{item.qty}</span>
                                                        <button className="btn btn-sm btn-white rounded-circle shadow-sm p-4 d-flex align-items-center justify-content-center" style={{ width: '24px', height: '24px' }} onClick={() => updateQty(item.cartId, 1)}>
                                                            <Icon icon="solar:add-linear" width="14" />
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="text-end fw-medium text-sm">₹{item.price.toFixed(2)}</td>
                                                <td className="text-end fw-bold text-sm text-primary-600 pe-24">₹{(item.price * item.qty).toFixed(2)}</td>
                                                <td className="text-center pe-12">
                                                    <button className="btn p-8 text-neutral-400 hover-text-danger-600 transition-all" onClick={() => removeFromCart(item.cartId)}>
                                                        <Icon icon="solar:trash-bin-trash-linear" width="18" />
                                                    </button>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan="5" className="text-center py-100">
                                                    <div className="d-flex flex-column align-items-center opacity-50">
                                                        <Icon icon="solar:cart-large-minimalistic-linear" className="display-4 mb-3 text-neutral-400" />
                                                        <p className="italic text-secondary-400">Your cart is currently empty</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="card-footer bg-neutral-50 border-top p-24">
                            <div className="row g-3">
                                <div className="col-md-3">
                                    <div className="bg-white p-12 radius-8 border text-center">
                                        <p className="mb-4 text-xxxxs text-secondary-light uppercase fw-bold tracking-wider">Subtotal</p>
                                        <h5 className="mb-0 fw-black text-secondary-light">₹{subtotal.toFixed(2)}</h5>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="bg-white p-12 radius-8 border text-center">
                                        <p className="mb-4 text-xxxxs text-secondary-light uppercase fw-bold tracking-wider">Tax (18%)</p>
                                        <h5 className="mb-0 fw-black text-secondary-light">₹{tax.toFixed(2)}</h5>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="bg-white p-12 radius-8 border text-center">
                                        <p className="mb-4 text-xxxxs text-danger-600 uppercase fw-bold tracking-wider">Discount</p>
                                        <h5 className="mb-0 fw-black text-danger-600">₹{overallDiscount.toFixed(2)}</h5>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="bg-primary-600 p-12 radius-8 text-center text-white border-0">
                                        <p className="mb-4 text-xxxxs opacity-75 uppercase fw-bold tracking-wider">Payable Amount</p>
                                        <h5 className="mb-0 fw-black">₹{grandTotal.toFixed(2)}</h5>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Customer & Search */}
                <div className="col-xxl-4 col-xl-5">
                    <div className="card h-100 radius-12 shadow-sm border-0 d-flex flex-column bg-neutral-10">
                        <div className="card-body p-24 d-flex flex-column">
                            {/* Customer Section */}
                            <div className="mb-24">
                                <label className="form-label text-xs fw-bold text-secondary-light uppercase mb-12 tracking-wider">Customer Information</label>
                                <div className="position-relative" ref={customerDropdownRef}>
                                    <div className="input-group">
                                        <span className="input-group-text bg-white border-end-0 border-primary-50">
                                            <Icon icon="solar:user-circle-linear" />
                                        </span>
                                        <input
                                            type="text"
                                            className="form-control border-start-0 border-primary-50 ps-0"
                                            placeholder="Mobile or Name..."
                                            value={customerSearch}
                                            onChange={(e) => setCustomerSearch(e.target.value)}
                                        />
                                    </div>

                                    {customers.length > 0 && (
                                        <ul className="dropdown-menu show w-100 shadow-lg border-0 mt-2 radius-12 overflow-hidden z-3">
                                            {customers.map(c => (
                                                <li key={c._id} className="dropdown-item cursor-pointer py-12 border-bottom hover-bg-primary-50 flex-column align-items-start" onClick={() => { setSelectedCustomer(c); setCustomers([]); setCustomerSearch(""); }}>
                                                    <div className="d-flex align-items-center gap-2">
                                                        <div className="avatar-sm bg-primary-100 text-primary-600 rounded-circle d-flex align-items-center justify-content-center flex-shrink-0">
                                                            <Icon icon="solar:user-bold" />
                                                        </div>
                                                        <div className="overflow-hidden">
                                                            <p className="mb-0 fw-bold text-sm text-secondary-light">{c.fullName}</p>
                                                            <p className="mb-0 text-xxxxs text-secondary-light">{c.phoneNumber}</p>
                                                        </div>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    )}

                                    {customerSearch.length > 1 && customers.length === 0 && (
                                        <div className="card mt-2 border-0 shadow-sm radius-8">
                                            <div className="card-body p-12 d-flex align-items-center justify-content-between hvr-text-primary-600 cursor-pointer" onClick={() => setShowCustomerModal(true)}>
                                                <span className="text-secondary-light text-xs fw-medium">Not found? <span className="text-primary-600 fw-bold">Create "{customerSearch}"</span></span>
                                                <Icon icon="solar:add-circle-bold" className="text-primary-600" />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {selectedCustomer && (
                                    <div className="card mt-16 bg-success-focus-light border border-success-focus radius-12 shadow-none">
                                        <div className="card-body p-16 d-flex align-items-center justify-content-between">
                                            <div className="d-flex align-items-center gap-3">
                                                <div className="avatar bg-success-main text-white rounded-circle shadow-sm">
                                                    <Icon icon="solar:user-check-bold" />
                                                </div>
                                                <div>
                                                    <h6 className="mb-0 text-sm fw-black text-success-main">{selectedCustomer.fullName}</h6>
                                                    <p className="mb-0 text-xxxxs text-success-main opacity-75">{selectedCustomer.phoneNumber}</p>
                                                </div>
                                            </div>
                                            <button className="btn btn-sm btn-white rounded-circle shadow-none p-4 d-flex align-items-center justify-content-center text-secondary-light hover-bg-danger-focus hover-text-danger-main" onClick={() => setSelectedCustomer(null)}>
                                                <Icon icon="solar:close-circle-bold" width="18" />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Product Section */}
                            <div className="mb-32">
                                <label className="form-label text-xs fw-bold text-secondary-light uppercase mb-12 tracking-wider">Search Products</label>
                                <div className="position-relative" ref={productDropdownRef}>
                                    <div className="input-group input-group-lg shadow-sm radius-12 overflow-hidden border">
                                        <span className="input-group-text bg-white border-0 pe-0">
                                            <Icon icon="solar:magnifer-linear" className="text-primary-600" />
                                        </span>
                                        <input
                                            type="text"
                                            className="form-control border-0 text-md ps-12"
                                            placeholder="Name or SKU code..."
                                            value={productSearch}
                                            onChange={(e) => setProductSearch(e.target.value)}
                                            autoComplete="off"
                                        />
                                    </div>

                                    {products.length > 0 && (
                                        <ul className="dropdown-menu show w-100 shadow-lg border-0 mt-2 radius-12 overflow-hidden z-3" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                            {products.map(p => (
                                                <li key={p._id} className="dropdown-item cursor-pointer py-16 border-bottom hover-bg-primary-50" onClick={() => handleProductSelect(p)}>
                                                    <div className="d-flex align-items-center gap-3">
                                                        <div className="avatar-lg bg-neutral-100 p-1 radius-8 flex-shrink-0">
                                                            <img src={process.env.REACT_APP_IMG_URL + p.productImage?.path} alt="" className="w-100 h-100 object-fit-cover radius-4" />
                                                        </div>
                                                        <div className="flex-grow-1 overflow-hidden">
                                                            <p className="mb-4 fw-bold text-sm text-secondary-light line-height-1.2">{p.name}</p>
                                                            <div className="d-flex align-items-center justify-content-between">
                                                                <span className="badge bg-neutral-100 text-secondary-light text-xxxxs px-6 py-2">SKU: {p.sku}</span>
                                                                <span className="text-sm fw-black text-primary-600">₹{p.price}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-auto">
                                <div className="row g-3">
                                    <div className="col-12">
                                        <button className="btn btn-primary w-100 py-20 radius-12 shadow-lg fw-black text-md d-flex align-items-center justify-content-center gap-2" onClick={() => setShowPaymentModal(true)} disabled={cart.length === 0}>
                                            <Icon icon="solar:card-send-bold-duotone" width="28" />
                                            GO TO PAYMENT
                                        </button>
                                    </div>
                                    <div className="col-6">
                                        <button className="btn btn-warning-main w-100 py-16 radius-12 text-white fw-bold d-flex align-items-center justify-content-center gap-2 shadow-sm border-0">
                                            <Icon icon="solar:hand-stars-bold" />
                                            HOLD
                                        </button>
                                    </div>
                                    <div className="col-6">
                                        <button className="btn btn-outline-neutral w-100 py-16 radius-12 fw-bold d-flex align-items-center justify-content-center gap-2 shadow-none" onClick={() => { setCart([]); setSelectedCustomer(null); }}>
                                            <Icon icon="solar:refresh-linear" />
                                            CANCEL
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            {/* Add New Customer Modal */}
            <Modal show={showCustomerModal} onHide={() => setShowCustomerModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title className="text-md fw-bold">Add New Customer</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="row g-3">
                        <div className="col-12">
                            <label className="form-label">Full Name</label>
                            <input type="text" className="form-control" value={newCustomer.fullName} onChange={(e) => setNewCustomer({ ...newCustomer, fullName: e.target.value })} />
                        </div>
                        <div className="col-12">
                            <label className="form-label">Phone Number</label>
                            <input type="text" className="form-control" value={newCustomer.phoneNumber} onChange={(e) => setNewCustomer({ ...newCustomer, phoneNumber: e.target.value })} />
                        </div>
                        <div className="col-12">
                            <label className="form-label">Email (Optional)</label>
                            <input type="email" className="form-control" value={newCustomer.email} onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })} />
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-neutral" onClick={() => setShowCustomerModal(false)}>Close</Button>
                    <Button variant="primary" onClick={handleAddCustomer}>Create & Select</Button>
                </Modal.Footer>
            </Modal>

            {/* Payment Details Modal */}
            <Modal show={showPaymentModal} onHide={() => setShowPaymentModal(false)} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title className="text-md fw-bold">Payment Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="row g-4">
                        <div className="col-lg-7">
                            <div className="row g-3 mb-24">
                                <div className="col-md-6">
                                    <label className="form-label text-xs fw-bold">Overall Discount</label>
                                    <input type="number" className="form-control" value={overallDiscount} onChange={(e) => setOverallDiscount(Number(e.target.value))} />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label text-xs fw-bold">Order Type</label>
                                    <select className="form-select" value={orderType} onChange={(e) => setOrderType(e.target.value)}>
                                        <option>Takeaway/Packing</option>
                                        <option>Dine-in</option>
                                        <option>Delivery</option>
                                    </select>
                                </div>
                            </div>

                            <div className="payment-methods-area">
                                <div className="d-flex align-items-center justify-content-between mb-12">
                                    <h6 className="text-sm fw-bold mb-0">Payment Methods</h6>
                                    <button className="btn btn-outline-primary btn-sm radius-4 py-4" onClick={() => setPayments([...payments, { method: "Cash", amount: 0 }])}>
                                        <Icon icon="solar:add-circle-linear" /> Add Payment Method
                                    </button>
                                </div>

                                {payments.map((p, idx) => (
                                    <div key={idx} className="card p-16 radius-8 border mb-16 bg-neutral-10 position-relative">
                                        <div className="row g-3">
                                            <div className="col-md-6">
                                                <label className="form-label text-xxxxs text-secondary-light">Method</label>
                                                <select className="form-select form-select-sm" value={p.method} onChange={(e) => {
                                                    const newPayments = [...payments];
                                                    newPayments[idx].method = e.target.value;
                                                    setPayments(newPayments);
                                                }}>
                                                    <option>Cash</option>
                                                    <option>Card</option>
                                                    <option>UPI/QR</option>
                                                    <option>Wallet</option>
                                                </select>
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label text-xxxxs text-secondary-light">Amount</label>
                                                <input type="number" className="form-control form-control-sm" value={p.amount} onChange={(e) => {
                                                    const newPayments = [...payments];
                                                    newPayments[idx].amount = Number(e.target.value);
                                                    setPayments(newPayments);
                                                }} />
                                            </div>
                                        </div>
                                        {payments.length > 1 && (
                                            <button className="btn p-0 text-danger-600 position-absolute top-0 end-0 mt--8 me--8 bg-white border rounded-circle shadow-sm" style={{ width: '20px', height: '20px' }} onClick={() => setPayments(payments.filter((_, i) => i !== idx))}>
                                                <Icon icon="solar:close-circle-bold" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="col-lg-5">
                            <div className="card h-100 bg-neutral-50 border-0 radius-12 p-24">
                                <h6 className="text-md fw-bold mb-20 border-bottom pb-12">Order Summary</h6>
                                <div className="d-flex flex-column gap-12">
                                    <div className="d-flex justify-content-between">
                                        <span className="text-sm text-secondary-light">Subtotal:</span>
                                        <span className="text-sm fw-bold">₹{subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <span className="text-sm text-secondary-light">Tax (18%):</span>
                                        <span className="text-sm fw-bold">₹{tax.toFixed(2)}</span>
                                    </div>
                                    <div className="d-flex justify-content-between text-danger-600">
                                        <span className="text-sm">Overall Discount:</span>
                                        <span className="text-sm fw-bold">-₹{overallDiscount.toFixed(2)}</span>
                                    </div>
                                    <div className="d-flex justify-content-between border-top pt-12 mt-4">
                                        <span className="text-md fw-black">Total:</span>
                                        <span className="text-md fw-black text-primary-600">₹{grandTotal.toFixed(2)}</span>
                                    </div>
                                </div>

                                <div className="mt-40 bg-white p-16 radius-8 shadow-sm">
                                    <div className="d-flex justify-content-between mb-8">
                                        <span className="text-xxxxs text-secondary-light fw-bold uppercase">Received:</span>
                                        <span className="text-sm fw-bold">₹{payments.reduce((acc, p) => acc + p.amount, 0).toFixed(2)}</span>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <span className="text-xxxxs text-secondary-light fw-bold uppercase">Change:</span>
                                        <span className={`text-sm fw-bold ${payments.reduce((acc, p) => acc + p.amount, 0) - grandTotal >= 0 ? "text-success-main" : "text-danger-600"}`}>
                                            ₹{Math.max(0, payments.reduce((acc, p) => acc + p.amount, 0) - grandTotal).toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer className="border-0 bg-neutral-50">
                    <Button variant="outline-neutral" className="px-30" onClick={() => setShowPaymentModal(false)}>Cancel</Button>
                    <Button variant="success" className="px-30 fw-bold d-flex align-items-center gap-2" onClick={handlePayment}>
                        <Icon icon="solar:printer-minimalistic-bold" /> Complete Payment & Print
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Variant Selection Modal */}
            <Modal show={showVariantModal} onHide={() => setShowVariantModal(false)} size="md" centered>
                <Modal.Header closeButton>
                    <Modal.Title className="text-md fw-bold">Select Variation</Modal.Title>
                </Modal.Header>
                <Modal.Body className="bg-neutral-50">
                    {selectedProductForVariant && (
                        <div className="row g-3">
                            {selectedProductForVariant.attributes.map((attr, idx) => (
                                <div key={idx} className="col-12" onClick={() => addToCart(selectedProductForVariant, attr)}>
                                    <div className="card radius-8 border p-12 cursor-pointer hover-bg-primary-50 transition-all">
                                        <div className="d-flex align-items-center justify-content-between">
                                            <div className="d-flex flex-column gap-1">
                                                <div className="d-flex gap-2">
                                                    {attr.combination.map((c, i) => (
                                                        <span key={i} className="badge bg-white text-primary-600 border border-primary-200">{c.value}</span>
                                                    ))}
                                                </div>
                                                <span className="text-xxxxs text-secondary-light mt-1">SKU: {attr.sku} | Stock: {attr.stock}</span>
                                            </div>
                                            <div className="text-end">
                                                <p className="mb-0 fw-bold text-primary-600">₹{(Number(attr.price) || selectedProductForVariant.price).toFixed(2)}</p>
                                                {attr.mrp > attr.price && (
                                                    <p className="mb-0 text-xxxxs text-secondary-light text-decoration-line-through">₹{attr.mrp}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </Modal.Body>
            </Modal>
            {/* Bill Modal */}
            <Modal show={showBillModal} onHide={closeBill} size="md" centered className="no-print">
                <Modal.Header closeButton>
                    <Modal.Title className="text-md fw-bold">Order Invoice</Modal.Title>
                </Modal.Header>
                <Modal.Body className="bg-neutral-50">
                    {savedOrder && (
                        <div id="printable-bill" className="bill-preview shadow-sm" ref={billRef}>
                            <div className="bill-header">
                                <h4>Prrayasha Collections</h4>
                                <p>Provident Cosmo City, DR Abdul Kalam Road,</p>
                                <p>Pudhupakkam Village, Chengalpet 603103</p>
                                <p>PH : +91 91590 24967</p>
                                <p>Email: prayashacollections@gmail.com</p>
                                <div className="bill-divider"></div>
                                <h6 className="mb-0 fw-bold">POS INVOICE</h6>
                                <div className="bill-divider"></div>
                            </div>

                            <div className="bill-row">
                                <span>Customer: <strong>{savedOrder.address?.name || "Cash Customer"}</strong></span>
                                <span>Billing By: <strong>Admin</strong></span>
                            </div>
                            <div className="bill-row">
                                <span>Phone: {savedOrder.address?.phone || "N/A"}</span>
                            </div>

                            <div className="bill-divider"></div>

                            <div className="bill-row">
                                <span>Invoice No: <strong>{savedOrder.orderId}</strong></span>
                                <span>Date: {new Date(savedOrder.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="bill-row">
                                <span>Time: {new Date(savedOrder.createdAt).toLocaleTimeString()}</span>
                            </div>

                            <div className="bill-divider"></div>

                            <table className="bill-table">
                                <thead>
                                    <tr>
                                        <th>S.No</th>
                                        <th>Products</th>
                                        <th className="text-end">Rate</th>
                                        <th className="text-center">Qty</th>
                                        <th className="text-end">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {savedOrder.products?.map((item, idx) => (
                                        <tr key={idx}>
                                            <td>{idx + 1}</td>
                                            <td>
                                                {item.productName}
                                                {item.combination && (
                                                    <span style={{ fontSize: '10px', display: 'block' }}>
                                                        ({item.combination.map(c => c.value).join(", ")})
                                                    </span>
                                                )}
                                            </td>
                                            <td className="text-end">{item.price.toFixed(2)}</td>
                                            <td className="text-center">{item.qty}</td>
                                            <td className="text-end">{(item.price * item.qty).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <div className="bill-divider"></div>

                            <div className="bill-footer">
                                <div className="bill-footer-row">
                                    <span>Total Items:</span>
                                    <span>{savedOrder.products?.length}</span>
                                </div>
                                <div className="bill-footer-row">
                                    <span>Subtotal:</span>
                                    <span>₹{savedOrder.totalAmount?.toFixed(2)}</span>
                                </div>
                                <div className="bill-footer-row">
                                    <span>Discount:</span>
                                    <span>-₹{(savedOrder.overallDiscount || 0).toFixed(2)}</span>
                                </div>
                                <div className="bill-footer-row">
                                    <span>Tax (Included):</span>
                                    <span>₹{savedOrder.taxAmount?.toFixed(2)}</span>
                                </div>
                                <div className="bill-divider"></div>
                                <div className="bill-footer-row bill-footer-total">
                                    <span>Net Amount:</span>
                                    <span>₹{savedOrder.grandTotal?.toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="bill-divider"></div>
                            <div className="text-center" style={{ fontSize: '10px' }}>
                                <p>Thank you for your business!</p>
                                <p>GSTIN: 33AAFFR5104D1ZS</p>
                            </div>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer className="border-0 bg-neutral-50">
                    <Button variant="outline-neutral" onClick={closeBill}>Cancel</Button>
                    <Button variant="primary" className="d-flex align-items-center gap-2" onClick={handlePrint}>
                        <Icon icon="solar:printer-minimalistic-bold" /> Print Bill
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default PosOrderLayer;
