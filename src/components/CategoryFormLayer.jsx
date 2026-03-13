import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import { Icon } from "@iconify/react/dist/iconify.js";
import Select from "react-select";
import { selectStyles } from "../helper/SelectStyles";
import CategoryApi from "../Api/CategoryApi";
import usePermissions from "../hook/usePermissions";
import ImageUploadApi from "../Api/ImageUploadApi";
import { IMAGE_BASE_URL } from "../Config/Index";

const CategoryFormLayer = () => {
  const { hasPermission } = usePermissions();
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const isView = location.pathname.includes("/view/");

  const [formData, setFormData] = useState({
    "name": "",
    "slug": "",
    "description": "",
    "image": "",
    "status": true,
    "metaTitle": "",
    "metaKeywords": "",
    "metaDescription": "",
    "displayOrder": ""
});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [existingImage, setExistingImage] = useState(null);
  const [savedImage, setSavedImage] = useState(null);

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
    const response = await CategoryApi.getById(id);
    if (response.status) {
      const data = response.response.data || response.response;
      setFormData(prev => ({
        ...prev,
        ...data,
        status: data.status !== undefined ? (data.status === 1 || data.status === "active" || data.status === true) : data.isActive !== undefined ? data.isActive : true
      }));
      if (data.image) {
        const imagePath = data.image?.path || data.image;
        setExistingImage(imagePath);
        setSavedImage(imagePath);
        setPreviewImage(`${IMAGE_BASE_URL}/${imagePath}`);
      }
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
      setErrors(prev => ({ ...prev, image: "" }));
    }
  };
  const handleRemoveImage = async () => {
    if (imageFile) {
      setImageFile(null);
      if (existingImage && existingImage.path) setPreviewImage(`${IMAGE_BASE_URL}/${existingImage.path}`);
      else setPreviewImage(null);
      return;
    }
    if (existingImage) {
      setExistingImage(null);
      setPreviewImage(null);
    }
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
    let finalImage = existingImage;
    if (imageFile) {
      const form = new FormData();
      form.append("file", imageFile);
      const uploadRes = await ImageUploadApi.uploadImage({ formData: form, path: "categories" });
      if (uploadRes.status) finalImage = uploadRes.response.data || uploadRes.response;
      else { setLoading(false); return; }
    }
    if (savedImage && finalImage !== savedImage) await ImageUploadApi.deleteImage({ path: savedImage });
    payload["image"] = finalImage;
    payload.isActive = payload.status;
    let result;
    if (id) result = await CategoryApi.update(id, payload);
    else result = await CategoryApi.create(payload);
    setLoading(false);
    if (result.status) navigate("/category");
  };

  return (
    <div className="card h-100 p-0 radius-12">
      <div className="card-header border-bottom bg-base py-16 px-24">
        <h6 className="text-primary-600 pb-2 mb-0">{isView ? "View" : id ? "Edit" : "Create"} Category</h6>
      </div>
      <div className="card-body p-24">
        <form onSubmit={handleSubmit}>
          <div className="row gy-4">
            <div className="col-md-6">
              <label className="form-label fw-semibold">Category Name</label>
              <input type="text" className="form-control radius-8" name="name" value={formData.name} onChange={handleChange} placeholder="Enter Category Name" disabled={isView} />
              {errors.name && <small className="text-danger">{errors.name}</small>}
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">Slug</label>
              <input type="text" className="form-control radius-8" name="slug" value={formData.slug} onChange={handleChange} placeholder="Enter Slug" disabled={isView} />
              {errors.slug && <small className="text-danger">{errors.slug}</small>}
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">Display Order</label>
              <input type="number" className="form-control radius-8" name="displayOrder" value={formData.displayOrder} onChange={handleChange} placeholder="Enter Display Order (e.g. 1, 2, 3)" disabled={isView} />
              {errors.displayOrder && <small className="text-danger">{errors.displayOrder}</small>}
            </div>
            <div className="col-md-12">
              <label className="form-label fw-semibold">Description</label>
              <textarea className="form-control radius-8" name="description" value={formData.description} onChange={handleChange} placeholder="Enter Description" disabled={isView} rows="3" />
            </div>
            <div className="col-12">
              <label className="form-label fw-semibold">Image</label>
              {!previewImage && !existingImage && !loading && !isView && (
                <div className="position-relative">
                  <input type="file" className="form-control radius-8" accept="image/*" onChange={handleImageChange} />
                  {errors.image && <small className="text-danger">{errors.image}</small>}
                </div>
              )}
              {(previewImage || existingImage) && !loading && (
                <div className="d-flex align-items-center justify-content-between p-3 border rounded bg-light-600">
                  <div className="d-flex align-items-center gap-3">
                    <div className="w-100-px h-100-px rounded-8 overflow-hidden border">
                      <img src={previewImage || (existingImage ? `${IMAGE_BASE_URL}/${existingImage.path || existingImage}` : "")} alt="Preview" className="w-100 h-100 object-fit-cover" onError={(e) => (e.target.style.display = "none")} />
                    </div>
                  </div>
                  {!isView && (
                    <button type="button" className="btn btn-icon btn-primary-100 text-danger-600 rounded-circle" onClick={handleRemoveImage} title="Delete Image">
                      <Icon icon="mingcute:delete-2-line" width="24" height="24" />
                    </button>
                  )}
                </div>
              )}
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">Status <span className="text-danger">*</span></label>
              <Select name="status" options={statusOptions} value={statusOptions.find((opt) => opt.value === formData.status)} onChange={handleSelectChange} styles={selectStyles(errors.status)} isDisabled={isView} isClearable={false} />
              {errors.status && <small className="text-danger">{errors.status}</small>}
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">Meta Title</label>
              <input type="text" className="form-control radius-8" name="metaTitle" value={formData.metaTitle} onChange={handleChange} placeholder="Enter Meta Title" disabled={isView} />
              {errors.metaTitle && <small className="text-danger">{errors.metaTitle}</small>}
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">Meta Keywords</label>
              <input type="text" className="form-control radius-8" name="metaKeywords" value={formData.metaKeywords} onChange={handleChange} placeholder="Enter Meta Keywords" disabled={isView} />
              {errors.metaKeywords && <small className="text-danger">{errors.metaKeywords}</small>}
            </div>
            <div className="col-md-12">
              <label className="form-label fw-semibold">Meta Description</label>
              <textarea className="form-control radius-8" name="metaDescription" value={formData.metaDescription} onChange={handleChange} placeholder="Enter Meta Description" disabled={isView} rows="3" />
            </div>
          </div>
          <div className="d-flex justify-content-end gap-2 mt-24">
            <Link to="/category" className="btn btn-outline-danger-600 px-32 radius-8 justify-content-center" style={{ width: "120px" }}>Cancel</Link>
            {!isView && hasPermission("Category", id ? "edit" : "add") && (
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

export default CategoryFormLayer;
