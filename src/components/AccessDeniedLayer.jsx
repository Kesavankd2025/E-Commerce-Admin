import React from "react";
import { Link } from "react-router-dom";

const AccessDeniedLayer = () => {
  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-white">
      <div className="text-center">
        <Link to="/">
          <img
            src="assets/images/logo.png"
            alt="CNI Forum"
            style={{ maxWidth: "200px", height: "auto" }}
          />
        </Link>
        <h5 className="mt-4 text-secondary-light">Access Denied</h5>
      </div>
    </div>
  );
};

export default AccessDeniedLayer;
