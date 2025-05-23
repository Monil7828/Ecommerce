import connectToDB from "@/database";
import AuthUser from "@/middleware/AuthUser";
import Order from "@/models/order";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req, { params }) {
  try {
    await connectToDB();
    const { id } = params;

    const isAuthUser = await AuthUser(req);
    if (isAuthUser?.role !== "admin") {
      return NextResponse.json({
        success: false,
        message: "You are not authorized",
      });
    }

    const orderDetails = await Order.findById(id).populate("user").populate({
      path: "orderItems.product",
      model: "Product",
    });

    if (orderDetails) {
      return NextResponse.json({
        success: true,
        data: orderDetails,
      });
    } else {
      return NextResponse.json({
        success: false,
        message: "Order not found",
      });
    }
  } catch (error) {
    console.error("Error fetching order details:", error);
    return NextResponse.json({
      success: false,
      message: "Something went wrong! Please try again later",
    });
  }
}