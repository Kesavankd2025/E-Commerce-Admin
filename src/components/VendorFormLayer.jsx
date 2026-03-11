import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import { Icon } from "@iconify/react/dist/iconify.js";
import Select from "react-select";
import { selectStyles } from "../helper/SelectStyles";
import VendorApi from "../Api/VendorApi";
import usePermissions from "../hook/usePermissions";

const VendorFormLayer = () => {
    const { hasPermission } = usePermissions();
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const isView = location.pathname.includes("/view/");

    const [formData, setFormData] = useState({
        name: "",
        contactPerson: "",
        phoneNumber: "",
        address: "",
        gstNumber: "",
        bankName: "",
        accountNumber: "",
        ifscCode: "",
        status: true
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const statusOptions = [
        { value: true, label: "Active" },
        { value: false, label: "Inactive" },
    ];

    useEffect(() => {
        if (id) fetchDetails();
    }, [id]);

    const fetchDetails = async () => {
        setLoading(true);
        const response = await VendorApi.getById(id);
        if (response.status) {
            const data = response.response.data || response.response;
            setFormData({
                ...data,
                status: data.status !== undefined ? data.status : true
            });
        }
        setLoading(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
    };

    const handleSelectChange = (selectedOption, { name }) => {
        setFormData(prev => ({ ...prev, [name]: selectedOption ? selectedOption.value : true }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name?.trim()) newErrors.name = "Vendor Name is Required.";
        if (!formData.contactPerson?.trim()) newErrors.contactPerson = "Contact Person is Required.";
        if (!formData.phoneNumber?.trim()) newErrors.phoneNumber = "Phone Number is Required.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setLoading(true);

        let result;
        if (id) result = await VendorApi.update(id, formData);
        else result = await VendorApi.create(formData);

        setLoading(false);
        if (result.status) navigate("/vendor-list");
    };

    return (
        <div className="card h-100 p-0 radius-12">
            <div className="card-header border-bottom bg-base py-16 px-24">
                <h6 className="text-primary-600 pb-2 mb-0">{isView ? "View" : id ? "Edit" : "Create"} Vendor</h6>
            </div>
            <div className="card-body p-24">
                <form onSubmit={handleSubmit}>
                    <div className="row gy-4">
                        <div className="col-md-6">
                            <label className="form-label fw-semibold">Vendor Name <span className="text-danger">*</span></label>
                            <input type="text" className="form-control radius-8" name="name" value={formData.name} onChange={handleChange} placeholder="Enter Vendor Name" disabled={isView} />
                            {errors.name && <small className="text-danger">{errors.name}</small>}
                        </div>
                        <div className="col-md-6">
                            <label className="form-label fw-semibold">Contact Person <span className="text-danger">*</span></label>
                            <input type="text" className="form-control radius-8" name="contactPerson" value={formData.contactPerson} onChange={handleChange} placeholder="Enter Contact Person" disabled={isView} />
                            {errors.contactPerson && <small className="text-danger">{errors.contactPerson}</small>}
                        </div>
                        <div className="col-md-6">
                            <label className="form-label fw-semibold">Phone Number <span className="text-danger">*</span></label>
                            <input type="text" className="form-control radius-8" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="Enter Phone Number" disabled={isView} />
                            {errors.phoneNumber && <small className="text-danger">{errors.phoneNumber}</small>}
                        </div>
                        <div className="col-md-6">
                            <label className="form-label fw-semibold">GST Number</label>
                            <input type="text" className="form-control radius-8" name="gstNumber" value={formData.gstNumber} onChange={handleChange} placeholder="Enter GST Number" disabled={isView} />
                        </div>
                        <div className="col-md-12">
                            <label className="form-label fw-semibold">Address</label>
                            <textarea className="form-control radius-8" name="address" value={formData.address} onChange={handleChange} placeholder="Enter Address" disabled={isView} rows="2" />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label fw-semibold">Bank Name</label>
                            <input type="text" className="form-control radius-8" name="bankName" value={formData.bankName} onChange={handleChange} placeholder="Enter Bank Name" disabled={isView} />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label fw-semibold">Account Number</label>
                            <input type="text" className="form-control radius-8" name="accountNumber" value={formData.accountNumber} onChange={handleChange} placeholder="Enter Account Number" disabled={isView} />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label fw-semibold">IFSC Code</label>
                            <input type="text" className="form-control radius-8" name="ifscCode" value={formData.ifscCode} onChange={handleChange} placeholder="Enter IFSC Code" disabled={isView} />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label fw-semibold">Status <span className="text-danger">*</span></label>
                            <Select name="status" options={statusOptions} value={statusOptions.find((opt) => opt.value === formData.status)} onChange={handleSelectChange} styles={selectStyles(errors.status)} isDisabled={isView} isClearable={false} />
                            {errors.status && <small className="text-danger">{errors.status}</small>}
                        </div>
                    </div>
                    <div className="d-flex justify-content-end gap-2 mt-24">
                        <Link to="/vendor-list" className="btn btn-outline-danger-600 px-32 radius-8 justify-content-center" style={{ width: "120px" }}>Cancel</Link>
                        {!isView && hasPermission("Vendor", id ? "edit" : "add") && (
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

export default VendorFormLayer;
