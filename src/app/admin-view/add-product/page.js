"use client";

import InputComponent from "@/components/FormElements/InputComponent";
import SelectComponent from "@/components/FormElements/SelectComponent";
import TileComponent from "@/components/FormElements/TileComponent";
import ComponentLevelLoader from "@/components/Loader/componentlevel";
import Notification from "@/components/Notification";
import { GlobalContext } from "@/context";
import { addNewProduct, updateAProduct } from "@/services/product";
import {
  AvailableSizes,
  adminAddProductformControls,
  firebaseConfig,
  firebaseStroageURL,
} from "@/utils";
import { initializeApp } from "firebase/app";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useRouter, useSearchParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

const app = initializeApp(firebaseConfig);
const storage = getStorage(app, firebaseStroageURL);

const createUniqueFileName = (getFile) => {
  const timeStamp = Date.now();
  const randomStringValue = Math.random().toString(36).substring(2, 12);
  return `${getFile.name}-${timeStamp}-${randomStringValue}`;
};

async function helperForUPloadingImageToFirebase(file) {
  const getFileName = createUniqueFileName(file);
  const storageReference = ref(storage, `ecommerce/${getFileName}`);
  const uploadImage = uploadBytesResumable(storageReference, file);

  return new Promise((resolve, reject) => {
    uploadImage.on(
      "state_changed",
      (snapshot) => {},
      (error) => {
        reject(error);
      },
      () => {
        getDownloadURL(uploadImage.snapshot.ref)
          .then((downloadUrl) => resolve(downloadUrl))
          .catch((error) => reject(error));
      }
    );
  });
}

const initialFormData = {
  name: "",
  price: 0,
  description: "",
  category: "men",
  sizes: [],
  deliveryInfo: "",
  onSale: "no",
  imageUrl: "",
  priceDrop: 0,
};

export default function AdminAddNewProduct() {
  const [formData, setFormData] = useState(initialFormData);
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    componentLevelLoader,
    setComponentLevelLoader,
    currentUpdatedProduct,
    setCurrentUpdatedProduct,
  } = useContext(GlobalContext);

  useEffect(() => {
    if (currentUpdatedProduct) {
      setFormData({
        name: currentUpdatedProduct.name || "",
        price: currentUpdatedProduct.price || 0,
        description: currentUpdatedProduct.description || "",
        category: currentUpdatedProduct.category || "men",
        sizes: currentUpdatedProduct.sizes || [],
        deliveryInfo: currentUpdatedProduct.deliveryInfo || "",
        onSale: currentUpdatedProduct.onSale || "no",
        imageUrl: currentUpdatedProduct.imageUrl || "",
        priceDrop: currentUpdatedProduct.priceDrop || 0,
        _id: currentUpdatedProduct._id,
      });
    } else {
      setFormData(initialFormData);
    }
  }, [currentUpdatedProduct]);

  async function handleImage(event) {
    if (!event.target.files[0]) return;

    setComponentLevelLoader({ loading: true, id: "image-upload" });
    try {
      const extractImageUrl = await helperForUPloadingImageToFirebase(
        event.target.files[0]
      );

      if (extractImageUrl) {
        setFormData((prev) => ({
          ...prev,
          imageUrl: extractImageUrl,
        }));
        toast.success("Image uploaded successfully");
      }
    } catch (error) {
      toast.error("Image upload failed. Please try again.");
      console.error("Image upload error:", error);
    } finally {
      setComponentLevelLoader({ loading: false, id: "" });
    }
  }
  function handleTileClick(size) {
    setFormData((prevFormData) => {
      const sizes = prevFormData.sizes.includes(size)
        ? prevFormData.sizes.filter((s) => s !== size)
        : [...prevFormData.sizes, size];

      return {
        ...prevFormData,
        sizes,
      };
    });
  }

  async function handleAddProduct() {
    if (!formData.imageUrl) {
      toast.error("Please upload a product image");
      return;
    }

    setComponentLevelLoader({ loading: true, id: "submit-button" });

    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        category: formData.category,
        sizes: formData.sizes,
        deliveryInfo: formData.deliveryInfo,
        onSale: formData.onSale,
        priceDrop: Number(formData.priceDrop),
        imageUrl: formData.imageUrl,
      };

      if (currentUpdatedProduct) {
        productData._id = formData._id;
      }

      const res = currentUpdatedProduct
        ? await updateAProduct(productData)
        : await addNewProduct(productData);

      if (res.success) {
        toast.success(res.message);
        setFormData(initialFormData);
        setCurrentUpdatedProduct(null);
        setTimeout(() => {
          router.push("/admin-view/all-products");
        }, 1000);
      } else {
        throw new Error(res.message);
      }
    } catch (error) {
      toast.error(error.message || "Operation failed");
      console.error("Product operation error:", error);
    } finally {
      setComponentLevelLoader({ loading: false, id: "" });
    }
  }
  return (
    <div className="w-full mt-0 mr-0 mb-0 ml-0 relative">
      <div className="flex flex-col items-start justify-start p-10 bg-gray-50 shadow-2xl rounded-xl relative">
        <div className="w-full mt-6 space-y-8">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900">
              Product Image
            </label>
            <input
              accept="image/*"
              type="file"
              onChange={handleImage}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-black file:text-white
                hover:file:bg-gray-700"
            />
            {formData.imageUrl && (
              <img
                src={formData.imageUrl}
                alt="Preview"
                className="mt-2 h-20 object-contain"
              />
            )}
          </div>

          <div className="flex gap-2 text-gray-700 flex-col">
            <label>Available sizes</label>
            <TileComponent 
              selected={formData.sizes}
              onClick={handleTileClick}
              data={AvailableSizes}
            />
          </div>

          {adminAddProductformControls.map((controlItem) =>
            controlItem.componentType === "input" ? (
              <InputComponent
                key={controlItem.id}
                type={controlItem.type}
                placeholder={controlItem.placeholder}
                label={controlItem.label}
                value={formData[controlItem.id]}
                onChange={(event) => {
                  setFormData({
                    ...formData,
                    [controlItem.id]: event.target.value,
                  });
                }}
              />
            ) : controlItem.componentType === "select" ? (
              <SelectComponent
                key={controlItem.id}
                label={controlItem.label}
                options={controlItem.options}
                value={formData[controlItem.id]}
                onChange={(event) => {
                  setFormData({
                    ...formData,
                    [controlItem.id]: event.target.value,
                  });
                }}
              />
            ) : null
          )}

          <button
            onClick={handleAddProduct}
            disabled={componentLevelLoader?.loading}
            className="inline-flex w-full items-center justify-center bg-black px-6 py-4 text-lg text-white font-medium uppercase tracking-wide disabled:opacity-50"
          >
            {componentLevelLoader?.loading ? (
              <ComponentLevelLoader
                text={currentUpdatedProduct ? "Updating" : "Adding"}
                color="#ffffff"
                loading={true}
              />
            ) : currentUpdatedProduct ? (
              "Update Product"
            ) : (
              "Add Product"
            )}
          </button>
        </div>
      </div>
      <Notification />
    </div>
  );
}
