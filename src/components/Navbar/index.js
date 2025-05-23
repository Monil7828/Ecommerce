"use client";

import {
  Fragment,
  useContext,
  useEffect,
  useState,
  useTransition,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { PulseLoader } from "react-spinners";

import { GlobalContext } from "@/context";
import { adminNavOptions, navOptions } from "@/utils";
import CommonModal from "../CommonModal";
import CartModal from "../CartModal";
// Login Prompt Modal Component
function LoginPromptModal({ open, setOpen, onLoginClick }) {
  return (
    <CommonModal
      show={open}
      setShow={setOpen}
      mainContent={
        <div className="p-4 text-center pt-20">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Login Required
          </h3>
          <p className="text-gray-600 mb-4">
            Please login first to access this page
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                setOpen(false);
                onLoginClick();
              }}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors duration-200"
            >
              Login
            </button>
          </div>
        </div>
      }
    />
  );
}

// NavItems component
function NavItems({
  isModalView = false,
  isAdminView,
  handleButtonClick,
  onProtectedClick,
}) {
  const { isAuthUser } = useContext(GlobalContext);
  const pathName = usePathname();
  const [loadingItem, setLoadingItem] = useState(null);

  const handleNavClick = async (item) => {
    if (!isAuthUser && item.path !== "/login" && item.path !== "/") {
      onProtectedClick(item.path);
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
    <ul
      className={`flex flex-col md:flex-row md:space-x-6 p-4 md:p-0 font-medium md:mt-0 ${
        isModalView ? "" : "hidden md:flex"
      }`}
    >
      {(isAdminView ? adminNavOptions : navOptions).map((item) => (
        <li
          key={item.id}
          onClick={() => handleNavClick(item)}
          className={`cursor-pointer py-2 px-3 rounded text-center min-w-[100px] transition-transform duration-200 hover:scale-105 ${
            pathName === item.path
              ? "text-indigo-600 font-semibold"
              : "text-gray-900 hover:text-indigo-600"
          }`}
        >
          {loadingItem === item.id ? (
            <div className="flex justify-center h-6">
              <PulseLoader color="#000000" size={8} />
            </div>
          ) : (
            item.label
          )}
        </li>
      ))}
    </ul>
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
    cartItems,
  } = useContext(GlobalContext);

  const pathName = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [buttonLoading, setButtonLoading] = useState({
    account: false,
    cart: false,
    adminView: false,
    logout: false,
    login: false,
    menu: false,
  });
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [protectedPath, setProtectedPath] = useState(null);

  const isAdminView = pathName.includes("admin-view");

  useEffect(() => {
    if (
      pathName !== "/admin-view/add-product" &&
      currentUpdatedProduct !== null
    ) {
      setCurrentUpdatedProduct(null);
    }
  }, [pathName, currentUpdatedProduct, setCurrentUpdatedProduct]);

  const handleButtonClick = (path) => {
    startTransition(() => {
      router.push(path);
    });
  };

  const handleLogout = async () => {
    try {
      setButtonLoading((prev) => ({ ...prev, logout: true }));
      setIsAuthUser(false);
      setUser(null);
      Cookies.remove("token");
      localStorage.clear();
      startTransition(() => {
        router.push("/");
      });
    } finally {
      setButtonLoading((prev) => ({ ...prev, logout: false }));
    }
  };

  const handleCartClick = () => {
    if (!isAuthUser) {
      setProtectedPath("/cart");
      setShowLoginPrompt(true);
      return;
    }
    setButtonLoading((prev) => ({ ...prev, cart: true }));
    setShowCartModal(true);
    setButtonLoading((prev) => ({ ...prev, cart: false }));
  };

  const handleMenuClick = () => {
    setButtonLoading((prev) => ({ ...prev, menu: true }));
    setTimeout(() => {
      setShowNavModal((prev) => !prev);
      setButtonLoading((prev) => ({ ...prev, menu: false }));
    }, 200);
  };

  const handleLoginPromptConfirm = () => {
    handleButtonClick("/login");
  };

  return (
    <>
      {isPending && (
        <div className="fixed inset-0 z-50 bg-white/50 backdrop-blur-sm flex items-center justify-center transition-opacity duration-300">
          <PulseLoader color="#000000" size={15} />
        </div>
      )}

      <nav className="fixed top-0 left-0 w-full h-20 bg-white/70 backdrop-blur-md border-b border-gray-100 shadow-sm z-40 flex items-center transition-all duration-300">
        <div className="max-w-7xl mx-auto w-full px-4 flex items-center justify-between">
          {/* Logo & Brand Name */}
          <div
            onClick={() => handleButtonClick("/")}
            className="flex items-center space-x-3 cursor-pointer group transition-all duration-200"
          >
            {/* Logo Image */}
            <div className="h-20 w-auto flex-shrink-0 overflow-hidden rounded-lg p-0 hover:scale-105 transition-all duration-200">
              <img
                src="/logo.png"
                alt="Spargen Logo"
                className="h-full w-full object-contain"
              />
            </div>

            {/* Brand Name */}
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-gray-900 transition-all duration-200">
                Spargen
              </span>
              <span className="text-xs text-gray-500 hidden sm:block">
                Premium Collection
              </span>
            </div>
          </div>

          <NavItems
            isAdminView={isAdminView}
            handleButtonClick={handleButtonClick}
            onProtectedClick={(path) => {
              setProtectedPath(path);
              setShowLoginPrompt(true);
            }}
          />

          <div className="flex items-center gap-3">
            {isAuthUser && !isAdminView && (
              <button
                onClick={handleCartClick}
                disabled={buttonLoading.cart || isPending}
                className="relative p-2 rounded-full hover:shadow-sm hover:shadow-indigo-500 hover:scale-105 bg-indigo-50 text-gray-600 hover:text-indigo-600 transition-all duration-200"
              >
                {buttonLoading.cart ? (
                  <PulseLoader color="#6366f1" size={8} />
                ) : (
                  <>
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.3 2.3c-.6.6-.2 1.7.7 1.7H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span className="absolute -top-1 -right-1 text-xs font-bold text-white bg-indigo-600 rounded-full w-5 h-5 flex items-center justify-center">
                      {cartItems?.length || 0}
                    </span>
                  </>
                )}
              </button>
            )}

            {/* Account */}
            {isAuthUser && !isAdminView && (
              <button
                onClick={() => handleButtonClick("/account")}
                className="p-2 rounded-full hover:shadow-sm hover:shadow-indigo-500 hover:scale-105 bg-indigo-50 text-gray-600 hover:text-indigo-600 transition-all duration-200"
                disabled={buttonLoading.account || isPending}
              >
                {buttonLoading.account ? (
                  <PulseLoader color="#6366f1" size={8} />
                ) : (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                )}
              </button>
            )}

            {/* Admin View Toggle */}
            {user?.role === "admin" && (
              <button
                onClick={() =>
                  handleButtonClick(isAdminView ? "/" : "/admin-view")
                }
                disabled={buttonLoading.adminView || isPending}
                className={`px-4 py-2 text-sm rounded-lg font-medium border transition-all duration-200 hover:scale-105 ${
                  isAdminView
                    ? "bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700"
                    : "text-indigo-600 border-indigo-600 hover:bg-indigo-600 hover:text-white"
                }`}
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

            {/* Login/Logout */}
            {!isAuthUser && (
              <button
                onClick={() => handleButtonClick("/login")}
                disabled={buttonLoading.login || isPending}
                className="px-4 py-2 text-sm font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-all duration-200 hover:scale-105"
              >
                {buttonLoading.login ? (
                  <PulseLoader color="#ffffff" size={8} />
                ) : (
                  "Login"
                )}
              </button>
            )}

            {/* Hamburger */}
            <button
              onClick={handleMenuClick}
              disabled={buttonLoading.menu}
              className="md:hidden p-2 rounded-md hover:bg-indigo-50 text-indigo-600 transition-all duration-200"
            >
              {buttonLoading.menu ? (
                <PulseLoader color="#6366f1" size={8} />
              ) : (
                <svg
                  className="h-6 w-6 transition-transform duration-200"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Modal with transition */}
      <div
        className={`fixed inset-0 z-50 bg-black bg-opacity-40 md:hidden transition-opacity duration-300 ${
          showNavModal ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className={`absolute top-20 right-0 w-full max-w-xs bg-white p-4 shadow-lg transition-transform duration-300 ${
            showNavModal ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <NavItems
            isModalView={true}
            isAdminView={isAdminView}
            handleButtonClick={(path) => {
              handleButtonClick(path);
              setShowNavModal(false);
            }}
            onProtectedClick={(path) => {
              setProtectedPath(path);
              setShowLoginPrompt(true);
              setShowNavModal(false);
            }}
          />
        </div>
      </div>

      {/* Cart Modal */}
      {showCartModal && (
        <CartModal open={showCartModal} setOpen={setShowCartModal} />
      )}

      {/* Login Prompt Modal */}
      <LoginPromptModal
        open={showLoginPrompt}
        setOpen={setShowLoginPrompt}
        onLoginClick={handleLoginPromptConfirm}
      />
    </>
  );
}
