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
    <section className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <div className="container mx-auto px-4 py-20">
        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-4xl mx-auto">
          {/* Profile Header */}
          <div className="bg-indigo-600 p-6 text-white">
            <div className="flex flex-col md:flex-row items-center">
              <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center mb-4 md:mb-0 md:mr-6">
                <span className="text-3xl font-bold text-indigo-600">
                  {user?.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="text-center md:text-left">
                <h1 className="text-2xl font-bold">{user?.name}</h1>
                <p className="text-indigo-100">{user?.email}</p>
                <p className="mt-2 px-3 py-1 bg-indigo-700 rounded-full text-xs inline-block">
                  {user?.role.toUpperCase()}
                </p>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-6">
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 mb-8">
              <button
                onClick={() => router.push('/orders')}
                className="flex-1 min-w-[200px] bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition-all flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                View Your Orders
              </button>
              
              <button
                onClick={handleLogout}
                className="flex-1 min-w-[200px] bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg transition-all flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>

            {/* Address Section */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Your Addresses</h2>
                <button
                  onClick={() => setShowAddressForm(!showAddressForm)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  {showAddressForm ? "Hide Form" : "Add New Address"}
                </button>
              </div>

              {pageLevelLoader ? (
                <div className="flex justify-center py-8">
                  <PulseLoader color="#6366f1" size={15} />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addresses && addresses.length ? (
                    addresses.map((item) => (
                      <div key={item._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="space-y-2">
                          <p className="font-medium">{item.fullName}</p>
                          <p className="text-gray-600">{item.address}</p>
                          <p className="text-gray-600">{item.city}, {item.postalCode}</p>
                          <p className="text-gray-600">{item.country}</p>
                        </div>
                        <div className="mt-4 flex gap-2">
                          <button
                            onClick={() => handleUpdateAddress(item)}
                            className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 transition-colors text-sm"
                          >
                            Update
                          </button>
                          <button
                            onClick={() => handleDelete(item._id)}
                            className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors text-sm"
                          >
                            {componentLevelLoader?.loading && componentLevelLoader.id === item._id ? (
                              <PulseLoader color="#dc2626" size={8} />
                            ) : "Delete"}
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-2 py-6 text-center text-gray-500">
                      No addresses found. Please add a new address.
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Address Form */}
            {showAddressForm && (
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium mb-4">
                  {currentEditedAddressId ? "Update Address" : "Add New Address"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <div className="mt-6 flex justify-end gap-3">
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
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddOrUpdateAddress}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    {componentLevelLoader?.loading ? (
                      <PulseLoader color="#ffffff" size={8} />
                    ) : currentEditedAddressId ? "Update Address" : "Save Address"}
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