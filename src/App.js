import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePageEight from "./Pages/HomePageEight"; // Dashboard
import EmailPage from "./Pages/EmailPage";
import ErrorPage from "./Pages/ErrorPage";
import ForgotPasswordPage from "./Pages/ForgotPasswordPage";
import ForgotPinPage from "./Pages/ForgotPinPage";
import ResetPinPage from "./Pages/ResetPinPage";
import FormPage from "./Pages/FormPage";
import SignInPage from "./Pages/SignInPage";
import SignUpPage from "./Pages/SignUpPage";
import ViewProfilePage from "./Pages/ViewProfilePage";
import MyProfilePage from "./Pages/MyProfilePage";
import RouteScrollToTop from "./helper/RouteScrollToTop";
import PrivateRoute from "./helper/PrivateRoute";
import CustomerOrderListPage from "./Pages/CustomerOrderListPage";
import CustomerOrderDetailsPage from "./Pages/CustomerOrderDetailsPage";
import CustomerListPage from "./Pages/CustomerListPage";
import CustomerDetailsPage from "./Pages/CustomerDetailsPage";
import CancelledOrderListPage from "./Pages/CancelledOrderListPage";
import ReturnOrderListPage from "./Pages/ReturnOrderListPage";
import ReturnOrderDetailsPage from "./Pages/ReturnOrderDetailsPage";
import OrderFeedbackListPage from "./Pages/OrderFeedbackListPage";
import PosOrderPage from "./Pages/PosOrderPage";
import PosHistoryPage from "./Pages/PosHistoryPage";
import { ToastContainer } from "react-toastify";
import ComingSoonPage from "./Pages/ComingSoonPage";
import AccessDeniedPage from "./Pages/AccessDeniedPage";
import MaintenancePage from "./Pages/MaintenancePage";

import AdminRegistrationListPage from "./Pages/AdminRegistrationListPage";
import AdminRegistrationFormPage from "./Pages/AdminRegistrationFormPage";
import AdminRegistrationViewPage from "./Pages/AdminRegistrationViewPage";
import AdminRegistrationEditPage from "./Pages/AdminRegistrationEditPage";
import RegionListPage from "./Pages/RegionListPage";
import RegionFormPage from "./Pages/RegionFormPage";
import BadgeCreationPage from "./Pages/BadgeCreationPage";
import BadgeCreateFormPage from "./Pages/BadgeCreateFormPage";
import BadgeAssignFormPage from "./Pages/BadgeAssignFormPage";
import BadgeAssignCreatePage from "./Pages/BadgeAssignCreatePage";

import MemberListPage from "./Pages/MemberListPage";
import MemberFormPage from "./Pages/MemberFormPage";
import AttendanceListPage from "./Pages/AttendanceListPage";

import ChapterListPage from "./Pages/ChapterListPage";
import ChapterFormPage from "./Pages/ChapterFormPage";
import ChapterViewPage from "./Pages/ChapterViewPage";
import ChapterRoleAssignPage from "./Pages/ChapterRoleAssignPage";
import ChapterRoleHistoryPage from "./Pages/ChapterRoleHistoryPage";

import MeetingListPage from "./Pages/MeetingListPage";
import MeetingFormPage from "./Pages/MeetingFormPage";
import MeetingAttendancePage from "./Pages/MeetingAttendancePage";
import MemberHistoryPage from "./Pages/MemberHistoryPage";

import CommunityUpdatePage from "./Pages/CommunityUpdatePage";
import CommunityUpdateFormPage from "./Pages/CommunityUpdateFormPage";
import StarUpdatePage from "./Pages/StarUpdatePage";
import StarUpdateFormPage from "./Pages/StarUpdateFormPage";
import GalleryPage from "./Pages/MobileAdPage";

