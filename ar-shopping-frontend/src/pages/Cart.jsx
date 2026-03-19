import { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Trash2, ArrowRight, CreditCard, Banknote, CheckCircle, Package, Truck, ShieldCheck, MapPin } from 'lucide-react';
import axios from 'axios';
import CartContext from '../context/CartContext';
import AuthContext from '../context/AuthContext';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const [profileData, setProfileData] = useState(null);
  
  // Checkout States
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    if (user && showCheckout && !profileData) {
       // Fetch user profile to prefill address during checkout
       const fetchProfile = async () => {
         try {
           const config = { headers: { Authorization: `Bearer ${user.token}` } };
           const { data } = await axios.get('http://localhost:5000/api/users/profile', config);
           setProfileData(data);
         } catch(e) { console.error('Error fetching profile', e); }
       };
       fetchProfile();
    }
  }, [user, showCheckout, profileData]);

  const calculateFinalTotal = () => {
    const baseTotal = getCartTotal();
    return paymentMethod === 'cod' ? baseTotal + 10 : baseTotal;
  };

  const processCartCheckout = async () => {
    if (!paymentMethod) return;
    setProcessingPayment(true);

    try {
      const finalPrice = calculateFinalTotal();
      
      const orderPayload = {
        totalPrice: finalPrice,
        orderItems: cartItems.map(item => ({
           product_id: item.id,
           quantity: item.quantity,
           size: item.selectedSize,
           color: null,
           price: item.price
        }))
      };

      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.post('http://localhost:5000/api/orders', orderPayload, config);

      setTimeout(() => {
        setProcessingPayment(false);
        setPaymentSuccess(true);
        setOrderId(`ORD-${data.id}`);
        // Clear all items successfully checked out from cart context
        cartItems.forEach(item => removeFromCart(item.id));
      }, 1500);

    } catch (err) {
       setProcessingPayment(false);
       console.error('Checkout failed', err);
       alert('Order processing failed. Please try again.');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-empty-state animate-fade-in-up">
        <ShoppingCart size={80} style={{ color: 'var(--border-color)', margin: '0 auto 1.5rem auto' }} />
        <h1 className="mb-3" style={{ fontSize: '2.5rem', fontWeight: 300 }}>Your Cart is Empty</h1>
        <p className="mb-5" style={{ color: 'var(--text-muted)' }}>Looks like you haven't added any items to your cart yet.</p>
        <Link to="/shop" className="btn btn-primary" style={{ padding: '1rem 3rem' }}>Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="cart-container animate-fade-in-up">
      <h1 className="mb-4" style={{ fontSize: '3rem', fontWeight: 300, letterSpacing: '-0.02em' }}>Your Cart</h1>
      
      <div className="cart-layout">
        {/* Cart Items List */}
        <div>
          {cartItems.map(item => (
            <div key={`${item.id}-${item.selectedSize}`} className="cart-item-card">
              <img src={`http://localhost:5000${item.image_url}`} alt={item.name} className="cart-item-img" />
              
              <div className="cart-item-details">
                <Link to={`/product/${item.id}`} className="cart-item-title">{item.name}</Link>
                <p className="cart-item-meta">Size: {item.selectedSize}</p>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                   <div className="cart-qty-controls">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="cart-qty-btn">-</button>
                      <span className="cart-qty-display">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="cart-qty-btn">+</button>
                   </div>
                   <button onClick={() => removeFromCart(item.id)} className="cart-item-remove">
                     <Trash2 size={16} /> Remove
                   </button>
                </div>
              </div>

              <div className="cart-item-price-col">
                 <p className="cart-item-price">₹{(item.price * item.quantity).toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="cart-summary-card">
           <h3 className="mb-4" style={{ fontSize: '1.5rem', fontWeight: 300 }}>Order Summary</h3>
           <div className="summary-row">
             <span>Subtotal</span>
             <span>₹{getCartTotal().toFixed(2)}</span>
           </div>
           <div className="summary-row">
             <span>Estimated Tax</span>
             <span>₹0.00</span>
           </div>
           <hr className="summary-divider" />
           <div className="summary-total">
             <span>Total</span>
             <span>₹{getCartTotal().toFixed(2)}</span>
           </div>
           <button 
             className="btn btn-primary btn-block" 
             style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
             onClick={() => {
                if (!user) navigate('/login');
                else setShowCheckout(true);
             }}
           >
             Proceed to Checkout <ArrowRight size={18} />
           </button>
        </div>
      </div>

      {/* Checkout Modal Overlay */}
      {showCheckout && (
        <div className="checkout-overlay">
          <div className="checkout-modal animate-fade-in-up">
            
            {!paymentSuccess ? (
              <div className="checkout-grid">
                
                {/* Left Side: Address & Payment Selection */}
                <div>
                  <h2 style={{ fontSize: '2.5rem', fontWeight: 300, marginBottom: '2rem' }}>Secure Checkout</h2>
                  
                  {/* Shipping Address Preview */}
                  <div className="checkout-address-card">
                    <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontSize: '1.1rem', fontWeight: 600 }}>
                      <MapPin size={20} /> Shipping Address
                    </h4>
                    {profileData && (profileData.street || profileData.city) ? (
                       <div>
                         <p style={{ margin: '0 0 0.25rem 0', fontWeight: 600, fontSize: '1.1rem' }}>{profileData.name}</p>
                         <p style={{ margin: '0 0 0.25rem 0', color: 'var(--text-muted)' }}>{profileData.street}</p>
                         <p style={{ margin: 0, color: 'var(--text-muted)' }}>{profileData.city}, {profileData.state} {profileData.zip}</p>
                       </div>
                    ) : (
                       <div>
                         <p style={{ color: 'var(--danger-color)', margin: '0 0 1rem 0' }}>Profile shipping details missing.</p>
                         <button className="btn btn-secondary" onClick={() => navigate('/profile')} style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>Update Profile Settings</button>
                       </div>
                    )}
                  </div>

                  <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: 500 }}>Select Payment Method</h3>
                  
                  <div style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
                    <label className={`payment-option ${paymentMethod === 'card' ? 'active' : ''}`}>
                      <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="payment-radio" />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 600, fontSize: '1.1rem' }}>
                           <CreditCard size={20} color={paymentMethod === 'card' ? 'var(--primary-color)' : 'var(--text-main)'} /> Credit / Debit Card
                        </div>
                        <p style={{ margin: '0.25rem 0 0 2rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Secure encrypted transaction</p>
                      </div>
                    </label>

                    <label className={`payment-option ${paymentMethod === 'cod' ? 'active' : ''}`}>
                      <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="payment-radio" />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 600, fontSize: '1.1rem' }}>
                           <Banknote size={20} color={paymentMethod === 'cod' ? 'var(--primary-color)' : 'var(--text-main)'} /> Cash on Delivery
                        </div>
                        <p style={{ margin: '0.25rem 0 0 2rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Pay (+₹10 fee) when you receive</p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Right Side: Final Summary */}
                <div className="checkout-summary-pane">
                   <h3 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 300 }}>Order Summary</h3>
                   
                   <div className="summary-row">
                     <span>Items ({cartItems.length})</span>
                     <span>₹{getCartTotal().toFixed(2)}</span>
                   </div>
                   
                   {paymentMethod === 'cod' && (
                     <div className="summary-row">
                       <span>COD Handling Fee</span>
                       <span>₹10.00</span>
                     </div>
                   )}
                   
                   <div className="summary-row">
                     <span>Estimated Tax</span>
                     <span>₹0.00</span>
                   </div>
                   
                   <hr className="summary-divider" />
                   
                   <div className="summary-total">
                     <span>Total</span>
                     <span style={{ color: 'var(--primary-color)' }}>₹{paymentMethod ? calculateFinalTotal().toFixed(2) : getCartTotal().toFixed(2)}</span>
                   </div>

                   <div style={{ display: 'flex', gap: '1rem', marginTop: 'auto' }}>
                     <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowCheckout(false)} disabled={processingPayment}>Cancel</button>
                     <button 
                       className="btn btn-primary" 
                       style={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }} 
                       onClick={processCartCheckout}
                       disabled={processingPayment || !paymentMethod || (!profileData?.street && !profileData?.city)}
                     >
                       {processingPayment ? (
                         <>Processing...</>
                       ) : (
                         <><ShieldCheck size={18} /> Confirm Payment</>
                       )}
                     </button>
                   </div>
                </div>
              </div>
            ) : (
              // Success Screen
              <div className="success-screen">
                <div className="animate-fade-in-up">
                  <CheckCircle size={80} color="var(--success-color)" style={{ margin: '0 auto 1.5rem auto' }} />
                  <h2 style={{ fontSize: '3rem', fontWeight: 300, marginBottom: '1rem' }}>Payment Successful!</h2>
                  <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Thank you for your purchase.</p>
                  <p className="order-id-badge">
                    Order ID: {orderId}
                  </p>
                  
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem' }}>
                    <button className="btn btn-secondary" onClick={() => navigate('/shop')}>Continue Shopping</button>
                    <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={() => navigate('/profile')}>
                       <Truck size={18} /> Track Your Order
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
