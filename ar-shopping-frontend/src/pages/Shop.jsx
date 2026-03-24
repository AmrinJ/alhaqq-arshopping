import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Search, Filter, SlidersHorizontal, ChevronRight } from 'lucide-react';
import ProductCard from '../components/ProductCard';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/products`);
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Derived filtered & sorted array
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()));
                          
    const matchesCategory = categoryFilter === 'All' ? true : 
      (product.category && product.category.toLowerCase() === categoryFilter.toLowerCase());
      
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    return new Date(b.created_at || Date.now()) - new Date(a.created_at || Date.now()); // default newest
  });

  return (
    <div className="container" style={{ padding: '4rem 0' }}>
      
      {/* Breadcrumb / Title area */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '4rem' }}>
        <h1 style={{ fontSize: '3.5rem', fontWeight: 300, margin: 0 }}>Shop</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '1rem' }}>
          <span>Home</span> <ChevronRight size={14} /> <span style={{ color: 'black' }}>Shop</span>
        </div>
      </div>
      
      <div className="shop-layout" style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '4rem', alignItems: 'start' }}>
        
        {/* Sidebar Filters - Minimalist */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '3rem', marginTop: '0' }}>
          
          {/* Categories */}
          <div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.5rem', borderBottom: '1px solid black', paddingBottom: '0.5rem' }}>CATEGORIES</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {['All', 'Boys T-Shirts', 'Girls T-Shirts', 'Unisex T-Shirts', 'Hoodies'].map(cat => (
                <li key={cat}>
                  <button 
                    onClick={() => setCategoryFilter(cat)}
                    style={{ 
                      background: 'none', border: 'none', padding: 0, 
                      color: categoryFilter === cat ? 'black' : 'var(--text-muted)',
                      fontWeight: categoryFilter === cat ? 600 : 400,
                      cursor: 'pointer', fontSize: '0.95rem',
                      display: 'flex', alignItems: 'center', gap: '0.5rem'
                    }}
                  >
                    {categoryFilter === cat && <span style={{ width: '4px', height: '4px', background: 'black', borderRadius: '50%' }}></span>}
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

        </aside>

        {/* Product Grid Area WITH BANNERS */}
        <div style={{ marginTop: '0', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          
          {/* Top Banners Area */}
          <div className="shop-banners-wrapper animate-fade-in-up">
              {/* Main Big Banner */}
              <Link to="/category/unisex" className="shop-main-banner" style={{ 
                  height: '400px', 
                  backgroundImage: 'url("https://images.unsplash.com/photo-1519742866993-66d3cfef4bbd?q=80&w=2070&auto=format&fit=crop")',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.5rem',
                  border: '1px solid var(--border-color)',
                  overflow: 'hidden',
                  textDecoration: 'none'
              }} onClick={() => setCategoryFilter('Unisex T-Shirts')}>
                  <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.35)', transition: 'background-color 0.4s ease' }} onMouseOver={(e) => e.target.style.backgroundColor='rgba(0,0,0,0.5)'} onMouseOut={(e) => e.target.style.backgroundColor='rgba(0,0,0,0.35)'}></div>
                  <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', color: 'white', pointerEvents: 'none' }}>
                      <h2 style={{ fontSize: '3.5rem', fontWeight: 300, marginBottom: '1.5rem', letterSpacing: '-0.02em', textTransform: 'uppercase' }}>T-SHIRTS</h2>
                      <button className="btn" style={{ backgroundColor: 'white', color: 'black', padding: '0.8rem 2.5rem', fontWeight: 600, border: 'none', pointerEvents: 'auto' }} onClick={(e) => { e.preventDefault(); setCategoryFilter('Unisex T-Shirts'); }}>SHOP NOW</button>
                  </div>
              </Link>

              {/* Three Small Banners */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                  <Link to="/category/boys" className="shop-small-banner" style={{
                      height: '250px',
                      backgroundImage: 'url("https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?q=80&w=800&auto=format&fit=crop")',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid var(--border-color)',
                      overflow: 'hidden',
                      textDecoration: 'none'
                  }} onClick={() => setCategoryFilter('Boys T-Shirts')}>
                      <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.25)', transition: 'background-color 0.4s ease' }} onMouseOver={(e) => e.target.style.backgroundColor='rgba(0,0,0,0.45)'} onMouseOut={(e) => e.target.style.backgroundColor='rgba(0,0,0,0.25)'}></div>
                      <h3 style={{ position: 'relative', zIndex: 1, color: 'white', fontWeight: 600, fontSize: '1.25rem', letterSpacing: '0.05em', textAlign: 'center', textTransform: 'uppercase', pointerEvents: 'none' }}>Boys<br/>T-Shirts</h3>
                  </Link>
                  <Link to="/category/hoodies" className="shop-small-banner" style={{
                      height: '250px',
                      backgroundImage: 'url("https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800&auto=format&fit=crop")', // Working hoodie image
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid var(--border-color)',
                      overflow: 'hidden',
                      textDecoration: 'none'
                  }} onClick={() => setCategoryFilter('Hoodies')}>
                      <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.25)', transition: 'background-color 0.4s ease' }} onMouseOver={(e) => e.target.style.backgroundColor='rgba(0,0,0,0.45)'} onMouseOut={(e) => e.target.style.backgroundColor='rgba(0,0,0,0.25)'}></div>
                      <h3 style={{ position: 'relative', zIndex: 1, color: 'white', fontWeight: 600, fontSize: '1.25rem', letterSpacing: '0.05em', textAlign: 'center', textTransform: 'uppercase', pointerEvents: 'none' }}>Hoodies</h3>
                  </Link>
                  <Link to="/category/girls" className="shop-small-banner" style={{
                      height: '250px',
                      backgroundImage: 'url("https://images.unsplash.com/photo-1503342394128-c104d54dba01?q=80&w=800&auto=format&fit=crop")', // Girl in black graphic tee
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid var(--border-color)',
                      overflow: 'hidden',
                      textDecoration: 'none'
                  }} onClick={() => setCategoryFilter('Girls T-Shirts')}>
                      <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.25)', transition: 'background-color 0.4s ease' }} onMouseOver={(e) => e.target.style.backgroundColor='rgba(0,0,0,0.45)'} onMouseOut={(e) => e.target.style.backgroundColor='rgba(0,0,0,0.25)'}></div>
                      <h3 style={{ position: 'relative', zIndex: 1, color: 'white', fontWeight: 600, fontSize: '1.25rem', letterSpacing: '0.05em', textAlign: 'center', textTransform: 'uppercase', pointerEvents: 'none' }}>Girls<br/>T-Shirts</h3>
                  </Link>
              </div>
          </div>

          {/* Toolbar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', paddingBottom: '0.75rem', borderBottom: '1px solid black', height: 'auto', minHeight: '30px' }}>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Showing {filteredProducts.length} results
            </p>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <label style={{ color: 'var(--text-muted)' }}>Sort by:</label>
              <select 
                style={{ border: 'none', outline: 'none', background: 'none', fontWeight: 600, cursor: 'pointer', textTransform: 'uppercase' }}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Newest Arrived</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem 0', fontFamily: 'Outfit', fontWeight: 300, fontSize: '1.2rem' }}>Loading collection...</div>
          ) : filteredProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 0', backgroundColor: '#f9f9f9', border: '1px solid #e5e5e5' }}>
               <h4 style={{ margin: '0 0 0.5rem 0', fontWeight: 300, fontSize: '1.5rem' }}>No products found</h4>
               <p style={{ color: 'var(--text-muted)', margin: 0 }}>Try adjusting your search or filters.</p>
               <button 
                 className="btn btn-secondary mt-4" 
                 onClick={() => { setSearchQuery(''); setCategoryFilter('All'); }}
                 style={{ padding: '0.75rem 2rem', fontSize: '0.8rem' }}
               >
                 CLEAR FILTERS
               </button>
            </div>
          ) : (
            <div className="product-grid" style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
              gap: '2.5rem 2rem' 
            }}>
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
