import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePageEight from "./pages/HomePageEight"; // Dashboard
import EmailPage from "./pages/EmailPage";
import ErrorPage from "./pages/ErrorPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ForgotPinPage from "./pages/ForgotPinPage";
import ResetPinPage from "./pages/ResetPinPage";
import FormPage from "./pages/FormPage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import ViewProfilePage from "./pages/ViewProfilePage";
import MyProfilePage from "./pages/MyProfilePage";
import RouteScrollToTop from "./helper/RouteScrollToTop";
import PrivateRoute from "./helper/PrivateRoute";
import CustomerOrderListPage from "./pages/CustomerOrderListPage";
import CustomerOrderDetailsPage from "./pages/CustomerOrderDetailsPage";
import CustomerListPage from "./pages/CustomerListPage";
import CustomerDetailsPage from "./pages/CustomerDetailsPage";
import CancelledOrderListPage from "./pages/CancelledOrderListPage";
import ReturnOrderListPage from "./pages/ReturnOrderListPage";
import ReturnOrderDetailsPage from "./pages/ReturnOrderDetailsPage";
import OrderFeedbackListPage from "./pages/OrderFeedbackListPage";
import PosOrderPage from "./pages/PosOrderPage";
import PosHistoryPage from "./pages/PosHistoryPage";
import { ToastContainer } from "react-toastify";
import ComingSoonPage from "./pages/ComingSoonPage";
import AccessDeniedPage from "./pages/AccessDeniedPage";
import MaintenancePage from "./pages/MaintenancePage";

import AdminRegistrationListPage from "./pages/AdminRegistrationListPage";
import AdminRegistrationFormPage from "./pages/AdminRegistrationFormPage";
import AdminRegistrationViewPage from "./pages/AdminRegistrationViewPage";
import AdminRegistrationEditPage from "./pages/AdminRegistrationEditPage";
import RegionListPage from "./pages/RegionListPage";
import RegionFormPage from "./pages/RegionFormPage";
import BadgeCreationPage from "./pages/BadgeCreationPage";
import BadgeCreateFormPage from "./pages/BadgeCreateFormPage";
import BadgeAssignFormPage from "./pages/BadgeAssignFormPage";
import BadgeAssignCreatePage from "./pages/BadgeAssignCreatePage";

import MemberListPage from "./pages/MemberListPage";
import MemberFormPage from "./pages/MemberFormPage";
import AttendanceListPage from "./pages/AttendanceListPage";

import ChapterListPage from "./pages/ChapterListPage";
import ChapterFormPage from "./pages/ChapterFormPage";
import ChapterViewPage from "./pages/ChapterViewPage";
import ChapterRoleAssignPage from "./pages/ChapterRoleAssignPage";
import ChapterRoleHistoryPage from "./pages/ChapterRoleHistoryPage";

import MeetingListPage from "./pages/MeetingListPage";
import MeetingFormPage from "./pages/MeetingFormPage";
import MeetingAttendancePage from "./pages/MeetingAttendancePage";
import MemberHistoryPage from "./pages/MemberHistoryPage";

import CommunityUpdatePage from "./pages/CommunityUpdatePage";
import CommunityUpdateFormPage from "./pages/CommunityUpdateFormPage";
import StarUpdatePage from "./pages/StarUpdatePage";
import StarUpdateFormPage from "./pages/StarUpdateFormPage";
import GalleryPage from "./pages/MobileAdPage";

