import express from "express";
import upload from "../middleware/upload.js";
import { protect, isAdmin } from "../middleware/authMiddleware.js";

import {
  addProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct
} from "../controllers/productController.js";

const router = express.Router();

// ------------------------------
// ⭐ PRODUCT ROUTES
// ------------------------------

// Add product (Admin only)
router.post("/", protect, isAdmin, upload.single("image"), addProduct);

// Get all products (Public)
router.get("/", getProducts);

// Get single product by ID (Public)
router.get("/:id", getProduct);

// Update product (Admin only)
router.put("/:id", protect, isAdmin, upload.single("image"), updateProduct);

// Delete product (Admin only)
router.delete("/:id", protect, isAdmin, deleteProduct);

export default router;
