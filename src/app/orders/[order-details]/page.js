"use client";

import { GlobalContext } from "@/context";
import { getOrderDetails } from "@/services/order";
import { useParams, useRouter } from "next/navigation";
import { useContext, useEffect } from "react";
import { PulseLoader } from "react-spinners";

export default function OrderDetails() {
  const {
    pageLevelLoader,
    setPageLevelLoader,
    orderDetails,
    setOrderDetails,
    user,
  } = useContext(GlobalContext);

  const params = useParams();
  const router = useRouter();

  async function extractOrderDetails() {
    setPageLevelLoader(true);
    const res = await getOrderDetails(params["order-details"]);

    if (res.success) {
      setPageLevelLoader(false);
      setOrderDetails(res.data);
    } else {
      setPageLevelLoader(false);
    }
  }

  useEffect(() => {
    extractOrderDetails();
  }, []);

  if (pageLevelLoader) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center">
        <PulseLoader
          color={"#000000"}
          loading={pageLevelLoader}
          size={30}
          data-testid="loader"
        />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Order Details
          </h1>
          <div className="flex items-center justify-center space-x-4">
            <p className="text-gray-600">#{orderDetails && orderDetails._id}</p>
            <span className="text-gray-400">•</span>
            <p className="text-gray-600">
              {orderDetails &&
                new Date(orderDetails.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Items */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Order Summary
              </h2>

              <div className="space-y-6">
                {orderDetails &&
                orderDetails.orderItems &&
                orderDetails.orderItems.length ? (
                  orderDetails.orderItems.map((item) => (
                    <div
                      key={item._id}
                      className="flex gap-4 pb-6 border-b border-gray-100 last:border-0 last:pb-0"
                    >
                      <div className="flex-shrink-0">
                        <img
                          src={item?.product?.imageUrl}
                          alt={item?.product?.name}
                          className="h-24 w-24 rounded-lg object-cover border border-gray-200"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900">
                          {item?.product?.name}
                        </h3>
                        <p className="text-gray-600 mt-1">
                          ${item?.product?.price}
                        </p>
                      </div>
                    </div> // ✅ Closed this div
                  ))
                ) : (
                  <p className="text-gray-600">No items found in this order.</p>
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Payment Summary
              </h2>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium text-gray-900">
                    ${orderDetails && orderDetails.totalPrice}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium text-gray-900">Free</span>
                </div>
                <div className="flex justify-between pt-4 border-t border-gray-200">
                  <span className="text-lg font-semibold">Total</span>
                 <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                         ${orderDetails && orderDetails.totalPrice}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Customer Information
              </h2>

              <div className="space-y-3">
                <div>
                  <p className="text-sm  text-gray-500">Name</p>
                  <p className="font-medium text-gray-600">{user?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-gray-600">{user?.email}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Shipping Address
              </h2>

              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="font-medium text-gray-600">
                    {orderDetails && orderDetails.shippingAddress.address}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">City</p>
                    <p className="font-medium text-gray-600">
                      {orderDetails && orderDetails.shippingAddress.city}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Postal Code</p>
                    <p className="font-medium text-gray-600">
                      {orderDetails && orderDetails.shippingAddress.postalCode}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Country</p>
                  <p className="font-medium text-gray-600">
                    {orderDetails && orderDetails.shippingAddress.country}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Order Status
              </h2>

              <div className="flex items-center">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    orderDetails?.isProcessing
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {orderDetails?.isProcessing ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-yellow-600"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing
                    </>
                  ) : (
                    <>
                      <svg
                        className="-ml-1 mr-2 h-4 w-4 text-green-600"
                        xmlns="http://www.w3.org/2000/svg"
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
                      Delivered
                    </>
                  )}
                </span>
              </div>
            </div>

            <button
              onClick={() => router.push("/")}
              className="w-full flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300"
            >
              Continue Shopping
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="ml-2 -mr-1 h-5 w-5"
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
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
