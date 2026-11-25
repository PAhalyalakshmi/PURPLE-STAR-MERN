export default function RatingStars({ rating }) {
    const stars = [];
  
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} style={{ color: i <= rating ? "#ff9900" : "#ccc" }}>
          ★
        </span>
      );
    }
  
    return <div>{stars}</div>;
  }
  