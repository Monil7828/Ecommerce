"use client";

import ComponentLevelLoader from "@/components/Loader/componentlevel";
import { GlobalContext } from "@/context";
import { addToCart } from "@/services/cart";
import { deleteAProduct } from "@/services/product";
import { usePathname, useRouter } from "next/navigation";
import { useContext } from "react";
import { toast } from "react-toastify";

export default function ProductButton({ item }) {
  const pathName = usePathname();
  const {
    setCurrentUpdatedProduct,
    setComponentLevelLoader,
    componentLevelLoader,
    user,
    showCartModal, 
    setShowCartModal
  } = useContext(GlobalContext);
  const router = useRouter();

  const isAdminView = pathName.includes("admin-view");

  async function handleDeleteProduct(item) {
    setComponentLevelLoader({ loading: true, id: item._id });
    const res = await deleteAProduct(item._id);

    if (res.success) {
      setComponentLevelLoader({ loading: false, id: "" });
      toast.success(res.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      router.refresh();
    } else {
      toast.error(res.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      setComponentLevelLoader({ loading: false, id: "" });
    }
  }

  async function handleAddToCart(getItem) {
    setComponentLevelLoader({ loading: true, id: getItem._id });
    const res = await addToCart({ productID: getItem._id, userID: user._id });

    if (res.success) {
      toast.success(res.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      setShowCartModal(true);
    } else {
      toast.error(res.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
    setComponentLevelLoader({ loading: false, id: "" });
  }

  return isAdminView ? (
    <div className="flex gap-3 mt-4">
      {/* Update Button */}
      <button
        onClick={() => {
          setCurrentUpdatedProduct(item);
          router.push("/admin-view/add-product");
        }}
        className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all duration-200"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-4 w-4" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" 
          />
        </svg>
        Update
      </button>

      {/* Delete Button */}
      <button
        onClick={() => handleDeleteProduct(item)}
        className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 transition-all duration-200"
        disabled={componentLevelLoader?.loading && componentLevelLoader.id === item._id}
      >
        {componentLevelLoader?.loading && componentLevelLoader.id === item._id ? (
          <ComponentLevelLoader
            text={"Deleting"}
            color={"#ffffff"}
            loading={true}
            size="small"
          />
        ) : (
          <>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-4 w-4" 
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
            Delete
          </>
        )}
      </button>
    </div>
  ) : (
    <div className="mt-4">
      {/* Add to Cart Button */}
      <button
        onClick={() => handleAddToCart(item)}
        className="w-full flex items-center justify-center gap-2 rounded-lg bg-black px-4 py-3 text-sm font-medium text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black transition-all duration-200"
        disabled={componentLevelLoader?.loading && componentLevelLoader.id === item._id}
      >
        {componentLevelLoader?.loading && componentLevelLoader.id === item._id ? (
          <ComponentLevelLoader
            text={"Adding"}
            color={"#ffffff"}
            loading={true}
            size="small"
          />
        ) : (
          <>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5" 
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
            Add to Cart
          </>
        )}
      </button> 
    </div>
  );
}