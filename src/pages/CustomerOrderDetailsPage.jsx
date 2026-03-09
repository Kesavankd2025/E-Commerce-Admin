import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import CustomerOrderDetailsLayer from "../components/CustomerOrderDetailsLayer";

const CustomerOrderDetailsPage = () => {
    return (
        <MasterLayout>
            <CustomerOrderDetailsLayer />
        </MasterLayout>
    );
};

export default CustomerOrderDetailsPage;
