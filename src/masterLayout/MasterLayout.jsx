import React, { useEffect, useState, useRef } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Link, NavLink, useLocation } from "react-router-dom";
import ThemeToggleButton from "../helper/ThemeToggleButton";
import { IMAGE_BASE_URL } from "../Config/Index";
import LoginApi from "../Api/LoginApi";

const MasterLayout = ({ children }) => {
  let [sidebarActive, seSidebarActive] = useState(false);
  let [mobileMenu, setMobileMenu] = useState(false);
  const location = useLocation(); // Hook to get the current route
  const sidebarRef = useRef(null);
  const [permissions, setPermissions] = useState([]);
  const [userType, setUserType] = useState("");
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const result = await LoginApi.getRolesAndPermissions();
        if (result.status) {
          const user = result.response.data;
          setUserData(user);
          setUserType(user.userType);
          setPermissions(user.permissions || []);
        }
      } catch (error) {
        console.error("Error fetching permissions:", error);
      }
    };
    fetchPermissions();
  }, []);

  const hasPermission = (moduleName, action = "view") => {
    if (userType === "ADMIN") return true;
    const module = permissions.find((perm) => perm.moduleName === moduleName);
    return module?.actions?.[action];
  };
  useEffect(() => {
    const handleDropdownClick = (event) => {
      event.preventDefault();
      const clickedLink = event.currentTarget;
      const clickedDropdown = clickedLink.closest(".dropdown");

      if (!clickedDropdown) return;

      const isActive = clickedDropdown.classList.contains("open");
      const allDropdowns = document.querySelectorAll(".sidebar-menu .dropdown");
      allDropdowns.forEach((dropdown) => {
        dropdown.classList.remove("open");
        const submenu = dropdown.querySelector(".sidebar-submenu");
        if (submenu) {
          submenu.style.maxHeight = "0px";
        }
      });
      if (!isActive) {
        clickedDropdown.classList.add("open");
        const submenu = clickedDropdown.querySelector(".sidebar-submenu");
        if (submenu) {
          submenu.style.maxHeight = `${submenu.scrollHeight}px`;
        }
      }
    };
    const dropdownTriggers = document.querySelectorAll(
      ".sidebar-menu .dropdown > a, .sidebar-menu .dropdown > Link",
    );

    dropdownTriggers.forEach((trigger) => {
      trigger.addEventListener("click", handleDropdownClick);
    });

    const openActiveDropdown = () => {
      const allDropdowns = document.querySelectorAll(".sidebar-menu .dropdown");
      allDropdowns.forEach((dropdown) => {
        const submenuLinks = dropdown.querySelectorAll(".sidebar-submenu li a");
        submenuLinks.forEach((link) => {
          const path = link.getAttribute("href") || link.getAttribute("to");
          if (
            (path &&
              (location.pathname === path ||
                location.pathname.startsWith(path + "/"))) ||
            link.classList.contains("active-page")
          ) {
            dropdown.classList.add("open");
            const submenu = dropdown.querySelector(".sidebar-submenu");
            if (submenu) {
              submenu.style.maxHeight = `${submenu.scrollHeight}px`;
            }
          }
        });
      });

      setTimeout(() => {
        const activeLink = document.querySelector(".sidebar-menu .active-page");
        if (activeLink && sidebarRef.current) {
          activeLink.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
      }, 300);
    };

    // Open the submenu that contains the active route
    openActiveDropdown();

    // Cleanup event listeners on unmount
    return () => {
      dropdownTriggers.forEach((trigger) => {
        trigger.removeEventListener("click", handleDropdownClick);
      });
    };
  }, [location.pathname, permissions]); // Added permissions to dependency to re-run when updated

  useEffect(() => {
    // Restore scroll position
    const savedScrollPos = sessionStorage.getItem("sidebarScroll");
    if (savedScrollPos && sidebarRef.current) {
      sidebarRef.current.scrollTop = parseInt(savedScrollPos, 10);
    }

    const handleScroll = () => {
      if (sidebarRef.current) {
        sessionStorage.setItem("sidebarScroll", sidebarRef.current.scrollTop);
      }
    };

    const sidebar = sidebarRef.current;
    if (sidebar) {
      sidebar.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (sidebar) {
        sidebar.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  let sidebarControl = () => {
    seSidebarActive(!sidebarActive);
  };

  let mobileMenuControl = () => {
    setMobileMenu(!mobileMenu);
  };

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const dateStr = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  })
    .format(currentTime)
    .replace(/ /g, "-");

  const timeStr = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  }).format(currentTime);

  const formattedTime = `${dateStr} ${timeStr}`;

  return (
    <section className={mobileMenu ? "overlay active" : "overlay "}>
      {/* sidebar */}
      <aside
        className={
          sidebarActive
            ? "sidebar active "
            : mobileMenu
              ? "sidebar sidebar-open"
              : "sidebar"
        }
      >
        <button
          onClick={mobileMenuControl}
          type="button"
          className="sidebar-close-btn"
        >
          <Icon icon="radix-icons:cross-2" />
        </button>
        <div>
          <Link to="/" className="sidebar-logo">
            {sidebarActive ? (
              <img
                src="/assets/images/logo-icon.png"
                alt="site logo"
                className="logo-icon"
                style={{ width: '40px' }}
              />
            ) : (
              <span style={{ fontFamily: "'Aclonica', sans-serif", fontSize: '19px', fontWeight: '500', color: '#ffffff', letterSpacing: '0.05em', lineHeight: '1.2', whiteSpace: 'nowrap' }}>
                <span className="logo-highlight" style={{ fontSize: '1.2em', fontWeight: '700' }}>P</span>RRAYASHA <span className="logo-highlight" style={{ fontSize: '1.2em', fontWeight: '700' }}>C</span>OLLECTIONS
              </span>
            )}
          </Link>
        </div>
        <div className="sidebar-menu-area" ref={sidebarRef}>
          <ul className="sidebar-menu" id="sidebar-menu">
            {/* Dashboard */}
            {hasPermission("Dashboard") && (
              <li>
                <NavLink
                  to="/"
                  className={(navData) =>
                    navData.isActive ? "active-page" : ""
                  }
                >
                  <Icon
                    icon="solar:home-smile-angle-outline"
                    className="menu-icon"
                  />
                  <span>Dashboard</span>
                </NavLink>
              </li>
            )}

            {/* Master Creation */}
            {(hasPermission("Category") ||
              hasPermission("Sub Category") ||
              hasPermission("Brands") ||
              hasPermission("Attributes") ||
              hasPermission("Unit") ||
              hasPermission("Tax") ||
              hasPermission("Products") ||
              hasPermission("Shipping Methods")) && (
                <li className="dropdown">
                  <Link to="#"
                    className={
                      location.pathname.startsWith("/category") ||
                        location.pathname.startsWith("/sub-category") ||
                        location.pathname.startsWith("/brands") ||
                        location.pathname.startsWith("/attributes") ||
                        location.pathname.startsWith("/unit") ||
                        location.pathname.startsWith("/tax") ||
                        location.pathname.startsWith("/products") ||
                        location.pathname.startsWith("/shipping-methods")
                        ? "active-page"
                        : ""
                    }
                  >
                    <Icon icon="solar:Box-outline" className="menu-icon" />
                    <span>Master Creation</span>
                  </Link>
                  <ul className="sidebar-submenu">
                    {hasPermission("Category") && (
                      <li>
                        <NavLink to="/category" className={(navData) => navData.isActive ? "active-page" : ""}>
                          <i className="ri-circle-fill circle-icon text-primary-600 w-auto" /> Category
                        </NavLink>
                      </li>
                    )}
                    {hasPermission("Sub Category") && (
                      <li>
                        <NavLink to="/sub-category" className={(navData) => navData.isActive ? "active-page" : ""}>
                          <i className="ri-circle-fill circle-icon text-primary-600 w-auto" /> Sub Category
                        </NavLink>
                      </li>
                    )}
                    {hasPermission("Brands") && (
                      <li>
                        <NavLink to="/brands" className={(navData) => navData.isActive ? "active-page" : ""}>
                          <i className="ri-circle-fill circle-icon text-primary-600 w-auto" /> Brands
                        </NavLink>
                      </li>
                    )}
                    {hasPermission("Attributes") && (
                      <li>
                        <NavLink to="/attributes" className={(navData) => navData.isActive ? "active-page" : ""}>
                          <i className="ri-circle-fill circle-icon text-primary-600 w-auto" /> Attributes
                        </NavLink>
                      </li>
                    )}
                    {hasPermission("Unit") && (
                      <li>
                        <NavLink to="/units" className={(navData) => navData.isActive ? "active-page" : ""}>
                          <i className="ri-circle-fill circle-icon text-primary-600 w-auto" /> Unit
                        </NavLink>
                      </li>
                    )}
                    {hasPermission("Tax") && (
                      <li>
                        <NavLink to="/taxes" className={(navData) => navData.isActive ? "active-page" : ""}>
                          <i className="ri-circle-fill circle-icon text-primary-600 w-auto" /> Taxes
                        </NavLink>
                      </li>
                    )}
                    {hasPermission("Products") && (
                      <li>
                        <NavLink to="/products" className={(navData) => navData.isActive ? "active-page" : ""}>
                          <i className="ri-circle-fill circle-icon text-primary-600 w-auto" /> Products
                        </NavLink>
                      </li>
                    )}
                    {hasPermission("Shipping Methods") && (
                      <li>
                        <NavLink to="/shipping-methods" className={(navData) => navData.isActive ? "active-page" : ""}>
                          <i className="ri-circle-fill circle-icon text-primary-600 w-auto" /> Shipping Methods
                        </NavLink>
                      </li>
                    )}
                  </ul>
                </li>
              )}


            {/* Orders */}
            {(hasPermission("Customer Orders") ||
              hasPermission("Cancelled Orders") ||
              hasPermission("Return Orders") ||
              hasPermission("Orders Feedback")) && (
                <li className="dropdown">
                  <Link to="#">
                    <Icon icon="solar:cart-large-4-outline" className="menu-icon" />
                    <span>Orders</span>
                  </Link>
                  <ul className="sidebar-submenu">
                    {hasPermission("Customer Orders") && (
                      <li>
                        <NavLink to="/customer-orders" className={(navData) => navData.isActive ? "active-page" : ""}>
                          <i className="ri-circle-fill circle-icon text-primary-600 w-auto" /> Customer Orders
                        </NavLink>
                      </li>
                    )}
                    {hasPermission("Cancelled Orders") && (
                      <li>
                        <NavLink to="/cancelled-orders" className={(navData) => navData.isActive ? "active-page" : ""}>
                          <i className="ri-circle-fill circle-icon text-primary-600 w-auto" /> Cancelled Orders
                        </NavLink>
                      </li>
                    )}
                    {hasPermission("Return Orders") && (
                      <li>
                        <NavLink to="/return-orders" className={(navData) => navData.isActive ? "active-page" : ""}>
                          <i className="ri-circle-fill circle-icon text-primary-600 w-auto" /> Return Orders
                        </NavLink>
                      </li>
                    )}
                    {hasPermission("Orders Feedback") && (
                      <li>
                        <NavLink to="/orders-feedback" className={(navData) => navData.isActive ? "active-page" : ""}>
                          <i className="ri-circle-fill circle-icon text-primary-600 w-auto" /> Orders Feedback
                        </NavLink>
                      </li>
                    )}
                  </ul>
                </li>
              )}


            {/* Users */}
            {(hasPermission("User List") ||
              hasPermission("Role & Permission") ||
              hasPermission("Activity Logs") ||
              hasPermission("Customer List")) && (
                <li className="dropdown">
                  <Link to="#" className={
                    location.pathname.startsWith("/user-list") ||
                    location.pathname.startsWith("/roles-permissions") ||
                    location.pathname.startsWith("/activity-logs") ||
                    location.pathname.startsWith("/customer-list") ? "active-page" : ""
                  }>
                    <Icon icon="solar:users-group-two-rounded-outline" className="menu-icon" />
                    <span>Users</span>
                  </Link>
                  <ul className={
                    location.pathname.startsWith("/user-list") ||
                    location.pathname.startsWith("/roles-permissions") ||
                    location.pathname.startsWith("/activity-logs") ||
                    location.pathname.startsWith("/customer-list") ? "sidebar-submenu d-block" : "sidebar-submenu"
                  }>
                    {hasPermission("User List") && (
                      <li>
                        <NavLink to="/user-list" className={(navData) => navData.isActive ? "active-page" : ""}>
                          <i className="ri-circle-fill circle-icon text-primary-600 w-auto" /> User List
                        </NavLink>
                      </li>
                    )}
                    {hasPermission("Role & Permission") && (
                      <li>
                        <NavLink to="/roles-permissions" className={(navData) => navData.isActive ? "active-page" : ""}>
                          <i className="ri-circle-fill circle-icon text-primary-600 w-auto" /> Role & Permission
                        </NavLink>
                      </li>
                    )}
                    {hasPermission("Activity Logs") && (
                      <li>
                        <NavLink to="/activity-logs" className={(navData) => navData.isActive ? "active-page" : ""}>
                          <i className="ri-circle-fill circle-icon text-primary-600 w-auto" /> Activity Logs
                        </NavLink>
                      </li>
                    )}
                    {hasPermission("Customer List") && (
                      <li>
                        <NavLink to="/customer-list" className={(navData) => navData.isActive ? "active-page" : ""}>
                          <i className="ri-circle-fill circle-icon text-primary-600 w-auto" /> Customer List
                        </NavLink>
                      </li>
                    )}
                  </ul>
                </li>
              )}

            {/* POS */}
            {(hasPermission("POS Order") || hasPermission("POS Order History")) && (
              <li className="dropdown">
                <Link to="#">
                  <Icon icon="solar:calculator-outline" className="menu-icon" />
                  <span>POS</span>
                </Link>
                <ul className="sidebar-submenu">
                  {hasPermission("POS Order") && (
                    <li>
                      <NavLink to="/pos-order" className={(navData) => navData.isActive ? "active-page" : ""}>
                        <i className="ri-circle-fill circle-icon text-primary-600 w-auto" /> POS Order
                      </NavLink>
                    </li>
                  )}
                  {hasPermission("POS Order History") && (
                    <li>
                      <NavLink to="/pos-history" className={(navData) => navData.isActive ? "active-page" : ""}>
                        <i className="ri-circle-fill circle-icon text-primary-600 w-auto" /> POS History
                      </NavLink>
                    </li>
                  )}
                </ul>
              </li>
            )}

            {/* Vendor */}
            {(hasPermission("Vendor") ||
              hasPermission("Purchase Entry")) && (
                <li className="dropdown">
                  <Link to="#">
                    <Icon icon="solar:shop-2-outline" className="menu-icon" />
                    <span>Vendor</span>
                  </Link>
                  <ul className="sidebar-submenu">
                    {hasPermission("Vendor") && (
                      <li>
                        <NavLink to="/vendor-list" className={(navData) => navData.isActive ? "active-page" : ""}>
                          <i className="ri-circle-fill circle-icon text-primary-600 w-auto" /> Vendor List
                        </NavLink>
                      </li>
                    )}
                    {hasPermission("Purchase Entry") && (
                      <li>
                        <NavLink to="/purchase-entry" className={(navData) => navData.isActive ? "active-page" : ""}>
                          <i className="ri-circle-fill circle-icon text-primary-600 w-auto" /> Purchase Entry
                        </NavLink>
                      </li>
                    )}
                    {hasPermission("Vendor") && (
                      <li>
                        <NavLink to="/vendor-payment" className={(navData) => navData.isActive ? "active-page" : ""}>
                          <i className="ri-circle-fill circle-icon text-primary-600 w-auto" /> Payment
                        </NavLink>
                      </li>
                    )}
                  </ul>
                </li>
              )}

            {/* Payments */}
            {(hasPermission("Payment History") || hasPermission("Manual Payment")) && (
              <li className="dropdown">
                <Link to="#">
                  <Icon icon="solar:card-2-outline" className="menu-icon" />
                  <span>Payments</span>
                </Link>
                <ul className="sidebar-submenu">
                  {hasPermission("Payment History") && (
                    <li>
                      <NavLink to="/payment-history" className={(navData) => navData.isActive ? "active-page" : ""}>
                        <i className="ri-circle-fill circle-icon text-primary-600 w-auto" /> Payment History
                      </NavLink>
                    </li>
                  )}
                  {hasPermission("Manual Payment") && (
                    <li>
                      <NavLink to="/manual-payment" className={(navData) => navData.isActive ? "active-page" : ""}>
                        <i className="ri-circle-fill circle-icon text-primary-600 w-auto" /> Manual Payment
                      </NavLink>
                    </li>
                  )}
                </ul>
              </li>
            )}

            {/* Inventory */}
            {(hasPermission("Inventory List") || hasPermission("Add Stock")) && (
              <li className="dropdown">
                <Link to="#">
                  <Icon icon="solar:box-minimalistic-outline" className="menu-icon" />
                  <span>Inventory</span>
                </Link>
                <ul className="sidebar-submenu">
                  {hasPermission("Inventory List") && (
                    <li>
                      <NavLink to="/inventory-list" className={(navData) => navData.isActive ? "active-page" : ""}>
                        <i className="ri-circle-fill circle-icon text-primary-600 w-auto" /> Inventory List
                      </NavLink>
                    </li>
                  )}
                  {hasPermission("Add Stock") && (
                    <li>
                      <NavLink to="/add-stock" className={(navData) => navData.isActive ? "active-page" : ""}>
                        <i className="ri-circle-fill circle-icon text-primary-600 w-auto" /> Add Stock
                      </NavLink>
                    </li>
                  )}
                </ul>
              </li>
            )}

            {/* Reports */}
            {(hasPermission("Product Reports") ||
              hasPermission("Customer Reports") ||
              hasPermission("Vendor Reports") ||
              hasPermission("Payment Reports") ||
              hasPermission("Sales Reports")) && (
                <li className="dropdown">
                  <Link to="#">
                    <Icon icon="solar:chart-2-outline" className="menu-icon" />
                    <span>Reports</span>
                  </Link>
                  <ul className="sidebar-submenu">
                    {hasPermission("Product Reports") && (
                      <li>
                        <NavLink to="/product-reports" className={(navData) => navData.isActive ? "active-page" : ""}>
                          <i className="ri-circle-fill circle-icon text-primary-600 w-auto" /> Product reports
                        </NavLink>
                      </li>
                    )}
                    {hasPermission("Customer Reports") && (
                      <li>
                        <NavLink to="/customer-reports" className={(navData) => navData.isActive ? "active-page" : ""}>
                          <i className="ri-circle-fill circle-icon text-primary-600 w-auto" /> customer reports
                        </NavLink>
                      </li>
                    )}
                    {hasPermission("Vendor Reports") && (
                      <li>
                        <NavLink to="/vendor-reports" className={(navData) => navData.isActive ? "active-page" : ""}>
                          <i className="ri-circle-fill circle-icon text-primary-600 w-auto" /> Vendor reports
                        </NavLink>
                      </li>
                    )}
                    {hasPermission("Payment Reports") && (
                      <li>
                        <NavLink to="/payment-reports" className={(navData) => navData.isActive ? "active-page" : ""}>
                          <i className="ri-circle-fill circle-icon text-primary-600 w-auto" /> Payment Reports
                        </NavLink>
                      </li>
                    )}
                    {hasPermission("Sales Reports") && (
                      <li>
                        <NavLink to="/sales-reports" className={(navData) => navData.isActive ? "active-page" : ""}>
                          <i className="ri-circle-fill circle-icon text-primary-600 w-auto" /> Sales reports
                        </NavLink>
                      </li>
                    )}
                  </ul>
                </li>
              )}

          </ul>
        </div>
      </aside>

      <main
        className={sidebarActive ? "dashboard-main active" : "dashboard-main"}
      >
        <div className="navbar-header">
          <div className="row align-items-center justify-content-between">
            <div className="col-auto">
              <div className="d-flex flex-wrap align-items-center gap-4">
                <button
                  type="button"
                  className="sidebar-toggle"
                  onClick={sidebarControl}
                >
                  {sidebarActive ? (
                    <Icon
                      icon="iconoir:arrow-right"
                      className="icon text-2xl non-active"
                    />
                  ) : (
                    <Icon
                      icon="heroicons:bars-3-solid"
                      className="icon text-2xl non-active "
                    />
                  )}
                </button>
                <button
                  onClick={mobileMenuControl}
                  type="button"
                  className="sidebar-mobile-toggle"
                >
                  <Icon icon="heroicons:bars-3-solid" className="icon" />
                </button>
              </div>
            </div>
            <div className="col-auto">
              <div className="d-flex flex-wrap align-items-center gap-3">
                <span
                  style={{
                    color: "#003366",
                    fontWeight: "600",
                    fontSize: "16px",
                  }}
                >
                  {formattedTime}
                </span>
                {/* <ThemeToggleButton /> */}
                <div className="dropdown d-none d-sm-inline-block">
                  {/* <button
                    className="has-indicator w-40-px h-40-px bg-neutral-200 rounded-circle d-flex justify-content-center align-items-center"
                    type="button"
                    data-bs-toggle="dropdown"
                  >
                    <Icon
                      icon="iconoir:bell"
                      className="text-primary-light text-xl"
                    />
                  </button> */}
                  <div className="dropdown-menu to-top dropdown-menu-lg p-0">
                    <div className="m-16 py-12 px-16 radius-8 bg-primary-50 mb-16 d-flex align-items-center justify-content-between gap-2">
                      <div>
                        <h6 className="text-lg text-primary-light fw-semibold mb-0">
                          Notifications
                        </h6>
                      </div>
                      <span className="text-primary-600 fw-semibold text-lg w-40-px h-40-px rounded-circle bg-base d-flex justify-content-center align-items-center">
                        05
                      </span>
                    </div>
                    <div className="max-h-400-px overflow-y-auto scroll-sm pe-4">
                      <Link
                        to="#"
                        className="px-24 py-12 d-flex align-items-start gap-3 mb-2 justify-content-between"
                      >
                        <div className="text-black hover-bg-transparent hover-text-primary d-flex align-items-center gap-3">
                          <span className="w-44-px h-44-px bg-success-subtle text-success-main rounded-circle d-flex justify-content-center align-items-center flex-shrink-0">
                            <Icon
                              icon="bitcoin-icons:verify-outline"
                              className="icon text-xxl"
                            />
                          </span>
                          <div>
                            <h6 className="text-md fw-semibold mb-4">
                              Congratulations
                            </h6>
                            <p className="mb-0 text-sm text-secondary-light text-w-200-px">
                              Your profile has been Verified. Your profile has
                              been Verified
                            </p>
                          </div>
                        </div>
                        <span className="text-sm text-secondary-light flex-shrink-0">
                          23 Mins ago
                        </span>
                      </Link>
                      <Link
                        to="#"
                        className="px-24 py-12 d-flex align-items-start gap-3 mb-2 justify-content-between bg-neutral-50"
                      >
                        <div className="text-black hover-bg-transparent hover-text-primary d-flex align-items-center gap-3">
                          <span className="w-44-px h-44-px bg-success-subtle text-success-main rounded-circle d-flex justify-content-center align-items-center flex-shrink-0">
                            <img
                              src="/assets/images/notification/profile-1.png"
                              alt=""
                            />
                          </span>
                          <div>
                            <h6 className="text-md fw-semibold mb-4">
                              Ronald Richards
                            </h6>
                            <p className="mb-0 text-sm text-secondary-light text-w-200-px">
                              You can stitch between artboards
                            </p>
                          </div>
                        </div>
                        <span className="text-sm text-secondary-light flex-shrink-0">
                          23 Mins ago
                        </span>
                      </Link>
                      <Link
                        to="#"
                        className="px-24 py-12 d-flex align-items-start gap-3 mb-2 justify-content-between"
                      >
                        <div className="text-black hover-bg-transparent hover-text-primary d-flex align-items-center gap-3">
                          <span className="w-44-px h-44-px bg-info-subtle text-info-main rounded-circle d-flex justify-content-center align-items-center flex-shrink-0">
                            AM
                          </span>
                          <div>
                            <h6 className="text-md fw-semibold mb-4">
                              Arlene McCoy
                            </h6>
                            <p className="mb-0 text-sm text-secondary-light text-w-200-px">
                              Invite you to prototyping
                            </p>
                          </div>
                        </div>
                        <span className="text-sm text-secondary-light flex-shrink-0">
                          23 Mins ago
                        </span>
                      </Link>
                      <Link
                        to="#"
                        className="px-24 py-12 d-flex align-items-start gap-3 mb-2 justify-content-between bg-neutral-50"
                      >
                        <div className="text-black hover-bg-transparent hover-text-primary d-flex align-items-center gap-3">
                          <span className="w-44-px h-44-px bg-success-subtle text-success-main rounded-circle d-flex justify-content-center align-items-center flex-shrink-0">
                            <img
                              src="/assets/images/notification/profile-2.png"
                              alt=""
                            />
                          </span>
                          <div>
                            <h6 className="text-md fw-semibold mb-4">
                              Annette Black
                            </h6>
                            <p className="mb-0 text-sm text-secondary-light text-w-200-px">
                              Invite you to prototyping
                            </p>
                          </div>
                        </div>
                        <span className="text-sm text-secondary-light flex-shrink-0">
                          23 Mins ago
                        </span>
                      </Link>
                      <Link
                        to="#"
                        className="px-24 py-12 d-flex align-items-start gap-3 mb-2 justify-content-between"
                      >
                        <div className="text-black hover-bg-transparent hover-text-primary d-flex align-items-center gap-3">
                          <span className="w-44-px h-44-px bg-info-subtle text-info-main rounded-circle d-flex justify-content-center align-items-center flex-shrink-0">
                            DR
                          </span>
                          <div>
                            <h6 className="text-md fw-semibold mb-4">
                              Darlene Robertson
                            </h6>
                            <p className="mb-0 text-sm text-secondary-light text-w-200-px">
                              Invite you to prototyping
                            </p>
                          </div>
                        </div>
                        <span className="text-sm text-secondary-light flex-shrink-0">
                          23 Mins ago
                        </span>
                      </Link>
                    </div>
                    <div className="text-center py-12 px-16">
                      <Link
                        to="#"
                        className="text-primary-600 fw-semibold text-md hover-text-primary d-flex justify-content-center align-items-center gap-2"
                      >
                        See All Notifications
                        <Icon
                          icon="solar:arrow-right-linear"
                          className="icon"
                        />
                      </Link>
                    </div>
                  </div>
                </div>
                {/* Notification dropdown end */}

                <div className="dropdown">
                  <button
                    className="d-flex justify-content-center align-items-center rounded-circle border-0 p-0"
                    type="button"
                    data-bs-toggle="dropdown"
                  >
                    {userData?.profileImage ? (
                      <img
                        src={`${IMAGE_BASE_URL}/${userData.profileImage?.path || userData.profileImage}`}
                        alt="image"
                        className="w-40-px h-40-px object-fit-cover rounded-circle"
                      />
                    ) : (
                      <div
                        className="w-40-px h-40-px bg-primary-600 text-white rounded-circle d-flex justify-content-center align-items-center fw-bold"
                        style={{ fontSize: '18px' }}
                      >
                        {userData?.name?.charAt(0).toUpperCase() || "A"}
                      </div>
                    )}
                  </button>
                  <div className="dropdown-menu to-top dropdown-menu-sm p-0">
                    <div className="p-16 px-24 border-bottom">
                      <h6 className="text-lg fw-semibold text-primary-light mb-0">
                        {userData?.name || "Administrator"}
                      </h6>
                      <span className="text-secondary-light text-sm">
                        {userData?.roleId?.name || userData?.role?.name || "Admin"}
                      </span>
                    </div>
                    <ul className="p-16">
                      {/* <li>
                        <Link
                          to="/my-profile"
                          className="d-flex align-items-center gap-3 hover-bg-primary-50 text-secondary-light radius-8 px-12 py-12"
                        >
                          <Icon
                            icon="solar:user-circle-outline"
                            className="icon text-xl"
                          />
                          My Profile
                        </Link>
                      </li> */}
                      <li>
                        <button
                          onClick={() => {
                            if (
                              window.confirm("Are you sure you want to logout?")
                            ) {
                              localStorage.clear();
                              window.location.href = "/sign-in";
                            }
                          }}
                          className="d-flex align-items-center gap-3 hover-bg-primary-50 text-secondary-light radius-8 px-12 py-12 border-0 bg-transparent w-100"
                        >
                          <Icon
                            icon="solar:logout-2-outline"
                            className="icon text-xl"
                          />
                          Log Out
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
                {/* Profile dropdown end */}
              </div>
            </div>
          </div>
        </div>

        {/* dashboard-main-body */}
        <div className="dashboard-main-body">{children}</div>

        {/* Footer section */}
        <footer className="d-footer">
          <div className="row align-items-center">
            <div className="col-12 d-flex justify-content-between">

              {/* Left Side */}
              <p className="mb-0 text-start">
                © {new Date().getFullYear()}{" "}
                <span className="text-primary-600">CNI.</span> All Rights Reserved.
              </p>

              {/* Right Side */}
              <p className="mb-0 text-end">
                Developed & Maintained By{" "}
                <span className="text-primary-600">Ocean Softwares</span>
              </p>

            </div>
          </div>
        </footer>
      </main>
    </section>
  );
};

export default MasterLayout;
