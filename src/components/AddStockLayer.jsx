import React, { useState, useEffect } from "react";
import AsyncSelect from "react-select/async";
import { Icon } from "@iconify/react";
import ProductApi from "../Api/ProductApi";
import StockApi from "../Api/StockApi";
import AttributeApi from "../Api/AttributeApi";
import { selectStyles } from "../helper/SelectStyles";
import { toast } from "react-toastify";

const AddStockLayer = () => {
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [variants, setVariants] = useState([]);
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [attributesMap, setAttributesMap] = useState({});

    useEffect(() => {
        fetchAttributes();
    }, []);

    const fetchAttributes = async () => {
        const res = await AttributeApi.getAll(0, 500, "");
        if (res.status && res.response.data) {
            const map = {};
            res.response.data.forEach(attr => {
                map[attr._id] = attr.name;
            });
            setAttributesMap(map);
        }
    };

    const loadOptions = async (inputValue) => {
        const res = await ProductApi.getAll(0, 20, inputValue);
        if (res.status && res.response.data) {
            return res.response.data.map(p => ({
                value: p._id,
                label: p.name,
                fullData: p
            }));
        }
        return [];
    };

    const handleProductChange = (option) => {
        setSelectedProduct(option);
        if (option && option.fullData.attributes) {
            setVariants(option.fullData.attributes.map(attr => ({
                ...attr,
                newStock: attr.stock,
                variantLabel: getAttributeString(attr.combination)
            })));
        } else {
            setVariants([]);
        }
    };

    const getAttributeString = (combination) => {
        if (!combination || !Array.isArray(combination)) return "Default";
        return combination.map(c => {
            const name = attributesMap[c.attributeId] || "Attr";
            return `${name}: ${c.value}`;
        }).join(", ");
    };

    const handleStockChange = (index, value) => {
        const updated = [...variants];
        updated[index].newStock = value;
        setVariants(updated);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedProduct) {
            toast.error("Please select a product");
            return;
        }

        setLoading(true);
        const res = await StockApi.updateManual({
            productId: selectedProduct.value,
            variants: variants,
            description: description
        });

        if (res.status) {
            toast.success("Stock updated successfully");
            // Reset form
            setSelectedProduct(null);
            setVariants([]);
            setDescription("");
        }
        setLoading(false);
    };

    return (
        <div className="card h-100 p-0 radius-12">
            <div className="card-header border-bottom bg-base py-16 px-24">
                <h6 className="text-primary-600 pb-2 mb-0">Update Physical Stock</h6>
            </div>
            <div className="card-body p-24">
                <form onSubmit={handleSubmit}>
                    <div className="row gy-4">
                        <div className="col-md-6">
                            <label className="form-label fw-semibold">Search Product</label>
                            <AsyncSelect
                                cacheOptions
                                loadOptions={loadOptions}
                                defaultOptions
                                value={selectedProduct}
                                onChange={handleProductChange}
                                styles={selectStyles()}
                                placeholder="Start typing product name..."
                                isClearable
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label fw-semibold">Reference/Description</label>
                            <input
                                type="text"
                                className="form-control radius-8"
                                placeholder="e.g. Monthly Audit"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>

                        {selectedProduct && (
                            <div className="col-12 mt-40">
                                <h6 className="text-md mb-16">Product Variants & Stock Levels</h6>
                                <div className="table-responsive">
                                    <table className="table bordered-table sm-table mb-0">
                                        <thead>
                                            <tr>
                                                <th scope="col" style={{ color: "black" }}>S.No</th>
                                                <th scope="col" style={{ color: "black" }}>Variant Combination</th>
                                                <th scope="col" style={{ color: "black" }}>SKU</th>
                                                <th scope="col" style={{ color: "black" }}>Current Stock</th>
                                                <th scope="col" style={{ color: "black" }} className="w-200-px">New Stock</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {variants.length > 0 ? (
                                                variants.map((v, index) => (
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td className="fw-medium">{v.variantLabel}</td>
                                                        <td>{v.sku}</td>
                                                        <td className="text-secondary-light">{v.stock}</td>
                                                        <td>
                                                            <div className="d-flex align-items-center gap-2">
                                                                <input
                                                                    type="number"
                                                                    className="form-control radius-8 h-40-px"
                                                                    value={v.newStock}
                                                                    onChange={(e) => handleStockChange(index, e.target.value)}
                                                                    min="0"
                                                                />
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="5" className="text-center py-20 text-secondary-light">
                                                        No variants found for this product.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        <div className="col-12 d-flex justify-content-end gap-2 mt-24">
                            <button
                                type="submit"
                                className="btn btn-primary radius-8 px-32 py-12"
                                disabled={loading || !selectedProduct}
                                style={{ backgroundColor: "#003366", borderColor: "#003366" }}
                            >
                                {loading ? "Updating..." : "Update Stock"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddStockLayer;
