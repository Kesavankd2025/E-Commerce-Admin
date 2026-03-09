import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
// import Breadcrumb from "../components/Breadcrumb";
import CustomerListLayer from "../components/CustomerListLayer";

const CustomerListPage = () => {
    return (
        <MasterLayout>
            {/* <Breadcrumb title="Customer List" /> */}
            <CustomerListLayer />
        </MasterLayout>
    );
};

export default CustomerListPage;
