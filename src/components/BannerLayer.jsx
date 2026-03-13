import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react/dist/iconify.js";
import BannerApi from "../Api/BannerApi";
import { toast } from "react-toastify";
import { Modal, Button } from "react-bootstrap";
import usePermissions from "../hook/usePermissions";
import TablePagination from "./TablePagination";
import { IMAGE_BASE_URL } from "../Config/Index";

const BannerLayer = () => {
    const { hasPermission } = usePermissions();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    useEffect(() => {
        fetchData();
    }, [currentPage, rowsPerPage]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await BannerApi.getAllBanners(currentPage, rowsPerPage);
            if (response && response.status && response.response.data) {
                setData(response.response.data);
                setTotalRecords(response.response.total || 0);
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

    const handleToggleStatus = async (id) => {
        const response = await BannerApi.toggleStatus(id);
        if (response.status) {
            toast.success("Status updated");
            fetchData();
        } else {
            toast.error("Failed to update status");
        }
    };

    const confirmDelete = (item) => {
        setItemToDelete(item);
        setShowDeleteModal(true);
    };

    const handleDelete = async () => {
        if (itemToDelete) {
            const response = await BannerApi.deleteBanner(itemToDelete._id);
            if (response && response.status) {
                toast.success("Banner deleted");
                fetchData();
                setShowDeleteModal(false);
                setItemToDelete(null);
            }
        }
    };

    const totalPages = Math.ceil(totalRecords / rowsPerPage);

    return (
        <div className="card h-100 p-0 radius-12">
            <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center justify-content-between flex-wrap gap-3">
                <h6 className="text-primary-600 pb-2 mb-0">Banner List</h6>
                {hasPermission("Banner", "add") && (
                    <Link to="/banner/add" className="btn btn-primary text-sm btn-sm px-12 py-12 radius-8 d-flex align-items-center gap-2">
                        <Icon icon="ic:baseline-plus" className="text-xl" /> Add Banner
                    </Link>
                )}
            </div>
            <div className="card-body p-24">
                <div className="table-responsive scroll-sm">
                    <table className="table bordered-table sm-table mb-0">
                        <thead>
                            <tr>
                                <th scope="col" style={{ color: "black" }}>S.No</th>
                                <th scope="col" style={{ color: "black" }}>Image</th>
                                <th scope="col" style={{ color: "black" }}>Title</th>
                                <th scope="col" style={{ color: "black" }}>Status</th>
                                <th scope="col" style={{ color: "black" }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="5" className="text-center py-4">Loading...</td></tr>
                            ) : data.length > 0 ? (
                                data.map((item, index) => (
                                    <tr key={item._id || index}>
                                        <td>{currentPage * rowsPerPage + index + 1}</td>
                                        <td>
                                            <img 
                                                src={`${IMAGE_BASE_URL}/${item.image?.path || ''}`} 
                                                alt="" 
                                                style={{ width: '100px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                                                onError={(e) => { e.target.src = 'https://via.placeholder.com/100x50'; }}
                                            />
                                        </td>
                                        <td>
                                            <span className="text-md mb-0 fw-normal text-secondary-light">
                                                {item.title || "No Title"}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="form-check form-switch p-0">
                                                <input 
                                                    className="form-check-input" 
                                                    type="checkbox" 
                                                    checked={item.status} 
                                                    onChange={() => handleToggleStatus(item._id)}
                                                    style={{ cursor: 'pointer', float: 'none', marginLeft: '0' }}
                                                />
                                            </div>
                                        </td>
                                        <td>
                                            <div className="d-flex align-items-center gap-2">
                                                {hasPermission("Banner", "view") && (
                                                    <Link to={`/banner/view/${item._id}`} className="bg-info-focus text-info-600 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle border-0">
                                                        <Icon icon="lucide:eye" className="menu-icon" />
                                                    </Link>
                                                )}
                                                {hasPermission("Banner", "edit") && (
                                                    <Link to={`/banner/edit/${item._id}`} className="bg-success-focus text-success-600 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle border-0">
                                                        <Icon icon="lucide:edit" className="menu-icon" />
                                                    </Link>
                                                )}
                                                {hasPermission("Banner", "delete") && (
                                                    <button onClick={() => confirmDelete(item)} className="remove-item-btn bg-danger-focus text-danger-600 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle border-0">
                                                        <Icon icon="fluent:delete-24-regular" className="menu-icon" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="5" className="text-center py-4">No Data Found</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {!loading && (
                    <TablePagination 
                        currentPage={currentPage} 
                        totalPages={totalPages} 
                        onPageChange={setCurrentPage} 
                        rowsPerPage={rowsPerPage} 
                        onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value)); setCurrentPage(0); }} 
                        totalRecords={totalRecords} 
                    />
                )}
            </div>

            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
                <Modal.Body className="text-center p-5">
                    <div className="d-flex justify-content-center mb-3">
                        <div className="bg-danger-focus rounded-circle d-flex justify-content-center align-items-center w-64-px h-64-px">
                            <Icon icon="fluent:delete-24-regular" className="text-danger-600 text-xxl" />
                        </div>
                    </div>
                    <h5 className="mb-3">Are you sure?</h5>
                    <p className="text-secondary-light mb-4">Do you want to delete this Banner?</p>
                    <div className="d-flex justify-content-center gap-3">
                        <Button variant="outline-secondary" className="px-32" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
                        <Button variant="danger" className="px-32" onClick={handleDelete}>Delete</Button>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default BannerLayer;
