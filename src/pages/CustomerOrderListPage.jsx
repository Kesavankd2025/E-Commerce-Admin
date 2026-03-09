import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import CustomerOrderListLayer from "../components/CustomerOrderListLayer";

const CustomerOrderListPage = () => {
    return (
        <MasterLayout>
            <CustomerOrderListLayer />
        </MasterLayout>
    );
};

export default CustomerOrderListPage;
