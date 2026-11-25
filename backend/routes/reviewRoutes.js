import express from "express";
import { protect, isAdmin } from "../middleware/authMiddleware.js";

import {
  addOrUpdateReview,
  deleteReview,
  adminDeleteReview
} from "../controllers/reviewController.js";

const router = express.Router();

// ⭐ Add or Update Review (User must be logged in)
router.post("/add", protect, addOrUpdateReview);

// ⭐ User Deletes Their Review
router.post("/delete", protect, deleteReview);

// ⭐ ADMIN deletes any review
router.post("/admin/delete", protect, isAdmin, adminDeleteReview);

export default router;
