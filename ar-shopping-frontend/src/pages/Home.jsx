import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ChevronLeft, ChevronRight, Heart, ShoppingCart, Maximize2 } from 'lucide-react';

const Home = () => {
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/products');
        setTrendingProducts(data.slice(0, 3));
        setNewArrivals(data.slice(3, 6).length > 0 ? data.slice(3, 6) : data.slice(0, 3));
      } catch (error) {
        console.error("Error fetching products", error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="home-page-minimal">
      
      {/* Hero Section */}
      <section className="hero-section" style={{
        backgroundImage: 'url("https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=2070&auto=format&fit=crop")',
      }}>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>Build Your Own Style.</h1>
          <Link to="/shop" className="btn btn-hero">SHOP NOW</Link>
        </div>
      </section>

      {/* Services Banner */}
      <section className="services-banner container">
        <div className="service-item">
          <img src="https://cdn-icons-png.flaticon.com/512/2769/2769339.png" alt="Fast Delivery" className="service-icon" />
          <h4>Quick Delivery</h4>
          <p>Inside City delivery within 5 days</p>
        </div>
        <div className="service-item">
          <img src="https://cdn-icons-png.flaticon.com/512/1007/1007904.png" alt="Pick Up" className="service-icon" />
          <h4>Pick Up In Store</h4>
          <p>We have option of pick up in store.</p>
        </div>
        <div className="service-item">
          <img src="https://cdn-icons-png.flaticon.com/512/3063/3063822.png" alt="Packaging" className="service-icon" />
          <h4>Special Packaging</h4>
          <p>Our packaging is best for products.</p>
        </div>
      </section>

      {/* Category Grid (Masonry look) */}
      <section className="category-grid">
        <div className="cat-large" style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop")',
        }}>
          <div className="cat-content">
            <h2>Summer Outfits</h2>
          </div>
        </div>
        
        <div className="cat-right-col">
          <div className="cat-small" style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1000&auto=format&fit=crop")',
          }}>
            <div className="cat-content">
              <h2>Sweatshirts</h2>
            </div>
          </div>
          
          <div className="cat-small" style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?q=80&w=1000&auto=format&fit=crop")',
          }}>
            <div className="cat-content">
              <h2>Graphic T-Shirts</h2>
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="product-slider-section container">
        <div className="section-header">
          <h2>New Arrivals</h2>
          <p>These are the products that are new.</p>
        </div>
        
        <div className="slider-wrapper">
          <button className="slider-btn prev"><ChevronLeft /></button>
          
          <div className="product-grid-minimal">
            {newArrivals.map(product => (
              <div key={product.id} className="min-product-card">
                <div className="min-img-wrap">
                  <img src={product.image_url?.startsWith('http') ? product.image_url : `http://localhost:5000${product.image_url}`} alt={product.name} />
                  <div className="min-actions">
                    <button className="add-cart-btn">ADD TO CART</button>
                    <button className="icon-btn"><Heart size={16} /></button>
                    <button className="icon-btn"><Maximize2 size={16} /></button>
                  </div>
                </div>
                <div className="min-info">
                  <h3>{product.name}</h3>
                  <p>${product.price.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>

          <button className="slider-btn next"><ChevronRight /></button>
        </div>
        
        <div className="text-center mt-4">
          <Link to="/shop" className="btn btn-primary btn-dark">SHOP ALL</Link>
        </div>
      </section>

    </div>
  );
};

export default Home;
