import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import usePermissions from "../hook/usePermissions";
import AwardApi from "../Api/AwardApi";

const AwardFormLayer = () => {
  const { hasPermission } = usePermissions();
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    name: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEditMode) {
      getAwardById(id);
    }
  }, [isEditMode, id]);

  const getAwardById = async (id) => {
    const response = await AwardApi.getAward(id);
    if (response && response.status && response.response.data) {
      setFormData(response.response.data);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setErrors({ name: "Award Name is Required" });
      return;
    }
    if (isEditMode) {
      const payload = { ...formData, id };
      console.log(payload, "payload");
      const response = await AwardApi.updateAward(payload);
      if (response && response.status) {
        navigate("/award");
      }
    } else {
      const response = await AwardApi.createAward(formData);
      if (response && response.status) {
        navigate("/award");
      }
    }
  };

  return (
    <div className="card h-100 p-0 radius-12">
      <div className="card-header border-bottom bg-base py-16 px-24">
        <h6 className="text-primary-600 pb-2 mb-0">
          {isEditMode ? "Edit Award" : "Create Award"}
        </h6>
      </div>
      <div className="card-body p-24">
        <form onSubmit={handleSubmit}>
          <div className="row gy-3">
            <div className="col-12">
              <label className="form-label fw-semibold">
                Award Name <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control radius-8"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter Award Name"
                required={false}
              />
              {errors.name && (
                <span className="text-danger text-xs mt-1">{errors.name}</span>
              )}
            </div>
          </div>
          <div className="d-flex justify-content-end gap-2 mt-24">
            <Link
              to="/award"
              className="btn btn-outline-danger-600 px-32 radius-8 justify-content-center"
              style={{ width: "120px" }}
            >
              Cancel
            </Link>
            {hasPermission("Award", isEditMode ? "edit" : "add") && (
              <button
                type="submit"
                className="btn btn-primary radius-8 px-20 py-11 justify-content-center"
                style={{ width: "120px" }}
              >
                {isEditMode ? "Update" : "Save"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AwardFormLayer;
