import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
// import Breadcrumb from "../components/Breadcrumb";
import OrderFeedbackListLayer from "../components/OrderFeedbackListLayer";

const OrderFeedbackListPage = () => {
    return (
        <MasterLayout>
            {/* <Breadcrumb title="Order Feedback" /> */}
            <OrderFeedbackListLayer />
        </MasterLayout>
    );
};

export default OrderFeedbackListPage;