import GeneralUpdatePage from "./Pages/GeneralUpdatePage";
import ChapterReportPage from "./Pages/ChapterReportPage";
import Note121Page from "./Pages/Note121Page";
import ReferralNotePage from "./Pages/ReferralNotePage";
import ThankYouSlipPage from "./Pages/ThankYouSlipPage";
import PowerMeetReportPage from "./Pages/PowerDateReportPage";
import TestimonialsPage from "./Pages/TestimonialsPage";
import VisitorsReportPage from "./Pages/VisitorsReportPage";
import VisitorsFormPage from "./Pages/VisitorsFormPage";
import TrainingsReportPage from "./Pages/TrainingsReportPage";
import AbsentProxyReportPage from "./Pages/AbsentProxyReportPage";
import PerformanceReportPage from "./Pages/PerformanceReportPage";
import InterestedMembersPage from "./Pages/InterestedMembersPage";
import ChapterMemberListPage from "./Pages/ChapterMemberListPage";
import ThankYouSlipReportDetailedPage from "./Pages/ThankYouSlipReportDetailedPage";
import TestimonialsReportDetailedPage from "./Pages/TestimonialsReportDetailedPage";
import LogReportPage from "./Pages/LogReportPage";
import ShopListPage from "./Pages/ShopListPage";
import ShopCreatePage from "./Pages/ShopCreatePage";
import ShopFormPage from "./Pages/ShopFormPage";
import ShopCategoryListPage from "./Pages/ShopCategoryListPage";
import ShopCategoryFormPage from "./Pages/ShopCategoryFormPage";
import OrdersPage from "./Pages/OrdersPage";
import TrainingListPage from "./Pages/TrainingListPage";
import TrainingFormPage from "./Pages/TrainingFormPage";
import UserRoleListPage from "./Pages/UserRoleListPage";
import UserRoleFormPage from "./Pages/UserRoleFormPage";
import ChiefGuestListPage from "./Pages/ChiefGuestListPage";
import ChiefGuestReportPage from "./Pages/ChiefGuestReportPage";
import ChiefGuestFormPage from "./Pages/ChiefGuestFormPage";
import ChiefGuestHistoryPage from "./Pages/ChiefGuestHistoryPage";
import GeneralUpdateListPage from "./Pages/GeneralUpdateListPage";
import PointsPage from "./Pages/PointsPage";
import ChapterReportListPage from "./Pages/ChapterReportListPage";
import AwardListPage from "./Pages/AwardListPage";
import AwardFormPage from "./Pages/AwardFormPage";
import BusinessCategoryListPage from "./Pages/BusinessCategoryListPage";
import BusinessCategoryFormPage from "./Pages/BusinessCategoryFormPage";
import CompanyPage from "./Pages/CompanyPage";
import ZoneFormPage from "./Pages/ZoneFormPage";
import RenewalReportPage from "./Pages/RenewalReportPage";
import LocationListPage from "./Pages/LocationListPage";
import MemberPointsReportPage from "./Pages/MemberPointsReportPage";
import MemberSuggestionPage from "./Pages/MemberSuggestionPage";
import TrainingParticipantPage from "./Pages/TrainingParticipantPage";
import MeetingHistoryPage from "./Pages/MeetingHistoryPage";
import StarUpdateResponsePage from "./Pages/StarUpdateResponsePage";
import CommunityUpdateResponsePage from "./Pages/CommunityUpdateResponsePage";
import VerticalDirectorAssignPage from "./Pages/VerticalDirectorAssignPage";
import VerticalDirectorHistoryPage from "./Pages/VerticalDirectorHistoryPage";

import WebsiteEventListPage from "./Pages/WebsiteEventListPage";
import WebsiteEventFormPage from "./Pages/WebsiteEventFormPage";
import WebsiteEventViewPage from "./Pages/WebsiteEventViewPage";
import WebsiteMemberListPage from "./Pages/WebsiteMemberListPage";

