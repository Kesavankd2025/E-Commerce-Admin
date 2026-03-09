import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
// import Breadcrumb from "../components/Breadcrumb";
import ReturnOrderDetailsLayer from "../components/ReturnOrderDetailsLayer";

const ReturnOrderDetailsPage = () => {
    return (
        <MasterLayout>
            {/* <Breadcrumb title="Return Details" /> */}
            <ReturnOrderDetailsLayer />
        </MasterLayout>
    );
};

export default ReturnOrderDetailsPage;
