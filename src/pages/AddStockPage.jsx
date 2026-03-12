import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
// import Breadcrumb from "../components/Breadcrumb";
import AddStockLayer from "../components/AddStockLayer";

const AddStockPage = () => {
    return (
        <>
            <MasterLayout>
                {/* <Breadcrumb title="Add Stock" /> */}
                <AddStockLayer />
            </MasterLayout>
        </>
    );
};

export default AddStockPage;
