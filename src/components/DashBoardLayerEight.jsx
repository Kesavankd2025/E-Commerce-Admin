import React, { useState, useEffect } from "react";
import EcommStats from "./child/EcommStats";
import SalesOverviewChart from "./child/SalesOverviewChart";
import TopSellingProductsTable from "./child/TopSellingProductsTable";
import TopCustomersVendors from "./child/TopCustomersVendors";
import DashboardApi from "../Api/DashboardApi";

const DashBoardLayerEight = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await DashboardApi.getStats();
      if (response.status && response.response.data) {
        setStats(response.response.data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  return (
    <>
      <div className="row gy-4">
        <div className="col-12">
          {/* Top Summary Stats */}
          <EcommStats stats={stats} />

          {/* Sales Overview Chart */}
          <SalesOverviewChart />

          {/* Top Selling Products */}
          <TopSellingProductsTable />

          {/* Top Customers & Vendors */}
          <TopCustomersVendors />
        </div>
      </div>
    </>
  );
};

export default DashBoardLayerEight;
