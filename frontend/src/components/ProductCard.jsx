import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { addToCart } from "../redux/cartSlice";
import RatingStars from "./RatingStars";
import toast from "react-hot-toast";

export default function ProductCard({ p }) {
  const dispatch = useDispatch();

  const add = () => {
    dispatch(addToCart(p));
    toast.success("Added to cart 🛒");
  };

  return (
    <article className="product-card">
      <div className="product-card-image-wrap">
        <Link to={`/products/${p._id}`} className="product-card-image-link" aria-label={`View ${p.title}`}>
          <img
            className="product-card-image"
            src={p.image || "/banners/banner1.jpg"}
            alt={p.title}
            loading="lazy"
            onError={(event) => {
              event.currentTarget.src = "/banners/banner1.jpg";
            }}
          />
        </Link>
      </div>

      <div className="product-card-content">
        <span className="product-category">{p.category || "Purple Star pick"}</span>
        <Link to={`/products/${p._id}`} className="product-card-title">
          {p.title}
        </Link>
        <div className="product-card-rating">
          {p.numReviews > 0 ? (
            <>
              <RatingStars rating={p.averageRating || 0} />
              <span>{p.numReviews} reviews</span>
            </>
          ) : (
            <span className="new-product-label">New arrival</span>
          )}
        </div>
        <div className="product-card-footer">
          <span className="product-price">₹{Number(p.price).toLocaleString("en-IN")}</span>
          <button className="button button-primary product-add-button" onClick={add} type="button">
            Add to cart
          </button>
        </div>
      </div>
    </article>
  );
}
