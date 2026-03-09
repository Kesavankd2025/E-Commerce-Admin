import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import OrderFeedbackApi from "../Api/OrderFeedbackApi";
import { formatDate } from "../helper/DateHelper";
import TablePagination from "./TablePagination";

const OrderFeedbackListLayer = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);

    const fetchReviews = async () => {
        setLoading(true);
        try {
            const res = await OrderFeedbackApi.listReviews(currentPage, rowsPerPage);
            if (res.status && res.response) {
                setReviews(res.response.data || []);
                setTotalRecords(res.response.total || 0);
            }
        } catch (error) {
            console.error("Error fetching reviews:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusToggle = async (review) => {
        const newStatus = review.status === 1 ? 0 : 1;
        const res = await OrderFeedbackApi.updateReviewStatus(review.id || review._id, newStatus);
        if (res.status) {
            fetchReviews();
        }
    };

    useEffect(() => {
        fetchReviews();
    }, [currentPage, rowsPerPage]);

    const renderStars = (rating) => {
        return (
            <div className="d-flex align-items-center gap-1 text-warning-main">
                {[...Array(5)].map((_, i) => (
                    <Icon
                        key={i}
                        icon={i < rating ? "solar:star-bold" : "solar:star-outline"}
                        className="text-lg"
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="card h-100 p-0 radius-12 overflow-hidden shadow-sm border-0">
            <div className="card-header border-bottom bg-base py-20 px-24 d-flex align-items-center justify-content-between">
                <h6 className="text-lg fw-bold mb-0 text-primary-600 d-flex align-items-center gap-2">
                    <Icon icon="solar:chat-round-like-bold-duotone" className="text-2xl" />
                    Customer Feedbacks
                </h6>
            </div>
            <div className="card-body p-24">
                <div className="table-responsive">
                    <table className="table bordered-table sm-table mb-0">
                        <thead>
                            <tr className="bg-neutral-50 text-uppercase">
                                <th scope="col" className="text-center py-16" style={{ width: '80px' }}>S.No</th>
                                <th scope="col" className="py-16">Date</th>
                                <th scope="col" className="py-16">Customer</th>
                                <th scope="col" className="py-16">Product</th>
                                <th scope="col" className="py-16">Rating</th>
                                <th scope="col" className="py-16">Comment</th>
                                <th scope="col" className="text-center py-16">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-100">
                                        <div className="spinner-border text-primary-600" role="status"></div>
                                    </td>
                                </tr>
                            ) : reviews.length > 0 ? (
                                reviews.map((review, index) => (
                                    <tr key={review.id || review._id}>
                                        <td className="text-center text-sm fw-medium text-secondary-light">
                                            {currentPage * rowsPerPage + index + 1}
                                        </td>
                                        <td>
                                            <span className="text-sm text-secondary-light fw-medium">{formatDate(review.createdAt)}</span>
                                        </td>
                                        <td>
                                            <div className="d-flex flex-column">
                                                <span className="text-sm fw-bold text-secondary-light">{review.customerName}</span>
                                            </div>
                                        </td>
                                        <td style={{ maxWidth: '200px' }}>
                                            <span className="text-sm fw-bold text-secondary-light text-truncate d-block">{review.productName}</span>
                                            {review.combination && review.combination.length > 0 && (
                                                <div className="d-flex flex-wrap gap-1 mt-1">
                                                    {review.combination.map((c, i) => (
                                                        <span key={i} className="text-xxxxs badge bg-neutral-100 text-secondary-light border border-neutral-200">
                                                            {c.value}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </td>
                                        <td>
                                            {renderStars(review.rating)}
                                        </td>
                                        <td style={{ maxWidth: '300px' }}>
                                            <p className="text-xs text-secondary-light mb-0 italic line-height-1.5 overflow-hidden text-truncate-2">
                                                "{review.comment}"
                                            </p>
                                        </td>
                                        <td className="text-center">
                                            <div className="d-flex flex-column align-items-center gap-2">
                                                <div className="form-check form-switch d-inline-block p-0">
                                                    <input
                                                        className="form-check-input cursor-pointer"
                                                        type="checkbox"
                                                        role="switch"
                                                        checked={review.status === 1}
                                                        onChange={() => handleStatusToggle(review)}
                                                        style={{ width: '40px', height: '20px' }}
                                                    />
                                                </div>
                                                <span className={`badge px-8 py-2 radius-4 fw-black text-xxxxs uppercase ${review.status === 1 ? "bg-success-focus text-success-main" : "bg-neutral-200 text-secondary-light"}`}>
                                                    {review.status === 1 ? "Approved" : "Pending"}
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="text-center py-100 italic text-secondary-400">
                                        No feedbacks received yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {!loading && totalRecords > 0 && (
                    <div className="mt-24 px-24 pb-12">
                        <TablePagination
                            currentPage={currentPage}
                            totalPages={Math.ceil(totalRecords / rowsPerPage)}
                            onPageChange={setCurrentPage}
                            rowsPerPage={rowsPerPage}
                            onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value)); setCurrentPage(0); }}
                            totalRecords={totalRecords}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderFeedbackListLayer;
