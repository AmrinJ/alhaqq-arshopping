import { useState, useEffect } from 'react';
import axios from 'axios';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

const UnisexTShirts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('newest');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/products`);
        // Filter specifically for Unisex T-Shirts
        const filtered = data.filter(p => p.category && p.category.toLowerCase() === 'unisex t-shirts');
        setProducts(filtered);
      } catch (error) {
        console.error("Error fetching products", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Filter and Sort array
  const sortedProducts = [...products]
    .filter(p => {
      // Apply price filter
      if (minPrice && p.price < Number(minPrice)) return false;
      if (maxPrice && p.price > Number(maxPrice)) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      return new Date(b.created_at || Date.now()) - new Date(a.created_at || Date.now()); // default newest
    });

  return (
    <>
      {/* Full Width Hero Banner */}
      <div className="boys-hero animate-fade-in-up" style={{ 
        backgroundImage: 'url("https://images.unsplash.com/photo-1519742866993-66d3cfef4bbd?q=80&w=2070&auto=format&fit=crop")',
        marginBottom: '2rem'
      }}>
        {/* Optional overlay if needed for text readability */}
        <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.1)' }}></div>
        <div style={{ position: 'relative', zIndex: 1, padding: '4rem 10%', color: 'white' }}>
          <h1 style={{ fontSize: '4.5rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em', textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
            <span style={{color: '#e11d48'}}>UNISEX</span> COLLECTION
          </h1>
          <p style={{ fontSize: '1.2rem', fontWeight: 500, marginTop: '0.5rem', textShadow: '0 1px 5px rgba(0,0,0,0.3)' }}>Versatile and stylish for everyone</p>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: '5rem' }}>
        
        {/* Breadcrumb area */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          <Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Home</Link> <ChevronRight size={14} /> 
          <span style={{ color: 'black', fontWeight: 500 }}>Unisex T-Shirts</span>
        </div>
        
        <div className="boys-layout-grid">
          
          {/* Sidebar Filters */}
          <aside className="filter-sidebar">
            <h3>Product Filters</h3>
            
            <div className="filter-accordion">
              <div className="filter-accordion-header">
                <span>Price</span>
                <span>—</span>
              </div>
              <div>
                 <div className="filter-price-inputs">
                   <div className="filter-input-pack">
                     <label>From</label>
                     <input 
                        type="number" 
                        placeholder="₹ 0" 
                        value={minPrice} 
                        onChange={(e) => setMinPrice(e.target.value)}
                     />
                   </div>
                   <div className="filter-input-pack">
                     <label>To</label>
                     <input 
                        type="number" 
                        placeholder="₹ Max" 
                        value={maxPrice} 
                        onChange={(e) => setMaxPrice(e.target.value)}
                     />
                   </div>
                 </div>
                 <div className="filter-slider-track"></div>
              </div>
            </div>

            <div className="filter-accordion">
              <div className="filter-accordion-header">
                <span>Color</span>
                <span>+</span>
              </div>
            </div>
            
            <div className="filter-accordion">
              <div className="filter-accordion-header">
                <span>Gender</span>
                <span>+</span>
              </div>
            </div>

            <div className="filter-accordion">
              <div className="filter-accordion-header">
                <span>Product Type</span>
                <span>+</span>
              </div>
            </div>

            <div className="filter-accordion">
              <div className="filter-accordion-header">
                <span>Size</span>
                <span>+</span>
              </div>
            </div>

            <div className="filter-accordion" style={{ borderBottom: 'none' }}>
              <div className="filter-accordion-header">
                <span>Fabric Type</span>
                <span>+</span>
              </div>
            </div>

          </aside>

          {/* Product Grid Area */}
          <div>
            
            {/* Toolbar */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '2rem', paddingBottom: '0.75rem', height: 'auto', minHeight: '30px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', border: '1px solid #e5e5e5', padding: '0.5rem 1rem' }}>
                <select 
                  style={{ border: 'none', outline: 'none', background: 'none', fontSize: '0.85rem', cursor: 'pointer' }}
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="newest">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '0.2rem', marginLeft: '1rem' }}>
                 {/* Grid View Toggles (Mock) */}
                 <div style={{ width: '24px', height: '24px', backgroundColor: 'black' }}></div>
                 <div style={{ width: '24px', height: '24px', backgroundColor: '#e5e5e5' }}></div>
              </div>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '4rem 0', fontFamily: 'Outfit', fontWeight: 300, fontSize: '1.2rem' }}>Loading collection...</div>
            ) : sortedProducts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem 0', backgroundColor: '#f9f9f9', border: '1px solid #e5e5e5' }}>
                 <h4 style={{ margin: '0 0 0.5rem 0', fontWeight: 300, fontSize: '1.5rem' }}>No products found</h4>
                 <p style={{ color: 'var(--text-muted)', margin: 0 }}>This collection is currently empty.</p>
                 <Link 
                   to="/shop"
                   className="btn btn-secondary mt-4" 
                   style={{ padding: '0.75rem 2rem', fontSize: '0.8rem', display: 'inline-block', textDecoration: 'none' }}
                 >
                   BACK TO SHOP
                 </Link>
              </div>
            ) : (
              <div className="product-grid" style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(3, 1fr)', 
                gap: '2.5rem 1rem' 
              }}>
                {sortedProducts.map(product => (
                  <ProductCard key={product.id} product={product} variant="boys" />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default UnisexTShirts;
