import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    // 'percent' or 'flat'
    type: { type: String, enum: ["percent", "flat"], required: true },
    value: { type: Number, required: true }, // percent (e.g. 20) or flat amount (e.g. 200)
    minPurchase: { type: Number, default: 0 }, // minimum cart total to apply coupon
    maxDiscount: { type: Number, default: 0 }, // maximum allowed discount (0 = no cap)
    expiresAt: { type: Date, required: true },
    active: { type: Boolean, default: true },
    usageLimit: { type: Number, default: 0 }, // 0 = unlimited
    usedCount: { type: Number, default: 0 },
    oneTimePerUser: { type: Boolean, default: false }, // if true, each user can use only once
    usedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Coupon", couponSchema);
