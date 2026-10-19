
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { getProducts } from '../api/productApi';

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [collection, setCollection] = useState(
    searchParams.get('collection') || 'all'
  );
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState('default');
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    setLoading(true);

    getProducts({ search, collection, category }).then((p) => {
      setProducts(p);
      setLoading(false);
    });
  }, [search, collection, category]);

  useEffect(() => {
    const c = searchParams.get('collection');

    if (c && c !== collection) {
      setCollection(c);
    }
  }, [searchParams]);

  const collections = useMemo(
    () => ['all', ...new Set(products.map((p) => p.collection))],
    [products]
  );

  const categories = useMemo(
    () => ['all', ...new Set(products.map((p) => p.category))],
    [products]
  );

  const shown = useMemo(() => {
    let r = [...products];

    if (sort === 'price-asc') {
      r.sort((a, b) => a.price - b.price);
    }

    if (sort === 'price-desc') {
      r.sort((a, b) => b.price - a.price);
    }

    if (sort === 'name-asc') {
      r.sort((a, b) => a.name.localeCompare(b.name));
    }

    if (sort === 'featured') {
      r.sort((a, b) => Number(b.featured) - Number(a.featured));
    }

    return r;
  }, [products, sort]);

  const changeCollection = (v) => {
    setCollection(v);
    setSearchParams(v === 'all' ? {} : { collection: v });
  };

  return (
    <>
      <div className="page-hero">
        <span className="page-hero__eyebrow">Curated Jewellery</span>
        <h1>The Collection</h1>
        <p>
          Every piece handpicked for its beauty, craftsmanship and the
          stories it will hold.
        </p>
      </div>

      <div className="container">
        <div className="shop-layout">
          <aside
            className={`filters ${mobile ? 'mobile-open' : ''}`}
          >
            <div className="filters__title">Refine</div>

            <div className="filter-group">
              <div className="search-bar">
                <span className="search-bar__icon">⌕</span>

                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search pieces…"
                  aria-label="Search jewellery"
                />
              </div>
            </div>

            <div className="filter-group">
              <span className="filter-group__label">Collection</span>

              {collections.map((c) => (
                <label className="filter-option" key={c}>
                  <input
                    type="radio"
                    name="collection"
                    checked={collection === c}
                    onChange={() => changeCollection(c)}
                  />

                  <span>
                    {c === 'all' ? 'All Collections' : c}
                  </span>
                </label>
              ))}
            </div>

            <div className="filter-group">
              <span className="filter-group__label">Category</span>

              {categories.map((c) => (
                <label className="filter-option" key={c}>
                  <input
                    type="radio"
                    name="category"
                    checked={category === c}
                    onChange={() => setCategory(c)}
                  />

                  <span>
                    {c === 'all' ? 'All Categories' : c}
                  </span>
                </label>
              ))}
            </div>

            <button
              className="filters__reset"
              onClick={() => {
                setSearch('');
                setCategory('all');
                changeCollection('all');
                setSort('default');
              }}
            >
              Clear all filters
            </button>
          </aside>

          <main>
            <div className="shop-header">
              <button
                className="filters-toggle"
                onClick={() => setMobile(!mobile)}
              >
                {mobile ? '✕ Close Filters' : '⊟ Filters'}
              </button>

              <span className="shop-header__count">
                {shown.length} pieces
              </span>

              <div className="shop-header__sort">
                <label htmlFor="sortSelect">Sort</label>

                <select
                  id="sortSelect"
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                >
                  <option value="default">Default</option>
                  <option value="featured">Featured First</option>
                  <option value="price-asc">
                    Price: Low to High
                  </option>
                  <option value="price-desc">
                    Price: High to Low
                  </option>
                  <option value="name-asc">Name: A–Z</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="shop-empty">
                <p>Loading the collection…</p>
              </div>
            ) : (
              <div className="product-grid">
                {shown.length ? (
                  shown.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))
                ) : (
                  <div className="shop-empty">
                    <h3>No pieces found</h3>
                    <p>Try adjusting your search or filters.</p>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
}
