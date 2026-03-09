import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import PosOrderLayer from "../components/PosOrderLayer";

const PosOrderPage = () => {
    return (
        <MasterLayout>
            <div className="d-flex align-items-center justify-content-between mb-24">
                <h4 className="mb-0 fw-black text-primary-600 uppercase tracking-wider">POS Terminal</h4>
            </div>
            <PosOrderLayer />
        </MasterLayout>
    );
};

export default PosOrderPage;
