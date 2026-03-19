import { useState, useEffect, useContext, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Camera, ShoppingCart, Info, Activity, Tag, CreditCard, CheckCircle, Smartphone, Banknote, Download } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import AuthContext from '../context/AuthContext';
import CartContext from '../context/CartContext';
import WebARViewer from '../components/WebARViewer';
import Invoice from '../components/Invoice';
import { generatePDFFromElement } from '../utils/pdfGenerator';

const ProductDetails = () => {
  const invoiceRef = useRef(null);
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [arMode, setArMode] = useState(false);
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(''); // '', 'card', 'upi', 'cod'
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvv: '', name: '' });
  const [orderId, setOrderId] = useState('');
  const { user } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(data);
        if (data.sizes && data.sizes.length > 0) setSelectedSize(data.sizes[0]);
      } catch (error) {
        console.error("Error fetching product", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div style={{ textAlign: 'center', padding: '4rem 0' }}>Loading...</div>;
  if (!product) return <div style={{ textAlign: 'center', padding: '4rem 0' }}>Product not found.</div>;

  const imageUrl = product.image_url?.startsWith('http') 
    ? product.image_url 
    : `http://localhost:5000${product.image_url}`;

  const handleBuyNow = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setPaymentMethod('');
    setPaymentSuccess(false);
    setProcessingPayment(false);
    setCardDetails({ number: '', expiry: '', cvv: '', name: '' });
    setShowPaymentModal(true);
  };

  const calculateTotal = () => {
    return paymentMethod === 'cod' ? product.price + 10 : product.price;
  };

  const processSimulatedPayment = async () => {
    if (!paymentMethod) return;
    
    // Simulate simple client-side required field check for Card
    if (paymentMethod === 'card') {
      if (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvv || !cardDetails.name) {
        alert("Please fill out all Credit/Debit Card details.");
        return;
      }
    }

    setProcessingPayment(true);
    
    try {
      const finalPrice = calculateTotal();
      
      const orderPayload = {
        totalPrice: finalPrice,
        orderItems: [{
           product_id: product.id,
           quantity: 1,
           size: selectedSize,
           color: null,
           price: finalPrice
        }]
      };

      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.post('http://localhost:5000/api/orders', orderPayload, config);

      // Simulate network delay for UX
      setTimeout(() => {
        setProcessingPayment(false);
        setPaymentSuccess(true);
        setOrderId(`ORD-${data.id}`); // Use the real database ID
      }, 1500);

    } catch (err) {
      setProcessingPayment(false);
      console.error('Checkout failed', err);
      alert('Order processing failed. Please try again.');
    }
  };

  const generatePDF = async () => {
    if (!invoiceRef.current) return;
    try {
      await generatePDFFromElement(invoiceRef, `ALHAQQ_Invoice_${orderId}.pdf`);
    } catch (e) {
      console.error(e);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  const invoiceData = paymentSuccess ? {
    orderId: orderId,
    customerName: user?.user_name || cardDetails.name || 'Valued Customer',
    items: [{ name: product.name, size: selectedSize, quantity: 1, price: product.price }],
    subtotal: product.price,
    shipping: paymentMethod === 'cod' ? 10 : 0,
    total: calculateTotal(),
    paymentMethod: paymentMethod
  } : null;

  return (
    <div style={{ padding: '2rem 5%', maxWidth: '1400px', margin: '0 auto', position: 'relative' }}>
      <Link to="/shop" style={{ color: 'var(--text-muted)', marginBottom: '2rem', display: 'inline-block' }}>&larr; Back to Shop</Link>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '4rem', alignItems: 'start' }}>
        <div style={{ borderRadius: '0', overflow: 'hidden', position: 'relative', border: '1px solid black', backgroundColor: 'var(--surface-color)', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem' }}>
          {arMode && (
            <WebARViewer 
              imageUrl={product.ar_model_url ? `http://localhost:5000${product.ar_model_url}` : imageUrl} 
              onClose={() => setArMode(false)} 
            />
          )}
          <img src={imageUrl} alt={product.name} style={{ width: '100%', maxHeight: '700px', objectFit: 'contain', backgroundColor: 'transparent' }} />
        </div>
        
        <div>
          <h1 className="mb-2" style={{ fontSize: '3rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '-0.02em', lineHeight: 1.1 }}>{product.name}</h1>
          <p className="product-price mb-4" style={{ fontSize: '2rem', fontWeight: 300, color: 'black' }}>₹{product.price.toFixed(2)}</p>
          <p className="mb-5" style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: 1.6 }}>{product.description}</p>
          
          <div className="mb-4">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h4 style={{ margin: 0, textTransform: 'uppercase', fontSize: '0.9rem', letterSpacing: '0.05em' }}>Size</h4>
              <button 
                onClick={() => setShowSizeChart(true)} 
                style={{ background: 'none', border: 'none', color: 'black', cursor: 'pointer', fontSize: '0.85rem', textDecoration: 'underline', textTransform: 'uppercase', letterSpacing: '0.05em' }}
              >
                Size Guide
              </button>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {(product.sizes && product.sizes.length > 0 ? product.sizes : ['S', 'M', 'L', 'XL']).map(size => (
                <button 
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  style={{
                    width: '50px', height: '50px', 
                    borderRadius: '0',
                    border: `1px solid ${selectedSize === size ? 'black' : 'var(--border-color)'}`,
                    backgroundColor: selectedSize === size ? 'black' : 'var(--surface-color)',
                    color: selectedSize === size ? 'white' : 'black',
                    fontWeight: selectedSize === size ? 600 : 400,
                    fontSize: '1rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
          
          <div style={{ padding: '1.5rem', backgroundColor: '#fafafa', borderRadius: '0', border: '1px solid var(--border-color)', marginBottom: '2rem' }}>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'black', textTransform: 'uppercase', fontSize: '0.9rem', letterSpacing: '0.05em' }}>
              <Tag size={16} /> Available Offers
            </h4>
            <ul style={{ fontSize: '0.9rem', color: 'var(--text-muted)', paddingLeft: '1.5rem', margin: 0, lineHeight: 1.6 }}>
              <li style={{ marginBottom: '0.5rem' }}><strong>Bank Offer:</strong> Get 10% instant discount on HDFC Bank Credit Cards.</li>
              <li style={{ marginBottom: '0.5rem' }}><strong>Combo Offer:</strong> Buy 2 get 1 free on all men's T-shirts.</li>
              <li><strong>Free Delivery:</strong> Free shipping on orders above ₹999.</li>
            </ul>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1rem' }}>
            {user ? (
               <button className="btn" style={{ width: '100%', backgroundColor: 'transparent', color: 'black', border: '1px solid black', padding: '1rem', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }} onClick={() => {
                 addToCart({ ...product, selectedSize });
                 alert('Added to cart!');
               }}>
                 Add to Cart
               </button>
            ) : (
               <button className="btn" style={{ width: '100%', backgroundColor: 'transparent', color: 'var(--text-muted)', border: '1px solid var(--border-color)', padding: '1rem', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }} onClick={() => navigate('/login')}>
                 Login to Buy
               </button>
            )}
            
            <button className="btn" style={{ width: '100%', backgroundColor: 'black', color: 'white', border: '1px solid black', padding: '1rem', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }} onClick={handleBuyNow}>
              Buy Now
            </button>
          </div>
          
          <button className="btn" style={{ width: '100%', marginBottom: '2rem', backgroundColor: '#f3f4f6', color: 'black', border: 'none', padding: '1rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }} onClick={() => setArMode(!arMode)}>
            <Camera size={18} /> Try it On in AR
          </button>
          
          <div style={{ padding: '1rem', backgroundColor: 'var(--surface-color)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Info size={18} /> Product Details
            </h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}><strong>Fabric:</strong> Premium 100% Breathable Cotton</p>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}><strong>Fit:</strong> Regular Fit - accurate to standard sizing.</p>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}><strong>Care Instruction:</strong> Machine wash cold. Do not bleach.</p>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}><strong>Stock:</strong> {product.stock > 0 ? `${product.stock} Units In Stock` : 'Out of Stock'}</p>
          </div>
        </div>
      </div>

      {/* Size Chart Modal */}
      {showSizeChart && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }} onClick={() => setShowSizeChart(false)}>
          <div style={{ backgroundColor: 'var(--surface-color)', padding: '2rem', borderRadius: 'var(--radius-lg)', maxWidth: '500px', width: '90%', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border-color)' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0 }}>T-Shirt Size Guide</h3>
              <button 
                onClick={() => setShowSizeChart(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.5rem', cursor: 'pointer', lineHeight: 1 }}
              >&times;</button>
            </div>
            
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Measurements are in inches. Please allow ±0.5" tolerance.</p>
            
            <div style={{ overflowX: 'auto' }}>
              <table className="table" style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                    <th style={{ padding: '0.75rem' }}>Size</th>
                    <th style={{ padding: '0.75rem' }}>Chest</th>
                    <th style={{ padding: '0.75rem' }}>Length</th>
                    <th style={{ padding: '0.75rem' }}>Sleeve</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '0.75rem', fontWeight: 'bold' }}>S</td>
                    <td style={{ padding: '0.75rem' }}>38"</td>
                    <td style={{ padding: '0.75rem' }}>27"</td>
                    <td style={{ padding: '0.75rem' }}>8"</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '0.75rem', fontWeight: 'bold' }}>M</td>
                    <td style={{ padding: '0.75rem' }}>40"</td>
                    <td style={{ padding: '0.75rem' }}>28"</td>
                    <td style={{ padding: '0.75rem' }}>8.5"</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '0.75rem', fontWeight: 'bold' }}>L</td>
                    <td style={{ padding: '0.75rem' }}>42"</td>
                    <td style={{ padding: '0.75rem' }}>29"</td>
                    <td style={{ padding: '0.75rem' }}>9"</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '0.75rem', fontWeight: 'bold' }}>XL</td>
                    <td style={{ padding: '0.75rem' }}>44"</td>
                    <td style={{ padding: '0.75rem' }}>30"</td>
                    <td style={{ padding: '0.75rem' }}>9.5"</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '0.75rem', fontWeight: 'bold' }}>XXL</td>
                    <td style={{ padding: '0.75rem' }}>46"</td>
                    <td style={{ padding: '0.75rem' }}>31"</td>
                    <td style={{ padding: '0.75rem' }}>10"</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <button 
              className="btn btn-primary" 
              style={{ width: '100%', marginTop: '1.5rem' }}
              onClick={() => setShowSizeChart(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Enhanced Checkout Modal */}
      {showPaymentModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }} onClick={() => !processingPayment && !paymentSuccess && setShowPaymentModal(false)}>
          <div style={{ backgroundColor: 'White', padding: '2rem', borderRadius: '0', maxWidth: '450px', width: '90%', maxHeight: '90vh', overflowY: 'auto', border: '1px solid black', position: 'relative' }} onClick={e => e.stopPropagation()}>
            {(!processingPayment && !paymentSuccess) && (
              <button 
                onClick={() => setShowPaymentModal(false)}
                style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: 'black', fontSize: '1.5rem', cursor: 'pointer', lineHeight: 1 }}
              >&times;</button>
            )}

            {!paymentSuccess ? (
              !processingPayment ? (
                // Step 1: Select Payment Method
                <>
                  <h4 className="mb-4" style={{ textAlign: 'center', marginTop: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>CHECKOUT</h4>
                  <div style={{ marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                    <p style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Item:</span>
                      <strong style={{ fontWeight: 600 }}>{product.name} ({selectedSize})</strong>
                    </p>
                    <p style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0', fontSize: '1.2rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Total:</span>
                      <strong style={{ color: 'black', fontWeight: 800 }}>₹{calculateTotal().toFixed(2)}</strong>
                    </p>
                    {paymentMethod === 'cod' && (
                      <p style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.25rem', fontSize: '0.8rem', color: '#f59e0b' }}>
                        <span>Includes COD Extra Charge:</span>
                        <span>₹10.00</span>
                      </p>
                    )}
                  </div>

                  <h5 className="mb-3" style={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.9rem' }}>Payment Method</h5>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '2rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', borderRadius: '0', border: `1px solid ${paymentMethod === 'upi' ? 'black' : 'var(--border-color)'}`, backgroundColor: paymentMethod === 'upi' ? '#f9f9f9' : 'transparent', cursor: 'pointer', transition: 'all 0.2s ease' }}>
                      <input type="radio" name="paymentMethod" value="upi" checked={paymentMethod === 'upi'} onChange={() => setPaymentMethod('upi')} style={{ width: '16px', height: '16px', accentColor: 'black' }} />
                      <Smartphone size={20} style={{ color: paymentMethod === 'upi' ? 'black' : 'var(--text-muted)' }} />
                      <div style={{ flex: 1 }}>
                        <strong style={{ display: 'block', fontSize: '0.95rem', fontWeight: paymentMethod === 'upi' ? 700 : 500 }}>UPI App</strong>
                      </div>
                    </label>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', borderRadius: '0', border: `1px solid ${paymentMethod === 'card' ? 'black' : 'var(--border-color)'}`, backgroundColor: paymentMethod === 'card' ? '#f9f9f9' : 'transparent', cursor: 'pointer', transition: 'all 0.2s ease' }}>
                        <input type="radio" name="paymentMethod" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} style={{ width: '16px', height: '16px', accentColor: 'black' }} />
                        <CreditCard size={20} style={{ color: paymentMethod === 'card' ? 'black' : 'var(--text-muted)' }} />
                        <div style={{ flex: 1 }}>
                          <strong style={{ display: 'block', fontSize: '0.95rem', fontWeight: paymentMethod === 'card' ? 700 : 500 }}>Credit/Debit Card</strong>
                        </div>
                      </label>
                      
                      {/* Expanded Card Details Form */}
                      {paymentMethod === 'card' && (
                        <div style={{ padding: '1rem', backgroundColor: '#f9f9f9', border: '1px solid var(--border-color)', borderRadius: '0', display: 'grid', gap: '0.75rem' }}>
                           <input type="text" placeholder="Card Number" maxLength="19" className="form-control" style={{ width: '100%', padding: '0.75rem', fontSize: '0.9rem', borderRadius: '0', border: '1px solid var(--border-color)' }} value={cardDetails.number} onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})} />
                           <div style={{ display: 'flex', gap: '0.75rem' }}>
                             <input type="text" placeholder="MM/YY" maxLength="5" className="form-control" style={{ flex: 1, padding: '0.75rem', fontSize: '0.9rem', borderRadius: '0', border: '1px solid var(--border-color)' }} value={cardDetails.expiry} onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})} />
                             <input type="password" placeholder="CVV" maxLength="3" className="form-control" style={{ flex: 1, padding: '0.75rem', fontSize: '0.9rem', borderRadius: '0', border: '1px solid var(--border-color)' }} value={cardDetails.cvv} onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})} />
                           </div>
                           <input type="text" placeholder="Name on Card" className="form-control" style={{ width: '100%', padding: '0.75rem', fontSize: '0.9rem', borderRadius: '0', border: '1px solid var(--border-color)' }} value={cardDetails.name} onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})} />
                        </div>
                      )}
                    </div>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', borderRadius: '0', border: `1px solid ${paymentMethod === 'cod' ? 'black' : 'var(--border-color)'}`, backgroundColor: paymentMethod === 'cod' ? '#f9f9f9' : 'transparent', cursor: 'pointer', transition: 'all 0.2s ease' }}>
                      <input type="radio" name="paymentMethod" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} style={{ width: '16px', height: '16px', accentColor: 'black' }} />
                      <Banknote size={20} style={{ color: paymentMethod === 'cod' ? 'black' : 'var(--text-muted)' }} />
                      <div style={{ flex: 1 }}>
                        <strong style={{ display: 'block', fontSize: '0.95rem', fontWeight: paymentMethod === 'cod' ? 700 : 500 }}>Cash on Delivery</strong>
                      </div>
                    </label>
                  </div>

                  {/* Dynamic QR Code for UPI */}
                  {paymentMethod === 'upi' && (
                    <div style={{ textAlign: 'center', marginBottom: '1.5rem', padding: '1rem', backgroundColor: 'white', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                      <p style={{ color: '#333', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem' }}>Scan with any UPI App</p>
                      <QRCodeSVG 
                        value={`upi://pay?pa=amrinjameer@okicici&pn=Amrin%20Jameer&am=${calculateTotal().toFixed(2)}&cu=INR&tn=ALHAQQ_Garments_${encodeURIComponent(product.name)}`} 
                        size={120} 
                        level="H"
                        includeMargin={true}
                      />
                      <p style={{ color: '#666', marginTop: '0.5rem', fontSize: '0.8rem' }}>Paying ₹{calculateTotal().toFixed(2)} to ALHAQQ garments</p>
                    </div>
                  )}

                  <button 
                    className="btn" 
                    style={{ width: '100%', padding: '1rem', fontSize: '1rem', backgroundColor: 'black', color: 'white', border: '1px solid black', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}
                    onClick={processSimulatedPayment}
                    disabled={!paymentMethod}
                  >
                    {paymentMethod === 'cod' ? `CONFIRM ORDER (+₹10 COD)` : `PAY ₹${calculateTotal().toFixed(2)}`}
                  </button>
                </>
              ) : (
                // Step 2: Processing Payment State
                <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                  <Activity size={48} color="var(--primary-color)" className="mb-4" style={{ animation: 'spin 2s linear infinite', margin: '0 auto' }} />
                  <h3>{paymentMethod === 'cod' ? 'Processing Order...' : 'Processing Payment...'}</h3>
                  <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>Please do not close this window or press back.</p>
                  <div style={{ marginTop: '2rem', height: '4px', backgroundColor: 'var(--surface-hover)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ width: '50%', height: '100%', backgroundColor: 'var(--primary-color)', transition: 'width 2.5s ease', animation: 'progress 2.5s ease forwards' }}></div>
                  </div>
                </div>
              )
            ) : (
              // Step 3: Success State
              <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                <CheckCircle size={64} color="black" className="mb-4" style={{ margin: '0 auto' }} />
                <h3 style={{ color: 'black', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 800 }}>ORDER CONFIRMED</h3>
                <p style={{ color: 'var(--text-muted)', marginTop: '1rem', marginBottom: '2rem' }}>
                  {paymentMethod === 'cod' 
                    ? `Your order for ${product.name} (Size: ${selectedSize}) has been placed. You will pay ₹${calculateTotal().toFixed(2)} on delivery.`
                    : `Your payment of ₹${calculateTotal().toFixed(2)} was successful. Your order for ${product.name} (Size: ${selectedSize}) is confirmed.`}
                </p>
                
                <div style={{ padding: '1.5rem', backgroundColor: '#f9f9f9', borderRadius: '0', border: '1px solid var(--border-color)', marginBottom: '2rem', textAlign: 'left' }}>
                  <p style={{ margin: 0, fontSize: '0.9rem' }}><strong>Order ID:</strong> {orderId}</p>
                  <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem' }}><strong>Estimated Delivery:</strong> 3-5 Business Days</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <button 
                    className="btn" 
                    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', backgroundColor: 'transparent', border: '1px solid var(--border-color)', color: 'black', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}
                    onClick={generatePDF}
                  >
                    <Download size={20} /> Download Bill
                  </button>

                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button 
                      className="btn" 
                      style={{ flex: 1, backgroundColor: 'transparent', color: 'black', border: '1px solid black', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}
                      onClick={() => {
                        setShowPaymentModal(false);
                        setPaymentSuccess(false);
                      }}
                    >
                      Close
                    </button>
                    <Link 
                      to="/shop" 
                      className="btn" 
                      style={{ flex: 1, backgroundColor: 'black', color: 'white', border: '1px solid black', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, textDecoration: 'none', textAlign: 'center', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center' }}
                    >
                      Continue
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Hidden Invoice Template for PDF generation */}
      {paymentSuccess && <Invoice ref={invoiceRef} data={invoiceData} />}
      
    </div>
  );
};

export default ProductDetails;
