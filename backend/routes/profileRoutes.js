import express from "express";
import upload from "../middleware/upload.js";
import { protect } from "../middleware/authMiddleware.js";
import { getProfile, updateProfile } from "../controllers/profileController.js";

const router = express.Router();

// Get user profile
router.get("/", protect, getProfile);

// Update profile + Upload Avatar
router.put(
  "/update",
  protect,
  upload.single("avatar"),
  updateProfile
);

export default router;

