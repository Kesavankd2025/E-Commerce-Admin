import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
// import Breadcrumb from "../components/Breadcrumb";
import InventoryListLayer from "../components/InventoryListLayer";

const InventoryListPage = () => {
  return (
    <>
      <MasterLayout>
        {/* <Breadcrumb title="Inventory List" /> */}
        <InventoryListLayer />
      </MasterLayout>
    </>
  );
};

export default InventoryListPage;