import CategoryListPage from "./Pages/CategoryListPage";
import CategoryFormPage from "./Pages/CategoryFormPage";
import SubCategoryListPage from "./Pages/SubCategoryListPage";
import SubCategoryFormPage from "./Pages/SubCategoryFormPage";
import BrandListPage from "./Pages/BrandListPage";
import BrandFormPage from "./Pages/BrandFormPage";
import AttributeListPage from "./Pages/AttributeListPage";
import AttributeFormPage from "./Pages/AttributeFormPage";
import UnitListPage from "./Pages/UnitListPage";
import UnitFormPage from "./Pages/UnitFormPage";
import TaxListPage from "./Pages/TaxListPage";
import TaxFormPage from "./Pages/TaxFormPage";
import ProductListPage from "./Pages/ProductListPage";
import ProductFormPage from "./Pages/ProductFormPage";
import ShippingMethodPage from "./Pages/ShippingMethodPage";
import VendorListPage from "./Pages/VendorListPage";
import VendorFormPage from "./Pages/VendorFormPage";
import PurchaseListPage from "./Pages/PurchaseListPage";
import AddPurchasePage from "./Pages/AddPurchasePage";
import ViewPurchasePage from "./Pages/ViewPurchasePage";
import VendorPaymentPage from "./Pages/VendorPaymentPage";

import PaymentHistoryPage from "./Pages/PaymentHistoryPage";
import ManualPaymentPage from "./Pages/ManualPaymentPage";
import InventoryListPage from "./Pages/InventoryListPage";
import AddStockPage from "./Pages/AddStockPage";

import ProductReportsPage from "./Pages/ProductReportsPage";
import CustomerReportsPage from "./Pages/CustomerReportsPage";
import VendorReportsPage from "./Pages/VendorReportsPage";
import PaymentReportsPage from "./Pages/PaymentReportsPage";
import SalesReportsPage from "./Pages/SalesReportsPage";

import UserListPage from "./Pages/UserListPage";
import RolePermissionPage from "./Pages/RolePermissionPage";
import ActivityLogsPage from "./Pages/ActivityLogsPage";

import BannerListPage from "./Pages/BannerListPage";
import BannerAddPage from "./Pages/BannerAddPage";

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

        <Route exact path="/access-denied" element={<AccessDeniedPage />} />
        <Route exact path="/maintenance" element={<MaintenancePage />} />

        {/* Protected Routes */}
        <Route element={<PrivateRoute />}>
          <Route exact path="/" element={<HomePageEight />} />

          {/* Website Management */}
          <Route exact path="/banner" element={<BannerListPage />} />
          <Route exact path="/banner/add" element={<BannerAddPage />} />
          <Route exact path="/banner/edit/:id" element={<BannerAddPage />} />
          <Route exact path="/banner/view/:id" element={<BannerAddPage />} />

          {/* Vendor */}
          <Route exact path="/vendor-list" element={<VendorListPage />} />
          <Route exact path="/vendor/add" element={<VendorFormPage />} />
          <Route exact path="/vendor/edit/:id" element={<VendorFormPage />} />
          <Route exact path="/vendor/view/:id" element={<VendorFormPage />} />
          <Route exact path="/vendor-payment" element={<VendorPaymentPage />} />

          {/* Purchase Entry */}
          <Route exact path="/purchase-entry" element={<PurchaseListPage />} />
          <Route exact path="/purchase-entry/add" element={<AddPurchasePage />} />
          <Route exact path="/purchase-entry/view/:id" element={<ViewPurchasePage />} />
          <Route exact path="/email" element={<EmailPage />} />

          <Route exact path="/view-profile" element={<ViewProfilePage />} />
          <Route exact path="/my-profile" element={<MyProfilePage />} />
          <Route exact path="/company" element={<CompanyPage />} />

          <Route exact path="/payment-history" element={<PaymentHistoryPage />} />
          <Route exact path="/manual-payment" element={<ManualPaymentPage />} />
          <Route exact path="/inventory-list" element={<InventoryListPage />} />
          <Route exact path="/add-stock" element={<AddStockPage />} />

          {/* Reports Routes */}
          <Route exact path="/product-reports" element={<ProductReportsPage />} />
          <Route exact path="/customer-reports" element={<CustomerReportsPage />} />
          <Route exact path="/vendor-reports" element={<VendorReportsPage />} />
          <Route exact path="/payment-reports" element={<PaymentReportsPage />} />
          <Route exact path="/sales-reports" element={<SalesReportsPage />} />

          {/* User Module Routes */}
          <Route exact path="/user-list" element={<UserListPage />} />
          <Route exact path="/roles-permissions" element={<RolePermissionPage />} />
          <Route exact path="/activity-logs" element={<ActivityLogsPage />} />
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
