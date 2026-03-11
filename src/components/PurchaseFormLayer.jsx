import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react/dist/iconify.js";
import Select from "react-select";
import { selectStyles } from "../helper/SelectStyles";
import VendorApi from "../Api/VendorApi";
import ProductApi from "../Api/ProductApi";
import PurchaseApi from "../Api/PurchaseApi";
import { toast } from "react-toastify";
import { Modal, Button } from "react-bootstrap";

const PurchaseFormLayer = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [vendors, setVendors] = useState([]);
    const [products, setProducts] = useState([]);

    const [selectedVendor, setSelectedVendor] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [items, setItems] = useState([]);
    const [remarks, setRemarks] = useState("");
    const [otherCharges, setOtherCharges] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState("Cash");
    const [paidAmount, setPaidAmount] = useState(0);

    // Variant Selection State
    const [showVariantModal, setShowVariantModal] = useState(false);
    const [variants, setVariants] = useState([]);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [purchaseQty, setPurchaseQty] = useState(1);
    const [purchasePrice, setPurchasePrice] = useState(0);

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        const vRes = await VendorApi.getAll(0, 100);
        if (vRes.status) setVendors(vRes.response.data.map(v => ({ value: v._id, label: v.name })));

        const pRes = await ProductApi.getAll(0, 100);
        if (pRes.status) setProducts(pRes.response.data.map(p => ({ value: p._id, label: p.name, ...p })));
    };

    const handleProductChange = async (selected) => {
        if (!selected) return setSelectedProduct(null);
        setSelectedProduct(selected);

        // Populate variants from selected product
        if (selected.attributes && selected.attributes.length > 0) {
            setVariants(selected.attributes);
            setShowVariantModal(true);
        } else {
            toast.error("No variants found for this product.");
        }
    };

    const addToItems = () => {
        if (!selectedVariant) return toast.error("Please select a variant");
        if (purchaseQty <= 0) return toast.error("Quantity must be greater than 0");

        const combinationStr = selectedVariant.combination.map(c => c.value).join(", ");

        const newItem = {
            productId: selectedProduct.value,
            productName: selectedProduct.label,
            variantCombination: selectedVariant.combination,
            combinationStr: combinationStr,
            orderedQty: Number(purchaseQty),
            purchasePrice: Number(purchasePrice),
            total: Number(purchaseQty) * Number(purchasePrice),
            currentStock: selectedVariant.stock || 0
        };

        setItems([...items, newItem]);
        setShowVariantModal(false);
        setSelectedProduct(null);
        setSelectedVariant(null);
        setPurchaseQty(1);
        setPurchasePrice(0);
    };

    const removeItem = (idx) => {
        setItems(items.filter((_, i) => i !== idx));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedVendor) return toast.error("Please select a vendor");
        if (items.length === 0) return toast.error("Please add at least one item");

        setLoading(true);
        const payload = {
            vendorId: selectedVendor.value,
            items: items,
            totalAmount: items.reduce((acc, it) => acc + it.total, 0),
            otherCharges: Number(otherCharges),
            grandTotal: items.reduce((acc, it) => acc + it.total, 0) + Number(otherCharges),
            paidAmount: Number(paidAmount),
            paymentMethod: paymentMethod,
            remarks: remarks
        };

        const res = await PurchaseApi.create(payload);
        setLoading(true);
        if (res.status) {
            navigate("/purchase-entry");
        }
        setLoading(false);
    };

    const grandTotal = items.reduce((acc, it) => acc + it.total, 0);

    return (
        <div className="card h-100 p-0 radius-12 overflow-hidden">
            <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center justify-content-between">
                <h6 className="text-primary-600 pb-2 mb-0">Create Purchase Order</h6>
                <Link to="/purchase-entry" className="btn btn-outline-danger btn-sm">Cancel</Link>
            </div>

            <div className="card-body p-24">
                <form onSubmit={handleSubmit}>
                    <div className="row gy-4 mb-32">
                        {/* Vendor Selection */}
                        <div className="col-md-4">
                            <label className="form-label fw-bold">Select Vendor <span className="text-danger">*</span></label>
                            <Select
                                options={vendors}
                                value={selectedVendor}
                                onChange={setSelectedVendor}
                                placeholder="Search & Select Vendor"
                                styles={selectStyles()}
                            />
                        </div>

                        {/* Product Selection */}
                        <div className="col-md-5">
                            <label className="form-label fw-bold">Add Product <span className="text-danger">*</span></label>
                            <Select
                                options={products}
                                value={selectedProduct}
                                onChange={handleProductChange}
                                placeholder="Search Product to Add"
                                styles={selectStyles()}
                            />
                        </div>

                        <div className="col-md-3">
                            <label className="form-label fw-bold">Order Details</label>
                            <input type="text" className="form-control" placeholder="Remarks/Note" value={remarks} onChange={(e) => setRemarks(e.target.value)} />
                        </div>
                    </div>

                    {/* Items Table */}
                    <div className="table-responsive border radius-8 overflow-hidden mb-32">
                        <table className="table table-hover mb-0">
                            <thead className="bg-neutral-50">
                                <tr>
                                    <th className="py-16 px-24">Product</th>
                                    <th className="py-16 px-24 text-center">Current Stock</th>
                                    <th className="py-16 px-24 text-center">Purchase Price</th>
                                    <th className="py-16 px-24 text-center">Order Qty</th>
                                    <th className="py-16 px-24 text-right">Total</th>
                                    <th className="py-16 px-24 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.length > 0 ? items.map((it, idx) => (
                                    <tr key={idx}>
                                        <td className="py-16 px-24">
                                            <p className="mb-0 fw-bold">{it.productName}</p>
                                            <span className="text-secondary-light text-sm">({it.combinationStr})</span>
                                        </td>
                                        <td className="py-16 px-24 text-center">
                                            <span className={`badge ${it.currentStock <= 5 ? "bg-danger-focus text-danger-600" : "bg-neutral-100 text-secondary-light"}`}>{it.currentStock}</span>
                                        </td>
                                        <td className="py-16 px-24 text-center">₹{it.purchasePrice}</td>
                                        <td className="py-16 px-24 text-center fw-bold">{it.orderedQty}</td>
                                        <td className="py-16 px-24 text-right">₹{it.total?.toFixed(2)}</td>
                                        <td className="py-16 px-24 text-center">
                                            <button type="button" onClick={() => removeItem(idx)} className="btn btn-icon btn-outline-danger btn-sm rounded-circle"><Icon icon="fluent:delete-24-regular" /></button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan="6" className="text-center py-40 text-secondary-light">No products added. Start by adding products above.</td></tr>
                                )}
                            </tbody>
                            {items.length > 0 && (
                                <tfoot className="bg-neutral-50 border-top">
                                    <tr>
                                        <td colSpan="4" className="py-16 px-24 text-right fw-black">Subtotal:</td>
                                        <td className="py-16 px-24 text-right fw-black text-secondary-light text-lg">₹{grandTotal.toFixed(2)}</td>
                                        <td></td>
                                    </tr>
                                </tfoot>
                            )}
                        </table>
                    </div>

                    {items.length > 0 && (
                        <div className="row justify-content-end mb-32">
                            <div className="col-md-5">
                                <div className="bg-neutral-50 p-24 radius-12 border">
                                    <h6 className="mb-20 text-md">Grand Total & Payment</h6>

                                    <div className="mb-16">
                                        <label className="form-label fw-semibold">Other Charges (Freight/Coolie etc.)</label>
                                        <input type="number" className="form-control radius-8" value={otherCharges} onChange={(e) => setOtherCharges(e.target.value)} placeholder="0.00" />
                                    </div>

                                    <div className="mb-16">
                                        <label className="form-label fw-semibold">Payment Method</label>
                                        <select className="form-select radius-8" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                                            <option value="Cash">Cash</option>
                                            <option value="GPay">GPay</option>
                                            <option value="Bank Transfer">Bank Transfer</option>
                                            <option value="NEFT">NEFT</option>
                                            <option value="Cheque">Cheque</option>
                                        </select>
                                    </div>

                                    <div className="mb-20">
                                        <label className="form-label fw-bold text-success-600">Paid Amount (Optional)</label>
                                        <input type="number" className="form-control radius-8 border-success-600" value={paidAmount} onChange={(e) => setPaidAmount(e.target.value)} placeholder="0.00" />
                                        <small className="text-secondary-light mt-1 d-block">Leave 0 if not paid during order entry.</small>
                                    </div>

                                    <hr />

                                    <div className="d-flex justify-content-between mb-8">
                                        <span className="text-secondary-light font-weight-bold">Subtotal:</span>
                                        <span className="fw-bold">₹{grandTotal.toFixed(2)}</span>
                                    </div>
                                    <div className="d-flex justify-content-between mb-16">
                                        <span className="text-secondary-light">Other Charges:</span>
                                        <span className="fw-bold">₹{Number(otherCharges).toFixed(2)}</span>
                                    </div>
                                    <div className="d-flex justify-content-between border-top pt-16">
                                        <span className="fw-bold text-lg">Grand Total:</span>
                                        <span className="fw-black text-primary-600 text-xl">₹{(grandTotal + Number(otherCharges)).toFixed(2)}</span>
                                    </div>
                                    <div className="d-flex justify-content-between mt-8">
                                        <span className="fw-bold text-secondary-light">Balance Due:</span>
                                        <span className="fw-black text-danger-600 text-lg">₹{(grandTotal + Number(otherCharges) - Number(paidAmount)).toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="d-flex justify-content-end gap-3">
                        <button type="submit" disabled={loading} className="btn btn-primary px-40 py-12 radius-8 d-flex align-items-center gap-2" style={{ backgroundColor: '#003366', borderColor: '#003366' }}>
                            {loading ? "Processing..." : <><Icon icon="fluent:save-24-regular" className="text-xl" /> Submit Purchase Order</>}
                        </button>
                    </div>
                </form>
            </div>

            {/* Variant Modal */}
            <Modal show={showVariantModal} onHide={() => { setShowVariantModal(false); setSelectedProduct(null); }} centered size="lg">
                <Modal.Header closeButton className="bg-neutral-50">
                    <Modal.Title className="text-md fw-bold">Select Variant & Quantity - {selectedProduct?.label}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-24">
                    <div className="row gy-4">
                        <div className="col-12">
                            <label className="form-label fw-bold">Select Variant</label>
                            <div className="d-flex flex-wrap gap-2">
                                {variants.map((v, idx) => {
                                    const combo = v.combination.map(c => c.value).join(", ");
                                    const isSelected = selectedVariant === v;
                                    return (
                                        <button
                                            key={idx}
                                            type="button"
                                            onClick={() => { setSelectedVariant(v); setPurchasePrice(v.price || 0); }}
                                            className={`btn btn-sm radius-8 px-16 py-8 border text-left flex-grow-1 ${isSelected ? "border-primary-600 bg-primary-50 text-primary-600" : "bg-white text-secondary-light"}`}
                                        >
                                            <p className="mb-0 fw-bold">{combo}</p>
                                            <div className="d-flex justify-content-between align-items-center mt-4">
                                                <small>Stock: {v.stock || 0}</small>
                                                <small className="fw-black">₹{v.price || 0}</small>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="col-md-6">
                            <label className="form-label fw-bold">Purchase Price (per unit)</label>
                            <div className="input-group">
                                <span className="input-group-text bg-neutral-100">₹</span>
                                <input type="number" className="form-control" value={purchasePrice} onChange={(e) => setPurchasePrice(e.target.value)} placeholder="0.00" />
                            </div>
                        </div>

                        <div className="col-md-6">
                            <label className="form-label fw-bold">Quantity to Order</label>
                            <input type="number" className="form-control" value={purchaseQty} onChange={(e) => setPurchaseQty(e.target.value)} min="1" />
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer className="bg-neutral-50 px-24 py-16">
                    <Button variant="link" className="text-secondary-light text-decoration-none" onClick={() => { setShowVariantModal(false); setSelectedProduct(null); }}>Cancel</Button>
                    <Button variant="primary" className="px-32 radius-8" onClick={addToItems} disabled={!selectedVariant}>Add Item</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default PurchaseFormLayer;
