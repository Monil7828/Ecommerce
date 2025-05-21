"use client";

import Notification from "@/components/Notification";
import { GlobalContext } from "@/context";
import { fetchAllAddresses } from "@/services/address";
import { createNewOrder } from "@/services/order";
import { callStripeSession } from "@/services/stripe";
import { loadStripe } from "@stripe/stripe-js";
import { useRouter, useSearchParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { PulseLoader } from "react-spinners";
import { toast } from "react-toastify";

export default function Checkout() {
  const {
    cartItems,
    user,
    addresses,
    setAddresses,
    checkoutFormData,
    setCheckoutFormData,
  } = useContext(GlobalContext);

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isOrderProcessing, setIsOrderProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const router = useRouter();
  const params = useSearchParams();

  const publishableKey = "pk_test_51OQOEoSIs4efZtZKUhD2I1wA7lkdDKPF2zhXi3kVchlUvpsXHVRjUzRaDdqrliAn5AFYexJzfnpP57URvyQzUNvl00DidzARFd";
  const stripePromise = loadStripe(publishableKey);

  async function getAllAddresses() {
    const res = await fetchAllAddresses(user?._id);
    if (res.success) {
      setAddresses(res.data);
    }
  }

  useEffect(() => {
    if (user !== null) getAllAddresses();
  }, [user]);

  useEffect(() => {
    async function createFinalOrder() {
      const isStripe = JSON.parse(localStorage.getItem("stripe"));
      if (isStripe && params.get("status") === "success" && cartItems?.length > 0) {
        setIsOrderProcessing(true);
        const getCheckoutFormData = JSON.parse(localStorage.getItem("checkoutFormData"));

        const createFinalCheckoutFormData = {
          user: user?._id,
          shippingAddress: getCheckoutFormData.shippingAddress,
          orderItems: cartItems.map((item) => ({
            qty: 1,
            product: item.productID,
          })),
          paymentMethod: "Stripe",
          totalPrice: cartItems.reduce((total, item) => item.productID.price + total, 0),
          isPaid: true,
          isProcessing: true,
          paidAt: new Date(),
        };

        const res = await createNewOrder(createFinalCheckoutFormData);
        if (res.success) {
          setIsOrderProcessing(false);
          setOrderSuccess(true);
          toast.success(res.message);
        } else {
          setIsOrderProcessing(false);
          toast.error(res.message);
        }
      }
    }
    createFinalOrder();
  }, [params.get("status"), cartItems]);

  function handleSelectedAddress(getAddress) {
    if (getAddress._id === selectedAddress) {
      setSelectedAddress(null);
      setCheckoutFormData({ ...checkoutFormData, shippingAddress: {} });
      return;
    }

    setSelectedAddress(getAddress._id);
    setCheckoutFormData({
      ...checkoutFormData,
      shippingAddress: {
        ...checkoutFormData.shippingAddress,
        fullName: getAddress.fullName,
        city: getAddress.city,
        country: getAddress.country,
        postalCode: getAddress.postalCode,
        address: getAddress.address,
      },
    });
  }

  async function handleCheckout() {
    const stripe = await stripePromise;
    const createLineItems = cartItems.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          images: [item.productID.imageUrl],
          name: item.productID.name,
        },
        unit_amount: item.productID.price * 100,
      },
      quantity: 1,
    }));

    const res = await callStripeSession(createLineItems);
    setIsOrderProcessing(true);
    localStorage.setItem("stripe", true);
    localStorage.setItem("checkoutFormData", JSON.stringify(checkoutFormData));

    const { error } = await stripe.redirectToCheckout({ sessionId: res.id });
    if (error) console.error(error);
  }

  useEffect(() => {
    if (orderSuccess) {
      setTimeout(() => router.push("/orders"), 2000);
    }
  }, [orderSuccess]);

  if (orderSuccess) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h1>
          <p className="text-gray-600 mb-6">You'll be redirected to your orders shortly</p>
          <div className="w-full bg-gray-100 rounded-full h-2.5">
            <div className="bg-green-500 h-2.5 rounded-full animate-pulse" style={{width: '100%'}}></div>
          </div>
        </div>
      </section>
    );
  }

  if (isOrderProcessing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center">
        <PulseLoader color="#3b82f6" size={20} />
        <p className="mt-4 text-gray-600">Processing your order...</p>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Cart Summary */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Your Order</h2>
            <div className="space-y-4">
              {cartItems?.length ? (
                cartItems.map((item) => (
                  <div key={item._id} className="flex items-center border-b border-gray-100 pb-4">
                    <img
                      src={item?.productID?.imageUrl}
                      alt={item?.productID?.name}
                      className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                    />
                    <div className="ml-4 flex-1">
                      <h3 className="font-medium text-gray-800">{item?.productID?.name}</h3>
                      <p className="text-gray-600">${item?.productID?.price.toFixed(2)}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <p className="text-gray-500">Your cart is empty</p>
                </div>
              )}
            </div>

            {cartItems?.length > 0 && (
              <div className="mt-6 border-t border-gray-200 pt-4">
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">
                    ${cartItems.reduce((total, item) => total + item.productID.price, 0).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium text-green-500">Free</span>
                </div>
                <div className="flex justify-between py-2 border-t border-gray-200 mt-2 pt-3">
                  <span className="font-semibold text-gray-800">Total</span>
                  <span className="font-bold text-gray-800 text-lg">
                    ${cartItems.reduce((total, item) => total + item.productID.price, 0).toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Shipping Address</h2>
            
            <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto pr-2">
              {addresses?.length ? (
                addresses.map((item) => (
                  <div
                    key={item._id}
                    onClick={() => handleSelectedAddress(item)}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      item._id === selectedAddress 
                        ? "border-blue-500 bg-blue-50" 
                        : "border-gray-200 hover:border-blue-300"
                    }`}
                  >
                    <div className="flex items-start">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center mt-1 mr-3 ${
                        item._id === selectedAddress 
                          ? "bg-blue-500 border-blue-500" 
                          : "border-gray-300"
                      }`}>
                        {item._id === selectedAddress && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800">{item.fullName}</h3>
                        <p className="text-gray-600 text-sm">{item.address}</p>
                        <p className="text-gray-600 text-sm">{item.city}, {item.postalCode}, {item.country}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <p className="text-gray-500 mb-4">No addresses saved</p>
                  <button
                    onClick={() => router.push("/account")}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    Add New Address
                  </button>
                </div>
              )}
            </div>

            <button
              disabled={!cartItems?.length || !selectedAddress}
              onClick={handleCheckout}
              className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all ${
                !cartItems?.length || !selectedAddress
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg"
              }`}
            >
              Proceed to Payment
            </button>
          </div>
        </div>
      </div>
      <Notification />
    </section>
  );
}