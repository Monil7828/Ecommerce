"use client";

import { GlobalContext } from "@/context";
import { getAllAdminProducts } from "@/services/product";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PulseLoader } from "react-spinners";
import ProductButton from "../components/CommonListing/ProductButtons/index";

export default function Home() {
  const { isAuthUser } = useContext(GlobalContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function getListOfProducts() {
    setLoading(true);
    try {
      const res = await getAllAdminProducts();
      if (res.success) {
        setProducts(res.data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getListOfProducts();
  }, []);

  const handleButtonClick = (path) => {
    if (!isAuthUser) {
      toast.warning("Please login first to access this page");
      return;
    }
    setLoading(true);
    router.push(path);
  };

  const handleProductClick = (path) => {
    if (!isAuthUser) {
      toast.warning("Please login first to view product details");
      return;
    }
    setLoading(true);
    router.push(path);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <PulseLoader color="#000000" size={15} />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r h-full from-blue-50 to-indigo-50 py-12 md:py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0 md:pr-10 lg:pr-16 relative z-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-4">
              Elevate Your Style
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-lg">
              Discover premium fashion with timeless elegance and modern flair.
            </p>
            <button
              onClick={() => handleButtonClick("/product/listing/all-products")}
              className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Shop Collection
            </button>
          </div>

          <div className="md:w-1/2 flex justify-center relative">
            <div className="relative w-full max-w-xl h-96 md:h-[32rem] overflow-hidden rounded-2xl shadow-2xl group">
              <img
                src="https://imageio.forbes.com/specials-images/imageserve/638a98b6a088e5ce47202972/Girls-carrying-shopping-bags/960x0.jpg?format=jpg&width=960"
                alt="Fashion Collection"
                className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-in-out"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-blue-50/30 mix-blend-overlay"></div>
              <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-gray-900/40 to-transparent"></div>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        {/* <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div> */}
      </section>

      {/* Summer Sale Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-5xl font-bold text-gray-900">Summer Sale</h2>
            <p className="mt-2 text-lg text-gray-600">Limited time offers</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-pink-50 to-orange-50 p-8 rounded-2xl shadow-sm flex flex-col justify-center items-center">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                Up to 50% Off
              </h3>
              <button
                onClick={() => handleButtonClick("/product/listing/sales")}
                className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                View All Deals
              </button>
            </div>

            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {products && products.length
                ? products
                    .filter((item) => item.onSale === "yes")
                    .slice(0, 2)
                    .map((productItem) => (
                      <div
                        key={productItem._id}
                        onClick={() =>
                          handleProductClick(`/product/${productItem._id}`)
                        }
                        className="group cursor-pointer bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg"
                      >
                        <div className="relative overflow-hidden aspect-square">
                          <img
                            src={productItem.imageUrl}
                            alt={productItem.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute top-4 right-4 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                            SALE
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="font-medium text-gray-900 text-lg mb-1">
                            {productItem.name}
                          </h3>
                          <div className="flex items-center">
                            <span className="text-gray-900 font-bold">
                              ${productItem.price}
                            </span>
                            <span className="ml-2 text-red-600 text-sm font-medium">
                              {productItem.priceDrop}% OFF
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                : null}
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900">
              Shop by Category
            </h2>
            <p className="mt-2 text-gray-600">Find what suits your style</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "Women",
                image:
                  "https://asset7.ckassets.com/blog/wp-content/uploads/sites/5/2021/12/Womens-Clothing.jpg",
                path: "/product/listing/women",
              },
              {
                name: "Men",
                image:
                  "https://forgecraftmensjewelry.com/cdn/shop/articles/minimalist-mens-fashion-beige-shirt-and-trousers.jpg?v=1737391858&width=1100",
                path: "/product/listing/men",
              },
              {
                name: "Kids",
                image:
                  "https://kids.com.py/media/blog/cache/1100x/magefan_blog/kids-blog-01.jpg",
                path: "/product/listing/kids",
              },
            ].map((category) => (
              <div
                key={category.name}
                className="relative group overflow-hidden rounded-xl shadow-md h-64"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 to-transparent flex items-end p-6">
                  <div>
                    <h3 className="text-white text-2xl font-bold mb-2">
                      {category.name}
                    </h3>
                    <button
                      onClick={() => handleButtonClick(category.path)}
                      className="bg-white hover:bg-gray-100 text-gray-900 px-4 py-2 rounded-md font-medium transition-colors duration-300"
                    >
                      Shop Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* All Products Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900">Our Collection</h2>
            <p className="mt-2 text-gray-600">Discover our premium products</p>
          </div>

          {products && products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((productItem) => (
                <div
                  key={productItem._id}
                  className="group cursor-pointer bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg"
                >
                  <div
                    onClick={() =>
                      handleProductClick(`/product/${productItem._id}`)
                    }
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
                      onClick={() =>
                        handleProductClick(`/product/${productItem._id}`)
                      }
                      className="mb-3"
                    >
                      <h3 className="font-medium text-gray-900 text-lg mb-1">
                        {productItem.name}
                      </h3>
                      <div className="flex items-center">
                        <span className="text-gray-900 font-bold">
                          ${productItem.price}
                        </span>
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
              <p className="text-gray-500">
                No products available at the moment
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
