import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
// import Breadcrumb from "../components/Breadcrumb";
import ReturnOrderListLayer from "../components/ReturnOrderListLayer";

const ReturnOrderListPage = () => {
    return (
        <MasterLayout>
            {/* <Breadcrumb title="Return Orders" /> */}
            <ReturnOrderListLayer />
        </MasterLayout>
    );
};

export default ReturnOrderListPage;