import GeneralUpdatePage from "./pages/GeneralUpdatePage";
import ChapterReportPage from "./pages/ChapterReportPage";
import Note121Page from "./pages/Note121Page";
import ReferralNotePage from "./pages/ReferralNotePage";
import ThankYouSlipPage from "./pages/ThankYouSlipPage";
import PowerMeetReportPage from "./pages/PowerDateReportPage";
import TestimonialsPage from "./pages/TestimonialsPage";
import VisitorsReportPage from "./pages/VisitorsReportPage";
import VisitorsFormPage from "./pages/VisitorsFormPage";
import TrainingsReportPage from "./pages/TrainingsReportPage";
import AbsentProxyReportPage from "./pages/AbsentProxyReportPage";
import PerformanceReportPage from "./pages/PerformanceReportPage";
import InterestedMembersPage from "./pages/InterestedMembersPage";
import ChapterMemberListPage from "./pages/ChapterMemberListPage";
import ThankYouSlipReportDetailedPage from "./pages/ThankYouSlipReportDetailedPage";
import TestimonialsReportDetailedPage from "./pages/TestimonialsReportDetailedPage";
import LogReportPage from "./pages/LogReportPage";
import ShopListPage from "./pages/ShopListPage";
import ShopCreatePage from "./pages/ShopCreatePage";
import ShopFormPage from "./pages/ShopFormPage";
import ShopCategoryListPage from "./pages/ShopCategoryListPage";
import ShopCategoryFormPage from "./pages/ShopCategoryFormPage";
import OrdersPage from "./pages/OrdersPage";
import TrainingListPage from "./pages/TrainingListPage";
import TrainingFormPage from "./pages/TrainingFormPage";
import UserRoleListPage from "./pages/UserRoleListPage";
import UserRoleFormPage from "./pages/UserRoleFormPage";
import ChiefGuestListPage from "./pages/ChiefGuestListPage";
import ChiefGuestReportPage from "./pages/ChiefGuestReportPage";
import ChiefGuestFormPage from "./pages/ChiefGuestFormPage";
import ChiefGuestHistoryPage from "./pages/ChiefGuestHistoryPage";
import GeneralUpdateListPage from "./pages/GeneralUpdateListPage";
import PointsPage from "./pages/PointsPage";
import ChapterReportListPage from "./pages/ChapterReportListPage";
import AwardListPage from "./pages/AwardListPage";
import AwardFormPage from "./pages/AwardFormPage";
import BusinessCategoryListPage from "./pages/BusinessCategoryListPage";
import BusinessCategoryFormPage from "./pages/BusinessCategoryFormPage";
import CompanyPage from "./pages/CompanyPage";
import ZoneFormPage from "./pages/ZoneFormPage";
import RenewalReportPage from "./pages/RenewalReportPage";
import LocationListPage from "./pages/LocationListPage";
import MemberPointsReportPage from "./pages/MemberPointsReportPage";
import MemberSuggestionPage from "./pages/MemberSuggestionPage";
import TrainingParticipantPage from "./pages/TrainingParticipantPage";
import MeetingHistoryPage from "./pages/MeetingHistoryPage";
import StarUpdateResponsePage from "./pages/StarUpdateResponsePage";
import CommunityUpdateResponsePage from "./pages/CommunityUpdateResponsePage";
import VerticalDirectorAssignPage from "./pages/VerticalDirectorAssignPage";
import VerticalDirectorHistoryPage from "./pages/VerticalDirectorHistoryPage";

import WebsiteEventListPage from "./pages/WebsiteEventListPage";
import WebsiteEventFormPage from "./pages/WebsiteEventFormPage";
import WebsiteEventViewPage from "./pages/WebsiteEventViewPage";
import WebsiteMemberListPage from "./pages/WebsiteMemberListPage";

import CategoryListPage from "./pages/CategoryListPage";
import CategoryFormPage from "./pages/CategoryFormPage";
import SubCategoryListPage from "./pages/SubCategoryListPage";
import SubCategoryFormPage from "./pages/SubCategoryFormPage";
import BrandListPage from "./pages/BrandListPage";
import BrandFormPage from "./pages/BrandFormPage";
import AttributeListPage from "./pages/AttributeListPage";
import AttributeFormPage from "./pages/AttributeFormPage";
import UnitListPage from "./pages/UnitListPage";
import UnitFormPage from "./pages/UnitFormPage";
import TaxListPage from "./pages/TaxListPage";
import TaxFormPage from "./pages/TaxFormPage";
import ProductListPage from "./pages/ProductListPage";
import ProductFormPage from "./pages/ProductFormPage";
import ShippingMethodPage from "./pages/ShippingMethodPage";

