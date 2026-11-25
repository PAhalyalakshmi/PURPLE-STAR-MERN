import { useEffect, useMemo, useState } from "react";
import { getAllProducts } from "../api";
import ProductCard from "../components/ProductCard";
import ProductFilters from "../components/ProductFilters";
import Skeleton from "../components/Skeleton";

export default function Products() {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState({
    search: "",
    category: "",
    price: "",
    rating: "",
    sort: "",
  });

  useEffect(() => {
    getAllProducts()
      .then((res) => {
        if (!Array.isArray(res.data)) {
          throw new Error("The products API returned an invalid response.");
        }

        setAllProducts(res.data);
      })
      .catch(() => {
        setError("Could not load products. Check that the backend is running and try again.");
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let results = [...allProducts];

    // SEARCH
    if (filters.search.trim()) {
      results = results.filter((p) =>
        p.title.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // CATEGORY
    if (filters.category) {
      results = results.filter((p) => p.category === filters.category);
    }

    // PRICE
    if (filters.price) {
      const [min, max] = filters.price.split("-");
      results = results.filter((p) => {
        if (max) return p.price >= min && p.price <= max;
        return p.price >= parseInt(min);
      });
    }

    // RATING
    if (filters.rating) {
      results = results.filter((p) => p.averageRating >= Number(filters.rating));
    }

    // SORTING
    if (filters.sort === "low-high") {
      results.sort((a, b) => a.price - b.price);
    }
    if (filters.sort === "high-low") {
      results.sort((a, b) => b.price - a.price);
    }
    if (filters.sort === "newest") {
      results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return results;
  }, [filters, allProducts]);

  if (error) {
    return <p className="container status-message" role="alert">{error}</p>;
  }

  if (loading) {
    return (
      <div className="container products-layout">
        <ProductFilters
          allProducts={[]}
          filters={filters}
          setFilters={setFilters}
        />

        <div className="grid product-grid">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="product-card">
              <Skeleton height="200px" />
              <Skeleton height="20px" width="70%" />
              <Skeleton height="20px" width="50%" />
              <Skeleton height="35px" width="80%" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (allProducts.length === 0) {
    return (
      <div className="container empty-catalog">
        <span className="eyebrow">A LITTLE QUIET IN HERE</span>
        <h2>Our shelves are getting ready</h2>
        <p>There are no products in the catalog yet. Please check back soon.</p>
      </div>
    );
  }

  return (
    <main className="container products-page">
      <header className="page-heading">
        <div>
          <span className="eyebrow">THE PURPLE STAR EDIT</span>
          <h1>Find your next favorite</h1>
          <p>Thoughtful everyday finds, picked to bring a little more joy.</p>
        </div>
        <span className="results-count">{filtered.length} products</span>
      </header>

      <div className="products-layout">
      <ProductFilters
        allProducts={allProducts}
        filters={filters}
        setFilters={setFilters}
      />

      <section className="product-results" aria-label="Product results">
        {filtered.length === 0 ? (
          <div className="empty-results">
            <h2>No matches this time</h2>
            <p>Try changing a filter or using a broader search.</p>
          </div>
        ) : (
          <div className="grid product-grid">
            {filtered.map((product) => (
              <ProductCard key={product._id} p={product} />
            ))}
          </div>
        )}
      </section>
      </div>
    </main>
  );
}
