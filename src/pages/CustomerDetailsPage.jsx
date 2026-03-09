import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
// import Breadcrumb from "../components/Breadcrumb";
import CustomerDetailsLayer from "../components/CustomerDetailsLayer";

const CustomerDetailsPage = () => {
    return (
        <MasterLayout>
            {/* <Breadcrumb title="Customer Details" /> */}
            <CustomerDetailsLayer />
        </MasterLayout>
    );
};

export default CustomerDetailsPage;
