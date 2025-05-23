import connectToDB from "@/database";
import AuthUser from "@/middleware/AuthUser";
import Product from "@/models/product";
import Joi from "joi";
import { NextResponse } from "next/server";

const AddNewProductSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().required(),
  category: Joi.string().required(),
  sizes: Joi.array().items(Joi.object({
    id: Joi.string().required(),
    label: Joi.string().required()
  })).required(),
  deliveryInfo: Joi.string().required(),
  onSale: Joi.string().valid('yes', 'no').required(),
  priceDrop: Joi.number().min(0).max(100).required(),
  imageUrl: Joi.string().uri().required(),
});

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    await connectToDB();
    const isAuthUser = await AuthUser(req);

    if (isAuthUser?.role === "admin") {
      const extractData = await req.json();

      // Validate the incoming data
      const { error } = AddNewProductSchema.validate(extractData);
      if (error) {
        return NextResponse.json({
          success: false,
          message: error.details[0].message,
        });
      }

      // Convert price and priceDrop to numbers
      const productData = {
        ...extractData,
        price: Number(extractData.price),
        priceDrop: Number(extractData.priceDrop)
      };

      const newlyCreatedProduct = await Product.create(productData);

      if (newlyCreatedProduct) {
        return NextResponse.json({
          success: true,
          message: "Product added successfully",
          data: newlyCreatedProduct
        });
      } else {
        return NextResponse.json({
          success: false,
          message: "Failed to add the product. Please try again",
        });
      }
    } else {
      return NextResponse.json({
        success: false,
        message: "You are not authorized!",
      });
    }
  } catch (error) {
    console.error("Error in adding product:", error);
    return NextResponse.json({
      success: false,
      message: "Something went wrong! Please try again later",
      error: error.message
    });
  }
}