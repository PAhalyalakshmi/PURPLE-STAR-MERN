import { useEffect, useState } from "react";
import { getMyOrders } from "../api";
import Skeleton from "../components/Skeleton";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getMyOrders()
      .then((res) => setOrders(res.data))
      .catch(() => setError("Could not load your orders. Please try again."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="container">
        <h2>Your Orders</h2>
        {[...Array(2)].map((_, i) => (
          <div
            key={i}
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "12px",
              marginBottom: "25px",
            }}
          >
            <Skeleton width="40%" height="25px" />
            <Skeleton width="60%" height="15px" />
            <Skeleton width="80%" height="100px" />
          </div>
        ))}
      </div>
    );
  }

  if (error) return <p className="container">{error}</p>;

  // ⭐ Skeleton UI
  if (orders.length === 0) {
    return <h2 style={{ textAlign: "center", marginTop: 40 }}>No orders yet</h2>;
  }

  return (
    <div className="container">
      <h2>Your Orders</h2>

      {orders.map((o) => (
        <div
          key={o._id}
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "12px",
            marginBottom: "20px",
          }}
        >
          <h3>Order #{o._id}</h3>
          <p>Total Items: {o.items.length}</p>
        </div>
      ))}
    </div>
  );
}
