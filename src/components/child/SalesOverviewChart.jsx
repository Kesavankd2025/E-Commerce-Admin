import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import DashboardApi from "../../Api/DashboardApi";

const SalesOverviewChart = () => {
    const [filter, setFilter] = useState("Day"); // Day, Weekly, Monthly, Yearly
    const [chartData, setChartData] = useState({
        series: [{ name: 'Total Sales', data: [] }],
        categories: []
    });

    useEffect(() => {
        fetchSalesData();
    }, [filter]);

    const fetchSalesData = async () => {
        try {
            const res = await DashboardApi.getSalesOverview(filter);
            if (res.status && res.response.data) {
                processChartData(res.response.data);
            }
        } catch (error) {
            console.error("Error fetching sales overview:", error);
        }
    };

    const processChartData = (data) => {
        let categories = [];
        let salesData = [];

        if (filter === "Day") {
            // Hours 0-23
            categories = Array.from({ length: 24 }, (_, i) => `${i}:00`);
            salesData = new Array(24).fill(0);
            data.forEach(item => {
                const hour = item._id.hour;
                salesData[hour] = item.totalAmount;
            });
        } else if (filter === "Weekly") {
            const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
            categories = days;
            salesData = new Array(7).fill(0);
            data.forEach(item => {
                const dayIdx = item._id.dayOfWeek - 1; // MongoDB dayOfWeek is 1-7 (Sun-Sat)
                salesData[dayIdx] = item.totalAmount;
            });
        } else if (filter === "Monthly") {
            // Current month weeks
            categories = ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"];
            salesData = new Array(5).fill(0);
            // This is indicative, mapping week number to 1-5 relative to month start would be better
            // For now let's just use the raw output grouped by week
            const uniqueWeeks = [...new Set(data.map(d => d._id.week))].sort((a,b) => a-b);
            categories = uniqueWeeks.map((w, i) => `Week ${i + 1}`);
            salesData = new Array(uniqueWeeks.length).fill(0);
            data.forEach(item => {
                const weekIdx = uniqueWeeks.indexOf(item._id.week);
                salesData[weekIdx] = item.totalAmount;
            });
        } else if (filter === "Yearly") {
            const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            categories = months;
            salesData = new Array(12).fill(0);
            data.forEach(item => {
                const monthIdx = item._id.month - 1;
                salesData[monthIdx] = item.totalAmount;
            });
        }

        setChartData({
            series: [{ name: 'Total Sales', data: salesData }],
            categories: categories
        });
    };

    const options = {
        chart: {
            type: 'bar',
            height: 350,
            toolbar: { show: false }
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '40%',
                borderRadius: 4
            },
        },
        dataLabels: { enabled: false },
        stroke: {
            show: true,
            width: 2,
            colors: ['transparent']
        },
        xaxis: {
            categories: chartData.categories,
            title: { text: 'Time Period' }
        },
        yaxis: {
            title: { text: 'Sales Amount (₹)' },
            labels: {
                formatter: (val) => `₹${val.toLocaleString()}`
            }
        },
        fill: {
            opacity: 1,
            colors: ['#003366'] 
        },
        colors: ['#003366'],
        tooltip: {
            y: {
                formatter: (val) => `₹${val.toLocaleString()}`
            }
        }
    };

    return (
        <div className="card radius-12 border-0 shadow-sm mt-4">
            <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center justify-content-between">
                <h6 className="text-lg fw-semibold mb-0">Sales Overview - {filter}</h6>
                <div className="btn-group" role="group">
                    {["Day", "Weekly", "Monthly", "Yearly"].map((f) => (
                        <button
                            key={f}
                            type="button"
                            className={`btn btn-sm ${filter === f ? "btn-primary" : "btn-outline-primary"}`}
                            onClick={() => setFilter(f)}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>
            <div className="card-body p-24">
                <ReactApexChart 
                    options={options} 
                    series={chartData.series} 
                    type="bar" 
                    height={350} 
                />
            </div>
        </div>
    );
};

export default SalesOverviewChart;
