import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  name: String,
  rating: { type: Number, required: true },
  comment: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    image: String,
    category: String,
    stock: { type: Number, required: true, default: 10 },

    // ⭐ NEW — Reviews
    reviews: [reviewSchema],

    // ⭐ NEW — Average rating
    averageRating: {
      type: Number,
      default: 0
    },

    numReviews: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
