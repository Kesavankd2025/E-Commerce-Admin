import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import UserListLayer from "../components/UserListLayer";

const UserListPage = () => {
    return (
        <React.Fragment>
            <MasterLayout>
                <UserListLayer />
            </MasterLayout>
        </React.Fragment>
    );
};

export default UserListPage;
