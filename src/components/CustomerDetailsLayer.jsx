import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Icon } from "@iconify/react/dist/iconify.js";
import CustomerApi from "../Api/CustomerApi";
import { formatDate } from "../helper/DateHelper";

const CustomerDetailsLayer = () => {
    const { id } = useParams();
    const [customer, setCustomer] = useState(null);
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchDetails = async () => {
        setLoading(true);
        try {
            const res = await CustomerApi.getCustomerDetails(id);
            if (res.status && res.response) {
                setCustomer(res.response.data.customer);
                setAddresses(res.response.data.addresses || []);
            }
        } catch (error) {
            console.error("Error fetching details:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDetails();
    }, [id]);

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center py-100">
            <div className="spinner-border text-primary-600" role="status"></div>
        </div>
    );

    if (!customer) return <div className="text-center py-100 italic text-secondary-400">Customer not found.</div>;

    return (
        <div className="row g-4 pb-40">
            <div className="col-xl-4 no-print">
                <div className="card h-100 border-0 shadow-sm radius-12 p-32">
                    <div className="d-flex flex-column align-items-center mb-40 text-center">
                        <div className="w-120-px h-120-px rounded-circle bg-primary-100 text-primary-600 d-flex align-items-center justify-content-center fw-black text-4xl mb-24 shadow-sm border border-white">
                            {customer.fullName?.charAt(0).toUpperCase()}
                        </div>
                        <h4 className="fw-black text-primary-600 mb-4">{customer.fullName}</h4>
                        <span className="badge px-12 py-6 radius-8 bg-primary-focus text-primary-main fw-black text-xs uppercase">
                            Customer Profile
                        </span>
                    </div>

                    <div className="d-flex flex-column gap-4 v-divider">
                        <div>
                            <p className="text-xxxxs text-secondary-400 mb-4 fw-black uppercase">Email Address</p>
                            <h6 className="text-sm fw-bold text-secondary-light mb-0 d-flex align-items-center gap-2">
                                <Icon icon="solar:letter-bold" className="text-primary-400" />
                                {customer.email || "Not Provided"}
                            </h6>
                        </div>
                        <div className="dashed-divider my-10"></div>
                        <div>
                            <p className="text-xxxxs text-secondary-400 mb-4 fw-black uppercase">Mobile Number</p>
                            <h6 className="text-sm fw-bold text-secondary-light mb-0 d-flex align-items-center gap-2">
                                <Icon icon="solar:phone-bold" className="text-primary-400" />
                                {customer.phoneNumber}
                            </h6>
                        </div>
                        <div className="dashed-divider my-10"></div>
                        <div>
                            <p className="text-xxxxs text-secondary-400 mb-4 fw-black uppercase">Registered Date</p>
                            <h6 className="text-sm fw-bold text-secondary-light mb-0 d-flex align-items-center gap-2">
                                <Icon icon="solar:calendar-bold" className="text-primary-400" />
                                {formatDate(customer.createdAt)}
                            </h6>
                        </div>
                        <div className="dashed-divider my-10"></div>
                        <div>
                            <p className="text-xxxxs text-secondary-400 mb-4 fw-black uppercase">Account Status</p>
                            <span className={`badge px-12 py-4 radius-4 fw-black text-xs d-inline-flex align-items-center gap-2 ${customer.isActive ? "bg-success-focus text-success-main" : "bg-danger-focus text-danger-main"}`}>
                                <Icon icon={customer.isActive ? "solar:check-circle-bold" : "solar:close-circle-bold"} />
                                {customer.isActive ? "Active" : "Inactive"}
                            </span>
                        </div>
                    </div>

                    <div className="mt-40">
                        <Link to="/customer-list" className="btn btn-outline-primary-600 radius-8 h-48-px w-100 fw-bold d-flex align-items-center justify-content-center gap-2">
                            <Icon icon="solar:arrow-left-bold" />
                            Back to Customers
                        </Link>
                    </div>
                </div>
            </div>

            <div className="col-xl-8">
                <div className="card h-100 border-0 shadow-sm radius-12 p-32">
                    <div className="d-flex align-items-center justify-content-between mb-32 border-bottom pb-20">
                        <h5 className="mb-0 fw-black text-primary-600 d-flex align-items-center gap-2">
                            <Icon icon="solar:map-point-bold-duotone" className="text-2xl" />
                            Stored Addresses ({addresses.length})
                        </h5>
                    </div>

                    <div className="row g-3">
                        {addresses.length > 0 ? (
                            addresses.map((addr, idx) => (
                                <div className="col-md-6" key={addr.id || addr._id}>
                                    <div className={`p-24 radius-12 border h-100 position-relative transition-all hover-shadow-md ${addr.isDefault ? "bg-primary-50 border-primary-100" : "bg-neutral-50 border-neutral-100"}`}>
                                        <div className="d-flex align-items-start justify-content-between mb-16">
                                            <div>
                                                <span className={`badge px-12 py-6 radius-8 fw-black text-xxxxs uppercase mb-8 d-inline-block ${addr.label === "Home" ? "bg-info-focus text-info-main" : addr.label === "Work" ? "bg-success-focus text-success-main" : "bg-warning-focus text-warning-main"}`}>
                                                    <Icon icon={addr.label === "Home" ? "solar:home-bold" : addr.label === "Work" ? "solar:buildings-bold" : "solar:reorder-bold"} className="me-1" />
                                                    {addr.label}
                                                </span>
                                                {addr.isDefault && (
                                                    <span className="ms-2 badge px-12 py-6 radius-8 bg-primary-600 text-white fw-black text-xxxxs uppercase">
                                                        Default
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <h6 className="text-md fw-black text-secondary-light mb-8">{addr.name}</h6>
                                        <p className="text-xs text-secondary-light fw-bold mb-16 d-flex align-items-center gap-2">
                                            <Icon icon="solar:phone-bold" className="text-primary-400" />
                                            {addr.phone}
                                        </p>

                                        <div className="p-16 radius-8 bg-white border border-neutral-100 shadow-xs">
                                            <p className="text-xs text-secondary-light mb-0 fw-medium line-height-1.8">
                                                {addr.doorNo}, {addr.street}<br />
                                                {addr.city}, {addr.state}<br />
                                                <span className="text-primary-600 fw-black">PIN: {addr.pincode}</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-12">
                                <div className="p-100 text-center radius-12 bg-neutral-50 border border-neutral-100">
                                    <Icon icon="solar:map-point-remove-bold-duotone" className="text-64 text-neutral-300 mb-16" />
                                    <h6 className="text-secondary-400 italic mb-0">No addresses stored for this customer.</h6>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerDetailsLayer;
