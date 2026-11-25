import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllProducts } from "../api";
import HeroSlider from "../components/HeroSlider";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [catalogReady, setCatalogReady] = useState(true);

  useEffect(() => {
    getAllProducts()
      .then((response) => {
        if (!Array.isArray(response.data)) {
          throw new Error("The products API returned an invalid response.");
        }
        setFeatured(response.data.slice(0, 4));
      })
      .catch(() => setCatalogReady(false));
  }, []);

  return (
    <main>
      <div className="container home-page">
        <HeroSlider />

        <section className="benefit-row" aria-label="Shopping benefits">
          <div className="benefit-item">
            <span className="benefit-icon">✦</span>
            <div>
              <strong>Thoughtfully picked</strong>
              <span>Everyday things, made special</span>
            </div>
          </div>
          <div className="benefit-item">
            <span className="benefit-icon">◇</span>
            <div>
              <strong>Easy, secure checkout</strong>
              <span>A smoother way to shop</span>
            </div>
          </div>
          <div className="benefit-item">
            <span className="benefit-icon">♡</span>
            <div>
              <strong>Here for the details</strong>
              <span>Support when you need us</span>
            </div>
          </div>
        </section>

        <section className="featured-section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">A FEW GOOD FINDS</span>
              <h2>Picked for you</h2>
              <p>Little upgrades for the everyday.</p>
            </div>
            <Link to="/products" className="text-link">
              Explore everything <span aria-hidden="true">→</span>
            </Link>
          </div>

          {featured.length > 0 ? (
            <div className="grid product-grid">
              {featured.map((product) => (
                <ProductCard key={product._id} p={product} />
              ))}
            </div>
          ) : (
            <div className="home-catalog-note">
              {catalogReady
                ? "The collection is being curated. Check back soon."
                : "We couldn't reach the product catalog. Please check the server and try again."}
            </div>
          )}
        </section>

        <section className="closing-banner">
          <div>
            <span className="eyebrow">MAKE ROOM FOR A LITTLE JOY</span>
            <h2>Good finds. Good feelings.</h2>
          </div>
          <Link to="/products" className="button button-light">
            Browse the collection
          </Link>
        </section>
      </div>
    </main>
  );
}
