import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import RolePermissionLayer from "../components/RolePermissionLayer";

const RolePermissionPage = () => {
    return (
        <React.Fragment>
            <MasterLayout>
                <RolePermissionLayer />
            </MasterLayout>
        </React.Fragment>
    );
};

export default RolePermissionPage;
