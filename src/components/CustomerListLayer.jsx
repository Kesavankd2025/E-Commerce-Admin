import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react/dist/iconify.js";
import CustomerApi from "../Api/CustomerApi";
import { formatDate } from "../helper/DateHelper";
import TablePagination from "./TablePagination";

const CustomerListLayer = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);

    const fetchCustomers = async () => {
        setLoading(true);
        try {
            const res = await CustomerApi.listCustomers(currentPage, rowsPerPage);
            console.log(res, "resres");

            if (res.status && res.response) {
                setCustomers(res.response.data || []);
                setTotalRecords(res.response.data.total || 0);
            }
        } catch (error) {
            console.error("Error fetching customers:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusToggle = async (customer) => {
        const res = await CustomerApi.updateStatus(customer.id || customer._id, !customer.isActive);
        if (res.status) {
            fetchCustomers();
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, [currentPage, rowsPerPage]);

    return (
        <div className="card h-100 p-0 radius-12 overflow-hidden shadow-sm border-0">
            <div className="card-header border-bottom bg-base py-20 px-24 d-flex align-items-center justify-content-between">
                <h6 className="text-lg fw-bold mb-0 text-primary-600 d-flex align-items-center gap-2">
                    <Icon icon="solar:users-group-rounded-bold-duotone" className="text-2xl" />
                    Customer List
                </h6>
            </div>
            <div className="card-body p-24">
                <div className="table-responsive">
                    <table className="table bordered-table sm-table mb-0">
                        <thead>
                            <tr className="bg-neutral-50 text-uppercase">
                                <th scope="col" className="text-center py-16" style={{ width: '80px' }}>S.No</th>
                                <th scope="col" className="py-16">Name</th>
                                <th scope="col" className="py-16">Contact</th>
                                <th scope="col" className="py-16">Registration Date</th>
                                <th scope="col" className="text-center py-16">Status</th>
                                <th scope="col" className="text-center py-16">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-100">
                                        <div className="spinner-border text-primary-600" role="status"></div>
                                    </td>
                                </tr>
                            ) : customers.length > 0 ? (
                                customers.map((user, index) => (
                                    <tr key={user.id || user._id}>
                                        <td className="text-center text-sm fw-medium text-secondary-light">
                                            {currentPage * rowsPerPage + index + 1}
                                        </td>
                                        <td>
                                            <div className="d-flex align-items-center gap-3">
                                                <div className="w-40-px h-40-px rounded-circle bg-primary-100 text-primary-600 d-flex align-items-center justify-content-center fw-bold text-sm">
                                                    {user.fullName?.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="d-flex flex-column">
                                                    <span className="text-sm fw-bold text-secondary-light">{user.fullName}</span>
                                                    <span className="text-xxxxs text-secondary-400 capitalize">{(user.id || user._id)?.toString().slice(-6).toUpperCase()}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="d-flex flex-column">
                                                <span className="text-sm fw-medium text-secondary-light d-flex align-items-center gap-1">
                                                    <Icon icon="solar:phone-bold" className="text-xs text-primary-400" />
                                                    {user.phoneNumber}
                                                </span>
                                                <span className="text-xs text-secondary-400 d-flex align-items-center gap-1">
                                                    <Icon icon="solar:letter-bold" className="text-xs" />
                                                    {user.email || "No Email"}
                                                </span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="text-sm text-secondary-light fw-medium">{formatDate(user.createdAt)}</span>
                                        </td>
                                        <td className="text-center">
                                            <div className="form-check form-switch d-inline-block p-0">
                                                <input
                                                    className="form-check-input cursor-pointer"
                                                    type="checkbox"
                                                    role="switch"
                                                    checked={user.isActive !== false}
                                                    onChange={() => handleStatusToggle(user)}
                                                    style={{ width: '40px', height: '20px' }}
                                                />
                                            </div>
                                        </td>
                                        <td className="text-center">
                                            <Link
                                                to={`/customer-list/view/${user.id || user._id}`}
                                                className="bg-info-focus bg-hover-info-200 text-info-600 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle mx-auto transition-all"
                                                title="View Customer Details"
                                            >
                                                <Icon icon="solar:eye-bold" className="text-xl" />
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center py-100 italic text-secondary-400">
                                        No customers registered yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {!loading && totalRecords > 0 && (
                    <div className="mt-24 px-24 pb-12">
                        <TablePagination
                            currentPage={currentPage}
                            totalPages={Math.ceil(totalRecords / rowsPerPage)}
                            onPageChange={setCurrentPage}
                            rowsPerPage={rowsPerPage}
                            onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value)); setCurrentPage(0); }}
                            totalRecords={totalRecords}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustomerListLayer;
