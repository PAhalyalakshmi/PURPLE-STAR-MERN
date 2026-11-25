export default function ProductFilters({ allProducts, filters, setFilters }) {
  const categories = [...new Set(allProducts.map((product) => product.category).filter(Boolean))];

  const updateFilter = (key, value) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ search: "", category: "", price: "", rating: "", sort: "" });
  };

  return (
    <aside className="filter-panel" aria-label="Product filters">
      <div className="filter-heading">
        <div>
          <span className="eyebrow">REFINE YOUR SEARCH</span>
          <h2>Filters</h2>
        </div>
        <button className="text-button" type="button" onClick={clearFilters}>
          Clear
        </button>
      </div>

      <label className="filter-field">
        <span>Search</span>
        <input
          type="search"
          placeholder="Try “headphones”"
          value={filters.search}
          onChange={(event) => updateFilter("search", event.target.value)}
        />
      </label>

      <label className="filter-field">
        <span>Category</span>
        <select
          value={filters.category}
          onChange={(event) => updateFilter("category", event.target.value)}
        >
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </label>

      <label className="filter-field">
        <span>Price range</span>
        <select
          value={filters.price}
          onChange={(event) => updateFilter("price", event.target.value)}
        >
          <option value="">Any price</option>
          <option value="0-500">Under ₹500</option>
          <option value="500-1000">₹500–₹1,000</option>
          <option value="1000-5000">₹1,000–₹5,000</option>
          <option value="5000+">₹5,000 and above</option>
        </select>
      </label>

      <label className="filter-field">
        <span>Customer rating</span>
        <select
          value={filters.rating}
          onChange={(event) => updateFilter("rating", event.target.value)}
        >
          <option value="">Any rating</option>
          <option value="4">4 stars and up</option>
          <option value="3">3 stars and up</option>
          <option value="2">2 stars and up</option>
          <option value="1">1 star and up</option>
        </select>
      </label>

      <label className="filter-field">
        <span>Sort by</span>
        <select
          value={filters.sort}
          onChange={(event) => updateFilter("sort", event.target.value)}
        >
          <option value="">Recommended</option>
          <option value="low-high">Price: low to high</option>
          <option value="high-low">Price: high to low</option>
          <option value="newest">Newest arrivals</option>
        </select>
      </label>
    </aside>
  );
}
