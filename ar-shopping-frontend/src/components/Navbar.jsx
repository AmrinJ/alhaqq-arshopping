import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Heart, ShoppingCart, User, LogOut, Shirt } from 'lucide-react';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import CartContext from '../context/CartContext';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const { getCartCount } = useContext(CartContext);

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="navbar black-navbar">
      <div className="container nav-content">
        
        {/* Left Links */}
        <div className="nav-links nav-links-left">
          <Link to="/" className={`nav-link ${isActive('/')}`}>HOME</Link>
          <Link to="/about" className={`nav-link ${isActive('/about')}`}>ABOUT</Link>
          <Link to="/shop" className={`nav-link ${isActive('/shop')}`}>SHOP ▾</Link>
        </div>

        {/* Center Brand */}
        <Link to="/" className="nav-brand-center">
          <Shirt size={28} color="white" strokeWidth={1.5} />
          <span>ALHAQQ</span>
        </Link>

        {/* Right Links */}
        <div className="nav-links nav-links-right">
          <Link to="/cart" className="nav-icon-link">
            <ShoppingCart size={16} /> ({getCartCount()})
          </Link>
          {user?.role === 'admin' && (
            <Link to="/admin" style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.05em', color: 'white', backgroundColor: 'var(--danger-color)', padding: '0.3rem 0.8rem', borderRadius: '4px', textDecoration: 'none' }}>
              ADMIN
            </Link>
          )}

          <Link to="/pro" className="nav-pro-link">
            GET PRO
          </Link>

          {user ? (
            <>
              <Link to="/profile" className="nav-icon-link" title="Profile">
                <User size={16} />
              </Link>
              <span className="nav-icon-link" onClick={() => { logout(); navigate('/'); }} title="Logout">
                <LogOut size={16} />
              </span>
            </>
          ) : (
            <Link to="/login" className="nav-icon-link" title="Login">
              <User size={16} />
            </Link>
          )}
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
