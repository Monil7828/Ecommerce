"use client";

import { GlobalContext } from "@/context";
import { getOrderDetails } from "@/services/order";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { PulseLoader } from "react-spinners";
import { toast } from "react-toastify";

export default function AdminOrderDetails({ params }) {
  const { id } = params;
  const router = useRouter();
  const { user, pageLevelLoader, setPageLevelLoader } = useContext(GlobalContext);
  const [orderDetails, setOrderDetails] = useState(null);

  async function extractOrderDetails() {
    setPageLevelLoader(true);
    const res = await getOrderDetails(id);

    if (res.success) {
      setPageLevelLoader(false);
      setOrderDetails(res.data);
    } else {
      setPageLevelLoader(false);
      toast.error(res.message);
      router.push("/admin-view");
    }
  }

  useEffect(() => {
    if (user !== null && id) extractOrderDetails();
  }, [user, id]);

  if (pageLevelLoader) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center">
        <PulseLoader color={"#000000"} loading={pageLevelLoader} size={30} />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center text-indigo-600 hover:text-indigo-800"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Back to Orders
        </button>

        {orderDetails ? (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">
                Order #{orderDetails._id.slice(-8).toUpperCase()}
              </h2>
              <div className="mt-2 flex flex-wrap items-center justify-between">
                <p className="text-gray-600">
                  Placed on{" "}
                  {new Date(orderDetails.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    orderDetails.isProcessing
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {orderDetails.isProcessing ? "Processing" : "Delivered"}
                </span>
              </div>
            </div>

            <div className="px-6 py-5">
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Customer Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium">{orderDetails.user.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{orderDetails.user.email}</p>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Order Items
                </h3>
                <div className="space-y-6">
                  {orderDetails.orderItems.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center border-b border-gray-100 pb-4"
                    >
                      <img
                        src={item.product?.imageUrl}
                        alt={item.product?.name}
                        className="h-16 w-16 rounded-md object-cover"
                      />
                      <div className="ml-4 flex-1">
                        <h4 className="font-medium">{item.product?.name}</h4>
                        <p className="text-gray-600">
                          ${item.product?.price.toFixed(2)} x {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          ${(item.product?.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">Total</h3>
                  <p className="text-2xl font-bold">
                    ${orderDetails.totalPrice.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg p-6 text-center">
            <p className="text-gray-600">Order not found</p>
          </div>
        )}
      </div>
    </div>
  );
}