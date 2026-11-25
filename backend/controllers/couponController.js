import Coupon from "../models/Coupon.js";
import User from "../models/User.js";

// Create coupon (admin)
export const createCoupon = async (req, res) => {
  try {
    const {
      code,
      type,
      value,
      minPurchase,
      maxDiscount,
      expiresAt,
      active,
      usageLimit,
      oneTimePerUser,
    } = req.body;

    const exists = await Coupon.findOne({ code: code.toUpperCase() });
    if (exists) return res.status(400).json({ message: "Coupon code exists" });

    const coupon = await Coupon.create({
      code: code.toUpperCase(),
      type,
      value,
      minPurchase: minPurchase || 0,
      maxDiscount: maxDiscount || 0,
      expiresAt,
      active: active === "true" || active === true,
      usageLimit: usageLimit || 0,
      oneTimePerUser: oneTimePerUser === "true" || oneTimePerUser === true,
    });

    res.json(coupon);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all coupons (admin)
export const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json(coupons);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete coupon (admin)
export const deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    await Coupon.findByIdAndDelete(id);
    res.json({ message: "Coupon deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Validate coupon for a given user and cart total
export const validateCoupon = async (req, res) => {
  try {
    const { code, totalAmount } = req.body;
    const userId = req.user ? req.user._id : null;

    if (!code) return res.status(400).json({ message: "Coupon code required" });

    const coupon = await Coupon.findOne({ code: code.toUpperCase() });

    if (!coupon || !coupon.active) return res.status(404).json({ message: "Invalid coupon" });

    // expiry
    if (new Date(coupon.expiresAt) < new Date())
      return res.status(400).json({ message: "Coupon expired" });

    // min purchase
    if (totalAmount < (coupon.minPurchase || 0))
      return res.status(400).json({ message: `Minimum purchase ₹${coupon.minPurchase} required` });

    // usage limit
    if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit)
      return res.status(400).json({ message: "Coupon usage limit reached" });

    // one time per user
    if (userId && coupon.oneTimePerUser) {
      if (coupon.usedBy.some((id) => id.toString() === userId.toString()))
        return res.status(400).json({ message: "You already used this coupon" });
    }

    // calculate discount
    let discount = 0;
    if (coupon.type === "percent") {
      discount = (coupon.value / 100) * totalAmount;
      if (coupon.maxDiscount && coupon.maxDiscount > 0) {
        discount = Math.min(discount, coupon.maxDiscount);
      }
    } else {
      // flat
      discount = coupon.value;
      if (coupon.maxDiscount && coupon.maxDiscount > 0) {
        discount = Math.min(discount, coupon.maxDiscount);
      }
    }

    // round to 2 decimals (currency)
    discount = Math.round(discount * 100) / 100;
    const finalAmount = Math.max(0, Math.round((totalAmount - discount) * 100) / 100);

    res.json({
      code: coupon.code,
      discount,
      finalAmount,
      couponId: coupon._id,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
