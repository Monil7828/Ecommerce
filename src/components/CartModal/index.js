"use client";

import { Fragment, useContext, useEffect } from "react";
import CommonModal from "../CommonModal";
import { GlobalContext } from "@/context";
import { deleteFromCart, getAllCartItems } from "@/services/cart";
import { toast } from "react-toastify";
import ComponentLevelLoader from "../Loader/componentlevel";
import { useRouter } from "next/navigation";

export default function CartModal() {
  const {
    showCartModal,
    setShowCartModal,
    cartItems,
    setCartItems,
    user,
    setComponentLevelLoader,
    componentLevelLoader,
  } = useContext(GlobalContext);

  const router = useRouter();

  const extractAllCartItems = async () => {
    const res = await getAllCartItems(user?._id);
    if (res.success) {
      const updatedData = res.data?.map((item) => ({
        ...item,
        productID: {
          ...item.productID,
          price:
            item.productID.onSale === "yes"
              ? parseInt(
                  (
                    item.productID.price -
                    item.productID.price * (item.productID.priceDrop / 100)
                  ).toFixed(2)
                )
              : item.productID.price,
        },
      })) ?? [];

      setCartItems(updatedData);
      localStorage.setItem("cartItems", JSON.stringify(updatedData));
    }
  };

  useEffect(() => {
    if (user) extractAllCartItems();
  }, [user]);

  const handleDeleteCartItem = async (cartItemId) => {
    setComponentLevelLoader({ loading: true, id: cartItemId });
    const res = await deleteFromCart(cartItemId);
    if (res.success) {
      toast.success(res.message);
      extractAllCartItems();
    } else {
      toast.error(res.message);
    }
    setComponentLevelLoader({ loading: false, id: "" });
  };

  return (
    <CommonModal
      showButtons={true}
      show={showCartModal}
      setShow={setShowCartModal}
      mainContent={
        cartItems?.length ? (
          <ul className="-my-6 divide-y divide-gray-300 max-h-[70vh] overflow-y-auto pr-2 pt-20">
            {cartItems.map((item) => (
              <li key={item._id} className="flex py-6">
                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg border border-gray-200 shadow-sm">
                  <img
                    src={item.productID.imageUrl}
                    alt={item.productID.name}
                    className="h-full w-full object-cover object-center"
                  />
                </div>
                <div className="ml-4 flex flex-1 flex-col">
                  <div className="flex justify-between text-base text-gray-900">
                    <h3 className="font-semibold text-md">{item.productID.name}</h3>
                  </div>
                  <p className="mt-1 text-sm text-gray-600 font-medium">
                    ${item.productID.price}
                  </p>
                  <div className="flex flex-1 items-end justify-between text-sm">
                    <button
                      className="text-red-600 hover:text-red-800 font-semibold min-w-[80px] h-6 flex items-center justify-center"
                      onClick={() => handleDeleteCartItem(item._id)}
                      disabled={componentLevelLoader.loading && componentLevelLoader.id === item._id}
                    >
                      {componentLevelLoader.loading && componentLevelLoader.id === item._id ? (
                        <ComponentLevelLoader 
                          color="#6366f1" 
                          loading={true}
                        />
                      ) : (
                        "Remove"
                      )}
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-10 text-gray-500 text-sm">
            Your cart is empty. Add some products!
          </div>
        )
      }
      buttonComponent={
        <Fragment>
          <button
            type="button"
            onClick={() => {
              router.push("/cart");
              setShowCartModal(false);
            }}
            className="mt-3 w-full rounded-md bg-black text-white py-2 text-sm font-semibold uppercase hover:bg-gray-700 transition"
          >
            Go To Cart
          </button>
          <button
            type="button"
            disabled={cartItems.length === 0}
            onClick={() => {
              router.push("/checkout");
              setShowCartModal(false);
            }}
            className="mt-3 w-full rounded-md bg-indigo-600 text-white py-2 text-sm font-semibold uppercase hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Checkout
          </button>
          <div className="mt-6 text-center text-sm">
            <button
              onClick={() => setShowCartModal(false)}
              className="text-gray-500 hover:text-black transition font-medium"
            >
              Continue Shopping &rarr;
            </button>
          </div>
        </Fragment>
      }
    />
  );
}