import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import InventoryApi from "../Api/InventoryApi";
import { Modal, Button } from "react-bootstrap";
import TablePagination from "./TablePagination";
import AttributeApi from "../Api/AttributeApi";

const InventoryListLayer = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
    const [totalRecords, setTotalRecords] = useState(0);

    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [attributesMap, setAttributesMap] = useState({});

    useEffect(() => {
        const handler = setTimeout(() => { setDebouncedSearchTerm(searchTerm); }, 500);
        return () => clearTimeout(handler);
    }, [searchTerm]);

    useEffect(() => {
        fetchData();
        fetchAttributes();
    }, [currentPage, rowsPerPage, debouncedSearchTerm]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await InventoryApi.list(currentPage, rowsPerPage, debouncedSearchTerm);
            if (response && response.status && response.response.data) {
                setData(response.response.data);
                setTotalRecords(response.response.total || 0);
            } else {
                setData([]);
                setTotalRecords(0);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAttributes = async () => {
        try {
            const res = await AttributeApi.getAll(0, 500, "");
            if (res.status && res.response.data) {
                const map = {};
                res.response.data.forEach(attr => {
                    map[attr._id] = attr.name;
                });
                setAttributesMap(map);
            }
        } catch (error) {
            console.error("Error fetching attributes:", error);
        }
    };

    const handleView = (item) => {
        setSelectedProduct(item);
        setShowViewModal(true);
    };

    const totalPages = Math.ceil(totalRecords / rowsPerPage);

    const getAttributeString = (combination) => {
        if (!combination || !Array.isArray(combination)) return "N/A";
        return combination.map(c => {
            const name = attributesMap[c.attributeId] || "Attr";
            return `${name}: ${c.value}`;
        }).join(", ");
    };

    return (
        <div className="card h-100 p-0 radius-12">
            <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center justify-content-between flex-wrap gap-3">
                <h6 className="text-primary-600 pb-2 mb-0">Inventory List</h6>
                <div className="d-flex align-items-center flex-wrap gap-3">
                    <form className="navbar-search" onSubmit={(e) => e.preventDefault()}>
                        <input type="text" className="bg-base h-40-px w-auto" name="search" placeholder="Search product..." value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(0); }} />
                        <Icon icon="ion:search-outline" className="icon" />
                    </form>
                </div>
            </div>
            <div className="card-body p-24">
                <div className="table-responsive scroll-sm">
                    <table className="table bordered-table sm-table mb-0">
                        <thead>
                            <tr>
                                <th scope="col" style={{ color: "black" }}>S.No</th>
                                <th scope="col" style={{ color: "black" }}>Product Name</th>
                                <th scope="col" style={{ color: "black" }}>Total Stock</th>
                                <th scope="col" style={{ color: "black" }}>Alert Qty</th>
                                <th scope="col" style={{ color: "black" }} className="text-center">Status</th>
                                <th scope="col" style={{ color: "black" }} className="text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="6" className="text-center py-40">Loading...</td></tr>
                            ) : data.length > 0 ? (
                                data.map((item, index) => (
                                    <tr key={item._id || index}>
                                        <td>{currentPage * rowsPerPage + index + 1}</td>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <h6 className="text-md mb-0 fw-medium text-secondary-light">{item.name}</h6>
                                            </div>
                                        </td>
                                        <td className="fw-bold">
                                            {item.totalStock !== undefined ? item.totalStock : item.attributes?.reduce((acc, curr) => acc + (Number(curr.stock) || 0), 0)}
                                        </td>
                                        <td>{item.lowStockAlert || "0"}</td>
                                        <td className="text-center">
                                            <span className={`badge ${item.isLowStock ? "bg-danger-focus text-danger-600" : "bg-success-focus text-success-600"} px-24 py-4 radius-4 fw-medium text-sm`}>
                                                {item.isLowStock ? "Low Stock" : "In Stock"}
                                            </span>
                                        </td>
                                        <td className="text-center">
                                            <div className="d-flex align-items-center justify-content-center gap-2">
                                                <button onClick={() => handleView(item)} className="bg-info-focus bg-hover-info-200 text-info-600 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle border-0">
                                                    <Icon icon="majesticons:eye-line" className="menu-icon" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="6" className="text-center py-40">No Data Found</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {!loading && (
                    <TablePagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} rowsPerPage={rowsPerPage} onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value)); setCurrentPage(0); }} totalRecords={totalRecords} />
                )}
            </div>

            {/* View Modal */}
            <Modal show={showViewModal} onHide={() => setShowViewModal(false)} centered size="xl">
                <Modal.Header closeButton className="bg-base border-bottom py-16 px-24">
                    <Modal.Title className="text-primary-600 h6 mb-0">Inventory Details - {selectedProduct?.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-24">
                    <div className="row mb-24">
                        <div className="col-md-3">
                            <label className="form-label text-secondary-light">Alert Quantity</label>
                            <h6 className="mb-0">{selectedProduct?.lowStockAlert || 0}</h6>
                        </div>
                        <div className="col-md-3">
                            <label className="form-label text-secondary-light">Total Variations</label>
                            <h6 className="mb-0">{selectedProduct?.attributes?.length || 0}</h6>
                        </div>
                    </div>

                    <div className="table-responsive">
                        <table className="table bordered-table sm-table mb-0">
                            <thead className="bg-neutral-50 shadow-sm">
                                <tr>
                                    <th style={{ color: "black" }}>S.No</th>
                                    <th style={{ color: "black" }}>Variation</th>
                                    <th style={{ color: "black" }}>SKU</th>
                                    <th style={{ color: "black" }}>Stock</th>
                                    <th style={{ color: "black" }}>MRP</th>
                                    <th style={{ color: "black" }}>Price</th>
                                    <th style={{ color: "black" }} className="text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedProduct?.attributes?.map((attr, idx) => (
                                    <tr key={idx}>
                                        <td>{idx + 1}</td>
                                        <td className="fw-medium text-primary-600">{getAttributeString(attr.combination)}</td>
                                        <td>{attr.sku || "-"}</td>
                                        <td className={`fw-bold ${Number(attr.stock) <= (selectedProduct?.lowStockAlert || 0) ? "text-danger-600" : "text-success-600"}`}>
                                            {attr.stock}
                                        </td>
                                        <td>₹{attr.mrp || 0}</td>
                                        <td>₹{attr.price || 0}</td>
                                        <td className="text-center">
                                            {Number(attr.stock) <= (selectedProduct?.lowStockAlert || 0) ? (
                                                <span className="text-danger-600 d-flex align-items-center justify-content-center gap-1 fw-medium">
                                                    <Icon icon="ion:alert-circle" /> Low
                                                </span>
                                            ) : (
                                                <span className="text-success-600 fw-medium">Available</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Modal.Body>
                <Modal.Footer className="bg-base border-top p-24">
                    <Button variant="outline-secondary" className="px-32" onClick={() => setShowViewModal(false)}>Close</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default InventoryListLayer;
