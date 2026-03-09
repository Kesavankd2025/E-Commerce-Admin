import React, { useState, useEffect } from "react";
import DashboardApi from "../../Api/DashboardApi";

const UnitCountSix = () => {
  const [stats, setStats] = useState({
    zoneCount: 0,
    regionCount: 0,
    chapterCount: 0,
    visitorCount: 0,
    edCount: 0,
    rdCount: 0,
    memberCount: 0,
    goldClubCount: 0,
    diamondClubCount: 0,
    platinumClubCount: 0,
    primeChapterCount: 0,
    eliteChapterCount: 0,
  });

  const [activities, setActivities] = useState({
    oneToOneCount: 0,
    referralCount: 0,
    thankYouSlipAmount: 0,
    trainingCount: 0,
    powerDateCount: 0,
    testimonialsCount: 0,
    chiefGuestCount: 0,
    starUpdateCount: 0,
    starBusinessClosed: 0,
  });

  const [starAchievements, setStarAchievements] = useState({
    chiefGuestCount: 0,
    trainingCount: 0,
    starUpdateCount: 0,
    nextRenewalCount: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, activitiesRes, achievementsRes] = await Promise.all([
          DashboardApi.getDashboardStats(),
          DashboardApi.getDashboardActivities(),
          DashboardApi.getStarAchievements(),
        ]);

        if (statsRes.status) setStats(statsRes.response.data);
        if (activitiesRes.status) setActivities(activitiesRes.response.data);
        if (achievementsRes.status)
          setStarAchievements(achievementsRes.response.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };
    fetchData();
  }, []);

  const generalStats = [
    { label: "Zone", value: stats.zoneCount, icon: "ri-map-pin-line" },
    { label: "Region", value: stats.regionCount, icon: "ri-global-line" },
    { label: "Chapters", value: stats.chapterCount, icon: "ri-book-open-line" },
    { label: "Visitors", value: stats.visitorCount, icon: "ri-group-line" },
    { label: "ED", value: stats.edCount, icon: "ri-admin-line" },
    { label: "RD", value: stats.rdCount, icon: "ri-user-settings-line" },
  ];

  const memberStats = [
    { label: "Members", value: stats.memberCount, icon: "ri-group-line" },
    {
      label: "Gold Club",
      value: stats.goldClubCount,
      icon: "ri-vip-crown-line",
    },
    {
      label: "Diamond Club",
      value: stats.diamondClubCount,
      icon: "ri-vip-diamond-line",
    },
    {
      label: "Platinum Club",
      value: stats.platinumClubCount,
      icon: "ri-medal-line",
    },
    {
      label: "Prime Chapter",
      value: stats.primeChapterCount,
      icon: "ri-user-star-line",
    },
    {
      label: "Elite Chapter",
      value: stats.eliteChapterCount,
      icon: "ri-vip-line",
    },
  ];

  const achievementStats = [
    {
      label: "121 Count",
      value: activities.oneToOneCount || 0,
      icon: "ri-calendar-check-line",
    },
    {
      label: "Referral Count",
      value: activities.referralCount || 0,
      icon: "ri-share-line",
    },
    {
      label: "Thankyou slip ",
      value: activities.thankYouSlipCount || 0,
      icon: "ri-file-paper-line",
    },
    {
      label: "Power Meet",
      value: activities.powerDateCount || 0,
      icon: "ri-calendar-event-line",
    },
    {
      label: "Testimonials",
      value: activities.testimonialsCount || 0,
      icon: "ri-chat-quote-line",
    },
  ];

  const eventStats = [
    {
      label: "Chief Guest",
      value: starAchievements.chiefGuestCount || 0,
      icon: "ri-user-star-line",
    },
    {
      label: "Trainings",
      value: starAchievements.trainingCount || 0,
      icon: "ri-presentation-line",
    },
    {
      label: "CNI Projects",
      value: starAchievements.starUpdateCount || 0,
      icon: "ri-star-line",
    },

    {
      label: "Next Renewal",
      value: starAchievements.nextRenewalCount || 0,
      icon: "ri-refresh-line",
    },
  ];

  const UnitCard = ({ item }) => (
    <div className="col">
      <div
        className={`card h-100 py-1 shadow-hover-xl transition-2 radius-20 hover-border-primary cursor-pointer`}
        style={{
          border: "1px solid #e5e7eb",
          borderRight: `3px solid #003366`,
          paddingLeft: `10px`,
        }}
      >
        <div className="card-body p-0">
          <div className="gap-2">
            <div className="flex-grow-1">
              <span className="fw-medium text-secondary-light text-sm mb-1 d-block text-uppercase spacing-1">
                {item.label}
              </span>
            </div>
            <div className="d-flex align-items-center justify-content-between gap-2">
              <h6 className="fw-bolder text-1xl mb-0">
                {item.value.toLocaleString("en-IN")}
              </h6>
              <span
                className={`w-48-px h-48-px d-flex justify-content-center align-items-center text-1xl`}
              >
                <i className={item.icon} style={{ color: "#003366" }} />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="d-flex flex-column gap-4">
      <div className="card h-100 p-0 radius-12">
        <div className="card-body p-24">
          <div className="row gy-4 row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-xl-6">
            {generalStats.map((item, index) => (
              <UnitCard item={item} key={`gen-${index}`} />
            ))}
          </div>
          <div className="gy-4"></div>
          <div className="row gy-4 my-3 row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-xl-6">
            {memberStats.map((item, index) => (
              <UnitCard item={item} key={`mem-${index}`} />
            ))}
          </div>
        </div>
      </div>

      <div className="card h-100 p-0 radius-12">
        <div className="card-header border-bottom bg-base py-16 px-24">
          <h6 className="text-lg fw-semibold mb-0">Members Achievements</h6>
        </div>
        <div className="card-body p-24">
          <div className="row gy-4 row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-xl-5">
            {achievementStats.map((item, index) => (
              <UnitCard item={item} key={`ach-${index}`} />
            ))}
          </div>
        </div>
      </div>
      <div className="card h-100 p-0 radius-12">
        <div className="card-header border-bottom bg-base py-16 px-24">
          <h6 className="text-lg fw-semibold mb-0">CNI Achievements</h6>
        </div>
        <div className="card-body p-24">
          <div className="row gy-4 row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-xl-4">
            {eventStats.map((item, index) => (
              <UnitCard item={item} key={`evt-${index}`} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnitCountSix;
