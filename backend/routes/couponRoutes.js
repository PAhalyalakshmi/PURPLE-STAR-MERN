import express from "express";
import { protect, isAdmin } from "../middleware/authMiddleware.js";
import { createCoupon, getAllCoupons, deleteCoupon, validateCoupon } from "../controllers/couponController.js";

const router = express.Router();

// Admin create/list/delete
router.post("/", protect, isAdmin, createCoupon);
router.get("/", protect, isAdmin, getAllCoupons);
router.delete("/:id", protect, isAdmin, deleteCoupon);

// Validate coupon for a given cart total (user may be guest or logged in)
// protect optional; we will protect it so that only logged-in users can validate via checkout (you can remove protect if you want)
// Using protect ensures we can check oneTimePerUser
router.post("/validate", protect, validateCoupon);

export default router;
