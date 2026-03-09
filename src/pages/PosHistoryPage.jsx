import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import PosHistoryLayer from "../components/PosHistoryLayer";

const PosHistoryPage = () => {
    return (
        <MasterLayout>
            <div className="d-flex align-items-center justify-content-between mb-24">
                <h4 className="mb-0 fw-black text-primary-600 uppercase tracking-wider">POS History</h4>
            </div>
            <PosHistoryLayer />
        </MasterLayout>
    );
};

export default PosHistoryPage;
