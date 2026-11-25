import { useState } from "react";
import { addOrUpdateReview } from "../api";
import toast from "react-hot-toast";

export default function ReviewForm({ product, refresh }) {
  const existingReview = (product.reviews || []).find(
    (review) => review.user === localStorage.getItem("userId")
  );
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [comment, setComment] = useState(existingReview?.comment || "");
  const [saving, setSaving] = useState(false);

  const submitReview = async (event) => {
    event.preventDefault();
    if (!rating) return toast.error("Choose a star rating first");

    setSaving(true);
    try {
      await addOrUpdateReview({ productId: product._id, rating, comment });
      await refresh();
      toast.success("Your review has been saved");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not save your review");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="review-form" onSubmit={submitReview}>
      <h3>{existingReview ? "Update your review" : "Share your thoughts"}</h3>
      <div className="review-stars" role="group" aria-label="Choose a rating">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            type="button"
            key={value}
            className={value <= rating ? "is-selected" : ""}
            aria-label={`${value} star${value === 1 ? "" : "s"}`}
            aria-pressed={rating === value}
            onClick={() => setRating(value)}
          >
            ★
          </button>
        ))}
      </div>
      <textarea
        placeholder="What did you think? (optional)"
        value={comment}
        onChange={(event) => setComment(event.target.value)}
      />
      <button className="button button-primary" type="submit" disabled={saving}>
        {saving ? "Saving…" : existingReview ? "Update review" : "Post review"}
      </button>
    </form>
  );
}
