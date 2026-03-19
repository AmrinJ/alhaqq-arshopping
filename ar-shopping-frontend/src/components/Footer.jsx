import { Link } from 'react-router-dom';
import { ShoppingBag, Facebook, Twitter, Instagram, Youtube, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-content">
        <div className="footer-brand-col">
          <Link to="/" className="footer-brand mb-3">
            <ShoppingBag size={24} color="var(--primary-color)" />
            <span>ALHAQQ garments</span>
          </Link>
          <p className="footer-desc mb-4">
            Merging exceptionally crafted physical garments with state-of-the-art AR technology. See it, wear it, love it.
          </p>
          <div className="social-links d-flex gap-3">
            <a href="#" className="social-icon"><Facebook size={20} /></a>
            <a href="#" className="social-icon"><Twitter size={20} /></a>
            <a href="#" className="social-icon"><Instagram size={20} /></a>
            <a href="#" className="social-icon"><Youtube size={20} /></a>
          </div>
        </div>

        <div className="footer-links-col">
          <h4 className="footer-heading">Shop</h4>
          <ul className="footer-links-list">
            <li><Link to="/shop">All T-Shirts</Link></li>
            <li><Link to="/shop">Men's Collection</Link></li>
            <li><Link to="/shop">Women's Collection</Link></li>
            <li><Link to="/shop">New Arrivals</Link></li>
          </ul>
        </div>

        <div className="footer-links-col">
          <h4 className="footer-heading">Support</h4>
          <ul className="footer-links-list">
            <li><Link to="/contact">Contact Us</Link></li>
            <li><Link to="#">FAQ</Link></li>
            <li><Link to="#">Shipping & Returns</Link></li>
            <li><Link to="#">Size Guide</Link></li>
          </ul>
        </div>

        <div className="footer-newsletter-col">
          <h4 className="footer-heading">Stay in the loop</h4>
          <p className="footer-desc mb-3">Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.</p>
          <form className="newsletter-form" onSubmit={(e) => { e.preventDefault(); alert("Thanks for subscribing!"); }}>
            <div className="input-with-icon">
              <Mail size={18} className="input-icon" />
              <input type="email" placeholder="Enter your email" required className="form-control" />
            </div>
            <button type="submit" className="btn btn-primary mt-2" style={{ width: '100%' }}>Subscribe</button>
          </form>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="container d-flex justify-between align-center flex-wrap gap-3">
          <p className="mb-0">&copy; {new Date().getFullYear()} ALHAQQ garments. All rights reserved.</p>
          <div className="footer-legal-links d-flex gap-4">
            <Link to="#">Privacy Policy</Link>
            <Link to="#">Terms of Service</Link>
            <Link to="#">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
