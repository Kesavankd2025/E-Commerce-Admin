import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import { Icon } from "@iconify/react/dist/iconify.js";
import Select from "react-select";
import { selectStyles } from "../helper/SelectStyles";
import ProductApi from "../Api/ProductApi";
import usePermissions from "../hook/usePermissions";
import ImageUploadApi from "../Api/ImageUploadApi";
import { IMAGE_BASE_URL } from "../Config/Index";
import CategoryApi from "../Api/CategoryApi";
import SubCategoryApi from "../Api/SubCategoryApi";
import BrandApi from "../Api/BrandApi";
import UnitApi from "../Api/UnitApi";
import TaxApi from "../Api/TaxApi";
import AttributeApi from "../Api/AttributeApi";

const ProductFormLayer = () => {
  const { hasPermission } = usePermissions();
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const isView = location.pathname.includes("/view/");

  const [formData, setFormData] = useState({
    "name": "",
    "slug": "",
    "categoryId": "",
    "subCategoryId": "",
    "brandId": "",
    "unitId": "",
    "taxId": "",
    "hsnCode": "",
    "weight": "",
    "shortDescription": "",
    "fullDescription": "",
    "refundable": false,
    "status": true,
    "lowStockAlert": "",
    "metaTitle": "",
    "metaKeywords": "",
    "metaDescription": "",
    "attributes": [],
    "specifications": [
      {
        "key": "",
        "value": ""
      }
    ]
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Assuming a generic ReactQuill for text editor
  const [fullDescriptionContent, setFullDescriptionContent] = useState("");
  const [attributeOptions, setAttributeOptions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [units, setUnits] = useState([]);
  const [taxes, setTaxes] = useState([]);

  const statusOptions = [
    { value: true, label: "Active" },
    { value: false, label: "Inactive" },
  ];

  const booleanOptions = [
    { value: true, label: "Yes" },
    { value: false, label: "No" },
  ];

  useEffect(() => {
    fetchCategories();
    fetchSubCategories();
    fetchBrands();
    fetchUnits();
    fetchTaxes();
    fetchAttributes();
    if (id) fetchDetails();
  }, [id]);

  const fetchCategories = async () => {
    const res = await CategoryApi.getAll(0, 1000, "");
    if (res.status && res.response.data) setCategories(res.response.data.map(c => ({ value: c._id, label: c.name })));
  };

  const fetchSubCategories = async () => {
    const res = await SubCategoryApi.getAll(0, 1000, "");
    if (res.status && res.response.data) setSubCategories(res.response.data.map(c => ({ value: c._id, label: c.name })));
  };

  const fetchBrands = async () => {
    const res = await BrandApi.getAll(0, 1000, "");
    if (res.status && res.response.data) setBrands(res.response.data.map(c => ({ value: c._id, label: c.name })));
  };

  const fetchUnits = async () => {
    const res = await UnitApi.getAll(0, 1000, "");
    if (res.status && res.response.data) setUnits(res.response.data.map(c => ({ value: c._id, label: c.name })));
  };

  const fetchTaxes = async () => {
    const res = await TaxApi.getAll(0, 1000, "");
    if (res.status && res.response.data) setTaxes(res.response.data.map(c => ({ value: c._id, label: c.name })));
  };

  const fetchAttributes = async () => {
    const res = await AttributeApi.getAll(0, 1000, "");
    if (res.status && res.response.data) {
      setAttributeOptions(res.response.data.map(attr => ({
        value: attr._id,
        label: attr.name,
        rawValues: attr.value // Keeping the original values string/array
      })));
    }
  };

  const fetchDetails = async () => {
    setLoading(true);
    const response = await ProductApi.getById(id);
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

  const handleTextEditorChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (selectedOption, { name }) => {
    setFormData(prev => ({ ...prev, [name]: selectedOption ? selectedOption.value : (selectedOption === false ? false : "") }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleAddSpecification = () => {
    setFormData(prev => ({ ...prev, specifications: [...prev.specifications, { key: "", value: "" }] }));
  };
  const handleRemoveSpecification = (index) => {
    const updated = [...formData.specifications];
    updated.splice(index, 1);
    setFormData(prev => ({ ...prev, specifications: updated }));
  };
  const handleSpecificationChange = (index, field, value) => {
    const updated = [...formData.specifications];
    updated[index][field] = value;
    setFormData(prev => ({ ...prev, specifications: updated }));
  };

  const handleAddAttribute = () => {
    setFormData(prev => ({
      ...prev,
      attributes: [...prev.attributes, {
        combination: [{ attributeId: "", value: "" }],
        sku: "",
        stock: "",
        minOrderQty: "",
        maxOrderQty: "",
        mrp: "",
        price: "",
        images: []
      }]
    }));
  };
  const handleRemoveAttribute = (index) => {
    const updated = [...formData.attributes];
    updated.splice(index, 1);
    setFormData(prev => ({ ...prev, attributes: updated }));
  };
  const handleAttributeChange = (index, field, value) => {
    const updated = [...formData.attributes];
    updated[index][field] = value;
    setFormData(prev => ({ ...prev, attributes: updated }));
  };

  const handleAddCombination = (index) => {
    const updated = [...formData.attributes];
    updated[index].combination.push({ attributeId: "", value: "" });
    setFormData(prev => ({ ...prev, attributes: updated }));
  };

  const handleRemoveCombination = (attrIndex, combIndex) => {
    const updated = [...formData.attributes];
    updated[attrIndex].combination.splice(combIndex, 1);
    setFormData(prev => ({ ...prev, attributes: updated }));
  };

  const handleCombinationChange = (attrIndex, combIndex, field, value) => {
    const updated = [...formData.attributes];
    updated[attrIndex].combination[combIndex][field] = value;
    setFormData(prev => ({ ...prev, attributes: updated }));
  };
  const handleAttributeImageUpload = async (e, index) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setLoading(true);
      const updated = [...formData.attributes];
      for (const file of files) {
        const form = new FormData();
        form.append("file", file);
        const uploadRes = await ImageUploadApi.uploadImage({ formData: form, path: "products" });
        if (uploadRes.status) updated[index].images.push(uploadRes.response.data || uploadRes.response);
      }
      setFormData(prev => ({ ...prev, attributes: updated }));
      setLoading(false);
    }
  };
  const handleRemoveAttributeImage = async (attrIndex, imgIndex) => {
    const updated = [...formData.attributes];
    const imgPath = updated[attrIndex].images[imgIndex];
    // We could optionally call the API to delete here
    updated[attrIndex].images.splice(imgIndex, 1);
    setFormData(prev => ({ ...prev, attributes: updated }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name?.trim()) newErrors.name = "Name is Required.";
    if (!formData.categoryId) newErrors.categoryId = "Category is Required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    let payload = { ...formData };
    payload.weight = payload.weight ? parseFloat(payload.weight) : null;
    payload.lowStockAlert = payload.lowStockAlert ? parseFloat(payload.lowStockAlert) : null;
    if (payload.attributes && Array.isArray(payload.attributes)) {
      payload.attributes = payload.attributes
        .filter(attr => attr.combination && attr.combination.some(c => c.attributeId)) // Only keep variations with at least one attribute set
        .map(attr => ({
          ...attr,
          combination: attr.combination.filter(c => c.attributeId), // Remove empty combination rows if any
          sku: attr.sku ? parseFloat(attr.sku) : 0,
          stock: attr.stock ? parseFloat(attr.stock) : 0,
          minOrderQty: attr.minOrderQty ? parseFloat(attr.minOrderQty) : 0,
          maxOrderQty: attr.maxOrderQty ? parseFloat(attr.maxOrderQty) : 0,
          mrp: attr.mrp ? parseFloat(attr.mrp) : 0,
          price: attr.price ? parseFloat(attr.price) : 0,
        }));
    }
    payload.isActive = payload.status;
    let result;
    if (id) result = await ProductApi.update(id, payload);
    else result = await ProductApi.create(payload);
    setLoading(false);
    if (result.status) navigate("/products");
  };

  return (
    <div className="card h-100 p-0 radius-12">
      <div className="card-header border-bottom bg-base py-16 px-24">
        <h6 className="text-primary-600 pb-2 mb-0">{isView ? "View" : id ? "Edit" : "Create"} Products</h6>
      </div>
      <div className="card-body p-24">
        <form onSubmit={handleSubmit}>
          <div className="row gy-4">
            <div className="col-md-6">
              <label className="form-label fw-semibold">Product Name</label>
              <input type="text" className="form-control radius-8" name="name" value={formData.name} onChange={handleChange} placeholder="Enter Product Name" disabled={isView} />
              {errors.name && <small className="text-danger">{errors.name}</small>}
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">Slug</label>
              <input type="text" className="form-control radius-8" name="slug" value={formData.slug} onChange={handleChange} placeholder="Enter Slug" disabled={isView} />
              {errors.slug && <small className="text-danger">{errors.slug}</small>}
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">Category <span className="text-danger">*</span></label>
              <Select name="categoryId" options={categories} value={categories.find((opt) => opt.value === formData.categoryId)} onChange={handleSelectChange} styles={selectStyles(errors.categoryId)} isDisabled={isView} isClearable placeholder="Select Category" />
              {errors.categoryId && <small className="text-danger">{errors.categoryId}</small>}
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">Sub Category <span className="text-danger">*</span></label>
              <Select name="subCategoryId" options={subCategories} value={subCategories.find((opt) => opt.value === formData.subCategoryId)} onChange={handleSelectChange} styles={selectStyles(errors.subCategoryId)} isDisabled={isView} isClearable placeholder="Select Sub Category" />
              {errors.subCategoryId && <small className="text-danger">{errors.subCategoryId}</small>}
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">Brand <span className="text-danger">*</span></label>
              <Select name="brandId" options={brands} value={brands.find((opt) => opt.value === formData.brandId)} onChange={handleSelectChange} styles={selectStyles(errors.brandId)} isDisabled={isView} isClearable placeholder="Select Brand" />
              {errors.brandId && <small className="text-danger">{errors.brandId}</small>}
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">Unit <span className="text-danger">*</span></label>
              <Select name="unitId" options={units} value={units.find((opt) => opt.value === formData.unitId)} onChange={handleSelectChange} styles={selectStyles(errors.unitId)} isDisabled={isView} isClearable placeholder="Select Unit" />
              {errors.unitId && <small className="text-danger">{errors.unitId}</small>}
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">Tax <span className="text-danger">*</span></label>
              <Select name="taxId" options={taxes} value={taxes.find((opt) => opt.value === formData.taxId)} onChange={handleSelectChange} styles={selectStyles(errors.taxId)} isDisabled={isView} isClearable placeholder="Select Tax" />
              {errors.taxId && <small className="text-danger">{errors.taxId}</small>}
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">HSN Code</label>
              <input type="text" className="form-control radius-8" name="hsnCode" value={formData.hsnCode} onChange={handleChange} placeholder="Enter HSN Code" disabled={isView} />
              {errors.hsnCode && <small className="text-danger">{errors.hsnCode}</small>}
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">Weight</label>
              <input type="number" className="form-control radius-8" name="weight" value={formData.weight} onChange={handleChange} placeholder="Enter Weight" disabled={isView} />
              {errors.weight && <small className="text-danger">{errors.weight}</small>}
            </div>
            <div className="col-md-12">
              <label className="form-label fw-semibold">Short Description</label>
              <textarea className="form-control radius-8" name="shortDescription" value={formData.shortDescription} onChange={handleChange} placeholder="Enter Short Description" disabled={isView} rows="3" />
            </div>
            <div className="col-md-12">
              <label className="form-label fw-semibold">Full Description</label>
              <textarea className="form-control radius-8" name="fullDescription" value={formData.fullDescription} onChange={handleTextEditorChange} placeholder="Enter Full Description (Simulated Text Editor)" disabled={isView} rows="6" />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">Refundable (yes/no) <span className="text-danger">*</span></label>
              <Select name="refundable" options={booleanOptions} value={booleanOptions.find((opt) => opt.value === formData.refundable)} onChange={handleSelectChange} styles={selectStyles(errors.refundable)} isDisabled={isView} isClearable={false} />
              {errors.refundable && <small className="text-danger">{errors.refundable}</small>}
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">Status <span className="text-danger">*</span></label>
              <Select name="status" options={statusOptions} value={statusOptions.find((opt) => opt.value === formData.status)} onChange={handleSelectChange} styles={selectStyles(errors.status)} isDisabled={isView} isClearable={false} />
              {errors.status && <small className="text-danger">{errors.status}</small>}
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">Low stock alert qnt</label>
              <input type="number" className="form-control radius-8" name="lowStockAlert" value={formData.lowStockAlert} onChange={handleChange} placeholder="Enter Low stock alert qnt" disabled={isView} />
              {errors.lowStockAlert && <small className="text-danger">{errors.lowStockAlert}</small>}
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
          {/* Product Variations Section */}
          <div className="mt-5 pt-4 border-top">
            <div className="d-flex align-items-center justify-content-between mb-4">
              <h6 className="mb-0 fw-bold text-lg">Product Variations (Combinations)</h6>
              {!isView && (
                <button
                  type="button"
                  className="btn btn-primary-600 radius-8 px-20 py-10 d-flex align-items-center gap-2"
                  onClick={handleAddAttribute}
                  style={{ backgroundColor: "#003366", borderColor: "#003366" }}
                >
                  <Icon icon="ic:baseline-plus" fontSize="20px" />
                  <span>Add Variation</span>
                </button>
              )}
            </div>
            
            {formData.attributes.map((attr, index) => (
              <div key={index} className="p-24 mb-32 border radius-12 position-relative bg-light-50 shadow-sm">
                <div className="d-flex justify-content-between align-items-center mb-20 border-bottom pb-16">
                  <h6 className="text-md mb-0 text-primary-600 fw-bold">
                    <Icon icon="ph:package-duotone" className="me-2" />
                    Variation #{index + 1}
                  </h6>
                  {!isView && (
                    <button
                      type="button"
                      className="btn btn-sm btn-danger radius-8 px-12 py-6 d-flex align-items-center gap-1"
                      onClick={() => handleRemoveAttribute(index)}
                    >
                      <Icon icon="mingcute:delete-2-line" fontSize="16px" />
                      <span>Remove Variation</span>
                    </button>
                  )}
                </div>

                <div className="row gy-4">
                  {/* Nested Combinations section */}
                  <div className="col-12 mb-3">
                    <div className="d-flex align-items-center justify-content-between mb-16 bg-white p-12 radius-8 border">
                      <label className="form-label fw-bold mb-0 text-secondary-700">
                        <Icon icon="material-symbols:settings-input-component-outline" className="me-2" />
                        Attributes Combination (e.g. Red + M)
                      </label>
                      {!isView && (
                        <button 
                          type="button" 
                          className="btn btn-dark radius-8 px-16 py-8 d-flex align-items-center gap-2" 
                          onClick={() => handleAddCombination(index)}
                        >
                          <Icon icon="ic:baseline-plus" width="18" />
                          <span className="text-sm">Add Attribute</span>
                        </button>
                      )}
                    </div>

                    <div className="ps-4 border-start border-3 border-primary-50">
                      {attr.combination && attr.combination.map((comb, cIdx) => {
                        const selectedAttr = attributeOptions.find(opt => opt.value === comb.attributeId);
                        let valueOptions = [];

                        if (selectedAttr?.rawValues) {
                          if (typeof selectedAttr.rawValues === "string") {
                            valueOptions = selectedAttr.rawValues.split(",").map(v => ({ value: v.trim(), label: v.trim() }));
                          } else if (Array.isArray(selectedAttr.rawValues)) {
                            valueOptions = selectedAttr.rawValues.map(v => ({ value: String(v).trim(), label: String(v).trim() }));
                          }
                        }

                        return (
                          <div key={cIdx} className="row gy-3 mb-16 align-items-end justify-content-start">
                            <div className="col-md-5">
                              <label className="form-label text-xs fw-bold text-secondary-600 mb-8">Attribute Name</label>
                              <Select
                                options={attributeOptions}
                                value={attributeOptions.find(opt => opt.value === comb.attributeId)}
                                onChange={(sel) => handleCombinationChange(index, cIdx, "attributeId", sel ? sel.value : "")}
                                isDisabled={isView}
                                styles={selectStyles()}
                                placeholder="Select Attribute"
                              />
                            </div>
                            <div className="col-md-5">
                              <label className="form-label text-xs fw-bold text-secondary-600 mb-8">Value</label>
                              <Select
                                options={valueOptions}
                                value={valueOptions.find(opt => opt.value === comb.value)}
                                onChange={(sel) => handleCombinationChange(index, cIdx, "value", sel ? sel.value : "")}
                                isDisabled={isView || !comb.attributeId}
                                styles={selectStyles()}
                                placeholder="Select Value"
                              />
                            </div>
                            {!isView && attr.combination.length > 1 && (
                              <div className="col-md-1 d-flex align-items-center mb-1">
                                <button 
                                  type="button" 
                                  className="btn btn-danger radius-8 p-10 d-flex align-items-center justify-content-center" 
                                  onClick={() => handleRemoveCombination(index, cIdx)} 
                                  title="Remove Attribute"
                                  style={{ minWidth: "38px", height: "38px" }}
                                >
                                  <Icon icon="mingcute:delete-2-line" fontSize="18px" />
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Variation Details */}
                  <div className="col-md-3">
                    <label className="form-label fw-semibold mb-8">SKU</label>
                    <input type="text" className="form-control radius-8 py-10" value={attr.sku} onChange={(e) => handleAttributeChange(index, "sku", e.target.value)} disabled={isView} placeholder="Enter SKU" />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label fw-semibold mb-8">Stock Quantity</label>
                    <input type="number" className="form-control radius-8 py-10" value={attr.stock} onChange={(e) => handleAttributeChange(index, "stock", e.target.value)} disabled={isView} placeholder="Stock" />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label fw-semibold mb-8">Min Order Qty</label>
                    <input type="number" className="form-control radius-8 py-10" value={attr.minOrderQty} onChange={(e) => handleAttributeChange(index, "minOrderQty", e.target.value)} disabled={isView} placeholder="Min Qty" />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label fw-semibold mb-8">Max Order Qty</label>
                    <input type="number" className="form-control radius-8 py-10" value={attr.maxOrderQty} onChange={(e) => handleAttributeChange(index, "maxOrderQty", e.target.value)} disabled={isView} placeholder="Max Qty" />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label fw-semibold mb-8">MRP</label>
                    <input type="number" className="form-control radius-8 py-10" value={attr.mrp} onChange={(e) => handleAttributeChange(index, "mrp", e.target.value)} disabled={isView} placeholder="MRP" />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label fw-semibold mb-8">Price <span className="text-danger">*</span></label>
                    <input type="number" className="form-control radius-8 py-10" value={attr.price} onChange={(e) => handleAttributeChange(index, "price", e.target.value)} disabled={isView} placeholder="Price" />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold mb-8">Images (Optional)</label>
                    {!isView && <input type="file" multiple className="form-control radius-8 mb-12" accept="image/*" onChange={(e) => handleAttributeImageUpload(e, index)} disabled={loading} />}
                    <div className="d-flex flex-wrap gap-12">
                      {attr.images && attr.images.map((img, i) => (
                        <div key={i} className="position-relative w-80-px h-80-px rounded border shadow-sm bg-white p-4">
                          <img src={`${IMAGE_BASE_URL}/${img.path || img}`} alt="" className="w-100 h-100 object-fit-cover rounded" />
                          {!isView && <button type="button" className="btn btn-sm btn-icon btn-danger position-absolute top-0 end-0 rounded-circle" style={{ transform: "translate(30%, -30%)", padding: "4px" }} onClick={() => handleRemoveAttributeImage(index, i)}><Icon icon="mingcute:delete-2-line" fontSize="14px" /></button>}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {formData.attributes.length === 0 && <div className="text-secondary-light p-32 text-center border dashed radius-12 bg-light-600 fw-medium">No variations added yet. Click "Add Variation" to create product combinations.</div>}
          </div>

          {/* Specifications Section */}
          <div className="mt-5 pt-4 border-top">
            <div className="d-flex align-items-center justify-content-between mb-4">
              <h6 className="mb-0 fw-bold text-lg">Product Specifications</h6>
              {!isView && (
                <button
                  type="button"
                  className="btn btn-primary-600 radius-8 px-20 py-10 d-flex align-items-center gap-2"
                  onClick={handleAddSpecification}
                  style={{ backgroundColor: "#003366", borderColor: "#003366" }}
                >
                  <Icon icon="ic:baseline-plus" fontSize="20px" />
                  <span>Add Specification</span>
                </button>
              )}
            </div>
            
            <div className="bg-light-50 p-24 radius-12 border">
              <div className="row gy-4">
                {formData.specifications.map((spec, index) => (
                  <div key={index} className="col-12 d-flex align-items-center gap-3 bg-white p-16 radius-8 shadow-sm">
                    <div className="flex-grow-1">
                      <label className="form-label text-xs fw-bold text-secondary-600 mb-8">Property Name</label>
                      <input type="text" className="form-control radius-8 py-10" value={spec.key} onChange={(e) => handleSpecificationChange(index, "key", e.target.value)} disabled={isView} placeholder="e.g. Style, Material, fit, etc." />
                    </div>
                    <div className="flex-grow-1">
                      <label className="form-label text-xs fw-bold text-secondary-600 mb-8">Value</label>
                      <input type="text" className="form-control radius-8 py-10" value={spec.value} onChange={(e) => handleSpecificationChange(index, "value", e.target.value)} disabled={isView} placeholder="e.g. Regular, Cotton, Slim, etc." />
                    </div>
                    {!isView && (
                      <div className="pt-24">
                        <button 
                          type="button" 
                          className="btn btn-danger radius-8 p-10 d-flex align-items-center justify-content-center" 
                          onClick={() => handleRemoveSpecification(index)} 
                          disabled={formData.specifications.length === 1} 
                          title="Remove"
                          style={{ minWidth: "42px", height: "42px" }}
                        >
                          <Icon icon="mingcute:delete-2-line" fontSize="20px" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="d-flex justify-content-end gap-3 mt-40 pt-24 border-top">
            <Link to="/products" className="btn btn-outline-secondary px-32 py-12 radius-8 fw-semibold" style={{ minWidth: "140px" }}>
              Cancel
            </Link>
            {!isView && hasPermission("Products", id ? "edit" : "add") && (
              <button 
                type="submit" 
                className="btn btn-primary radius-8 px-32 py-12 fw-semibold d-flex align-items-center justify-content-center gap-2" 
                disabled={loading} 
                style={{ backgroundColor: "#364E3D", borderColor: "#364E3D", minWidth: "140px" }}
              >
                {loading ? (
                  <>
                    <Icon icon="line-md:loading-twotone-loop" fontSize="20px" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Icon icon="tabler:device-floppy" fontSize="20px" />
                    <span>{id ? "Update Product" : "Save Product"}</span>
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductFormLayer;
