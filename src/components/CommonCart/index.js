"use client";

import { useRouter } from "next/navigation";
import ComponentLevelLoader from "../Loader/componentlevel";

export default function CommonCart({
  cartItems = [],
  handleDeleteCartItem,
  componentLevelLoader,
}) {
  const router = useRouter();

  const subtotal = cartItems.reduce(
    (total, item) => item.productID.price * item.quantity + total, 
    0
  );

  return (
    <section className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="px-6 py-8 sm:p-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Shopping Cart</h1>
            <p className="text-gray-600 mb-8">
              {cartItems.length 
                ? `You have ${cartItems.length} item${cartItems.length > 1 ? 's' : ''} in your cart`
                : 'Your cart is waiting to be filled'}
            </p>

            {cartItems && cartItems.length ? (
              <div className="space-y-6">
                {cartItems.map((cartItem) => (
                  <div 
                    key={cartItem.id}
                    className="flex flex-col sm:flex-row gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                  >
                    <div className="flex-shrink-0">
                      <img
                        src={cartItem?.productID?.imageUrl}
                        alt={cartItem?.productID?.name}
                        className="h-32 w-32 rounded-lg object-cover border border-gray-200"
                      />
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {cartItem?.productID?.name}
                        </h3>
                        <p className="text-gray-600 mt-1">
                          ${cartItem?.productID?.price.toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Quantity: {cartItem.quantity || 1}
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-end mt-4">
                        <button
                          onClick={() => handleDeleteCartItem(cartItem._id)}
                          className="text-red-600 hover:text-red-800 transition-colors flex items-center"
                        >
                          {componentLevelLoader?.loading && 
                          componentLevelLoader.id === cartItem._id ? (
                            <ComponentLevelLoader
                              text={"Removing"}
                              color={"#dc2626"}
                              loading={true}
                              size="small"
                            />
                          ) : (
                            <>
                              <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                className="h-5 w-5 mr-1" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                              >
                                <path 
                                  strokeLinecap="round" 
                                  strokeLinejoin="round" 
                                  strokeWidth={2} 
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
                                />
                              </svg>
                              Remove
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-24 w-24 mx-auto text-gray-400" 
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
                <h2 className="text-2xl font-bold text-gray-900 mt-4">Your cart is empty</h2>
                <p className="text-gray-600 mt-2 mb-6">
                  Looks like you haven't added anything to your cart yet
                </p>
                <button
                  onClick={() => router.push('/')}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
            )}

            {cartItems.length > 0 && (
              <div className="mt-10 border-t border-gray-200 pt-6">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">Free</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-4 border-t border-gray-200">
                    <span>Total</span>
                    <span className="text-indigo-600">${subtotal.toFixed(2)}</span>
                  </div>
                </div>

                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => router.push('/')}
                    className="flex-1 px-6 py-3 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Continue Shopping
                  </button>
                  <button
                    onClick={() => router.push('/checkout')}
                    className="flex-1 px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
