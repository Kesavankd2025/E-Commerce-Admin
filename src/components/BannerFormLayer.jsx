import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useNavigate, Link, useParams, useLocation } from "react-router-dom";
import BannerApi from "../Api/BannerApi";
import ImageUploadApi from "../Api/ImageUploadApi";
import { toast } from "react-toastify";
import { IMAGE_BASE_URL } from "../Config/Index";
import Select from "react-select";
import { selectStyles } from "../helper/SelectStyles";
import usePermissions from "../hook/usePermissions";

const BannerFormLayer = () => {
    const { hasPermission } = usePermissions();
    const navigate = useNavigate();
    const { id } = useParams();
    const location = useLocation();
    const isView = location.pathname.includes("/view/");

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        link: "",
        status: true
    });
    const [imageFile, setImageFile] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [existingImage, setExistingImage] = useState(null);
    const [savedImage, setSavedImage] = useState(null);
    const [errors, setErrors] = useState({});

    const statusOptions = [
        { value: true, label: "Active" },
        { value: false, label: "Inactive" },
    ];

    useEffect(() => {
        if (id) fetchDetails();
    }, [id]);

    const fetchDetails = async () => {
        setLoading(true);
        const response = await BannerApi.getAllBanners(0, 1000); // We don't have getById for banner, so let's find it in the list or implement getById. 
        // Actually, let's implement getById in BannerApi and Backend for consistency.
        // For now, I'll fetch it from the list. 
        if (response.status) {
            const banner = response.response.data.find(b => b._id === id);
            if (banner) {
                setFormData({
                    title: banner.title || "",
                    description: banner.description || "",
                    link: banner.link || "",
                    status: banner.status ?? true
                });
                if (banner.image) {
                    const imagePath = banner.image?.path || banner.image;
                    setExistingImage(imagePath);
                    setSavedImage(imagePath);
                    setPreviewImage(`${IMAGE_BASE_URL}/${imagePath}`);
                }
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
        setFormData(prev => ({ ...prev, [name]: selectedOption ? selectedOption.value : true }));
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

    const handleRemoveImage = () => {
        setImageFile(null);
        if (existingImage) {
            setPreviewImage(`${IMAGE_BASE_URL}/${existingImage}`);
        } else {
            setPreviewImage(null);
        }
        // If they want to truly remove it, we need a way to mark it for deletion.
        // For now, follow Category logic.
        if (!imageFile && existingImage) {
            setExistingImage(null);
            setPreviewImage(null);
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!imageFile && !previewImage) newErrors.image = "Image is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
            let finalImage = existingImage;
            if (imageFile) {
                const form = new FormData();
                form.append("file", imageFile);
                const uploadRes = await ImageUploadApi.uploadImage({ formData: form, path: "banners" });
                if (uploadRes.status) {
                    finalImage = uploadRes.response.data || uploadRes.response;
                } else {
                    setLoading(false);
                    return;
                }
            }

            const payload = {
                ...formData,
                image: finalImage
            };

            let res;
            if (id) {
                // We need an update method in BannerApi. I'll add it.
                res = await BannerApi.updateBanner(id, payload);
            } else {
                res = await BannerApi.createBanner(payload);
            }

            if (res.status) {
                toast.success(id ? "Banner updated successfully" : "Banner added successfully");
                navigate("/banner");
            }
        } catch (error) {
            console.error("Error submitting banner:", error);
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card h-100 p-0 radius-12">
            <div className="card-header border-bottom bg-base py-16 px-24">
                <h6 className="text-primary-600 pb-2 mb-0">{isView ? "View" : id ? "Edit" : "Add"} Banner</h6>
            </div>
            <div className="card-body p-24">
                <form onSubmit={handleSubmit}>
                    <div className="row gy-4">
                        <div className="col-md-6">
                            <label className="form-label fw-semibold">Banner Title</label>
                            <input 
                                type="text" 
                                className="form-control radius-8" 
                                name="title"
                                placeholder="Enter title" 
                                value={formData.title}
                                onChange={handleChange}
                                disabled={isView}
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label fw-semibold">Link (Optional)</label>
                            <input 
                                type="text" 
                                className="form-control radius-8" 
                                name="link"
                                placeholder="Enter link URL" 
                                value={formData.link}
                                onChange={handleChange}
                                disabled={isView}
                            />
                        </div>
                        <div className="col-12">
                            <label className="form-label fw-semibold">Description</label>
                            <textarea 
                                className="form-control radius-8" 
                                name="description"
                                rows="3" 
                                placeholder="Enter description"
                                value={formData.description}
                                onChange={handleChange}
                                disabled={isView}
                            ></textarea>
                        </div>
                        <div className="col-12">
                            <label className="form-label fw-semibold">Banner Image</label>
                            {!previewImage && !isView && (
                                <div className="position-relative">
                                    <input type="file" className="form-control radius-8" accept="image/*" onChange={handleImageChange} />
                                    {errors.image && <small className="text-danger">{errors.image}</small>}
                                </div>
                            )}
                            {previewImage && (
                                <div className="d-flex align-items-center justify-content-between p-3 border rounded bg-light-600">
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="w-100-px h-100-px rounded-8 overflow-hidden border">
                                            <img src={previewImage} alt="Preview" className="w-100 h-100 object-fit-cover" />
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
                            <Select 
                                name="status" 
                                options={statusOptions} 
                                value={statusOptions.find((opt) => opt.value === formData.status)} 
                                onChange={handleSelectChange} 
                                styles={selectStyles(errors.status)} 
                                isClearable={false} 
                                isDisabled={isView}
                            />
                        </div>
                    </div>
                    <div className="d-flex justify-content-end gap-2 mt-24">
                        <Link to="/banner" className="btn btn-outline-danger-600 px-32 radius-8 justify-content-center" style={{ width: "120px" }}>Cancel</Link>
                        {!isView && (
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

export default BannerFormLayer;
