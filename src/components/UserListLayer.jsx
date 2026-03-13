import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react/dist/iconify.js";
import AdminUserApi from "../Api/AdminUserApi";
import RoleApi from "../Api/RoleApi";
import { toast } from "react-toastify";
import { Modal, Button } from "react-bootstrap";
import usePermissions from "../hook/usePermissions";
import TablePagination from "./TablePagination";

const UserListLayer = () => {
  const { hasPermission } = usePermissions();
  const [data, setData] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [totalRecords, setTotalRecords] = useState(0);

  const [showFormModal, setShowFormModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ id: "", name: "", email: "", phoneNumber: "", pin: "", roleId: "", isActive: 1 });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  useEffect(() => {
    const handler = setTimeout(() => { setDebouncedSearchTerm(searchTerm); }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    fetchData();
  }, [currentPage, rowsPerPage, debouncedSearchTerm]);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const params = { page: currentPage, limit: rowsPerPage, search: debouncedSearchTerm };
      const response = await AdminUserApi.getAdminUsers(params);
      if (response && response.status && response.response.data) {
        setData(response.response.data);
        setTotalRecords(response.response.total || 0);
      } else {
        setData([]);
        setTotalRecords(0);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await RoleApi.getRoles({ limit: 100 });
      if (response && response.status && response.response.data) {
        setRoles(response.response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleOpenForm = (item = null) => {
    if (item) {
      setIsEditing(true);
      setFormData({ id: item._id, name: item.name, email: item.email || "", phoneNumber: item.phoneNumber, pin: "", roleId: item.roleId, isActive: item.isActive });
    } else {
      setIsEditing(false);
      setFormData({ id: "", name: "", email: "", phoneNumber: "", pin: "", roleId: "", isActive: 1 });
    }
    setShowFormModal(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phoneNumber || !formData.roleId) {
      return toast.warning("Name, Phone Number, and Role are required");
    }
    if (!isEditing && !formData.pin) {
      return toast.warning("PIN is required for new users");
    }

    const payload = { ...formData };

    let res;
    if (isEditing) {
      if (!payload.pin) delete payload.pin; // Do not update pin if empty
      res = await AdminUserApi.updateAdminUser(formData.id, payload);
    } else {
      res = await AdminUserApi.createAdminUser(payload);
    }

    if (res && res.status) {
      fetchData();
      setShowFormModal(false);
    }
  };

  const confirmDelete = (item) => {
    setItemToDelete(item);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (itemToDelete) {
      const response = await AdminUserApi.deleteAdminUser(itemToDelete._id);
      if (response && response.status) {
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
        <h6 className="text-primary-600 pb-2 mb-0">Admin Users List</h6>
        <div className="d-flex align-items-center flex-wrap gap-3">
          <form className="navbar-search" onSubmit={(e) => e.preventDefault()}>
            <input type="text" className="bg-base h-40-px w-auto" name="search" placeholder="Search..." value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(0); }} />
            <Icon icon="ion:search-outline" className="icon" />
          </form>
          {hasPermission("User List", "add") && (
            <button onClick={() => handleOpenForm()} className="btn btn-primary text-sm btn-sm px-12 py-12 radius-8 d-flex align-items-center gap-2">
              <Icon icon="ic:baseline-plus" className="text-xl" /> Add User
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
                <th scope="col" style={{ color: "black", fontWeight: '600' }}>Name</th>
                <th scope="col" style={{ color: "black", fontWeight: '600' }}>Phone No</th>
                <th scope="col" style={{ color: "black", fontWeight: '600' }}>Email</th>
                <th scope="col" style={{ color: "black", fontWeight: '600' }}>Role</th>
                <th scope="col" style={{ color: "black", fontWeight: '600' }}>Status</th>
                <th scope="col" style={{ color: "black", fontWeight: '600' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7" className="text-center py-4">Loading...</td></tr>
              ) : data.length > 0 ? (
                data.map((item, index) => (
                  <tr key={item._id || index}>
                    <td>{currentPage * rowsPerPage + index + 1}</td>
                    <td><span className="text-md mb-0 fw-normal text-secondary-light">{item.name}</span></td>
                    <td>{item.phoneNumber}</td>
                    <td>{item.email || "-"}</td>
                    <td><span className=" bg-primary-focus text-primary-main px-12 py-4 radius-4">{item.roleName}</span></td>
                    <td>
                      <span className={`badge ${item.isActive ? "bg-success-focus text-success-600" : "bg-danger-focus text-danger-600"} px-24 py-4 radius-4 fw-medium text-sm`}>
                        {item.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        {hasPermission("User List", "edit") && (
                          <button onClick={() => handleOpenForm(item)} className="btn-edit-custom border-0 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle">
                            <Icon icon="lucide:edit" className="menu-icon" />
                          </button>
                        )}
                        {hasPermission("User List", "delete") && (
                          <button onClick={() => confirmDelete(item)} className="remove-item-btn bg-danger-focus text-danger-600 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle border-0">
                            <Icon icon="fluent:delete-24-regular" className="menu-icon" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="7" className="text-center py-4">No Data Found</td></tr>
              )}
            </tbody>
          </table>
        </div>
        {!loading && (
          <TablePagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} rowsPerPage={rowsPerPage} onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value)); setCurrentPage(0); }} totalRecords={totalRecords} />
        )}
      </div>

      <Modal show={showFormModal} onHide={() => setShowFormModal(false)} centered size="md">
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? "Edit User" : "Add New User"}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <form className="row g-3" onSubmit={handleFormSubmit}>
            <div className="col-12">
              <label className="form-label">Full Name <span className="text-danger">*</span></label>
              <input type="text" className="form-control radius-8" required placeholder="Enter name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            </div>
            <div className="col-12">
              <label className="form-label">Phone Number <span className="text-danger">*</span></label>
              <input type="text" className="form-control radius-8" required placeholder="Enter phone number" value={formData.phoneNumber} onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })} />
            </div>
            <div className="col-12">
              <label className="form-label">Email (Optional)</label>
              <input type="email" className="form-control radius-8" placeholder="Enter email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            </div>
            <div className="col-12">
              <label className="form-label">Select Role <span className="text-danger">*</span></label>
              <select className="form-select radius-8" required value={formData.roleId} onChange={(e) => setFormData({ ...formData, roleId: e.target.value })}>
                <option value="">-- Select Role --</option>
                {roles.map((role) => (
                  <option key={role._id} value={role._id}>{role.name}</option>
                ))}
              </select>
            </div>
            <div className="col-12">
              <label className="form-label">Login PIN {isEditing ? "(Leave blank to keep current)" : <span className="text-danger">*</span>}</label>
              <input type="text" className="form-control radius-8" placeholder="Enter secure PIN" value={formData.pin} onChange={(e) => setFormData({ ...formData, pin: e.target.value })} />
            </div>
            <div className="col-12">
              <label className="form-label">Status</label>
              <select className="form-select radius-8" value={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: Number(e.target.value) })}>
                <option value={1}>Active</option>
                <option value={0}>Inactive</option>
              </select>
            </div>
            <div className="col-12 text-end mt-4">
              <button type="button" className="btn btn-outline-secondary me-2 radius-8" onClick={() => setShowFormModal(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary radius-8">{isEditing ? "Save Changes" : "Create User"}</button>
            </div>
          </form>
        </Modal.Body>
      </Modal>

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

export default UserListLayer;
