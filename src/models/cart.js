import mongoose from "mongoose";

const CartSchema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    productID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Products",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, "Quantity can't be less than 1"],
      default: 1,
    },
  },
  {
    timestamps: true, 
    versionKey: false,
  }
);

CartSchema.index({ userID: 1, productID: 1 }, { unique: true });

const Cart = mongoose.models.Cart || mongoose.model("Cart", CartSchema);
export default Cart;
