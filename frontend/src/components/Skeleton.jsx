export default function Skeleton({ height = "20px", width = "100%", radius = "8px" }) {
    return (
      <div
        style={{
          height,
          width,
          borderRadius: radius,
          background: "linear-gradient(90deg, #e3e3e3 0%, #f5f5f5 50%, #e3e3e3 100%)",
          backgroundSize: "200% 100%",
          animation: "shimmer 1.5s infinite linear",
        }}
      ></div>
    );
  }
  