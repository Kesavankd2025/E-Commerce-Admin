import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import PurchaseFormLayer from "../components/PurchaseFormLayer";

const AddPurchasePage = () => {
    return (
        <MasterLayout>
            <div className="mb-24">
                <h4 className="mb-8 fw-black text-primary-600 uppercase tracking-wider">New Purchase Entry</h4>
                <p className="text-secondary-light">Create a manual stock purchase from a vendor.</p>
            </div>
            <PurchaseFormLayer />
        </MasterLayout>
    );
};

export default AddPurchasePage;
