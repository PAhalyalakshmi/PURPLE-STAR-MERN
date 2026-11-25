import User from "../models/User.js";

// Add to wishlist
export const addToWishlist = async (req, res) => {
  const userId = req.user.id;
  const { productId } = req.body;

  const user = await User.findById(userId);

  if (user.wishlist.some((id) => id.toString() === productId)) {
    return res.status(400).json({ message: "Already in wishlist" });
  }

  user.wishlist.push(productId);
  await user.save();
  await user.populate("wishlist");

  res.json({ message: "Added to wishlist", wishlist: user.wishlist });
};

// Remove from wishlist
export const removeFromWishlist = async (req, res) => {
  const userId = req.user.id;
  const productId = req.params.productId;

  const user = await User.findById(userId);

  user.wishlist = user.wishlist.filter((id) => id.toString() !== productId);
  await user.save();
  await user.populate("wishlist");

  res.json({ message: "Removed", wishlist: user.wishlist });
};

// Get wishlist
export const getWishlist = async (req, res) => {
  const userId = req.user.id;

  const user = await User.findById(userId).populate("wishlist");

  res.json(user.wishlist);
};
