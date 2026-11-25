import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOrderById } from "../api";

export default function OrderTracking() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  const steps = [
    { key: "Placed", label: "Order Placed" },
    { key: "Packed", label: "Packed" },
    { key: "Shipped", label: "Shipped" },
    { key: "Delivered", label: "Delivered" },
  ];

  useEffect(() => {
    getOrderById(id).then((res) => setOrder(res.data));
  }, [id]);

  if (!order) return <h2 style={{ textAlign: "center" }}>Loading...</h2>;

  const getStatusDate = (statusKey) => {
    const dateField = statusKey.toLowerCase() + "At";
    return order.statusDates[dateField]
      ? new Date(order.statusDates[dateField]).toLocaleString()
      : null;
  };

  // Determine active step index
  const activeIndex = steps.findIndex((s) => s.key === order.status);

  return (
    <div className="container" style={{ marginTop: "30px" }}>
      <h1>Order Tracking</h1>
      <h3 style={{ opacity: 0.7 }}>Order ID: {order._id}</h3>

      {/* ⭐ TIMELINE */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "40px" }}>
        {steps.map((step, index) => {
          const isActive = index <= activeIndex;
          return (
            <div key={step.key} style={{ textAlign: "center", width: "25%" }}>
              
              {/* Circle */}
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  margin: "auto",
                  background: isActive ? "#6a0dad" : "#ccc",
                  transition: "0.3s",
                }}
              ></div>

              <p style={{ marginTop: "10px", fontWeight: isActive ? "bold" : "normal" }}>
                {step.label}
              </p>

              <p style={{ fontSize: "13px", opacity: 0.7 }}>
                {getStatusDate(step.key) || ""}
              </p>

              {/* Line */}
              {index < steps.length - 1 && (
                <div
                  style={{
                    height: "4px",
                    width: "100%",
                    background: index < activeIndex ? "#6a0dad" : "#ccc",
                    marginTop: "10px",
                    transition: "0.3s",
                  }}
                ></div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: "40px" }}>
        <h2>Order Summary</h2>

        {order.items.map((item) => (
          <div
            key={item._id}
            style={{
              marginTop: "15px",
              padding: "15px",
              borderRadius: "10px",
              background: "white",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            }}
          >
            <p><b>Product:</b> {item.productId?.title}</p>
            <p><b>Quantity:</b> {item.quantity}</p>
          </div>
        ))}

        <h3 style={{ marginTop: "20px" }}>Total: ₹{order.totalAmount}</h3>
      </div>
    </div>
  );
}
