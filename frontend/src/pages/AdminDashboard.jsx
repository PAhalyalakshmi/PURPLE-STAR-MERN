import { useEffect, useState } from "react";
import { getAllOrders, updateOrderStatus } from "../api";
import toast from "react-hot-toast";

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const res = await getAllOrders();
      setOrders(res.data);
    } catch (err) {
      console.log(err);
      toast.error("Failed to fetch orders");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      toast.success("Order status updated!");
      fetchOrders();
    } catch (err) {
      toast.error("Failed");
      console.log(err);
    }
  };

  return (
    <div className="container">
      <h1>Admin Dashboard</h1>
      <h2>Manage Orders</h2>

      <div style={{ marginTop: "20px" }}>
        {orders.length === 0 && <p>No orders found.</p>}

        {orders.map((order) => (
          <div
            key={order._id}
            style={{
              padding: "20px",
              background: "white",
              borderRadius: "12px",
              marginBottom: "20px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <p><b>Order ID:</b> {order._id}</p>
            <p><b>User:</b> {order.userId?.name}</p>
            <p><b>Email:</b> {order.userId?.email}</p>
            <p><b>Total Amount:</b> ₹{order.totalAmount}</p>
            <p><b>Current Status:</b> {order.status}</p>

            {/* ⭐ STATUS DROPDOWN */}
            <select
              value={order.status}
              onChange={(e) =>
                handleStatusChange(order._id, e.target.value)
              }
              style={{
                padding: "8px",
                marginTop: "10px",
                borderRadius: "8px",
              }}
            >
              <option value="Placed">Placed</option>
              <option value="Packed">Packed</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
            </select>

            <p style={{ marginTop: "10px", opacity: 0.7 }}>
              <b>Timeline:</b><br/>
              Placed: {order.statusDates?.placedAt ? new Date(order.statusDates.placedAt).toLocaleString() : "-"}<br/>
              Packed: {order.statusDates?.packedAt ? new Date(order.statusDates.packedAt).toLocaleString() : "-"}<br/>
              Shipped: {order.statusDates?.shippedAt ? new Date(order.statusDates.shippedAt).toLocaleString() : "-"}<br/>
              Delivered: {order.statusDates?.deliveredAt ? new Date(order.statusDates.deliveredAt).toLocaleString() : "-"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
