import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaSearch, FaStar } from "react-icons/fa";
import { ThemeContext } from "../context/ThemeContext";
import { getAllProducts } from "../api";

export default function Navbar() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const cartCount = useSelector((state) =>
    state.cart.items.reduce((count, item) => count + (item.quantity || 1), 0)
  );
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionQuery, setSuggestionQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);
  const [searchError, setSearchError] = useState(false);
  const [searchErrorQuery, setSearchErrorQuery] = useState("");
  const visibleSuggestions = query.trim() === suggestionQuery ? suggestions : [];

  useEffect(() => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return undefined;

    let active = true;
    const delay = setTimeout(() => {
      getAllProducts()
        .then((response) => {
          if (!active) return;
          const products = Array.isArray(response.data) ? response.data : [];
          const matches = products.filter((product) =>
            product.title.toLowerCase().includes(trimmedQuery.toLowerCase())
          );
          setSuggestions(matches.slice(0, 6));
          setSuggestionQuery(trimmedQuery);
          setSearchError(false);
          setSearchErrorQuery("");
        })
        .catch(() => {
          if (active) {
            setSearchError(true);
            setSearchErrorQuery(trimmedQuery);
          }
        });
    }, 250);

    return () => {
      active = false;
      clearTimeout(delay);
    };
  }, [query]);

  const selectSuggestion = (product) => {
    navigate(`/products/${product._id}`);
    setSuggestions([]);
    setQuery("");
  };

  const handleKeyDown = (event) => {
    if (visibleSuggestions.length === 0) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => (index + 1) % visibleSuggestions.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => (index <= 0 ? visibleSuggestions.length - 1 : index - 1));
    } else if (event.key === "Enter" && activeIndex >= 0) {
      event.preventDefault();
      selectSuggestion(visibleSuggestions[activeIndex]);
    } else if (event.key === "Escape") {
      setSuggestions([]);
    }
  };

  return (
    <header className="site-header">
      <nav className="site-nav container" aria-label="Main navigation">
        <Link to="/" className="nav-brand" aria-label="Purple Star home">
          <span className="brand-mark"><FaStar aria-hidden="true" /></span>
          <span>Purple<span>Star</span></span>
        </Link>

        <div className="nav-search">
          <FaSearch className="search-icon" aria-hidden="true" />
          <input
            type="search"
            placeholder="Search something lovely..."
            aria-label="Search products"
            aria-expanded={visibleSuggestions.length > 0}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActiveIndex(-1);
            }}
            onKeyDown={handleKeyDown}
          />
          {searchError && query.trim() === searchErrorQuery && (
            <p className="search-message">Search is unavailable right now.</p>
          )}
          {visibleSuggestions.length > 0 && (
            <div className="search-suggestions" role="listbox">
              {visibleSuggestions.map((product, index) => (
                <button
                  type="button"
                  role="option"
                  aria-selected={index === activeIndex}
                  className={`search-suggestion${index === activeIndex ? " is-active" : ""}`}
                  key={product._id}
                  onClick={() => selectSuggestion(product)}
                >
                  <img src={product.image || "/banners/banner1.jpg"} alt="" />
                  <span>{product.title}</span>
                  <span className="suggestion-price">₹{Number(product.price).toLocaleString("en-IN")}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="nav-actions">
          <Link to="/products" className="nav-link">Shop</Link>
          <Link to="/cart" className="nav-link">Cart ({cartCount})</Link>
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            type="button"
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
          >
            {theme === "dark" ? "☀ Light" : "☾ Dark"}
          </button>
        </div>
      </nav>
    </header>
  );
}
