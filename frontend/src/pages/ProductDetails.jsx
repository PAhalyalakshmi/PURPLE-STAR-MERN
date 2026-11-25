import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import API from "../api";
import { addToCart } from "../redux/cartSlice";
import RatingStars from "../components/RatingStars";
import toast from "react-hot-toast";

export default function ProductDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [requestState, setRequestState] = useState({
    productId: null,
    status: "loading",
    error: "",
  });

  useEffect(() => {
    let active = true;
    API.get(`/products/${id}`)
      .then((response) => {
        if (active) {
          setProduct(response.data);
          setRequestState({
            productId: id,
            status: "loaded",
            error: response.data ? "" : "This product could not be found.",
          });
        }
      })
      .catch(() => {
        if (active) {
          setRequestState({
            productId: id,
            status: "error",
            error: "Could not load this product. Please try again.",
          });
        }
      })

    return () => {
      active = false;
    };
  }, [id]);

  if (requestState.productId !== id || requestState.status === "loading") {
    return <p className="container status-message">Loading product…</p>;
  }

  if (requestState.status === "error" || !product) {
    return (
      <p className="container status-message" role="alert">
        {requestState.error || "Product not found."}
      </p>
    );
  }

  const reviews = product.reviews || [];

  return (
    <main className="container product-detail-page">
      <Link to="/products" className="back-link">← Back to the collection</Link>

      <section className="product-detail-card">
        <div className="product-detail-image-wrap">
          <img
            src={product.image || "/banners/banner1.jpg"}
            alt={product.title}
            className="product-detail-image"
            onError={(event) => {
              event.currentTarget.src = "/banners/banner1.jpg";
            }}
          />
        </div>

        <div className="product-detail-info">
          <span className="eyebrow">{product.category || "PURPLE STAR PICK"}</span>
          <h1>{product.title}</h1>
          <div className="detail-rating">
            {product.numReviews > 0 ? (
              <>
                <RatingStars rating={product.averageRating || 0} />
                <span>{product.numReviews} customer reviews</span>
              </>
            ) : (
              <span className="new-product-label">A new arrival</span>
            )}
          </div>
          <p className="detail-price">₹{Number(product.price).toLocaleString("en-IN")}</p>
          <p className="detail-description">
            {product.description || "A thoughtful find, selected for your everyday."}
          </p>
          <p className={product.stock > 0 ? "stock-message" : "stock-message is-unavailable"}>
            {product.stock > 0 ? `${product.stock} in stock` : "Currently out of stock"}
          </p>
          <button
            className="button button-primary detail-add-button"
            type="button"
            disabled={product.stock < 1}
            onClick={() => {
              dispatch(addToCart(product));
              toast.success("Added to cart");
            }}
          >
            Add to cart
          </button>
        </div>
      </section>

      <section className="reviews-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">REAL NOTES FROM CUSTOMERS</span>
            <h2>Customer reviews</h2>
          </div>
          {reviews.length > 0 && <span className="results-count">{reviews.length} reviews</span>}
        </div>

        {reviews.length === 0 ? (
          <p className="review-login-note">No customer reviews yet.</p>
        ) : (
          <div className="review-list">
            {reviews.map((review) => (
              <article className="review-card" key={review._id}>
                <div className="review-card-heading">
                  <div>
                    <strong>{review.name || "Purple Star customer"}</strong>
                    <RatingStars rating={review.rating} />
                  </div>
                  <time>{new Date(review.createdAt).toLocaleDateString()}</time>
                </div>
                <p>{review.comment || "No written comment."}</p>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
