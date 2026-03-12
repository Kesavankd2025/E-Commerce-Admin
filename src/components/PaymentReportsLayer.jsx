import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import Select from "react-select";
import { selectStyles } from "../helper/SelectStyles";
import TablePagination from "./TablePagination";
import ReportsApi from "../Api/ReportsApi";
import StandardDatePicker from "./StandardDatePicker";
import usePermissions from "../hook/usePermissions";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";

const PaymentReportsLayer = () => {
    const [reportData, setReportData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [totalRecords, setTotalRecords] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const [currentPage, setCurrentPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [selectedPaymentMode, setSelectedPaymentMode] = useState(null);

    const { hasPermission } = usePermissions();

    const paymentModes = [
        { value: "Cash", label: "Cash" },
        { value: "Card", label: "Card" },
        { value: "UPI", label: "UPI" },
        { value: "Net Banking", label: "Net Banking" },
        { value: "Multiple", label: "Multiple" }
    ];

    useEffect(() => {
        fetchReport();
    }, [currentPage, rowsPerPage, selectedPaymentMode]);

    const fetchReport = async () => {
        setIsLoading(true);
        try {
            const params = {
                page: currentPage,
                limit: rowsPerPage,
                paymentMode: selectedPaymentMode?.value || undefined,
                fromDate: fromDate || undefined,
                toDate: toDate || undefined
            };
            const res = await ReportsApi.getPaymentReports(params);
            if (res.status) {
                setReportData(res.response.data || []);
                setTotalRecords(res.response.total || 0);
                setTotalPages(Math.ceil((res.response.total || 0) / rowsPerPage));
            }
        } catch (error) {
            console.error("Error fetching payment report:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClearFilters = () => {
        setFromDate("");
        setToDate("");
        setSelectedPaymentMode(null);
        if (currentPage === 0) fetchReport();
        else setCurrentPage(0);
    };

    const handleExportExcel = async () => {
        toast.info("Preparing Excel file...");
        try {
            const params = { page: 0, limit: -1, paymentMode: selectedPaymentMode?.value || undefined, fromDate: fromDate || undefined, toDate: toDate || undefined };
            const res = await ReportsApi.getPaymentReports(params);
            if (res.status && res.response.data) {
                const data = res.response.data.map((item, index) => ({
                    "S.No": index + 1,
                    "Date": item.date ? new Date(item.date).toLocaleString() : "-",
                    "Type": item.type,
                    "Source": item.source,
                    "Reference ID": item.referenceId || "N/A",
                    "Method": item.method,
                    "Amount": item.amount || 0
                }));

                const worksheet = XLSX.utils.json_to_sheet(data);
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, "Payment Report");
                XLSX.writeFile(workbook, `Payment_Report_${new Date().getTime()}.xlsx`);
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
                    <h6 className="text-primary-600 pb-2 mb-0">Payment Reports</h6>
                </div>

                <div className="row g-3 align-items-end">
                    <div className="col-xl col-md-3 col-sm-6">
                        <label className="form-label fw-bold">From Date</label>
                        <StandardDatePicker name="fromDate" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="form-control radius-8" />
                    </div>
                    <div className="col-xl col-md-3 col-sm-6">
                        <label className="form-label fw-bold">To Date</label>
                        <StandardDatePicker name="toDate" value={toDate} onChange={(e) => setToDate(e.target.value)} className="form-control radius-8" />
                    </div>
                    <div className="col-xl col-md-3 col-sm-6">
                        <label className="form-label fw-bold">Payment Mode</label>
                        <Select options={paymentModes} value={selectedPaymentMode} onChange={setSelectedPaymentMode} placeholder="All" styles={selectStyles()} isClearable />
                    </div>
                    <div className="col-xl-auto col-md-3 col-sm-6 d-flex align-items-end gap-2">
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
                                <th scope="col" style={{ color: "black", fontWeight: '600' }}>Date</th>
                                <th scope="col" style={{ color: "black", fontWeight: '600' }}>Transaction Type</th>
                                <th scope="col" style={{ color: "black", fontWeight: '600' }}>Source</th>
                                <th scope="col" style={{ color: "black", fontWeight: '600' }}>Reference</th>
                                <th scope="col" style={{ color: "black", fontWeight: '600' }}>Method</th>
                                <th scope="col" style={{ color: "black", fontWeight: '600' }}>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (<tr><td colSpan="7" className="text-center py-4">Data loading...</td></tr>) : reportData.length > 0 ? (
                                reportData.map((data, index) => (
                                    <tr key={index}>
                                        <td>{currentPage * rowsPerPage + index + 1}</td>
                                        <td>{data.date ? new Date(data.date).toLocaleString() : "-"}</td>
                                        <td>
                                            <span className={`badge ${data.type === 'Incoming' ? 'bg-success-focus text-success-main' : 'bg-danger-focus text-danger-main'} px-24 py-4 radius-4`}>
                                                {data.type}
                                            </span>
                                        </td>
                                        <td>{data.source}</td>
                                        <td>{data.referenceId || "N/A"}</td>
                                        <td>{data.method}</td>
                                        <td className="fw-bold">₹{data.amount?.toFixed(2) || "0.00"}</td>
                                    </tr>
                                ))
                            ) : (<tr><td colSpan="7" className="text-center py-4">No reports found.</td></tr>)}
                        </tbody>
                    </table>
                </div>

                <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mt-24">
                    <div>
                        {hasPermission("Payment Reports") && (
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

export default PaymentReportsLayer;
