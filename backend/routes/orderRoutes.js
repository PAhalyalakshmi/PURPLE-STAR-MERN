import express from "express";
import {
  placeOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  getAllOrders,
} from "../controllers/orderController.js";

import { protect, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// ⭐ USER ROUTES
router.post("/place", protect, placeOrder);
router.get("/myorders", protect, getMyOrders);
router.get("/:id", protect, getOrderById);

// ⭐ ADMIN ROUTES
router.get("/admin/all", protect, isAdmin, getAllOrders);
router.put("/admin/update-status/:orderId", protect, isAdmin, updateOrderStatus);

export default router;
