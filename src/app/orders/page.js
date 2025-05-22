"use client";

import Notification from "@/components/Notification";
import { GlobalContext } from "@/context";
import { getAllOrdersForUser } from "@/services/order";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";
import { PulseLoader } from "react-spinners";
import { toast } from "react-toastify";

export default function Orders() {
  const {
    user,
    pageLevelLoader,
    setPageLevelLoader,
    allOrdersForUser,
    setAllOrdersForUser,
  } = useContext(GlobalContext);

  const router = useRouter();

  async function extractAllOrders() {
    setPageLevelLoader(true);
    const res = await getAllOrdersForUser(user?._id);

    if (res.success) {
      setPageLevelLoader(false);
      setAllOrdersForUser(res.data);
      toast.success(res.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
    } else {
      setPageLevelLoader(false);
      toast.error(res.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  }

  useEffect(() => {
    if (user !== null) extractAllOrders();
  }, [user]);

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
    <section className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Orders</h1>
          <p className="text-gray-600 max-w-lg mx-auto">
            {allOrdersForUser?.length
              ? "Here's your order history"
              : "You haven't placed any orders yet"}
          </p>
        </div>

        {allOrdersForUser && allOrdersForUser.length ? (
          <div className="grid gap-8">
            {allOrdersForUser.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md"
              >
                <div className="p-6 sm:p-8">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-800">
                        Order #{item._id.slice(-8).toUpperCase()}
                      </h2>
                      <p className="text-sm text-gray-500 mt-1">
                        Placed on{" "}
                        {new Date(item.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-500 mr-2">
                        Total:
                      </span>
                      <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        ${item.totalPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-500 mb-3">
                      Items
                    </h3>
                    <div className="flex flex-wrap gap-4">
                      {item.orderItems.map((orderItem, index) => (
                        <div
                          key={index}
                          className="relative group"
                          onClick={() =>
                            router.push(`/product/${orderItem.product._id}`)
                          }
                        >
                          <div className="h-24 w-24 rounded-lg overflow-hidden border border-gray-200 transition-all duration-300 group-hover:shadow-md cursor-pointer">
                            <img
                              alt={orderItem.product.name}
                              className="h-full w-full object-cover"
                              src={orderItem.product.imageUrl}
                            />
                          </div>
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 rounded-lg" />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-4 border-t border-gray-100">
                    <div className="flex-1">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          item.isProcessing
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {item.isProcessing ? (
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
                    <div className="flex gap-3">
                      <button
                        onClick={() => router.push(`/orders/${item._id}`)}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300"
                      >
                        View Details
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="ml-2 -mr-1 h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>
                      <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300">
                        Track Order
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="mx-auto h-24 w-24 text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              No orders yet
            </h3>
            <p className="mt-2 text-gray-500 max-w-md mx-auto">
              Your order history will appear here once you've made purchases.
            </p>
            <div className="mt-6">
              <button
                onClick={() => router.push("/")}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300"
              >
                Continue Shopping
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="ml-2 -mr-1 h-4 w-4"
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
        )}
      </div>
      <Notification />
    </section>
  );
}
