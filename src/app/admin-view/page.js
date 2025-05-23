"use client";

import ComponentLevelLoader from "@/components/Loader/componentlevel";
import { GlobalContext } from "@/context";
import { getAllOrdersForAllUsers, updateStatusOfOrder } from "@/services/order";
import { useContext, useEffect, useState } from "react";
import { PulseLoader } from "react-spinners";
import { useRouter } from "next/navigation";

export default function AdminView() {
  const {
    allOrdersForAllUsers,
    setAllOrdersForAllUsers,
    user,
    pageLevelLoader,
    setPageLevelLoader,
    componentLevelLoader,
    setComponentLevelLoader,
  } = useContext(GlobalContext);

  const [expandedOrder, setExpandedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  async function extractAllOrdersForAllUsers() {
    setPageLevelLoader(true);
    const res = await getAllOrdersForAllUsers();

    if (res.success) {
      setPageLevelLoader(false);
      setAllOrdersForAllUsers(
        res.data && res.data.length
          ? res.data.filter((item) => item.user._id !== user._id)
          : []
      );
    } else {
      setPageLevelLoader(false);
    }
  }

  useEffect(() => {
    if (user !== null) extractAllOrdersForAllUsers();
  }, [user]);

  async function handleUpdateOrderStatus(getItem) {
    setComponentLevelLoader({ loading: true, id: getItem._id });
    const res = await updateStatusOfOrder({
      ...getItem,
      isProcessing: false,
    });

    if (res.success) {
      setComponentLevelLoader({ loading: false, id: "" });
      extractAllOrdersForAllUsers();
    } else {
      setComponentLevelLoader({ loading: false, id: "" });
    }
  }

  const filteredOrders = allOrdersForAllUsers
    ?.filter((order) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        order._id.toLowerCase().includes(searchLower) ||
        order.user.name.toLowerCase().includes(searchLower) ||
        order.user.email.toLowerCase().includes(searchLower) ||
        order.totalPrice.toString().includes(searchTerm)
      );
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  if (pageLevelLoader) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center">
        <PulseLoader
          color={"#000000"}
          loading={pageLevelLoader}
          size={15}
          data-testid="loader"
        />
      </div>
    );
  }

  return (
    <section className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Order Management
          </h1>
          <p className="text-gray-600">Manage and track all customer orders</p>

          <div className="mt-6">
            <div className="relative text-gray-400">
              <input
                type="text"
                placeholder="Search orders by ID, name, email or amount..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg
                className="absolute right-3 top-3 h-5 w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        {filteredOrders && filteredOrders.length ? (
          <div className="space-y-4">
            {filteredOrders.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md"
              >
                <div
                  className="p-6 cursor-pointer"
                  onClick={() =>
                    setExpandedOrder(
                      expandedOrder === item._id ? null : item._id
                    )
                  }
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">
                        Order #{item._id.slice(-8).toUpperCase()}
                      </h2>
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(item.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>

                    <div className="flex flex-col sm:items-end">
                      <span className="text-lg font-bold text-indigo-600">
                        ${item.totalPrice.toFixed(2)}
                      </span>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          item.isProcessing
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {item.isProcessing ? "Processing" : "Delivered"}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Customer</p>
                      <p className="font-medium text-gray-500">
                        {item.user.name}
                      </p>
                      <p className="text-sm text-gray-500">{item.user.email}</p>
                    </div>

                    <svg
                      className={`h-5 w-5 text-gray-400 transform transition-transform duration-200 ${
                        expandedOrder === item._id ? "rotate-180" : ""
                      }`}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>

                {expandedOrder === item._id && (
                  <div className="border-t border-gray-200 px-6 py-4">
                    <div className="mb-4">
                      <h3 className="text-sm font-medium text-gray-500 mb-2">
                        Order Items
                      </h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {item.orderItems.map((orderItem, index) => (
                          <div
                            key={index}
                            className="flex flex-col items-center"
                          >
                            <img
                              src={orderItem?.product?.imageUrl}
                              alt={orderItem?.product?.name}
                              className="h-20 w-20 rounded-lg object-cover border border-gray-200"
                            />
                            <p className="mt-2 text-sm font-medium text-center">
                              {orderItem?.product?.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              ${orderItem?.product?.price.toFixed(2)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                      {!item.isProcessing ? (
                        <span className="flex-1 sm:flex-none px-4 py-2 rounded-md text-sm font-medium bg-green-100 text-green-800">
                          Delivered
                        </span>
                      ) : (
                        <button
                          onClick={() => handleUpdateOrderStatus(item)}
                          disabled={!item.isProcessing}
                          className={`flex-1 sm:flex-none px-4 py-2 rounded-md text-sm font-medium ${
                            item.isProcessing
                              ? "bg-indigo-600 text-white hover:bg-indigo-700"
                              : "bg-gray-200 text-gray-500 cursor-not-allowed"
                          }`}
                        >
                          {componentLevelLoader?.loading &&
                          componentLevelLoader.id === item._id ? (
                            <ComponentLevelLoader
                              text={"Updating"}
                              color={"#ffffff"}
                              loading={true}
                              size="small"
                            />
                          ) : (
                            "Mark as Delivered"
                          )}
                        </button>
                      )}

                      <button
                        onClick={() => router.push(`/admin/orders/${item._id}`)}
                        className="flex-1 sm:flex-none px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                      >
                        View Details
                      </button>

                      <button className="flex-1 sm:flex-none px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                        Contact Customer
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
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
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              No orders found
            </h3>
            <p className="mt-2 text-gray-500">
              {searchTerm
                ? "No orders match your search"
                : "There are no orders to display"}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Clear search
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
