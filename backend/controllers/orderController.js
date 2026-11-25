import Order from "../models/Order.js";
import Coupon from "../models/Coupon.js";
import Product from "../models/Product.js";
import User from "../models/User.js";

// ===============================
// ⭐ USER — PLACE ORDER (Coupon + Inventory)
// ===============================
export const placeOrder = async (req, res) => {
  try {
    const { items, totalAmount, address, couponCode } = req.body;
    const userId = req.user._id;

    let discountAmount = 0;
    let finalAmount = totalAmount;

    // -------------------------------
    // ⭐ STEP 1 — Apply Coupon (Optional)
    // -------------------------------
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });

      if (!coupon || !coupon.active)
        return res.status(400).json({ message: "Invalid coupon" });

      if (new Date(coupon.expiresAt) < new Date())
        return res.status(400).json({ message: "Coupon expired" });

      if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit)
        return res.status(400).json({ message: "Coupon usage exceeded" });

      if (
        coupon.oneTimePerUser &&
        coupon.usedBy.some((id) => id.toString() === userId.toString())
      )
        return res.status(400).json({ message: "You already used this coupon" });

      if (totalAmount < (coupon.minPurchase || 0))
        return res
          .status(400)
          .json({
            message: `Minimum purchase ₹${coupon.minPurchase} required`,
          });

      // % or Flat Discount
      if (coupon.type === "percent") {
        discountAmount = (coupon.value / 100) * totalAmount;
        if (coupon.maxDiscount)
          discountAmount = Math.min(discountAmount, coupon.maxDiscount);
      } else {
        discountAmount = coupon.value;
        if (coupon.maxDiscount)
          discountAmount = Math.min(discountAmount, coupon.maxDiscount);
      }

      discountAmount = Math.round(discountAmount);
      finalAmount = Math.max(0, totalAmount - discountAmount);

      // Record usage
      coupon.usedCount = (coupon.usedCount || 0) + 1;
      if (coupon.oneTimePerUser) coupon.usedBy.push(userId);
      await coupon.save();
    }

    // -------------------------------
    // ⭐ STEP 2 — Reduce Inventory Stock
    // -------------------------------
    for (const item of items) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Only ${product.stock} left of ${product.title}`,
        });
      }

      product.stock -= item.quantity;
      await product.save();
    }

    // -------------------------------
    // ⭐ STEP 3 — Create Order
    // -------------------------------
    const order = await Order.create({
      userId,
      items,
      totalAmount,
      discountAmount,
      finalAmount,
      address,
      couponCode: couponCode ? couponCode.toUpperCase() : null,
      status: "Placed",
      statusDates: { placedAt: Date.now() },
    });

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ===============================
// ⭐ USER — GET MY ORDERS
// ===============================
export const getMyOrders = async (req, res) => {
  const orders = await Order.find({ userId: req.user._id }).sort({
    createdAt: -1,
  });
  res.json(orders);
};

// ===============================
// ⭐ USER — ORDER DETAILS
// ===============================
export const getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "items.productId"
  );
  res.json(order);
};

// ===============================
// ⭐ ADMIN — ALL ORDERS
// ===============================
export const getAllOrders = async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders);
};

// ===============================
// ⭐ ADMIN — UPDATE ORDER STATUS
// ===============================
export const updateOrderStatus = async (req, res) => {
  const order = await Order.findById(req.params.orderId);

  if (!order) return res.status(404).json({ message: "Order not found" });

  order.status = req.body.status;
  order.statusDates[`${req.body.status}At`] = Date.now();

  await order.save();
  res.json(order);
};

// ===============================
// ⭐ ADMIN — ANALYTICS
// ===============================
export const getAnalytics = async (req, res) => {
  const totalOrders = await Order.countDocuments();
  const totalUsers = await User.countDocuments();
  const totalRevenueAgg = await Order.aggregate([
    { $group: { _id: null, total: { $sum: "$finalAmount" } } },
  ]);

  const totalRevenue = totalRevenueAgg[0]?.total || 0;

  const revenueData = await Order.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        total: { $sum: "$finalAmount" },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  res.json({
    totalOrders,
    totalUsers,
    totalRevenue,
    revenueData,
  });
};
