import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
// import Breadcrumb from "../components/Breadcrumb";
import CancelledOrderListLayer from "../components/CancelledOrderListLayer";

const CancelledOrderListPage = () => {
    return (
        <MasterLayout>
            {/* <Breadcrumb title="Cancelled Orders" /> */}
            <CancelledOrderListLayer />
        </MasterLayout>
    );
};

export default CancelledOrderListPage;
