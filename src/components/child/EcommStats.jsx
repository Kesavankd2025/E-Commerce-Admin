import React from "react";
import { Icon } from "@iconify/react";

const EcommStats = ({ stats }) => {
  const statItems = [
    {
      label: "Total Orders",
      value: stats.totalOrders || 0,
      icon: "solar:cart-large-minimalistic-outline",
      color: "#003366",
      bg: "#e6f0ff"
    },
    {
      label: "Total Products",
      value: stats.totalProducts || 0,
      icon: "solar:box-outline",
      color: "#28a745",
      bg: "#eafaf1"
    },
    {
      label: "Total Customers",
      value: stats.totalCustomers || 0,
      icon: "solar:users-group-two-rounded-outline",
      color: "#fd7e14",
      bg: "#fff5eb"
    },
    {
      label: "Total Revenue",
      value: `₹${(stats.totalRevenue || 0).toLocaleString("en-IN")}`,
      icon: "solar:wad-of-money-outline",
      color: "#dc3545",
      bg: "#fdf2f2"
    }
  ];

  return (
    <div className="row gy-4 mb-4">
      {statItems.map((item, index) => (
        <div className="col-xxl-3 col-sm-6" key={index}>
          <div className="card h-100 p-0 radius-12 border-0 shadow-sm">
            <div className="card-body p-24">
              <div className="d-flex align-items-center justify-content-between gap-3">
                <div>
                  <span className="fw-medium text-secondary-light text-sm mb-12 d-block">
                    {item.label}
                  </span>
                  <h4 className="fw-bold mb-0">{item.value}</h4>
                </div>
                <div 
                  className="w-56-px h-56-px d-flex justify-content-center align-items-center radius-12"
                  style={{ backgroundColor: item.bg, color: item.color }}
                >
                  <Icon icon={item.icon} width="28" />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EcommStats;
