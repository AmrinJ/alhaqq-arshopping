import { Link } from 'react-router-dom';
import { Camera, Maximize2, Heart } from 'lucide-react';

const ProductCard = ({ product, variant }) => {
  const imageUrl = product.image_url?.startsWith('http') 
    ? product.image_url 
    : `http://localhost:5000${product.image_url}`;

  if (variant === 'boys') {
    return (
      <div className="boys-product-card">
        <div className="boys-img-wrap">
          <div className="boys-badge-fast">SELLING FAST</div>
          <button className="boys-card-heart"><Heart size={18} /></button>
          <img src={imageUrl || "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3"} alt={product.name} />
          <Link to={`/product/${product.id}`} className="boys-quick-shop" style={{ textDecoration: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            QUICK SHOP
          </Link>
        </div>
        <div className="boys-card-info">
          <div>
            <h3>{product.name}</h3>
            <div className="boys-card-price">₹{product.price}</div>
          </div>
          <div className="boys-color-swatch-container">
            <div className="boys-color-swatch"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-product-card">
      <div className="min-img-wrap">
        {product.ar_model_url && (
          <div className="ar-badge" style={{ position: 'absolute', top: 10, right: 10, zIndex: 5 }}>
            <Camera size={14} /> AR Ready
          </div>
        )}
        <img src={imageUrl || "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3"} alt={product.name} />
        <div className="min-actions">
          <Link to={`/product/${product.id}`} className="add-cart-btn" style={{textDecoration: 'none', color: 'black', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            VIEW DETAILS
          </Link>
          <button className="icon-btn"><Heart size={16} /></button>
          <button className="icon-btn"><Maximize2 size={16} /></button>
        </div>
      </div>
      <div className="min-info">
        <h3>{product.name}</h3>
        <p>${product.price.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default ProductCard;
