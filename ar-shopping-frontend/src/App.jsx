import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import About from './pages/About';
import Contact from './pages/Contact';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import Profile from './pages/Profile';
import UnisexTShirts from './pages/UnisexTShirts';
import BoysTShirts from './pages/BoysTShirts';
import GirlsTShirts from './pages/GirlsTShirts';
import Hoodies from './pages/Hoodies';
import Pro from './pages/Pro';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

const AppContent = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <>
      <Navbar />
      <main className={isHome ? "" : "container"}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/category/unisex" element={<UnisexTShirts />} />
          <Route path="/category/boys" element={<BoysTShirts />} />
          <Route path="/category/girls" element={<GirlsTShirts />} />
          <Route path="/category/hoodies" element={<Hoodies />} />
          <Route path="/pro" element={<Pro />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <AppContent />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
