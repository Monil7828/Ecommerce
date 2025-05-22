"use client";

import InputComponent from "@/components/FormElements/InputComponent";
import SelectComponent from "@/components/FormElements/SelectComponent";
import ComponentLevelLoader from "@/components/Loader/componentlevel";
import Notification from "@/components/Notification";
import { GlobalContext } from "@/context";
import { registerNewUser } from "@/services/register";
import { registrationFormControls } from "@/utils";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

const initialFormData = {
  name: "",
  email: "",
  password: "",
  role: "customer",
};

export default function Register() {
  const [formData, setFormData] = useState(initialFormData);
  const [isRegistered, setIsRegistered] = useState(false);
  const { componentLevelLoader, setComponentLevelLoader, isAuthUser } = useContext(GlobalContext);
  const [isHovering, setIsHovering] = useState(false);

  const router = useRouter();

  function isFormValid() {
    return formData &&
      formData.name &&
      formData.name.trim() !== "" &&
      formData.email &&
      formData.email.trim() !== "" &&
      formData.password &&
      formData.password.trim() !== ""
      ? true
      : false;
  }

  async function handleRegisterOnSubmit() {
    setComponentLevelLoader({ loading: true, id: "" });
    const data = await registerNewUser(formData);

    if (data.success) {
      toast.success(data.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      setIsRegistered(true);
      setComponentLevelLoader({ loading: false, id: "" });
      setFormData(initialFormData);
    } else {
      toast.error(data.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      setComponentLevelLoader({ loading: false, id: "" });
      setFormData(initialFormData);
    }
  }

  useEffect(() => {
    if (isAuthUser) router.push("/");
  }, [isAuthUser]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl flex flex-col lg:flex-row rounded-2xl overflow-hidden shadow-2xl">
        {/* Left Side - Decorative Graphic */}
        <div className="hidden lg:block lg:w-1/2 bg-gradient-to-br from-indigo-600 to-purple-600 p-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/pattern.svg')] bg-[length:300px] opacity-10"></div>
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Join Us</h1>
              <p className="text-indigo-100 text-lg">
                Create your account to unlock exclusive features
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span className="text-white">Personalized dashboard</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span className="text-white">Priority customer support</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span className="text-white">Exclusive member offers</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Registration Form */}
        <div className="w-full lg:w-1/2 bg-gray-50 p-8 sm:p-12 flex flex-col justify-center">
          {isRegistered ? (
            <div className="text-center space-y-6">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
                <svg
                  className="h-10 w-10 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Registration Successful!</h2>
              <p className="text-gray-600">
                Your account has been created successfully. You can now login to access your account.
              </p>
              <button
                onClick={() => router.push('/login')}
                className="w-full flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300"
              >
                Go to Login
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="ml-2 h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                  />
                </svg>
              </button>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
                <p className="text-gray-600">
                  Fill in your details to get started
                </p>
              </div>

              <div className="space-y-5">
                {registrationFormControls.map((controlItem) =>
                  controlItem.componentType === "input" ? (
                    <InputComponent
                      key={controlItem.id}
                      type={controlItem.type}
                      placeholder={controlItem.placeholder}
                      label={controlItem.label}
                      onChange={(event) => {
                        setFormData({
                          ...formData,
                          [controlItem.id]: event.target.value,
                        });
                      }}
                      value={formData[controlItem.id]}
                    />
                  ) : controlItem.componentType === "select" ? (
                    <SelectComponent
                      key={controlItem.id}
                      options={controlItem.options}
                      label={controlItem.label}
                      onChange={(event) => {
                        setFormData({
                          ...formData,
                          [controlItem.id]: event.target.value,
                        });
                      }}
                      value={formData[controlItem.id]}
                    />
                  ) : null
                )}

                <button
                  className={`w-full flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 ${
                    !isFormValid() ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={!isFormValid() || (componentLevelLoader?.loading)}
                  onClick={handleRegisterOnSubmit}
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                >
                  {componentLevelLoader?.loading ? (
                    <ComponentLevelLoader
                      text={"Creating Account..."}
                      color={"#ffffff"}
                      loading={componentLevelLoader.loading}
                    />
                  ) : (
                    <>
                      <span>Register Now</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`ml-2 h-5 w-5 transition-transform duration-300 ${
                          isHovering ? "translate-x-1" : ""
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                        />
                      </svg>
                    </>
                  )}
                </button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">
                      Already have an account?
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => router.push("/login")}
                  className="w-full flex items-center justify-center px-6 py-3 border border-gray-300 rounded-md shadow-sm text-lg font-medium text-gray-700 bg-gray-50 hover:bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300"
                >
                  Sign in instead
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      <Notification />
    </div>
  );
}