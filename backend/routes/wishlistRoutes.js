import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  addToWishlist,
  getWishlist,
  removeFromWishlist
} from "../controllers/wishlistController.js";

const router = express.Router();

// ⭐ Add item to wishlist (user only)
router.post("/add", protect, addToWishlist);

// ⭐ Get user wishlist
router.get("/", protect, getWishlist);

// ⭐ Remove item
router.delete("/:productId", protect, removeFromWishlist);

export default router;
