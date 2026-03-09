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
          <div className="mt-4 pt-4 border-top">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h6 className="mb-0">Product Variations (Combinations)</h6>
              {!isView && <button type="button" className="btn btn-sm btn-primary-600 radius-8" onClick={handleAddAttribute}><Icon icon="ic:baseline-plus" /> Add Variation</button>}
            </div>
            {formData.attributes.map((attr, index) => (
              <div key={index} className="p-4 mb-4 border radius-8 position-relative bg-light-50 shadow-sm">
                <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
                  <h6 className="text-md mb-0 text-primary-600 fw-bold">Variation #{index + 1}</h6>
                  {!isView && (
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger radius-8 d-flex align-items-center gap-1"
                      onClick={() => handleRemoveAttribute(index)}
                    >
                      <Icon icon="mingcute:delete-2-line" fontSize="16px" />
                      <span>Remove Variation</span>
                    </button>
                  )}
                </div>

                <div className="row gy-3">
                  {/* Nested Combinations section */}
                  <div className="col-12 mb-2">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <label className="form-label fw-bold mb-0 text-secondary-600">Attributes Combination (e.g. Red + M)</label>
                      {!isView && (
                        <button type="button" className="btn btn-sm btn-primary-600 radius-8 py-2 px-3 d-flex align-items-center gap-2" onClick={() => handleAddCombination(index)} style={{ backgroundColor: "#003366", borderColor: "#003366" }}>
                          <Icon icon="ic:baseline-plus" width="18" />
                          <span>Add Attribute</span>
                        </button>
                      )}
                    </div>

                    <div className="ps-3 border-start border-2 border-primary-100">
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
                          <div key={cIdx} className="row gy-2 mb-3 align-items-end">
                            <div className="col-md-5">
                              <label className="form-label text-xs fw-semibold text-secondary-500">Attribute Name</label>
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
                              <label className="form-label text-xs fw-semibold text-secondary-500">Value</label>
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
                              <div className="col-md-1 mb-2">
                                <button type="button" className="btn btn-icon btn-sm btn-danger text-white rounded-circle" onClick={() => handleRemoveCombination(index, cIdx)} title="Remove Attribute">
                                  <Icon icon="mingcute:delete-2-line" fontSize="14px" />
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
                    <label className="form-label fw-semibold">SKU</label>
                    <input type="text" className="form-control radius-8" value={attr.sku} onChange={(e) => handleAttributeChange(index, "sku", e.target.value)} disabled={isView} placeholder="SKU" />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label fw-semibold">Stock Quantity</label>
                    <input type="number" className="form-control radius-8" value={attr.stock} onChange={(e) => handleAttributeChange(index, "stock", e.target.value)} disabled={isView} placeholder="Stock" />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label fw-semibold">Min Order Qty</label>
                    <input type="number" className="form-control radius-8" value={attr.minOrderQty} onChange={(e) => handleAttributeChange(index, "minOrderQty", e.target.value)} disabled={isView} placeholder="Min Qty" />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label fw-semibold">Max Order Qty</label>
                    <input type="number" className="form-control radius-8" value={attr.maxOrderQty} onChange={(e) => handleAttributeChange(index, "maxOrderQty", e.target.value)} disabled={isView} placeholder="Max Qty" />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label fw-semibold">MRP</label>
                    <input type="number" className="form-control radius-8" value={attr.mrp} onChange={(e) => handleAttributeChange(index, "mrp", e.target.value)} disabled={isView} placeholder="MRP" />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label fw-semibold">Price <span className="text-danger">*</span></label>
                    <input type="number" className="form-control radius-8" value={attr.price} onChange={(e) => handleAttributeChange(index, "price", e.target.value)} disabled={isView} placeholder="Price" />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Images (Optional)</label>
                    {!isView && <input type="file" multiple className="form-control radius-8 mb-2" accept="image/*" onChange={(e) => handleAttributeImageUpload(e, index)} disabled={loading} />}
                    <div className="d-flex flex-wrap gap-2">
                      {attr.images && attr.images.map((img, i) => (
                        <div key={i} className="position-relative w-64-px h-64-px rounded border shadow-sm">
                          <img src={`${IMAGE_BASE_URL}/${img.path || img}`} alt="" className="w-100 h-100 object-fit-cover rounded" />
                          {!isView && <button type="button" className="btn btn-sm btn-icon btn-danger position-absolute top-0 end-0 rounded-circle" style={{ transform: "translate(30%, -30%)", padding: "2px" }} onClick={() => handleRemoveAttributeImage(index, i)}><Icon icon="mingcute:delete-2-line" fontSize="12px" /></button>}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {formData.attributes.length === 0 && <div className="text-secondary-light p-3 text-center border radius-8 bg-light-600">No variations added yet. Click "Add Variation" to create product combinations.</div>}
          </div>
          <div className="mt-4 pt-4 border-top">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h6 className="mb-0">Specifications</h6>
              {!isView && <button type="button" className="btn btn-sm btn-primary-600 radius-8" onClick={handleAddSpecification}><Icon icon="ic:baseline-plus" /> Add Specification</button>}
            </div>
            <div className="row gy-3">
              {formData.specifications.map((spec, index) => (
                <div key={index} className="col-12 d-flex align-items-center gap-3">
                  <div className="flex-grow-1">
                    <input type="text" className="form-control radius-8" value={spec.key} onChange={(e) => handleSpecificationChange(index, "key", e.target.value)} disabled={isView} placeholder="e.g. Style" />
                  </div>
                  <div className="flex-grow-1">
                    <input type="text" className="form-control radius-8" value={spec.value} onChange={(e) => handleSpecificationChange(index, "value", e.target.value)} disabled={isView} placeholder="e.g. Regular Jacket" />
                  </div>
                  {!isView && (
                    <button type="button" className="btn btn-icon btn-outline-danger-600 rounded-circle" onClick={() => handleRemoveSpecification(index)} disabled={formData.specifications.length === 1} title="Remove"><Icon icon="mingcute:delete-2-line" /></button>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="d-flex justify-content-end gap-2 mt-24">
            <Link to="/products" className="btn btn-outline-danger-600 px-32 radius-8 justify-content-center" style={{ width: "120px" }}>Cancel</Link>
            {!isView && hasPermission("Products", id ? "edit" : "add") && (
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

export default ProductFormLayer;
