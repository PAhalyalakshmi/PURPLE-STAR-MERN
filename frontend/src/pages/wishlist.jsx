import { useEffect } from "react";
import { getWishlist, removeWishlist } from "../api";
import { useDispatch, useSelector } from "react-redux";
import { setWishlist } from "../redux/wishlistSlice";
import { addToCart } from "../redux/cartSlice";
import toast from "react-hot-toast";

export default function Wishlist() {
  const dispatch = useDispatch();
  const items = useSelector((s) => s.wishlist.items);

  const loadWishlist = async () => {
    const res = await getWishlist();
    dispatch(setWishlist(res.data));
  };

  useEffect(() => {
    loadWishlist();
  }, []);

  const moveToCart = async (p) => {
    // Add to cart
    dispatch(addToCart(p));
    toast.success("Moved to cart 🛒");

    // Remove from wishlist
    const res = await removeWishlist(p._id);
    dispatch(setWishlist(res.data.wishlist));
  };

  if (items.length === 0)
    return <h2 style={{ textAlign: "center", marginTop: 40 }}>No items in wishlist ❤️</h2>;

  return (
    <div className="container" style={{ marginTop: 20 }}>
      <h2>Your Wishlist ❤️</h2>

      <div className="grid">
        {items.map((p) => (
          <div key={p._id} className="product-card">
            <img
              src={p.image}
              style={{ width: "100%", height: 220, objectFit: "cover", borderRadius: 8 }}
            />
            <h3>{p.title}</h3>
            <p>₹{p.price}</p>

            <button
              onClick={() => moveToCart(p)}
              style={{
                padding: "8px 14px",
                background: "green",
                color: "white",
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
                marginTop: 10,
              }}
            >
              🛒 Move to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
