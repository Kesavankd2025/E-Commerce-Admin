import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react/dist/iconify.js";
import PurchaseApi from "../Api/PurchaseApi";
import VendorApi from "../Api/VendorApi";
import ProductApi from "../Api/ProductApi";
import { toast } from "react-toastify";
import TablePagination from "./TablePagination";
import Select from "react-select";
import { selectStyles } from "../helper/SelectStyles";

const PurchaseListLayer = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);

    // Filters
    const [vendorList, setVendorList] = useState([]);
    const [productList, setProductList] = useState([]);
    const [filters, setFilters] = useState({
        vendorId: "",
        productId: "",
        fromDate: "",
        toDate: ""
    });

    useEffect(() => {
        fetchVendors();
        fetchProducts();
    }, []);

    useEffect(() => {
        fetchData();
    }, [currentPage, rowsPerPage, filters]);

    const fetchVendors = async () => {
        const res = await VendorApi.getAll(0, 100);
        if (res.status) setVendorList(res.response.data.map(v => ({ value: v._id, label: v.name })));
    };

    const fetchProducts = async () => {
        const res = await ProductApi.getAll(0, 100);
        if (res.status) setProductList(res.response.data.map(p => ({ value: p._id, label: p.name })));
    };

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await PurchaseApi.getAll(currentPage, rowsPerPage, filters);
            if (response && response.status && response.response.data) {
                setData(response.response.data);
                setTotalRecords(response.response.total || response.response.data.length || 0);
            } else {
                setData([]);
                setTotalRecords(0);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error("Failed to fetch data");
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (selected, name) => {
        setFilters(prev => ({ ...prev, [name]: selected ? selected.value : "" }));
        setCurrentPage(0);
    };

    const handleDateChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
        setCurrentPage(0);
    };

    return (
        <div className="card h-100 p-0 radius-12">
            <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center justify-content-between flex-wrap gap-3">
                <h6 className="text-primary-600 pb-2 mb-0">Purchase Entry List</h6>
                <Link to="/purchase-entry/add" className="btn btn-primary text-sm btn-sm px-12 py-12 radius-8 d-flex align-items-center gap-2">
                    <Icon icon="ic:baseline-plus" className="text-xl" /> New Purchase from Vendor
                </Link>
            </div>

            <div className="card-body p-24">
                {/* Filters Row */}
                <div className="row g-3 mb-24 align-items-end">
                    <div className="col-md-3">
                        <label className="form-label fw-medium text-secondary-light">Filter by Vendor</label>
                        <Select
                            options={vendorList}
                            isClearable
                            placeholder="Select Vendor"
                            styles={selectStyles()}
                            onChange={(opt) => handleFilterChange(opt, "vendorId")}
                        />
                    </div>
                    <div className="col-md-3">
                        <label className="form-label fw-medium text-secondary-light">Filter by Product</label>
                        <Select
                            options={productList}
                            isClearable
                            placeholder="Select Product"
                            styles={selectStyles()}
                            onChange={(opt) => handleFilterChange(opt, "productId")}
                        />
                    </div>
                    <div className="col-md-3">
                        <label className="form-label fw-medium text-secondary-light">From Date</label>
                        <input type="date" name="fromDate" className="form-control" value={filters.fromDate} onChange={handleDateChange} />
                    </div>
                    <div className="col-md-3">
                        <label className="form-label fw-medium text-secondary-light">To Date</label>
                        <input type="date" name="toDate" className="form-control" value={filters.toDate} onChange={handleDateChange} />
                    </div>
                </div>

                <div className="table-responsive scroll-sm">
                    <table className="table bordered-table sm-table mb-0">
                        <thead>
                            <tr>
                                <th scope="col" style={{ color: "black" }}>S.No</th>
                                <th scope="col" style={{ color: "black" }}>Order ID</th>
                                <th scope="col" style={{ color: "black" }}>Vendor</th>
                                <th scope="col" style={{ color: "black" }}>Date</th>
                                <th scope="col" style={{ color: "black" }}>Total Items</th>
                                <th scope="col" style={{ color: "black" }}>Amount</th>
                                <th scope="col" style={{ color: "black" }}>Status</th>
                                <th scope="col" style={{ color: "black" }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="8" className="text-center py-4">Loading...</td></tr>
                            ) : data.length > 0 ? (
                                data.map((item, index) => (
                                    <tr key={item._id || index}>
                                        <td>{currentPage * rowsPerPage + index + 1}</td>
                                        <td><span className="text-md mb-0 fw-bold text-primary-600">{item.orderId}</span></td>
                                        <td><span className="text-md mb-0 fw-normal text-secondary-light">{item.vendorData?.name || "N/A"}</span></td>
                                        <td><span className="text-md mb-0 fw-normal text-secondary-light">{new Date(item.createdAt).toLocaleDateString()}</span></td>
                                        <td><span className="text-md mb-0 fw-normal text-secondary-light">{item.items?.length || 0}</span></td>
                                        <td><span className="text-md mb-0 fw-bold text-secondary-light">₹{item.totalAmount?.toFixed(2)}</span></td>
                                        <td>
                                            <span className={`badge ${item.status === "Received" ? "bg-success-focus text-success-600" :
                                                    item.status === "Partially Received" ? "bg-warning-focus text-warning-600" :
                                                        "bg-neutral-focus text-neutral-600"
                                                } px-24 py-4 radius-4 fw-medium text-sm`}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="d-flex align-items-center gap-2">
                                                <Link to={`/purchase-entry/view/${item._id}`} className="bg-info-focus bg-hover-info-200 text-info-600 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle">
                                                    <Icon icon="majesticons:eye-line" className="menu-icon" />
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="8" className="text-center py-4">No Data Found</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {!loading && (
                    <TablePagination currentPage={currentPage} totalPages={Math.ceil(totalRecords / rowsPerPage)} onPageChange={setCurrentPage} rowsPerPage={rowsPerPage} onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value)); setCurrentPage(0); }} totalRecords={totalRecords} />
                )}
            </div>
        </div>
    );
};

export default PurchaseListLayer;
