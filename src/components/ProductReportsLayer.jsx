import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import Select from "react-select";
import { selectStyles } from "../helper/SelectStyles";
import TablePagination from "./TablePagination";
import ReportsApi from "../Api/ReportsApi";
import StandardDatePicker from "./StandardDatePicker";
import ShowNotifications from "../helper/ShowNotifications";
import usePermissions from "../hook/usePermissions";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";

const ProductReportsLayer = () => {
    const [reportData, setReportData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [totalRecords, setTotalRecords] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const [currentPage, setCurrentPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");

    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [selectedOrderFrom, setSelectedOrderFrom] = useState(null);

    const { hasPermission } = usePermissions();

    const orderFromOptions = [
        { value: "Both", label: "Both" },
        { value: "POS", label: "POS" },
        { value: "Website", label: "Website" },
    ];

    useEffect(() => {
        fetchReport();
    }, [currentPage, rowsPerPage, selectedOrderFrom]);

    // Handle Search explicitly
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (currentPage === 0) {
            fetchReport();
        } else {
            setCurrentPage(0);
        }
    };

    const fetchReport = async () => {
        setIsLoading(true);
        try {
            const params = {
                page: currentPage,
                limit: rowsPerPage,
                search: searchTerm,
                fromDate: fromDate || undefined,
                toDate: toDate || undefined,
                orderFrom: selectedOrderFrom?.value || undefined
            };
            const res = await ReportsApi.getProductReports(params);
            if (res.status) {
                setReportData(res.response.data || []);
                setTotalRecords(res.response.total || 0);
                setTotalPages(Math.ceil((res.response.total || 0) / rowsPerPage));
            }
        } catch (error) {
            console.error("Error fetching product report:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleRowsPerPageChange = (e) => {
        setRowsPerPage(parseInt(e.target.value));
        setCurrentPage(0);
    };

    const handleClearFilters = () => {
        setFromDate("");
        setToDate("");
        setSelectedOrderFrom(null);
        setSearchTerm("");
        if (currentPage === 0) {
            fetchReport(); // This might trigger twice but it's okay for clear
        } else {
            setCurrentPage(0);
        }
    };

    const handleExportExcel = async () => {
        toast.info("Preparing Excel file...");
        try {
            const params = {
                page: 0,
                limit: -1, // Fetch all records
                search: searchTerm,
                fromDate: fromDate || undefined,
                toDate: toDate || undefined,
                orderFrom: selectedOrderFrom?.value || undefined
            };
            const res = await ReportsApi.getProductReports(params);
            if (res.status && res.response.data) {
                const data = res.response.data.map((item, index) => ({
                    "S.No": index + 1,
                    "Product Name": item.productName || "-",
                    "SKU": item.sku || "-",
                    "Total Quantity Sold": item.totalQuantitySold || 0,
                    "Total Revenue": item.totalRevenue || 0
                }));

                const worksheet = XLSX.utils.json_to_sheet(data);
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, "Product Report");
                XLSX.writeFile(workbook, `Product_Report_${new Date().getTime()}.xlsx`);
                toast.success("Excel downloaded successfully");
            } else {
                toast.error("Failed to export data");
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred during export");
        }
    };

    return (
        <div className="card h-100 p-0 radius-12">
            <div className="card-header border-bottom bg-base py-16 px-24">
                <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-3">
                    <h6 className="text-primary-600 pb-2 mb-0">Product Reports</h6>
                    <form className="navbar-search" onSubmit={handleSearchSubmit}>
                        <input
                            type="text"
                            className="bg-base h-40-px w-auto"
                            name="search"
                            placeholder="Search product..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Icon icon="ion:search-outline" className="icon" />
                    </form>
                </div>

                {/* Filters */}
                <div className="row g-3 align-items-end">
                    <div className="col-xl col-md-3 col-sm-6">
                        <label className="form-label fw-bold">From Date</label>
                        <StandardDatePicker
                            name="fromDate"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                            className="form-control radius-8"
                        />
                    </div>
                    <div className="col-xl col-md-3 col-sm-6">
                        <label className="form-label fw-bold">To Date</label>
                        <StandardDatePicker
                            name="toDate"
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                            className="form-control radius-8"
                        />
                    </div>
                    <div className="col-xl col-md-3 col-sm-6">
                        <label className="form-label fw-bold">Order From</label>
                        <Select
                            options={orderFromOptions}
                            value={selectedOrderFrom}
                            onChange={setSelectedOrderFrom}
                            placeholder="All"
                            styles={selectStyles()}
                            isClearable
                        />
                    </div>
                    <div className="col-xl-auto col-md-3 col-sm-6 d-flex align-items-end gap-2">
                        <button
                            type="button"
                            onClick={() => { setCurrentPage(0); fetchReport(); }}
                            className="btn btn-primary d-flex align-items-center gap-2 radius-8 h-40-px"
                        >
                            Filter
                        </button>
                        <button
                            type="button"
                            onClick={handleClearFilters}
                            className="btn btn-outline-danger d-flex align-items-center gap-2 radius-8 h-40-px text-nowrap"
                        >
                            <Icon icon="solar:filter-remove-bold-duotone" fontSize={20} />
                            Clear
                        </button>
                    </div>
                </div>
            </div>

            <div className="card-body p-24">
                <div className="table-responsive scroll-sm">
                    <table className="table bordered-table sm-table mb-0">
                        <thead>
                            <tr>
                                <th scope="col" style={{ color: "black", fontWeight: '600' }}>S.No</th>
                                <th scope="col" style={{ color: "black", fontWeight: '600' }}>Product Name</th>
                                <th scope="col" style={{ color: "black", fontWeight: '600' }}>SKU</th>
                                <th scope="col" style={{ color: "black", fontWeight: '600' }}>Quantity Sold</th>
                                <th scope="col" style={{ color: "black", fontWeight: '600' }}>Revenue</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-4">Data loading...</td>
                                </tr>
                            ) : reportData.length > 0 ? (
                                reportData.map((data, index) => (
                                    <tr key={data._id || index}>
                                        <td>{currentPage * rowsPerPage + index + 1}</td>
                                        <td className="fw-medium">{data.productName || "-"}</td>
                                        <td>{data.sku || "-"}</td>
                                        <td className="fw-bold text-success-main">{data.totalQuantitySold || 0}</td>
                                        <td className="fw-bold">₹{data.totalRevenue?.toFixed(2) || "0.00"}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center py-4">No reports found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mt-24">
                    <div>
                        {hasPermission("Product Reports") && (
                            <button
                                type="button"
                                className="btn btn-success radius-8 px-20 py-11 d-flex align-items-center gap-2"
                                onClick={handleExportExcel}
                            >
                                <Icon icon="lucide:download" className="text-xl" />
                                Export Excel
                            </button>
                        )}
                    </div>
                    <div className="flex-grow-1">
                        <TablePagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                            rowsPerPage={rowsPerPage}
                            onRowsPerPageChange={handleRowsPerPageChange}
                            totalRecords={totalRecords}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductReportsLayer;
