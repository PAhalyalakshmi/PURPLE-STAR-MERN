import { useState, useEffect } from "react";
import { getCart, validateCoupon, placeOrder } from "../api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const [cart, setCart] = useState(null);
  const [address, setAddress] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null); // { code, discount, finalAmount, couponId }
  const [validating, setValidating] = useState(false);

  const navigate = useNavigate();

  const loadCart = async () => {
    const res = await getCart();
    setCart(res.data);
  };

  useEffect(() => {
    loadCart();
  }, []);

  if (!cart) return <h2 style={{ padding: 40 }}>Loading...</h2>;

  const totalAmount = cart.items.reduce((s, i) => s + i.productId.price * i.quantity, 0);

  const handleValidate = async () => {
    if (!couponCode.trim()) return toast.error("Enter coupon code");
    setValidating(true);
    try {
      const res = await validateCoupon({ code: couponCode.trim(), totalAmount });
      setAppliedCoupon(res.data);
      toast.success(`Coupon applied: -₹${res.data.discount}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid coupon");
      setAppliedCoupon(null);
    } finally {
      setValidating(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    toast("Coupon removed");
  };

  const place = async () => {
    if (!address.trim()) return toast.error("Enter delivery address");

    const items = cart.items.map((i) => ({ productId: i.productId._id, quantity: i.quantity }));

    const orderPayload = {
      items,
      totalAmount,
      address,
      couponCode: appliedCoupon?.code || null,
    };

    try {
      const res = await placeOrder(orderPayload);
      toast.success("Order placed!");
      navigate(`/track/${res.data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Order failed");
      console.log(err);
    }
  };

  return (
    <div className="container" style={{ marginTop: 20 }}>
      <h2>Checkout</h2>

      <div style={{ display: "flex", gap: 30, alignItems: "flex-start", flexWrap: "wrap" }}>
        {/* LEFT */}
        <div style={{ flex: 2, background: "white", padding: 20, borderRadius: 12 }}>
          <h3>Delivery Address</h3>
          <textarea value={address} onChange={(e)=>setAddress(e.target.value)}
            placeholder="Enter full address" style={{ width: "100%", height: 120, padding: 12, borderRadius:8, border:"1px solid #ccc" }} />

          <hr style={{ margin: "20px 0" }} />

          <h3>Apply Coupon</h3>
          <div style={{ display: "flex", gap: 10 }}>
            <input placeholder="Coupon code" value={couponCode} onChange={(e)=>setCouponCode(e.target.value)}
              style={{ padding:10, borderRadius:8, border:"1px solid #ccc", flex:1 }} />
            {!appliedCoupon ? (
              <button onClick={handleValidate} style={{ padding:"10px 14px", background:"#ff9900", border:"none", borderRadius:8, cursor:"pointer" }}>
                {validating ? "Checking..." : "Apply"}
              </button>
            ) : (
              <button onClick={removeCoupon} style={{ padding:"10px 14px", background:"gray", border:"none", borderRadius:8, cursor:"pointer" }}>
                Remove
              </button>
            )}
          </div>

          {appliedCoupon && (
            <div style={{ marginTop: 12, background: "#f0fff4", padding: 10, borderRadius:8 }}>
              <strong>{appliedCoupon.code}</strong> applied • Discount: ₹{appliedCoupon.discount} • Final: ₹{appliedCoupon.finalAmount}
            </div>
          )}
        </div>

        {/* RIGHT */}
        <div style={{ flex: 1, minWidth: 300, background: "white", padding: 20, borderRadius: 12 }}>
          <h3>Order Summary</h3>
          <p>Total: ₹{totalAmount}</p>
          <p>Discount: ₹{appliedCoupon?.discount || 0}</p>
          <h2>Payable: ₹{appliedCoupon ? appliedCoupon.finalAmount : totalAmount}</h2>

          <button onClick={place} style={{ width: "100%", padding: 12, marginTop: 12, background:"#ff9900", border:"none", borderRadius:8, cursor:"pointer" }}>
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
}
