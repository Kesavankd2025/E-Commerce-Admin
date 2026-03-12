import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import RoleApi from "../Api/RoleApi";
import ModuleApi from "../Api/ModuleApi";
import { toast } from "react-toastify";
import { Modal, Button } from "react-bootstrap";
import usePermissions from "../hook/usePermissions";
import TablePagination from "./TablePagination";

const RolePermissionLayer = () => {
    const { hasPermission } = usePermissions();
    const [roles, setRoles] = useState([]);
    const [modules, setModules] = useState([]);
    const [loading, setLoading] = useState(true);

    const [currentPage, setCurrentPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
    const [totalRecords, setTotalRecords] = useState(0);

    const [isFormVisible, setIsFormVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ id: "", name: "", permissions: {} });

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    useEffect(() => {
        const handler = setTimeout(() => { setDebouncedSearchTerm(searchTerm); }, 500);
        return () => clearTimeout(handler);
    }, [searchTerm]);

    useEffect(() => {
        fetchRoles();
    }, [currentPage, rowsPerPage, debouncedSearchTerm]);

    useEffect(() => {
        fetchModules();
    }, []);

    const fetchRoles = async () => {
        try {
            setLoading(true);
            const params = { page: currentPage, limit: rowsPerPage, search: debouncedSearchTerm };
            const response = await RoleApi.getRoles(params);
            if (response && response.status && response.response.data) {
                setRoles(response.response.data);
                setTotalRecords(response.response.total || 0);
            } else {
                setRoles([]);
                setTotalRecords(0);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchModules = async () => {
        try {
            const response = await ModuleApi.getModules();
            if (response && response.status && response.response.data) {
                setModules(response.response.data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleOpenForm = (role = null) => {
        if (role) {
            setIsEditing(true);
            const permissionsMap = {};
            role.permissions.forEach(p => {
                permissionsMap[p.moduleId] = {
                    add: !!p.actions?.add,
                    edit: !!p.actions?.edit,
                    delete: !!p.actions?.delete,
                    view: !!p.actions?.view
                };
            });
            setFormData({
                id: role._id,
                name: role.name,
                permissions: permissionsMap
            });
        } else {
            setIsEditing(false);
            setFormData({ id: "", name: "", permissions: {} });
        }
        setIsFormVisible(true);
    };

    const handlePermissionChange = (moduleId, actionType, isChecked) => {
        setFormData(prev => {
            const currentPerms = prev.permissions[moduleId] || { add: false, edit: false, delete: false, view: false };
            const updatedPerms = { ...currentPerms, [actionType]: isChecked };

            // When adding, editing, or deleting... automatically assign 'view'
            if (isChecked && actionType !== "view") {
                updatedPerms.view = true;
            }
            
            return {
                ...prev,
                permissions: {
                    ...prev.permissions,
                    [moduleId]: updatedPerms
                }
            };
        });
    };

    const handleColumnSelectAll = (actionType, isChecked) => {
        setFormData(prev => {
            const newPermissions = { ...prev.permissions };
            modules.forEach(module => {
                const currentPerms = newPermissions[module.id] || { add: false, edit: false, delete: false, view: false };
                const updatedPerms = { ...currentPerms, [actionType]: isChecked };

                // When adding, editing, or deleting... automatically assign 'view'
                if (isChecked && actionType !== "view") {
                    updatedPerms.view = true;
                }
                
                newPermissions[module.id] = updatedPerms;
            });

            return {
                ...prev,
                permissions: newPermissions
            };
        });
    };

    const isColumnSelected = (actionType) => {
        if (!modules || modules.length === 0) return false;
        return modules.every(m => formData.permissions[m.id] && formData.permissions[m.id][actionType]);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name) return toast.warning("Role Name is required");

        const formattedPermissions = Object.entries(formData.permissions).map(([moduleId, actionsMap]) => {
            const hasAnyAction = actionsMap.add || actionsMap.edit || actionsMap.delete || actionsMap.view;

            if (hasAnyAction) {
                return {
                    moduleId,
                    actions: {
                        add: !!actionsMap.add,
                        edit: !!actionsMap.edit,
                        delete: !!actionsMap.delete,
                        view: !!actionsMap.view
                    }
                };
            }
            return null;
        }).filter(Boolean);

        const payload = {
            name: formData.name,
            permissions: formattedPermissions
        };

        let res;
        if (isEditing) {
            res = await RoleApi.updateRole(formData.id, payload);
        } else {
            res = await RoleApi.createRole(payload);
        }

        if (res && res.status) {
            fetchRoles();
            setIsFormVisible(false);
        }
    };

    const handleCloseForm = () => {
        setIsFormVisible(false);
    };

    const confirmDelete = (item) => {
        setItemToDelete(item);
        setShowDeleteModal(true);
    };

    const handleDelete = async () => {
        if (itemToDelete) {
            const response = await RoleApi.deleteRole(itemToDelete._id);
            if (response && response.status) {
                fetchRoles();
                setShowDeleteModal(false);
                setItemToDelete(null);
            }
        }
    };

    const totalPages = Math.ceil(totalRecords / rowsPerPage);

    if (isFormVisible) {
        return (
            <div className="card h-100 p-0 radius-12">
                <div className="card-header border-bottom bg-base py-16 px-24">
                    <h6 className="text-primary-600 mb-0">{isEditing ? "Edit Role & Permissions" : "Add New Role"}</h6>
                </div>
                <div className="card-body p-24">
                    <form onSubmit={handleFormSubmit}>
                        <div className="row mb-4">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Role Name <span className="text-danger">*</span></label>
                                <input type="text" className="form-control radius-8" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="E.g. Sales Manager" />
                            </div>
                        </div>

                        <div className="table-responsive">
                            <table className="table table-bordered sm-table">
                                <thead className="bg-primary-50">
                                    <tr>
                                        <th style={{ color: "black", fontWeight: '600' }}>Modules</th>
                                        <th className="text-center" style={{ color: "black", fontWeight: '600' }}>
                                            <div className="d-flex align-items-center justify-content-center gap-2">
                                                <span>View</span>
                                                <input className="form-check-input border-primary m-0" type="checkbox" checked={isColumnSelected("view")} onChange={(e) => handleColumnSelectAll("view", e.target.checked)} title="Select All View" />
                                            </div>
                                        </th>
                                        <th className="text-center" style={{ color: "black", fontWeight: '600' }}>
                                            <div className="d-flex align-items-center justify-content-center gap-2">
                                                <span>Add</span>
                                                <input className="form-check-input border-primary m-0" type="checkbox" checked={isColumnSelected("add")} onChange={(e) => handleColumnSelectAll("add", e.target.checked)} title="Select All Add" />
                                            </div>
                                        </th>
                                        <th className="text-center" style={{ color: "black", fontWeight: '600' }}>
                                            <div className="d-flex align-items-center justify-content-center gap-2">
                                                <span>Edit</span>
                                                <input className="form-check-input border-primary m-0" type="checkbox" checked={isColumnSelected("edit")} onChange={(e) => handleColumnSelectAll("edit", e.target.checked)} title="Select All Edit" />
                                            </div>
                                        </th>
                                        <th className="text-center" style={{ color: "black", fontWeight: '600' }}>
                                            <div className="d-flex align-items-center justify-content-center gap-2">
                                                <span>Delete</span>
                                                <input className="form-check-input border-primary m-0" type="checkbox" checked={isColumnSelected("delete")} onChange={(e) => handleColumnSelectAll("delete", e.target.checked)} title="Select All Delete" />
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {modules.map((module) => {
                                        const perms = formData.permissions[module.id] || { add: false, edit: false, delete: false, view: false };
                                        return (
                                            <tr key={module.id}>
                                                <td className="fw-medium text-secondary-light">{module.name}</td>
                                                <td className="text-center">
                                                    <div className="form-check d-flex justify-content-center">
                                                        <input className="form-check-input border-primary" type="checkbox" checked={perms.view} onChange={(e) => handlePermissionChange(module.id, "view", e.target.checked)} />
                                                    </div>
                                                </td>
                                                <td className="text-center">
                                                    <div className="form-check d-flex justify-content-center">
                                                        <input className="form-check-input border-primary" type="checkbox" checked={perms.add} onChange={(e) => handlePermissionChange(module.id, "add", e.target.checked)} />
                                                    </div>
                                                </td>
                                                <td className="text-center">
                                                    <div className="form-check d-flex justify-content-center">
                                                        <input className="form-check-input border-primary" type="checkbox" checked={perms.edit} onChange={(e) => handlePermissionChange(module.id, "edit", e.target.checked)} />
                                                    </div>
                                                </td>
                                                <td className="text-center">
                                                    <div className="form-check d-flex justify-content-center">
                                                        <input className="form-check-input border-primary" type="checkbox" checked={perms.delete} onChange={(e) => handlePermissionChange(module.id, "delete", e.target.checked)} />
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        <div className="d-flex align-items-center justify-content-end gap-3 mt-4">
                            <button type="button" className="btn btn-outline-secondary radius-8 px-20 py-11" onClick={handleCloseForm}>Cancel</button>
                            <button type="submit" className="btn btn-primary radius-8 px-20 py-11">{isEditing ? "Update Role" : "Save Role"}</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="card h-100 p-0 radius-12">
            <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center justify-content-between flex-wrap gap-3">
                <h6 className="text-primary-600 pb-2 mb-0">Role & Permission</h6>
                <div className="d-flex align-items-center flex-wrap gap-3">
                    <form className="navbar-search" onSubmit={(e) => e.preventDefault()}>
                        <input type="text" className="bg-base h-40-px w-auto" name="search" placeholder="Search..." value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(0); }} />
                        <Icon icon="ion:search-outline" className="icon" />
                    </form>
                    {hasPermission("Role & Permission", "add") && (
                        <button onClick={() => handleOpenForm()} className="btn btn-primary text-sm btn-sm px-12 py-12 radius-8 d-flex align-items-center gap-2">
                            <Icon icon="ic:baseline-plus" className="text-xl" /> Create Role
                        </button>
                    )}
                </div>
            </div>
            <div className="card-body p-24">
                <div className="table-responsive scroll-sm">
                    <table className="table bordered-table sm-table mb-0">
                        <thead>
                            <tr>
                                <th scope="col" style={{ color: "black", fontWeight: '600' }}>S.No</th>
                                <th scope="col" style={{ color: "black", fontWeight: '600' }}>Role Name</th>
                                <th scope="col" style={{ color: "black", fontWeight: '600' }}>Role Code</th>
                                <th scope="col" style={{ color: "black", fontWeight: '600' }}>Status</th>
                                <th scope="col" style={{ color: "black", fontWeight: '600' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="5" className="text-center py-4">Loading...</td></tr>
                            ) : roles.length > 0 ? (
                                roles.map((item, index) => (
                                    <tr key={item._id || index}>
                                        <td>{currentPage * rowsPerPage + index + 1}</td>
                                        <td><span className="text-md mb-0 fw-normal text-secondary-light">{item.name}</span></td>
                                        <td><span className="badge bg-secondary-focus text-secondary-main px-12 py-4 radius-4 rounded-pill">{item.code}</span></td>
                                        <td>
                                            <span className={`badge ${item.isActive ? "bg-success-focus text-success-600" : "bg-danger-focus text-danger-600"} px-24 py-4 radius-4 fw-medium text-sm`}>
                                                {item.isActive ? "Active" : "Inactive"}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="d-flex align-items-center gap-2">
                                                {hasPermission("Role & Permission", "edit") && (
                                                    <button onClick={() => handleOpenForm(item)} disabled={item.code === "SUPER_ADMIN"} className="btn-edit-custom border-0 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle" title={item.code === "SUPER_ADMIN" ? "Super Admin restricts editing" : "Edit Role"}>
                                                        <Icon icon="lucide:edit" className="menu-icon" />
                                                    </button>
                                                )}
                                                {hasPermission("Role & Permission", "delete") && (
                                                    <button onClick={() => confirmDelete(item)} disabled={item.code === "SUPER_ADMIN"} className="remove-item-btn bg-danger-focus text-danger-600 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle border-0" title={item.code === "SUPER_ADMIN" ? "Super Admin cannot be deleted" : "Delete Role"}>
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
                    <TablePagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} rowsPerPage={rowsPerPage} onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value)); setCurrentPage(0); }} totalRecords={totalRecords} />
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
                    <p className="text-secondary-light mb-4">You are about to delete {itemToDelete?.name}.</p>
                    <div className="d-flex justify-content-center gap-3">
                        <Button variant="outline-secondary" className="px-32" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
                        <Button variant="danger" className="px-32" onClick={handleDelete}>Delete</Button>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default RolePermissionLayer;
