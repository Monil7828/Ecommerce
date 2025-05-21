"use client";

import { Fragment, useContext, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { PulseLoader } from "react-spinners";

import { GlobalContext } from "@/context";
import { adminNavOptions, navOptions } from "@/utils";
import CommonModal from "../CommonModal";
import CartModal from "../CartModal";

// NavItems component
function NavItems({ isModalView = false, isAdminView, handleButtonClick }) {
  const { isAuthUser } = useContext(GlobalContext);
  const pathName = usePathname();
  const [loadingItem, setLoadingItem] = useState(null);

  const handleNavClick = async (item) => {
    if (!isAuthUser && item.path !== "/login" && item.path !== "/") {
      toast.warning("Please login first to access this page");
      return;
    }

    setLoadingItem(item.id);
    try {
      await handleButtonClick(item.path);
    } finally {
      setLoadingItem(null);
    }
  };

  return (
    <div
      className={`items-center justify-between w-full md:flex md:w-auto ${
        isModalView ? "" : "hidden"
      }`}
      id="nav-items"
    >
      <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium rounded-lg md:flex-row md:space-x-6 md:mt-0">
        {(isAdminView ? adminNavOptions : navOptions).map((item) => (
          <li
            key={item.id}
            className={`cursor-pointer block py-2 px-3 rounded md:p-0 transition-all duration-200 transform hover:scale-105 min-w-[100px] text-center ${
              pathName === item.path
                ? "text-indigo-600 font-semibold"
                : "text-gray-900 hover:text-indigo-600"
            }`}
            onClick={() => handleNavClick(item)}
          >
            {loadingItem === item.id ? (
              <div className="flex items-center justify-center h-6">
                <PulseLoader color="#6366f1" size={8} />
              </div>
            ) : (
              <span>{item.label}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

// Navbar component
export default function Navbar() {
  const {
    user,
    isAuthUser,
    setIsAuthUser,
    setUser,
    currentUpdatedProduct,
    setCurrentUpdatedProduct,
    showCartModal,
    setShowCartModal,
    showNavModal,
    setShowNavModal,
  } = useContext(GlobalContext);

  const pathName = usePathname();
  const router = useRouter();

  const [isNavigating, setIsNavigating] = useState(false);
  const [buttonLoading, setButtonLoading] = useState({
    account: false,
    cart: false,
    adminView: false,
    logout: false,
    login: false,
    menu: false,
  });

  // Clear currentUpdatedProduct when leaving admin add-product page
  useEffect(() => {
    if (
      pathName !== "/admin-view/add-product" &&
      currentUpdatedProduct !== null
    ) {
      setCurrentUpdatedProduct(null);
    }
  }, [pathName, currentUpdatedProduct, setCurrentUpdatedProduct]);

  const isAdminView = pathName.includes("admin-view");

  // Manual loading state management for navigation
  const handleButtonClick = async (path) => {
    try {
      setIsNavigating(true);
      await router.push(path);
    } finally {
      setIsNavigating(false);
    }
  };

  const handleLogout = async () => {
    try {
      setButtonLoading((prev) => ({ ...prev, logout: true }));
      setIsAuthUser(false);
      setUser(null);
      Cookies.remove("token");
      localStorage.clear();
      await router.push("/");
    } finally {
      setButtonLoading((prev) => ({ ...prev, logout: false }));
    }
  };

  const handleCartClick = async () => {
    try {
      setButtonLoading((prev) => ({ ...prev, cart: true }));
      setShowCartModal(true);
    } finally {
      setButtonLoading((prev) => ({ ...prev, cart: false }));
    }
  };

  const handleMenuClick = async () => {
    try {
      setButtonLoading((prev) => ({ ...prev, menu: true }));
      setShowNavModal(true);
    } finally {
      setButtonLoading((prev) => ({ ...prev, menu: false }));
    }
  };

  return (
    <>
      {isNavigating && (
        <div className="fixed inset-0 z-30 bg-white/50 backdrop-blur-sm flex items-center justify-center">
          <PulseLoader color="#6366f1" size={15} />
        </div>
      )}

      <nav className="bg-white/80 backdrop-blur-md shadow-sm fixed w-full z-40 top-0 left-0 border-b border-gray-100 h-20 flex items-center">
        <div className="max-w-7xl w-full flex flex-wrap items-center justify-between mx-auto px-4 py-4">
          <div
            onClick={() => handleButtonClick("/")}
            className="flex items-center cursor-pointer transform hover:scale-105 transition-transform duration-200"
          >
            <span
              className={`self-center text-3xl text-black hover:text-indigo-600 font-bold whitespace-nowrap transition-colors duration-200 "
              }`}
            >
              Spargen
            </span>
          </div>

          <div className="flex md:order-2 gap-3 items-center">
            {!isAdminView && isAuthUser && (
              <Fragment>
                {/* Cart */}
                <button
                  className={`relative p-2 rounded-full transition-all duration-200 transform hover:scale-110 focus:outline-none ${
                    pathName === "/cart"
                      ? "text-indigo-600 bg-indigo-50"
                      : "text-gray-600 hover:text-indigo-600 hover:bg-indigo-50"
                  }`}
                  onClick={handleCartClick}
                  disabled={buttonLoading.cart || isNavigating}
                >
                  {buttonLoading.cart ? (
                    <PulseLoader color="#6366f1" size={8} />
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                      <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        0
                      </span>
                    </>
                  )}
                </button>
              </Fragment>
            )}
            {/* Account */}
            <button
              className={`relative p-2 rounded-full transition-all duration-200 transform hover:scale-110 focus:outline-none ${
                pathName === "/account"
                  ? "text-indigo-600 bg-indigo-50"
                  : "text-gray-600 hover:text-indigo-600 hover:bg-indigo-50"
              }`}
              onClick={() => handleButtonClick("/account")}
              disabled={buttonLoading.account || isNavigating}
            >
              {buttonLoading.account ? (
                <PulseLoader color="#6366f1" size={8} />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              )}
            </button>

            {/* Admin Toggle */}
            {user?.role === "admin" && (
              <button
                onClick={() =>
                  handleButtonClick(isAdminView ? "/" : "/admin-view")
                }
                className={`px-4 py-2 text-sm font-medium rounded-lg border transition-all duration-200 transform hover:scale-105 ${
                  isAdminView
                    ? "text-white bg-indigo-600 border-indigo-600 hover:bg-indigo-700"
                    : "text-indigo-600 border-indigo-600 hover:text-white hover:bg-indigo-600"
                }`}
                disabled={buttonLoading.adminView || isNavigating}
              >
                {buttonLoading.adminView ? (
                  <PulseLoader
                    color={isAdminView ? "#ffffff" : "#6366f1"}
                    size={8}
                  />
                ) : isAdminView ? (
                  "Client View"
                ) : (
                  "Admin View"
                )}
              </button>
            )}

            {!isAuthUser && (
              <button
                onClick={() => handleButtonClick("/login")}
                className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-all duration-200 transform hover:scale-105 ${
                  pathName === "/login"
                    ? "bg-indigo-700"
                    : "bg-indigo-600 hover:bg-indigo-700"
                }`}
                disabled={buttonLoading.login || isNavigating}
              >
                {buttonLoading.login ? (
                  <PulseLoader color="#ffffff" size={8} />
                ) : (
                  "Login"
                )}
              </button>
            )}

            {/* Hamburger (mobile) */}
            <button
              onClick={handleMenuClick}
              className="md:hidden p-2 rounded-md hover:bg-indigo-50 text-indigo-600 transition-colors duration-200"
              disabled={buttonLoading.menu || isNavigating}
              aria-label="Toggle menu"
            >
              {buttonLoading.menu ? (
                <PulseLoader color="#6366f1" size={8} />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>

          {/* Nav Items (desktop) */}
          <NavItems
            isAdminView={isAdminView}
            handleButtonClick={handleButtonClick}
          />

          {/* Nav Items Modal (mobile) */}
          {showNavModal && (
            <CommonModal
              open={showNavModal}
              setOpen={setShowNavModal}
              className="top-[5.5rem] max-w-xs w-full rounded-md p-0"
            >
              <NavItems
                isModalView={true}
                isAdminView={isAdminView}
                handleButtonClick={handleButtonClick}
              />
            </CommonModal>
          )}

          {/* Cart Modal */}
          {showCartModal && (
            <CartModal open={showCartModal} setOpen={setShowCartModal} />
          )}
        </div>
      </nav>
    </>
  );
}
