import User from "../models/User.js";

// Get user profile
export const getProfile = async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
};

// Update profile
export const updateProfile = async (req, res) => {
  const { name, email, password } = req.body;

  const updateData = { name, email };

  if (password) updateData.password = password;
  if (req.file) updateData.avatar = req.file.path; // Cloudinary URL

  const updatedUser = await User.findByIdAndUpdate(req.user.id, updateData, {
    new: true,
  }).select("-password");

  res.json(updatedUser);
};
