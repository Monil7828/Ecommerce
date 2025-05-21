"use client";

import { useRouter } from "next/navigation";
import ProductButton from "./ProductButtons";
import Notification from "../Notification";
import { useEffect } from "react";

export default function CommonListing({ data }) {
  const router = useRouter();

  useEffect(() => {
    router.refresh();
  }, [router]);

  const handleProductClick = (url) => {
    router.push(url);
  };

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {data && data.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {data.map((productItem) => (
              <div
                key={productItem._id}
                className="group cursor-pointer bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg"
              >
                <div
                  onClick={() => handleProductClick(`/product/${productItem._id}`)}
                  className="relative overflow-hidden aspect-square"
                >
                  <img
                    src={productItem.imageUrl}
                    alt={productItem.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {productItem.onSale === "yes" && (
                    <div className="absolute top-4 right-4 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                      SALE
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div
                    onClick={() => handleProductClick(`/product/${productItem._id}`)}
                    className="mb-3"
                  >
                    <h3 className="font-medium text-gray-900 text-lg mb-1">
                      {productItem.name}
                    </h3>
                    <div className="flex items-center">
                      <span className="text-gray-900 font-bold">${productItem.price}</span>
                      {productItem.onSale === "yes" && (
                        <span className="ml-2 text-red-600 text-sm font-medium">
                          {productItem.priceDrop}% OFF
                        </span>
                      )}
                    </div>
                  </div>
                  <ProductButton item={productItem} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No products available at the moment</p>
          </div>
        )}
      </div>
      <Notification />
    </section>
  );
}
