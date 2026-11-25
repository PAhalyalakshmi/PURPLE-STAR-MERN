import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: Number,
      },
    ],

    totalAmount: Number, // original total before coupon
    discountAmount: { type: Number, default: 0 }, // discount applied
    finalAmount: Number, // total after discount
    address: String,

    // Order tracking status
    status: {
      type: String,
      enum: ["Placed", "Packed", "Shipped", "Delivered"],
      default: "Placed",
    },

    // Timestamps for status
    statusDates: {
      placedAt: { type: Date, default: Date.now },
      packedAt: { type: Date },
      shippedAt: { type: Date },
      deliveredAt: { type: Date },
    },

    // Coupon code applied (if any)
    couponCode: { type: String, default: null },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
