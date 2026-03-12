import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import ActivityLogsLayer from "../components/ActivityLogsLayer";

const ActivityLogsPage = () => {
    return (
        <React.Fragment>
            <MasterLayout>
                <ActivityLogsLayer />
            </MasterLayout>
        </React.Fragment>
    );
};

export default ActivityLogsPage;
