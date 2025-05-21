"use client";

import InputComponent from "@/components/FormElements/InputComponent";
import ComponentLevelLoader from "@/components/Loader/componentlevel";
import Notification from "@/components/Notification";
import { GlobalContext } from "@/context";
import {
  addNewAddress,
  deleteAddress,
  fetchAllAddresses,
  updateAddress,
} from "@/services/address";
import { addNewAddressFormControls } from "@/utils";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { PulseLoader } from "react-spinners";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

export default function Account() {
  const {
    user,
    addresses,
    setAddresses,
    addressFormData,
    setAddressFormData,
    componentLevelLoader,
    setComponentLevelLoader,
    pageLevelLoader,
    setPageLevelLoader,
    setIsAuthUser,
    setUser
  } = useContext(GlobalContext);

  const [showAddressForm, setShowAddressForm] = useState(false);
  const [currentEditedAddressId, setCurrentEditedAddressId] = useState(null);
  const router = useRouter();

  async function extractAllAddresses() {
    setPageLevelLoader(true);
    const res = await fetchAllAddresses(user?._id);

    if (res.success) {
      setPageLevelLoader(false);
      setAddresses(res.data);
    }
  }

  async function handleAddOrUpdateAddress() {
    setComponentLevelLoader({ loading: true, id: "" });
    const res =
      currentEditedAddressId !== null
        ? await updateAddress({
            ...addressFormData,
            _id: currentEditedAddressId,
          })
        : await addNewAddress({ ...addressFormData, userID: user?._id });

    if (res.success) {
      setComponentLevelLoader({ loading: false, id: "" });
      toast.success(res.message);
      setAddressFormData({
        fullName: "",
        city: "",
        country: "",
        postalCode: "",
        address: "",
      });
      extractAllAddresses();
      setCurrentEditedAddressId(null);
    } else {
      setComponentLevelLoader({ loading: false, id: "" });
      toast.error(res.message);
      setAddressFormData({
        fullName: "",
        city: "",
        country: "",
        postalCode: "",
        address: "",
      });
    }
  }

  function handleUpdateAddress(getCurrentAddress) {
    setShowAddressForm(true);
    setAddressFormData({
      fullName: getCurrentAddress.fullName,
      city: getCurrentAddress.city,
      country: getCurrentAddress.country,
      postalCode: getCurrentAddress.postalCode,
      address: getCurrentAddress.address,
    });
    setCurrentEditedAddressId(getCurrentAddress._id);
  }

  async function handleDelete(getCurrentAddressID) {
    setComponentLevelLoader({ loading: true, id: getCurrentAddressID });

    const res = await deleteAddress(getCurrentAddressID);

    if (res.success) {
      setComponentLevelLoader({ loading: false, id: "" });
      toast.success(res.message);
      extractAllAddresses();
    } else {
      setComponentLevelLoader({ loading: false, id: "" });
      toast.error(res.message);
    }
  }

  const handleLogout = async () => {
    setIsAuthUser(false);
    setUser(null);
    Cookies.remove("token");
    localStorage.clear();
    router.push("/");
  };

  useEffect(() => {
    if (user !== null) extractAllAddresses();
  }, [user]);

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-12">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-5xl mx-auto">
          {/* Profile Header with gradient */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white">
            <div className="flex flex-col md:flex-row items-center">
              <div className="w-28 h-28 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-6 md:mb-0 md:mr-8 border-2 border-white/30">
                <span className="text-4xl font-bold text-white">
                  {user?.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="text-center md:text-left">
                <h1 className="text-3xl font-bold">{user?.name}</h1>
                <p className="text-blue-100 mt-1">{user?.email}</p>
                <span className="inline-block mt-3 px-4 py-1 bg-white/20 rounded-full text-sm font-medium backdrop-blur-sm">
                  {user?.role.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-8">
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 mb-10">
              <button
                onClick={() => router.push('/orders')}
                className="flex-1 min-w-[200px] bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl transition-all flex items-center justify-center shadow-md hover:shadow-lg"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                View Orders
              </button>
              
              <button
                onClick={handleLogout}
                className="flex-1 min-w-[200px] bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 text-gray-800 px-6 py-3 rounded-xl transition-all flex items-center justify-center shadow-md hover:shadow-lg"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign Out
              </button>
            </div>

            {/* Address Section */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Your Addresses</h2>
                <button
                  onClick={() => setShowAddressForm(!showAddressForm)}
                  className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg flex items-center"
                >
                  {showAddressForm ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                      Cancel
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                      Add Address
                    </>
                  )}
                </button>
              </div>

              {pageLevelLoader ? (
                <div className="flex justify-center py-10">
                  <PulseLoader color="#3b82f6" size={15} />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {addresses && addresses.length ? (
                    addresses.map((item) => (
                      <div key={item._id} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow shadow-sm">
                        <div className="space-y-3">
                          <p className="font-semibold text-lg text-gray-800">{item.fullName}</p>
                          <p className="text-gray-600">{item.address}</p>
                          <div className="flex items-center text-gray-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                            {item.city}, {item.postalCode}, {item.country}
                          </div>
                        </div>
                        <div className="mt-5 flex gap-3">
                          <button
                            onClick={() => handleUpdateAddress(item)}
                            className="flex-1 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium flex items-center justify-center"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(item._id)}
                            className="flex-1 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium flex items-center justify-center"
                          >
                            {componentLevelLoader?.loading && componentLevelLoader.id === item._id ? (
                              <PulseLoader color="#ef4444" size={8} />
                            ) : (
                              <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                Delete
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full py-10 text-center">
                      <div className="mx-auto w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-gray-700 mb-1">No addresses saved</h3>
                      <p className="text-gray-500">Add your first address to get started</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Address Form */}
            {showAddressForm && (
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-800 mb-5">
                  {currentEditedAddressId ? "Edit Address" : "Add New Address"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {addNewAddressFormControls.map((controlItem) => (
                    <InputComponent
                      key={controlItem.id}
                      type={controlItem.type}
                      placeholder={controlItem.placeholder}
                      label={controlItem.label}
                      value={addressFormData[controlItem.id]}
                      onChange={(event) =>
                        setAddressFormData({
                          ...addressFormData,
                          [controlItem.id]: event.target.value,
                        })
                      }
                    />
                  ))}
                </div>
                <div className="mt-7 flex justify-end gap-3">
                  <button
                    onClick={() => {
                      setShowAddressForm(false);
                      setCurrentEditedAddressId(null);
                      setAddressFormData({
                        fullName: "",
                        city: "",
                        country: "",
                        postalCode: "",
                        address: "",
                      });
                    }}
                    className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddOrUpdateAddress}
                    className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all font-medium shadow-md hover:shadow-lg flex items-center"
                  >
                    {componentLevelLoader?.loading ? (
                      <PulseLoader color="#ffffff" size={8} />
                    ) : (
                      <>
                        {currentEditedAddressId ? (
                          <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h5a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h5v5.586l-1.293-1.293zM9 4a1 1 0 012 0v2H9V4z" />
                            </svg>
                            Update Address
                          </>
                        ) : (
                          <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                            </svg>
                            Save Address
                          </>
                        )}
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Notification />
    </section>
  );
}