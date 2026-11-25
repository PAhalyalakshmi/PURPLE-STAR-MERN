import Product from "../models/Product.js";

// Add or Edit Review
export const addOrUpdateReview = async (req, res) => {
  const { productId, rating, comment } = req.body;
  const userId = req.user.id;
  const userName = req.user.name;

  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ message: "Product not found" });

  // Check if user already reviewed
  const existingReview = product.reviews.find(
    (r) => r.user.toString() === userId
  );

  if (existingReview) {
    // Update review
    existingReview.rating = rating;
    existingReview.comment = comment;
  } else {
    // Add new review
    product.reviews.push({
      user: userId,
      name: userName,
      rating,
      comment
    });
  }

  // Update stats
  product.numReviews = product.reviews.length;
  product.averageRating =
    product.reviews.reduce((a, c) => a + c.rating, 0) / product.reviews.length;

  await product.save();
  res.json({ message: "Review saved", product });
};

// Delete Review
export const deleteReview = async (req, res) => {
  const { productId, reviewId } = req.body;
  const userId = req.user.id;

  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ message: "Product not found" });

  const review = product.reviews.find((r) => r._id.toString() === reviewId);

  if (!review) return res.status(404).json({ message: "Review not found" });

  // Allow: review owner OR admin (role check optional)
  if (review.user.toString() !== userId) {
    return res.status(403).json({ message: "Not authorized" });
  }

  product.reviews = product.reviews.filter(
    (r) => r._id.toString() !== reviewId
  );

  // Update stats
  product.numReviews = product.reviews.length;
  product.averageRating =
    product.reviews.length === 0
      ? 0
      : product.reviews.reduce((a, c) => a + c.rating, 0) /
        product.reviews.length;

  await product.save();
  res.json({ message: "Review deleted", product });
};

// Admin Delete (no auth limits)
export const adminDeleteReview = async (req, res) => {
  const { productId, reviewId } = req.body;

  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ message: "Product not found" });

  product.reviews = product.reviews.filter(
    (r) => r._id.toString() !== reviewId
  );

  product.numReviews = product.reviews.length;
  product.averageRating =
    product.reviews.length === 0
      ? 0
      : product.reviews.reduce((a, c) => a + c.rating, 0) /
        product.reviews.length;

  await product.save();
  res.json({ message: "Admin deleted review", product });
};
