import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Link, useParams } from "react-router-dom";
import ReactApexChart from "react-apexcharts";
import ChapterApi from "../Api/ChapterApi";
import MemberApi from "../Api/MemberApi";
import { IMAGE_BASE_URL } from "../Config/Index";

const ChapterViewLayer = () => {
  const { id } = useParams();
  const [chapter, setChapter] = useState(null);
  const [edRdTeam, setEdRdTeam] = useState([]);
  const [coreTeam, setCoreTeam] = useState([]);
  const [revenueData, setRevenueData] = useState({
    totalRevenue: 0,
    monthly: [],
  });
  const [chapterStats, setChapterStats] = useState({
    powerDates: 0,
    referrals: 0,
    visitors: 0,
    oneToOnes: 0,
    thankYouSlips: 0,
    businessGiven: 0,
  });
  const [top1to1Members, setTop1to1Members] = useState({
    total: 0,
    topMembers: [],
  });
  const [topThankYouMembers, setTopThankYouMembers] = useState({
    total: 0,
    topMembers: [],
  });
  const [topReferralMembers, setTopReferralMembers] = useState({
    total: 0,
    topMembers: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isBackHovered, setIsBackHovered] = useState(false);

  useEffect(() => {
    fetchChapterDetails();
    fetchTeamMembers();
    fetchChapterRevenue();
    fetchChapterStats();
    fetchTop1to1Members();
    fetchTopThankYouMembers();
    fetchTopReferralMembers();
  }, [id]);

  const fetchChapterRevenue = async () => {
    const params = {
      chapterId: id,
    };
    try {
      const res = await ChapterApi.getChapterRevenue(params);
      if (res.status) {
        setRevenueData(res.response.data || { totalRevenue: 0, monthly: [] });
      }
    } catch (error) {
      console.error("Error fetching chapter revenue:", error);
    }
  };

  const fetchChapterStats = async () => {
    try {
      const res = await ChapterApi.getChapterStats(id);
      if (res.status) {
        setChapterStats(
          res.response.data || {
            powerDates: 0,
            referrals: 0,
            visitors: 0,
            oneToOnes: 0,
            thankYouSlips: 0,
            businessGiven: 0,
          },
        );
      }
    } catch (error) {
      console.error("Error fetching chapter stats:", error);
    }
  };

  const fetchTop1to1Members = async () => {
    try {
      const res = await ChapterApi.getTop1to1Members(id);
      if (res.status) {
        setTop1to1Members(res.response.data || { total: 0, topMembers: [] });
      }
    } catch (error) {
      console.error("Error fetching top 1-2-1 members:", error);
    }
  };

  const fetchTopThankYouMembers = async () => {
    try {
      const res = await ChapterApi.getTopThankYouMembers(id);
      if (res.status) {
        setTopThankYouMembers(
          res.response.data || { total: 0, topMembers: [] },
        );
      }
    } catch (error) {
      console.error("Error fetching top thank you members:", error);
    }
  };

  const fetchTopReferralMembers = async () => {
    try {
      const res = await ChapterApi.getTopReferralMembers(id);
      if (res.status) {
        setTopReferralMembers(
          res.response.data || { total: 0, topMembers: [] },
        );
      }
    } catch (error) {
      console.error("Error fetching top referral members:", error);
    }
  };

  const fetchChapterDetails = async () => {
    try {
      const res = await ChapterApi.getChapter({ id });
      if (res.status) {
        setChapter(res.response.data);
      }
    } catch (error) {
      console.error("Error fetching chapter details:", error);
    }
  };

  const fetchTeamMembers = async () => {
    try {
      // Fetch Regional & ED Team using specific API
      const coreRes = await ChapterApi.getChapterEdRdMembers(id);
      console.log(coreRes, "wwwwwwwww");

      if (coreRes.status) {
        const coreMembers = coreRes.response.data || [];
        setCoreTeam(
          coreMembers.map((item) => {
            const imgPath = item.member?.profileImage?.path || item.profileImage?.path;
            return {
              name: item.member?.fullName || item.fullName || "Unknown",
              role: item.roleName || item.role?.name || "No Role",
              image: imgPath ? `${IMAGE_BASE_URL}/${imgPath}` : null,
              phone: item.member?.phoneNumber || item.phoneNumber,
              email: item.member?.email || item.email,
            };
          }),
        );
      }

      // Fetch other team members (ED/RD etc)
      const rolesRes = await ChapterApi.getChapterRoles(id);
      if (rolesRes.status) {
        const roles = rolesRes.response.data || [];
        const allRoles = roles.map((item) => {
          const imgPath = item.member?.profileImage?.path || item.profileImage?.path;
          return {
            name: item.member?.fullName || item.memberName || item.fullName || "Unknown",
            role: item.roleName || "No Role",
            image: imgPath ? `${IMAGE_BASE_URL}/${imgPath}` : null,
            phone: item.member?.phoneNumber || item.phoneNumber,
            email: item.member?.email || item.email,
          };
        });

        // Filter out core titles from the regional team list

        setEdRdTeam(allRoles.filter((r) => r.role));
      }
    } catch (error) {
      console.error("Error fetching team members:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const stats = [
    {
      label: "Power Meet",
      value: chapterStats.powerDates?.toLocaleString("en-IN") || "0",
      icon: "mdi:calendar-range",
      color: "bg-primary-50 text-primary-600",
    },
    {
      label: "Referral's",
      value: chapterStats.referrals?.toLocaleString("en-IN") || "0",
      icon: "mdi:handshake",
      color: "bg-success-50 text-success-600",
    },
    {
      label: "Visitor's",
      value: chapterStats.visitors?.toLocaleString("en-IN") || "0",
      icon: "mdi:account-eye",
      color: "bg-warning-50 text-warning-600",
    },
    {
      label: "121's",
      value: chapterStats.oneToOnes?.toLocaleString("en-IN") || "0",
      icon: "mdi:account-convert",
      color: "bg-info-50 text-info-600",
    },
    {
      label: "Thank You Slips",
      value: chapterStats.thankYouSlips?.toLocaleString("en-IN") || "0",
      icon: "mdi:script-text-outline",
      color: "bg-danger-50 text-danger-600",
    },
    {
      label: "Business Given",
      value: formatCurrency(chapterStats.businessGiven),
      icon: "mdi:currency-inr",
      color: "bg-purple-50 text-purple-600",
    },
  ];

  if (isLoading)
    return <div className="p-24 text-center">Loading Chapter Details...</div>;
  if (!chapter)
    return <div className="p-24 text-center">Chapter not found</div>;

  return (
    <div className="d-flex flex-column gap-24">
      <div className="d-flex align-items-center justify-content-end mb-4">
        <Link
          to="/chapter-creation"
          onMouseEnter={() => setIsBackHovered(true)}
          onMouseLeave={() => setIsBackHovered(false)}
          className="btn d-inline-flex align-items-center gap-2 px-16 py-8 radius-8 fontsize-10 fw-bold transition-all shadow-sm"
          style={{
            backgroundColor: isBackHovered ? "#64748B" : "#F3F4F6",
            color: isBackHovered ? "#FFFFFF" : "#64748B",
            border: `1px solid ${isBackHovered ? "#64748B" : "#CBD5E1"}`
          }}
        >
          <Icon icon="solar:alt-arrow-left-linear" className="fontsize-14" />
          Back List
        </Link>
      </div>
      {/* Header Section */}
      <div className="card p-20 bg-base radius-12 shadow-sm border-0 position-relative">
        <div className="row align-items-start gy-3">
          {/* Chapter Info - Left Column */}
          <div className="col-md-3 text-start" style={{ flex: "0 0 auto", width: window.innerWidth >= 768 ? "24%" : "100%" }}>
            <h5 className="fw-semibold mb-1 text-primary-600 line-height-1 fontsize-14">
              {chapter.chapterName}
            </h5>
            <p className="text-secondary-light text-xs mb-1">
              Meeting is only on invite
            </p>
            <p className="text-secondary-light text-xs mb-2 text-capitalize">
              {chapter.weekday} 09:30 PM
            </p>
            <span className="badge bg-neutral-100 text-neutral-600 px-2 py-1 radius-4 text-capitalize text-xs">
              {chapter.meetingType}
            </span>
          </div>

          {/* Meeting Location - Second Column */}
          {/* Meeting Venue Column */}
          <div className="col-lg-3 border-end border-neutral-100 bg-white bg-opacity-50">
            <div className="d-flex flex-column gap-16">

              <p className="mb-0 fw-semibold text-secondary-light text-uppercase fontsize-7 tracking-wider">Meeting Venue</p>

              <div className="d-flex align-items-start gap-10 mt-8">
                <div className="bg-primary-50 text-primary-600 p-2 radius-8 d-flex align-items-center justify-content-center flex-shrink-0">
                  <Icon icon="solar:map-point-bold-duotone" className="text-xl" />
                </div>
                <div className="d-flex flex-column">
                  <span className="fontsize-12 fw-bold text-primary-light line-height-1 mb-4">
                    {chapter.location}
                  </span>
                  <span className="fontsize-10 text-secondary-light fw-medium line-height-1.4">
                    {chapter.state}, {chapter.country}
                  </span>
                </div>
              </div>

            </div>
          </div>

          {/* Chapter Badge - Third Column */}
          <div className="col-md-3 text-center border-start-md px-md-2" style={{ flex: "0 0 auto", width: window.innerWidth >= 768 ? "24%" : "100%" }}>
            <p className="mb-0 fw-semibold text-secondary-light text-uppercase fontsize-7 tracking-wider">
              {chapter?.badges?.[0]?.badgeName || "No Chapter Badge"}
            </p>
            <div className="w-56-px h-56-px radius-8 bg-primary-50 d-flex justify-content-center align-items-center flex-shrink-0 border border-primary-100 overflow-hidden mx-auto mb-1">
              {chapter?.badges?.[0]?.badgeImage?.path ? (
                <img
                  src={`${IMAGE_BASE_URL}/${chapter.badges[0].badgeImage.path}`}
                  alt="Badge"
                  className="w-100 h-100 object-fit-contain"
                />
              ) : "Empty"}
            </div>

          </div>

          {/* Member Count - Fourth Column */}
          <div className="col-md-3 text-center border-start-md ps-md-2 pe-md-3" style={{ flex: "0 0 auto", width: window.innerWidth >= 768 ? "24%" : "100%" }}>
            <p className="mb-1 fw-semibold text-secondary-light text-uppercase fontsize-7 tracking-wider">
              Member Count
            </p>
            <div className="d-flex flex-column align-items-center mt-1">
              <h4 className="mb-0 text-primary-600 fw-semibold fontsize-16">
                {chapter.totalMembers || 0}
              </h4>
              <span className="text-primary-600 text-xs fw-medium cursor-pointer mt-1 hover-underline">
                Show Members
              </span>
            </div>
          </div>
        </div>

        {/* Back Button - Top Right */}

      </div>

      {/* Stats Row */}
      <div className="row gy-3">
        {stats.map((stat, index) => (
          <div key={index} className="col-xxl-2 col-md-4 col-sm-6">
            {/* <div className={`card p-16 radius-12 border-0 shadow-sm d-flex align-items-center gap-3 ${stat.color.split(' ')[0]} bg-opacity-10`}>
                            <div className={`w-40-px h-40-px rounded-circle d-flex justify-content-center align-items-center ${stat.color}`}>
                                <Icon icon={stat.icon} className="text-2xl" />
                            </div>
                            <div>
                                <h6 className="mb-0 fw-bold">{stat.value}</h6>
                                <span className="text-secondary-light text-sm">{stat.label}</span>
                            </div>
                        </div> */}
            <div className="col">
              <div
                className={`card h-100 py-1 shadow-hover-xl transition-2 radius-20  ${stat.color.split(" ")[0]}`}
                style={{
                  borderRight: `3px solid #003366`,
                  paddingLeft: `10px`,
                }}
              >
                <div className="card-body p-0">
                  <div className="gap-2">
                    <div className="flex-grow-1">
                      <span className="fw-medium text-secondary-light text-sm mb-1 d-block text-uppercase spacing-1">
                        {stat.label}
                      </span>
                    </div>
                    <div className="d-flex align-items-center justify-content-between gap-2">
                      <h6 className="fw-bolder text-1xl mb-0">{stat.value}</h6>
                      <span
                        className={`w-48-px h-48-px d-flex justify-content-center align-items-center text-1xl`}
                      >
                        <div
                          className={`w-40-px h-40-px rounded-circle d-flex justify-content-center align-items-center ${stat.color}`}
                        >
                          <Icon icon={stat.icon} className="text-2xl" />
                        </div>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Regional & ED Leadership */}
      <div className="d-flex flex-column gap-3">
        <h6 className="mb-0 fw-bold text-primary-600">ED & RD Team</h6>
        <div className="row g-4">
          {coreTeam.length > 0 ? (
            coreTeam.map((leader, index) => (
              <div key={index} className="col-xl-3 col-lg-4 col-sm-6">
                <LeadershipCard leader={leader} />
              </div>
            ))
          ) : (
            <div className="col-12 text-center py-4 bg-neutral-50 radius-8">
              <span className="text-secondary-light font-bold">
                No data found
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Chapter Core Leadership */}
      <div className="d-flex flex-column gap-3">
        <h6 className="mb-0 fw-bold text-primary-600">
          Chapter Core Leadership
        </h6>
        <div className="row g-4">
          {edRdTeam.length > 0 ? (
            edRdTeam.map((leader, index) => (
              <div key={index} className="col-xl-3 col-lg-4 col-sm-6">
                <LeadershipCard leader={leader} />
              </div>
            ))
          ) : (
            <div className="col-12 text-center py-4 bg-neutral-50 radius-8">
              <span className="text-secondary-light font-bold">
                No data found
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Business Achieved Section */}
      <div className="card h-100 p-0 radius-12 shadow-sm border-0 overflow-hidden">
        <div className="card-header bg-transparent border-bottom px-24 py-16 d-flex align-items-center justify-content-between">
          <h6 className="mb-0 fw-bold text-primary-600">Business Achieved</h6>
          <span className="text-sm text-secondary-light">
            Last updated: {new Date().toLocaleDateString()}
          </span>
        </div>
        <div className="card-body p-24">
          <div className="row g-4">
            <div className="col-lg-4">
              <div className="h-100 d-flex flex-column align-items-center justify-content-center p-24 bg-primary-50 radius-12 border border-primary-100 text-center">
                <h2 className="display-5 fw-bold text-primary-600 mb-1">
                  {formatCurrency(revenueData.totalRevenue)}
                </h2>
                <span className="text-secondary-light fw-medium">
                  Total Revenue Generated
                </span>
              </div>
            </div>
            <div className="col-lg-8">
              <BusinessChart data={revenueData.monthly} />
            </div>
          </div>
        </div>
      </div>

      <div className="d-flex flex-column gap-3">
        <h6 className="mb-0 fw-bold text-primary-600">Top Achievers</h6>
        <div className="row g-4">

          <TopAchieverCard
            title="Top 121's"
            total={top1to1Members.total}
            icon="mdi:account-multiple-check"
            data={top1to1Members.topMembers.map((m) => ({
              name: m.fullName,
              count: m.count,
              image: m.profileImage?.path
                ? `${IMAGE_BASE_URL}/${m.profileImage.path}`
                : null,
            }))}
          />
          <TopAchieverCard
            title="Top Referrals"
            total={topReferralMembers.total}
            icon="mdi:handshake"
            data={topReferralMembers.topMembers.map((m) => ({
              name: m.fullName,
              count: m.count,
              image: m.profileImage?.path
                ? `${IMAGE_BASE_URL}/${m.profileImage.path}`
                : null,
            }))}
          />
          <TopAchieverCard
            title="Top Thank You Notes"
            total={topThankYouMembers.total}
            icon="mdi:note-text"
            data={topThankYouMembers.topMembers.map((m) => ({
              name: m.fullName,
              count: m.count,
              image: m.profileImage?.path
                ? `${IMAGE_BASE_URL}/${m.profileImage.path}`
                : null,
            }))}
          />
        </div>
      </div>
    </div>
  );
};

export default ChapterViewLayer;

const BusinessChart = ({ data = [] }) => {
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Prepare data for the chart
  // We want to show all 12 months, even if data is missing for some.
  // Assuming the current year or most recent data.
  const chartData = monthNames.map((month, index) => {
    const monthData = data.find((d) => d.month === index + 1);
    return monthData ? monthData.amount : 0;
  });

  const options = {
    chart: {
      height: 300,
      type: "area",
      toolbar: { show: false },
      zoom: { enabled: false },
      fontFamily: "Inter, sans-serif",
    },
    dataLabels: { enabled: false },
    stroke: { curve: "smooth", width: 3, colors: ["#003366"] },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.3,
        opacityTo: 0.05,
        stops: [0, 90, 100],
      },
    },
    grid: {
      borderColor: "#f1f1f1",
      strokeDashArray: 3,
      padding: {
        left: 0,
      },
    },
    colors: ["#003366"],
    xaxis: {
      categories: monthNames,
      offsetX: 10,
      labels: {
        style: { colors: "#6B7280", fontSize: "12px" },
        offsetY: 0,
      },
    },
    yaxis: {
      min: 0,
      offsetY: 10,
      labels: {
        formatter: (value) => {
          if (value >= 10000000) return (value / 10000000).toFixed(1) + "Cr";
          if (value >= 1000000) return (value / 1000000).toFixed(1) + "M";
          if (value >= 100000) return (value / 100000).toFixed(1) + "L";
          if (value >= 1000) return (value / 1000).toFixed(1) + "K";
          return value;
        },
        style: { colors: "#6B7280", fontSize: "12px" },
        offsetX: 0,
        minWidth: 60,
      },
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return "₹ " + val.toLocaleString("en-IN");
        },
      },
    },
  };

  const series = [
    {
      name: "Revenue",
      data: chartData,
    },
  ];

  return (
    <ReactApexChart
      options={options}
      series={series}
      type="area"
      height={280}
    />
  );
};

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatCurrency = (value) => {
  if (value === undefined || value === null) return "₹0";
  if (value >= 10000000) return "₹" + (value / 10000000).toFixed(1) + "Cr";
  if (value >= 1000000) return "₹" + (value / 1000000).toFixed(1) + "M";
  if (value >= 100000) return "₹" + (value / 100000).toFixed(1) + "L";
  if (value >= 1000) return "₹" + (value / 1000).toFixed(1) + "K";
  return "₹" + value.toLocaleString("en-IN");
};

const getInitials = (name) => {
  if (!name) return "S";
  const parts = name.split(" ");
  if (parts.length >= 2) {
    return (
      parts[0].charAt(0) + parts[parts.length - 1].charAt(0)
    ).toUpperCase();
  }
  return parts[0].charAt(0).toUpperCase();
};

const LeadershipCard = ({ leader }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="card h-100 shadow-sm border-0 radius-12 hover-scale-1 transition-2 top-border-card">
      <div className="card-body p-24 text-center">
        <div className="w-80-px h-80-px mx-auto mb-3 p-1 rounded-circle border border-2 border-primary-100 bg-white d-flex align-items-center justify-content-center overflow-hidden">
          {leader.image && !imgError ? (
            <img
              src={leader.image}
              alt={leader.name}
              className="w-100 h-100 rounded-circle object-fit-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-100 h-100 rounded-circle bg-neutral-100 text-neutral-600 d-flex align-items-center justify-content-center fw-bold fs-4">
              {getInitials(leader.name)}
            </div>
          )}
        </div>
        <h6 className="text-primary-600 fw-bold mb-1 title-case">
          {leader.name}
        </h6>
        <p className="text-secondary-light text-sm mb-3 text-uppercase fw-medium tracking-wide">
          {leader.role}
        </p>

        <div className="d-flex justify-content-center gap-2">
          <button className="btn btn-primary-50 text-primary-600 hover-bg-primary-600 hover-text-white rounded-circle w-32-px h-32-px d-flex justify-content-center align-items-center p-0 transition-2">
            <Icon icon="mdi:phone" />
          </button>
          <button className="btn btn-success-50 text-success-600 hover-bg-success-600 hover-text-white rounded-circle w-32-px h-32-px d-flex justify-content-center align-items-center p-0 transition-2">
            <Icon icon="mdi:whatsapp" />
          </button>
          <button className="btn btn-info-50 text-info-600 hover-bg-info-600 hover-text-white rounded-circle w-32-px h-32-px d-flex justify-content-center align-items-center p-0 transition-2">
            <Icon icon="mdi:email-outline" />
          </button>
        </div>
      </div>
    </div>
  );
};

const ImageWithFallback = ({ src, name, className }) => {
  const [imgError, setImgError] = useState(false);

  if (src && !imgError) {
    return (
      <img
        src={src}
        alt={name}
        className={className}
        onError={() => setImgError(true)}
      />
    );
  }

  return (
    <div
      className={`${className} bg-neutral-100 text-neutral-600 d-flex align-items-center justify-content-center fw-bold text-xs border border-white`}
    >
      {getInitials(name)}
    </div>
  );
};

const TopAchieverCard = ({ title, total, data, icon }) => {
  return (
    <div className="col-xl-4 col-md-6">
      <div className="card h-100 border-0 radius-12 shadow-sm overflow-hidden">
        <div className="card-body p-0">
          <div
            className="d-flex align-items-center justify-content-between p-20 border-bottom border-neutral-100"
            style={{ backgroundColor: "#f48989ff" }}
          >
            <div className="d-flex align-items-center gap-3">
              <div className="w-40-px h-40-px rounded-circle bg-white shadow-sm d-flex justify-content-center align-items-center text-primary-600">
                <Icon icon={icon} className="text-xl" />
              </div>
              <h6 className="mb-0 text-primary-600 fw-semibold text-md">
                {title}
              </h6>
            </div>
            <span className="badge bg-primary-600 text-white fw-bold px-10 py-1 radius-8">
              {total}
            </span>
          </div>
          <div className="p-16">
            {data.length > 0 ? (
              <ul className="d-flex flex-column gap-2 mb-0">
                {data.map((item, i) => (
                  <li
                    key={i}
                    className="d-flex align-items-center justify-content-between p-12 radius-8 bg-hover-neutral-50 transition-1 border border-transparent hover-border-neutral-200"
                  >
                    <div className="d-flex align-items-center gap-3">
                      <div className="position-relative">
                        <ImageWithFallback
                          src={item.image}
                          name={item.name}
                          className="w-36-px h-36-px rounded-circle object-fit-cover shadow-sm border border-white"
                        />
                      </div>
                      <div className="d-flex flex-column">
                        <span className="text-primary-600 fw-medium text-sm title-case">
                          {item.name}
                        </span>
                      </div>
                    </div>
                    <span className="text-primary-600 fw-bold fs-6">
                      {item.count}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-4 bg-neutral-50 radius-8">
                <span className="text-secondary-light font-bold">
                  No data found
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