function App() {
  return (
    <BrowserRouter>
      <RouteScrollToTop />
      <ToastContainer />
      <Routes>
        <Route exact path="/sign-in" element={<SignInPage />} />
        <Route exact path="/sign-up" element={<SignUpPage />} />
        <Route exact path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route exact path="/forgot-pin" element={<ForgotPinPage />} />
        <Route exact path="/reset-pin" element={<ResetPinPage />} />
        <Route exact path="/coming-soon" element={<ComingSoonPage />} />
        <Route exact path="/access-denied" element={<AccessDeniedPage />} />
        <Route exact path="/maintenance" element={<MaintenancePage />} />

        {/* Protected Routes */}
        <Route element={<PrivateRoute />}>
          <Route exact path="/" element={<HomePageEight />} />
          <Route exact path="/email" element={<EmailPage />} />

          <Route exact path="/view-profile" element={<ViewProfilePage />} />
          <Route exact path="/my-profile" element={<MyProfilePage />} />
          <Route exact path="/company" element={<CompanyPage />} />
          {/* Dynamic Forms using FormPage */}
          <Route
            exact
            path="/chapter-badge"
            element={<FormPage title="Chapter Badge" />}
          />
          <Route
            exact
            path="/member-badge"
            element={<FormPage title="Member Badge" />}
          />
          <Route
            exact
            path="/meetings-create"
            element={<FormPage title="Meeting Creation" />}
          />
          <Route exact path="/renewal-report" element={<RenewalReportPage />} />
          <Route
            exact
            path="/ed-report"
            element={<FormPage title="ED Report" />}
          />
          <Route
            exact
            path="/rd-report"
            element={<FormPage title="RD Report" />}
          />
          <Route exact path="/power-date" element={<PowerMeetReportPage />} />
          <Route
            exact
            path="/present-update"
            element={<FormPage title="Present Update" />}
          />
          <Route
            exact
            path="/roles-permissions"
            element={<FormPage title="Roles & Permissions" />}
          />
          <Route
            exact
            path="/office-location"
            element={<FormPage title="Office Location" />}
          />
          <Route exact path="/location-list" element={<LocationListPage />} />
          <Route exact path="/form" element={<FormPage />} />
          {/* Dynamic Forms using FormPage */}
          <Route
            exact
            path="/chapter-badge"
            element={<FormPage title="Chapter Badge" />}
          />
          <Route
            exact
            path="/member-badge"
            element={<FormPage title="Member Badge" />}
          />
          <Route
            exact
            path="/meetings-create"
            element={<FormPage title="Meeting Creation" />}
          />
          <Route exact path="/renewal-report" element={<RenewalReportPage />} />
          <Route
            exact
            path="/ed-report"
            element={<FormPage title="ED Report" />}
          />
          <Route
            exact
            path="/rd-report"
            element={<FormPage title="RD Report" />}
          />
          <Route
            exact
            path="/power-date"
            element={<FormPage title="Power meet" />}
          />
          <Route
            exact
            path="/present-update"
            element={<FormPage title="Present Update" />}
          />
          <Route
            exact
            path="/office-location"
            element={<FormPage title="Office Location" />}
          />
          <Route exact path="/location-list" element={<LocationListPage />} />
          <Route exact path="/form" element={<FormPage />} />
          {/* Master Creation */}
          <Route exact path="/category" element={<CategoryListPage />} />
          <Route exact path="/category/add" element={<CategoryFormPage />} />
          <Route exact path="/category/edit/:id" element={<CategoryFormPage />} />
          <Route exact path="/category/view/:id" element={<CategoryFormPage />} />

          <Route exact path="/sub-category" element={<SubCategoryListPage />} />
          <Route exact path="/sub-category/add" element={<SubCategoryFormPage />} />
          <Route exact path="/sub-category/edit/:id" element={<SubCategoryFormPage />} />
          <Route exact path="/sub-category/view/:id" element={<SubCategoryFormPage />} />

          <Route exact path="/brands" element={<BrandListPage />} />
          <Route exact path="/brands/add" element={<BrandFormPage />} />
          <Route exact path="/brands/edit/:id" element={<BrandFormPage />} />
          <Route exact path="/brands/view/:id" element={<BrandFormPage />} />

          <Route exact path="/attributes" element={<AttributeListPage />} />
          <Route exact path="/attributes/add" element={<AttributeFormPage />} />
          <Route exact path="/attributes/edit/:id" element={<AttributeFormPage />} />
          <Route exact path="/attributes/view/:id" element={<AttributeFormPage />} />

          <Route exact path="/units" element={<UnitListPage />} />
          <Route exact path="/units/add" element={<UnitFormPage />} />
          <Route exact path="/units/edit/:id" element={<UnitFormPage />} />
          <Route exact path="/units/view/:id" element={<UnitFormPage />} />

          <Route exact path="/taxes" element={<TaxListPage />} />
          <Route exact path="/taxes/add" element={<TaxFormPage />} />
          <Route exact path="/taxes/edit/:id" element={<TaxFormPage />} />
          <Route exact path="/taxes/view/:id" element={<TaxFormPage />} />

          <Route exact path="/products" element={<ProductListPage />} />
          <Route exact path="/products/add" element={<ProductFormPage />} />
          <Route exact path="/products/edit/:id" element={<ProductFormPage />} />
          <Route exact path="/products/view/:id" element={<ProductFormPage />} />
          <Route exact path="/shipping-methods" element={<ShippingMethodPage />} />

          <Route exact path="/user-roles" element={<UserRoleListPage />} />
          <Route
            exact
            path="/user-roles/create"
            element={<UserRoleFormPage />}
          />
          <Route exact path="/zone/add" element={<ZoneFormPage />} />
          <Route
            exact
            path="/user-roles/edit/:id"
            element={<UserRoleFormPage />}
          />
          <Route
            exact
            path="/user-roles/view/:id"
            element={<UserRoleFormPage />}
          />
          <Route
            exact
            path="/admin-registration"
            element={<AdminRegistrationListPage />}
          />
          <Route
            exact
            path="/admin-registration/add"
            element={<AdminRegistrationFormPage />}
          />
          <Route
            exact
            path="/admin-registration/view/:id"
            element={<AdminRegistrationViewPage />}
          />
          <Route
            exact
            path="/admin-registration/edit/:id"
            element={<AdminRegistrationEditPage />}
          />
          <Route
            exact
            path="/region"
            element={<RegionListPage />}
          />
          <Route
            exact
            path="/region/add"
            element={<RegionFormPage />}
          />
          <Route
            exact
            path="/region/edit/:id"
            element={<RegionFormPage />}
          />
          <Route exact path="/badge" element={<BadgeCreationPage />} />
          <Route exact path="/badge/create" element={<BadgeCreateFormPage />} />
          <Route
            exact
            path="/badge/edit/:id"
            element={<BadgeCreateFormPage />}
          />
          <Route
            exact
            path="/badge/assign/create"
            element={<BadgeAssignCreatePage />}
          />
          <Route exact path="/badge/assign" element={<BadgeAssignFormPage />} />
          <Route exact path="/award" element={<AwardListPage />} />
          <Route exact path="/award/add" element={<AwardFormPage />} />
          <Route exact path="/award/edit/:id" element={<AwardFormPage />} />
          <Route
            exact
            path="/business-category"
            element={<BusinessCategoryListPage />}
          />
          <Route
            exact
            path="/business-category/add"
            element={<BusinessCategoryFormPage />}
          />
          <Route
            exact
            path="/business-category/edit/:id"
            element={<BusinessCategoryFormPage />}
          />
          <Route
            exact
            path="/vertical-directors"
            element={<VerticalDirectorAssignPage />}
          />
          <Route
            exact
            path="/vertical-directors/history"
            element={<VerticalDirectorHistoryPage />}
          />
          {/* Chapter Creation */}
          <Route exact path="/chapter-creation" element={<ChapterListPage />} />
          <Route
            exact
            path="/chapter-creation/add"
            element={<ChapterFormPage />}
          />
          <Route
            exact
            path="/chapter-creation/edit/:id"
            element={<ChapterFormPage />}
          />
          <Route exact path="/chapter-view/:id" element={<ChapterViewPage />} />
          <Route
            exact
            path="/chapter-roles/:id"
            element={<ChapterRoleAssignPage />}
          />
          <Route
            exact
            path="/chapter-roles/history/:id"
            element={<ChapterRoleHistoryPage />}
          />
          {/* Members Registration */}
          <Route
            exact
            path="/members-registration"
            element={<MemberListPage />}
          />
          <Route
            exact
            path="/members-registration/add"
            element={<MemberFormPage />}
          />
          <Route
            exact
            path="/members-registration/edit/:id"
            element={<MemberFormPage />}
          />
          {/* Meeting Creation */}
          <Route exact path="/meeting-creation" element={<MeetingListPage />} />
          <Route
            exact
            path="/meeting-creation/add"
            element={<MeetingFormPage />}
          />
          <Route
            exact
            path="/meeting-creation/edit/:id"
            element={<MeetingFormPage />}
          />
          {/* Attendance List */}
          <Route
            exact
            path="/attendance-report"
            element={<AttendanceListPage />}
          />
          <Route
            exact
            path="/meeting-attendance/:id"
            element={<MeetingAttendancePage />}
          />
          <Route
            exact
            path="/member-history/:id"
            element={<MemberHistoryPage />}
          />
          {/* Announcement */}
          <Route exact path="/general-update" element={<GeneralUpdatePage />} />
          <Route
            exact
            path="/general-update-list"
            element={<GeneralUpdateListPage />}
          />
          <Route
            exact
            path="/community-update"
            element={<CommunityUpdatePage />}
          />
          <Route
            exact
            path="/community-update/add"
            element={<CommunityUpdateFormPage />}
          />
          <Route exact path="/star-update" element={<StarUpdatePage />} />
          <Route
            exact
            path="/star-update/add"
            element={<StarUpdateFormPage />}
          />
          <Route
            exact
            path="/star-update/edit/:id"
            element={<StarUpdateFormPage />}
          />
          <Route
            exact
            path="/star-update/view/:id"
            element={<StarUpdateFormPage />}
          />
          <Route
            exact
            path="/star-update/responses/:id"
            element={<StarUpdateResponsePage />}
          />
          <Route
            exact
            path="/community-update/responses/:id"
            element={<CommunityUpdateResponsePage />}
          />
          <Route exact path="/mobile-ads" element={<GalleryPage />} />
          <Route exact path="/points" element={<PointsPage />} />

          {/* Website - Event & Member List */}
          <Route exact path="/website-event-list" element={<WebsiteEventListPage />} />
          <Route exact path="/website-event-add" element={<WebsiteEventFormPage />} />
          <Route exact path="/website-event-edit/:id" element={<WebsiteEventFormPage />} />
          <Route exact path="/website-event-view/:id" element={<WebsiteEventViewPage />} />
          <Route exact path="/website-member-list" element={<WebsiteMemberListPage />} />

          {/* Training */}
          <Route exact path="/training" element={<TrainingListPage />} />
          <Route exact path="/training-list" element={<TrainingListPage />} />
          <Route exact path="/training-create" element={<TrainingFormPage />} />
          <Route
            exact
            path="/training-edit/:id"
            element={<TrainingFormPage />}
          />
          <Route
            exact
            path="/training-view/:id"
            element={<TrainingFormPage />}
          />
          <Route
            exact
            path="/training-participants/:id"
            element={<TrainingParticipantPage />}
          />
          {/* Shop */}
          <Route exact path="/shop-list" element={<ShopListPage />} />
          <Route exact path="/shop-create" element={<ShopCreatePage />} />
          <Route exact path="/shop-add" element={<ShopFormPage />} />
          <Route exact path="/shop-edit/:id" element={<ShopFormPage />} />
          {/* Shop Category */}
          <Route
            exact
            path="/shop-category-list"
            element={<ShopCategoryListPage />}
          />
          <Route
            exact
            path="/shop-category-create"
            element={<ShopCategoryFormPage />}
          />
          <Route
            exact
            path="/shop-category-edit/:id"
            element={<ShopCategoryFormPage />}
          />
          {/* Orders */}
          <Route exact path="/orders" element={<OrdersPage />} />
          <Route exact path="/customer-orders" element={<CustomerOrderListPage />} />
          <Route exact path="/customer-orders/view/:id" element={<CustomerOrderDetailsPage />} />
          <Route exact path="/cancelled-orders" element={<CancelledOrderListPage />} />
          <Route exact path="/return-orders" element={<ReturnOrderListPage />} />
          <Route exact path="/return-orders/view/:id" element={<ReturnOrderDetailsPage />} />
          {/* Log Report */}
          <Route exact path="/log-report" element={<LogReportPage />} />
          {/* Chapter Report */}
          <Route exact path="/chapter-report" element={<ChapterReportPage />} />
          {/* Chapter Report */}
          <Route exact path="/chapter-report" element={<ChapterReportPage />} />
          <Route
            exact
            path="/chapter-report-list/:id"
            element={<ChapterReportListPage />}
          />
          <Route
            exact
            path="/member-points-report"
            element={<MemberPointsReportPage />}
          />
          {/* Visitors Report */}
          <Route
            exact
            path="/visitors-report"
            element={<VisitorsReportPage />}
          />
          <Route exact path="/visitors-form" element={<VisitorsFormPage />} />
          <Route
            exact
            path="/visitors-form/add"
            element={<VisitorsFormPage />}
          />
          <Route
            exact
            path="/visitors-form/edit/:id"
            element={<VisitorsFormPage />}
          />
          <Route
            exact
            path="/visitors-form/view/:id"
            element={<VisitorsFormPage />}
          />
          {/* Chapter Activity Report */}
          <Route exact path="/note-121" element={<Note121Page />} />
          <Route exact path="/referral-note" element={<ReferralNotePage />} />
          <Route exact path="/thank-you-slip" element={<ThankYouSlipPage />} />
          <Route
            exact
            path="/thank-you-slip-report"
            element={<ThankYouSlipReportDetailedPage />}
          />
          <Route exact path="/power-date" element={<PowerMeetReportPage />} />
          <Route
            exact
            path="/trainings-report"
            element={<TrainingsReportPage />}
          />
          <Route
            exact
            path="/trainings-report/interested-members/:id"
            element={<InterestedMembersPage />}
          />
          <Route
            exact
            path="/chapter-member-list"
            element={<ChapterMemberListPage />}
          />
          <Route exact path="/testimonials" element={<TestimonialsPage />} />
          <Route
            exact
            path="/testimonials-report"
            element={<TestimonialsReportDetailedPage />}
          />
          <Route
            exact
            path="/member-suggestion-report"
            element={<MemberSuggestionPage />}
          />
          {/* Visitors Report */}
          <Route
            exact
            path="/visitors-report"
            element={<VisitorsReportPage />}
          />
          {/* Chapter Activity Report */}
          <Route exact path="/note-121" element={<Note121Page />} />
          <Route exact path="/referral-report" element={<ReferralNotePage />} />
          <Route
            exact
            path="/absent-proxy-report"
            element={<AbsentProxyReportPage />}
          />
          <Route
            exact
            path="/performance-report"
            element={<PerformanceReportPage />}
          />
          <Route
            exact
            path="/chief-guest-report"
            element={<ChiefGuestReportPage />}
          />
          <Route exact path="/thank-you-slip" element={<ThankYouSlipPage />} />
          <Route exact path="/testimonials" element={<TestimonialsPage />} />
          {/* Chief Guest List */}
          <Route
            exact
            path="/chief-guest-list"
            element={<ChiefGuestListPage />}
          />
          <Route
            exact
            path="/chief-guest-add"
            element={<ChiefGuestFormPage />}
          />
          <Route
            exact
            path="/chief-guest-edit/:id"
            element={<ChiefGuestFormPage />}
          />
          <Route
            exact
            path="/chief-guest-history/:id"
            element={<ChiefGuestHistoryPage />}
          />

          <Route
            exact
            path="/meeting-history/:id"
            element={<MeetingHistoryPage />}
          />
          <Route exact path="/customer-list" element={<CustomerListPage />} />
          <Route exact path="/customer-list/view/:id" element={<CustomerDetailsPage />} />
          <Route exact path="/orders-feedback" element={<OrderFeedbackListPage />} />
          <Route exact path="/pos-order" element={<PosOrderPage />} />
          <Route exact path="/pos-history" element={<PosHistoryPage />} />
          <Route exact path="*" element={<ErrorPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
