import CommonListing from "@/components/CommonListing";
import { getAllAdminProducts } from "@/services/product";

export default async function OnSaleProducts() {
  const allProducts = await getAllAdminProducts();
  
  // Filter products to only include those with onSale === "yes"
  const onSaleProducts = allProducts?.data?.filter(product => product.onSale === "yes");

  return <CommonListing data={onSaleProducts} />;
}