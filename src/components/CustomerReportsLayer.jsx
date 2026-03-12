import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import TablePagination from "./TablePagination";
import ReportsApi from "../Api/ReportsApi";
import StandardDatePicker from "./StandardDatePicker";
import usePermissions from "../hook/usePermissions";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";

const CustomerReportsLayer = () => {
    const [reportData, setReportData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [totalRecords, setTotalRecords] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const [currentPage, setCurrentPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");

    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    const { hasPermission } = usePermissions();

    useEffect(() => {
        fetchReport();
    }, [currentPage, rowsPerPage]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (currentPage === 0) fetchReport();
        else setCurrentPage(0);
    };

    const fetchReport = async () => {
        setIsLoading(true);
        try {
            const params = {
                page: currentPage,
                limit: rowsPerPage,
                search: searchTerm,
                fromDate: fromDate || undefined,
                toDate: toDate || undefined
            };
            const res = await ReportsApi.getCustomerReports(params);
            if (res.status) {
                setReportData(res.response.data || []);
                setTotalRecords(res.response.total || 0);
                setTotalPages(Math.ceil((res.response.total || 0) / rowsPerPage));
            }
        } catch (error) {
            console.error("Error fetching customer report:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClearFilters = () => {
        setFromDate("");
        setToDate("");
        setSearchTerm("");
        if (currentPage === 0) fetchReport();
        else setCurrentPage(0);
    };

    const handleExportExcel = async () => {
        toast.info("Preparing Excel file...");
        try {
            const params = { page: 0, limit: -1, search: searchTerm, fromDate: fromDate || undefined, toDate: toDate || undefined };
            const res = await ReportsApi.getCustomerReports(params);
            if (res.status && res.response.data) {
                const data = res.response.data.map((item, index) => ({
                    "S.No": index + 1,
                    "Customer Name": item.fullName || "Guest",
                    "Phone Number": item.phoneNumber || "N/A",
                    "Total Orders": item.totalOrders || 0,
                    "Total Spent": (item.totalSpent || 0).toFixed(2),
                    "Last Order Date": item.lastOrderDate ? new Date(item.lastOrderDate).toLocaleDateString() : "-"
                }));

                const worksheet = XLSX.utils.json_to_sheet(data);
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, "Customer Report");
                XLSX.writeFile(workbook, `Customer_Report_${new Date().getTime()}.xlsx`);
                toast.success("Excel downloaded successfully");
            } else toast.error("Failed to export data");
        } catch (error) {
            console.error(error);
            toast.error("An error occurred during export");
        }
    };

    return (
        <div className="card h-100 p-0 radius-12">
            <div className="card-header border-bottom bg-base py-16 px-24">
                <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-3">
                    <h6 className="text-primary-600 pb-2 mb-0">Customer Reports</h6>
                    <form className="navbar-search" onSubmit={handleSearchSubmit}>
                        <input type="text" className="bg-base h-40-px w-auto" name="search" placeholder="Search customer (name/phone)..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        <Icon icon="ion:search-outline" className="icon" />
                    </form>
                </div>

                <div className="row g-3 align-items-end">
                    <div className="col-xl col-md-4 col-sm-6">
                        <label className="form-label fw-bold">From Date</label>
                        <StandardDatePicker name="fromDate" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="form-control radius-8" />
                    </div>
                    <div className="col-xl col-md-4 col-sm-6">
                        <label className="form-label fw-bold">To Date</label>
                        <StandardDatePicker name="toDate" value={toDate} onChange={(e) => setToDate(e.target.value)} className="form-control radius-8" />
                    </div>
                    <div className="col-xl-auto col-md-4 col-sm-6 d-flex align-items-end gap-2">
                        <button type="button" onClick={() => { setCurrentPage(0); fetchReport(); }} className="btn btn-primary d-flex align-items-center gap-2 radius-8 h-40-px">Filter</button>
                        <button type="button" onClick={handleClearFilters} className="btn btn-outline-danger d-flex align-items-center gap-2 radius-8 h-40-px text-nowrap">
                            <Icon icon="solar:filter-remove-bold-duotone" fontSize={20} /> Clear
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
                                <th scope="col" style={{ color: "black", fontWeight: '600' }}>Customer Name</th>
                                <th scope="col" style={{ color: "black", fontWeight: '600' }}>Phone</th>
                                <th scope="col" style={{ color: "black", fontWeight: '600' }}>Total Orders</th>
                                <th scope="col" style={{ color: "black", fontWeight: '600' }}>Total Spent</th>
                                <th scope="col" style={{ color: "black", fontWeight: '600' }}>Last Active</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (<tr><td colSpan="6" className="text-center py-4">Data loading...</td></tr>) : reportData.length > 0 ? (
                                reportData.map((data, index) => (
                                    <tr key={data._id || index}>
                                        <td>{currentPage * rowsPerPage + index + 1}</td>
                                        <td className="fw-medium">{data.fullName || "Guest User"}</td>
                                        <td>{data.phoneNumber || "-"}</td>
                                        <td className="fw-bold text-success-main">{data.totalOrders || 0}</td>
                                        <td className="fw-bold">₹{data.totalSpent?.toFixed(2) || "0.00"}</td>
                                        <td>{data.lastOrderDate ? new Date(data.lastOrderDate).toLocaleDateString() : "-"}</td>
                                    </tr>
                                ))
                            ) : (<tr><td colSpan="6" className="text-center py-4">No reports found.</td></tr>)}
                        </tbody>
                    </table>
                </div>

                <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mt-24">
                    <div>
                        {hasPermission("Customer Reports") && (
                            <button type="button" className="btn btn-success radius-8 px-20 py-11 d-flex align-items-center gap-2" onClick={handleExportExcel}>
                                <Icon icon="lucide:download" className="text-xl" /> Export Excel
                            </button>
                        )}
                    </div>
                    <div className="flex-grow-1">
                        <TablePagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} rowsPerPage={rowsPerPage} onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value)); setCurrentPage(0); }} totalRecords={totalRecords} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerReportsLayer;
