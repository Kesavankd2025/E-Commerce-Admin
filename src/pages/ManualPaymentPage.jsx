import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
// import Breadcrumb from "../components/Breadcrumb";
import ManualPaymentListLayer from "../components/ManualPaymentListLayer";

const ManualPaymentPage = () => {
  return (
    <>
      <MasterLayout>
        {/* <Breadcrumb title="Manual Payment" /> */}
        <ManualPaymentListLayer />
      </MasterLayout>
    </>
  );
};

export default ManualPaymentPage;
