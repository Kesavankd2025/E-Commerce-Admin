import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import PurchaseViewLayer from "../components/PurchaseViewLayer";

const ViewPurchasePage = () => {
    return (
        <MasterLayout>
            <div className="mb-24">
                <h4 className="mb-8 fw-black text-primary-600 uppercase tracking-wider">Purchase Order Detail</h4>
                <p className="text-secondary-light">Verify and receive products to inventory stock.</p>
            </div>
            <PurchaseViewLayer />
        </MasterLayout>
    );
};

export default ViewPurchasePage;
