import React, { useState, useEffect } from "react";
import UnitCountSix from "./child/UnitCountSix";
import PatientVisitByGender from "./child/PatientVisitByGender";
import TopPerformanceList from "./child/TopPerformanceList";
import RecentlyMembersJoined from "./child/RecentlyMembersJoined";
import DashboardApi from "../Api/DashboardApi";
import { IMAGE_BASE_URL } from "../Config/Index";

const DashBoardLayerEight = () => {
  const [top121Members, setTop121Members] = useState([]);
  const [topThankYouMembers, setTopThankYouMembers] = useState([]);
  const [topReferralMembers, setTopReferralMembers] = useState([]);

  useEffect(() => {
    fetchTop121Members();
    fetchTopThankYouMembers();
    fetchTopReferralMembers();
  }, []);

  const fetchTop121Members = async () => {
    try {
      const response = await DashboardApi.getTop121Members();
      if (response.status && response.response.data) {
        const mappedData = response.response.data.topMembers.map((member) => ({
          name: member.fullName,
          value: member.count,
          image: member.profileImage
            ? `${IMAGE_BASE_URL}/${member.profileImage.path}`
            : null,
          businessCategory: member.businessCategoryName || "",
        }));
        setTop121Members(mappedData);
      }
    } catch (error) {
      console.error("Error fetching Top 121 Members:", error);
    }
  };

  const fetchTopThankYouMembers = async () => {
    try {
      const response = await DashboardApi.getTopThankYouMembers();
      if (response.status && response.response.data) {
        const mappedData = response.response.data.topMembers.map((member) => ({
          name: member.fullName,
          value: member.count,
          image: member.profileImage
            ? `${IMAGE_BASE_URL}/${member.profileImage.path}`
            : null,
          businessCategory: member.businessCategoryName || "",
        }));
        setTopThankYouMembers(mappedData);
      }
    } catch (error) {
      console.error("Error fetching Top Thank You Members:", error);
    }
  };

  const fetchTopReferralMembers = async () => {
    try {
      const response = await DashboardApi.getTopReferralMembers();
      if (response.status && response.response.data) {
        const mappedData = response.response.data.topMembers.map((member) => ({
          name: member.fullName,
          value: member.count,
          image: member.profileImage
            ? `${IMAGE_BASE_URL}/${member.profileImage.path}`
            : null,
          businessCategory: member.businessCategoryName || "",
        }));
        setTopReferralMembers(mappedData);
      }
    } catch (error) {
      console.error("Error fetching Top Referral Members:", error);
    }
  };

  return (
    <>
      <div className="row gy-4">
        <div className="col-xxxl-12">
          <div className="row gy-4">
            <UnitCountSix />

            <PatientVisitByGender />

            <TopPerformanceList
              title="Top 121 Members"
              data={top121Members}
              linkTo="/note-121"
            />
            <TopPerformanceList
              title="Top Referral Members"
              data={topReferralMembers}
              linkTo="/referral-report"
            />
            <TopPerformanceList
              title="Top Thank You Members"
              data={topThankYouMembers}
              linkTo="/thank-you-slip-report"
            />

            {/* Recently Members Joined */}
            <RecentlyMembersJoined />
          </div>
        </div>
      </div>
    </>
  );
};

export default DashBoardLayerEight;
