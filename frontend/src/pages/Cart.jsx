import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { removeFromCart, setCart, updateQuantity } from "../redux/cartSlice";

export default function Cart() {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.items);
  const total = cart.reduce((sum, product) => sum + product.price * product.quantity, 0);

  if (cart.length === 0) {
    return (
      <main className="container cart-page">
        <div className="empty-catalog">
          <span className="eyebrow">YOUR LITTLE EDIT</span>
          <h1>Your cart is taking a breather</h1>
          <p>Find something lovely and it will be waiting here.</p>
          <Link to="/products" className="button button-primary cart-browse-button">
            Browse products
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="container cart-page">
      <header className="page-heading">
        <div>
          <span className="eyebrow">YOUR LITTLE EDIT</span>
          <h1>Your cart</h1>
          <p>{cart.length} {cart.length === 1 ? "item" : "items"} picked out for you</p>
        </div>
        <button
          className="text-button"
          type="button"
          onClick={() => dispatch(setCart([]))}
        >
          Clear cart
        </button>
      </header>

      <div className="cart-layout">
        <section className="cart-items" aria-label="Items in your cart">
          {cart.map((product) => (
            <article className="cart-item" key={product._id}>
              <img
                src={product.image || "/banners/banner1.jpg"}
                alt={product.title}
                onError={(event) => {
                  event.currentTarget.src = "/banners/banner1.jpg";
                }}
              />
              <div className="cart-item-info">
                <span className="product-category">{product.category || "Purple Star pick"}</span>
                <h2>{product.title}</h2>
                <p>₹{Number(product.price).toLocaleString("en-IN")}</p>
                <div className="quantity-control" aria-label={`Quantity for ${product.title}`}>
                  <button
                    type="button"
                    aria-label={`Decrease ${product.title} quantity`}
                    onClick={() => dispatch(updateQuantity({
                      id: product._id,
                      quantity: product.quantity - 1,
                    }))}
                  >
                    −
                  </button>
                  <span>{product.quantity}</span>
                  <button
                    type="button"
                    aria-label={`Increase ${product.title} quantity`}
                    onClick={() => dispatch(updateQuantity({
                      id: product._id,
                      quantity: product.quantity + 1,
                    }))}
                  >
                    +
                  </button>
                </div>
              </div>
              <button
                className="cart-remove-button"
                type="button"
                onClick={() => dispatch(removeFromCart(product._id))}
              >
                Remove
              </button>
            </article>
          ))}
        </section>

        <aside className="cart-summary">
          <span className="eyebrow">ORDER SUMMARY</span>
          <h2>Cart total</h2>
          <div className="cart-total-row">
            <span>Subtotal</span>
            <strong>₹{total.toLocaleString("en-IN")}</strong>
          </div>
          <p className="cart-demo-note">
            This portfolio version demonstrates local cart interactions; checkout is not connected.
          </p>
          <Link to="/products" className="button button-primary cart-browse-button">
            Keep browsing
          </Link>
        </aside>
      </div>
    </main>
  );
}
