import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import { Icon } from "@iconify/react/dist/iconify.js";
import Select from "react-select";
import { selectStyles } from "../helper/SelectStyles";
import TaxApi from "../Api/TaxApi";
import usePermissions from "../hook/usePermissions";

const TaxFormLayer = () => {
  const { hasPermission } = usePermissions();
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const isView = location.pathname.includes("/view/");

  const [formData, setFormData] = useState({
    "name": "",
    "taxType": "",
    "percentage": "",
    "description": "",
    "status": true
});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);


  const statusOptions = [
    { value: true, label: "Active" },
    { value: false, label: "Inactive" },
  ];

  const booleanOptions = [
    { value: true, label: "Yes" },
    { value: false, label: "No" },
  ];

  useEffect(() => {
    if (id) fetchDetails();
  }, [id]);

  const fetchDetails = async () => {
    setLoading(true);
    const response = await TaxApi.getById(id);
    if (response.status) {
      const data = response.response.data || response.response;
      setFormData(prev => ({
        ...prev,
        ...data,
        status: data.status !== undefined ? (data.status === 1 || data.status === "active" || data.status === true) : data.isActive !== undefined ? data.isActive : true
      }));
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleSelectChange = (selectedOption, { name }) => {
    setFormData(prev => ({ ...prev, [name]: selectedOption ? selectedOption.value : (selectedOption === false ? false : "") }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name?.trim()) newErrors.name = "Name is Required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    let payload = { ...formData };
    payload.percentage = payload.percentage ? parseFloat(payload.percentage) : null;
    payload.isActive = payload.status;
    let result;
    if (id) result = await TaxApi.update(id, payload);
    else result = await TaxApi.create(payload);
    setLoading(false);
    if (result.status) navigate("/taxes");
  };

  return (
    <div className="card h-100 p-0 radius-12">
      <div className="card-header border-bottom bg-base py-16 px-24">
        <h6 className="text-primary-600 pb-2 mb-0">{isView ? "View" : id ? "Edit" : "Create"} Taxes</h6>
      </div>
      <div className="card-body p-24">
        <form onSubmit={handleSubmit}>
          <div className="row gy-4">
            <div className="col-md-6">
              <label className="form-label fw-semibold">Tax Name</label>
              <input type="text" className="form-control radius-8" name="name" value={formData.name} onChange={handleChange} placeholder="Enter Tax Name" disabled={isView} />
              {errors.name && <small className="text-danger">{errors.name}</small>}
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">Tax Type</label>
              <input type="text" className="form-control radius-8" name="taxType" value={formData.taxType} onChange={handleChange} placeholder="Enter Tax Type" disabled={isView} />
              {errors.taxType && <small className="text-danger">{errors.taxType}</small>}
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">Percentage</label>
              <input type="number" className="form-control radius-8" name="percentage" value={formData.percentage} onChange={handleChange} placeholder="Enter Percentage" disabled={isView} />
              {errors.percentage && <small className="text-danger">{errors.percentage}</small>}
            </div>
            <div className="col-md-12">
              <label className="form-label fw-semibold">Description</label>
              <textarea className="form-control radius-8" name="description" value={formData.description} onChange={handleChange} placeholder="Enter Description" disabled={isView} rows="3" />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">Status <span className="text-danger">*</span></label>
              <Select name="status" options={statusOptions} value={statusOptions.find((opt) => opt.value === formData.status)} onChange={handleSelectChange} styles={selectStyles(errors.status)} isDisabled={isView} isClearable={false} />
              {errors.status && <small className="text-danger">{errors.status}</small>}
            </div>
          </div>
          <div className="d-flex justify-content-end gap-2 mt-24">
            <Link to="/taxes" className="btn btn-outline-danger-600 px-32 radius-8 justify-content-center" style={{ width: "120px" }}>Cancel</Link>
            {!isView && hasPermission("Tax", id ? "edit" : "add") && (
              <button type="submit" className="btn btn-primary radius-8 px-18 py-11 justify-content-center" disabled={loading} style={{ backgroundColor: "#003366", borderColor: "#003366", width: "120px" }}>
                {loading ? "Saving..." : id ? "Update" : "Save"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaxFormLayer;
