import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import PurchaseListLayer from "../components/PurchaseListLayer";

const PurchaseListPage = () => {
    return (
        <MasterLayout>
            <div className="d-flex align-items-center justify-content-between mb-24">
                <h4 className="mb-0 fw-black text-primary-600 uppercase tracking-wider">Purchase Entry</h4>
            </div>
            <PurchaseListLayer />
        </MasterLayout>
    );
};

export default PurchaseListPage;
