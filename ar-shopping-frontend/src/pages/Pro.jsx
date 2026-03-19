import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Smartphone, CreditCard, Activity, CheckCircle, Download } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import Invoice from '../components/Invoice';
import { generatePDFFromElement } from '../utils/pdfGenerator';

const Pro = () => {
  const invoiceRef = useRef(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');
  
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });

  const generateOrderId = () => {
    return 'PRO-' + Math.random().toString(36).substring(2, 10).toUpperCase();
  };

  const processSimulatedPayment = () => {
    setProcessingPayment(true);
    
    // Simulate API call and processing time
    setTimeout(() => {
      setProcessingPayment(false);
      setPaymentSuccess(true);
      setOrderId(generateOrderId());
    }, 2500);
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
    customerName: cardDetails.name || 'Pro Member',
    items: [{ name: 'ALHAQQ PRO Membership (1 Year)', quantity: 1, price: 999.00 }],
    subtotal: 999.00,
    shipping: 0,
    total: 999.00,
    paymentMethod: paymentMethod
  } : null;

  return (
    <div style={{ padding: '8rem 5%', textAlign: 'center', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
      
      <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'black', color: 'white', marginBottom: '2rem' }}>
        <Clock size={40} />
      </div>

      <h1 style={{ fontSize: '3rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '-0.02em', marginBottom: '1.5rem', margin: 0 }}>
        ALHAQQ PRO
      </h1>
      
      <h2 style={{ fontSize: '1.5rem', fontWeight: 400, color: 'var(--text-muted)', marginBottom: '3rem', maxWidth: '600px' }}>
        Get your products delivered within 24 hours. Guaranteed.
      </h2>

      <div style={{ padding: '2rem', border: '1px solid black', backgroundColor: '#fafafa', maxWidth: '400px', width: '100%', marginBottom: '2rem' }}>
        <p style={{ fontSize: '1.2rem', fontWeight: 600, margin: '0 0 1rem 0' }}>Subscription</p>
        <p style={{ fontSize: '2.5rem', fontWeight: 800, margin: '0 0 1.5rem 0' }}>₹999<span style={{ fontSize: '1rem', fontWeight: 400, color: 'var(--text-muted)' }}>/year</span></p>
        
        <button 
          onClick={() => setShowPaymentModal(true)}
          style={{ width: '100%', backgroundColor: 'black', color: 'white', border: 'none', padding: '1rem', fontSize: '1rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', cursor: 'pointer' }}
        >
          Subscribe Now
        </button>
      </div>

      <Link to="/shop" style={{ color: 'var(--text-muted)', textDecoration: 'underline' }}>
        Maybe later, take me back to shopping
      </Link>

      {/* Subscription Checkout Modal */}
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
                <div style={{ textAlign: 'left' }}>
                  <h4 className="mb-4" style={{ textAlign: 'center', marginTop: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>PRO CHECKOUT</h4>
                  <div style={{ marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                    <p style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Item:</span>
                      <strong style={{ fontWeight: 600 }}>ALHAQQ PRO (1 Year)</strong>
                    </p>
                    <p style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0', fontSize: '1.2rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Total:</span>
                      <strong style={{ color: 'black', fontWeight: 800 }}>₹999.00</strong>
                    </p>
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
                  </div>

                  {/* Dynamic QR Code for UPI */}
                  {paymentMethod === 'upi' && (
                    <div style={{ textAlign: 'center', marginBottom: '1.5rem', padding: '1rem', backgroundColor: 'white', borderRadius: '0', border: '1px solid var(--border-color)' }}>
                      <p style={{ color: '#333', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem' }}>Scan with any UPI App</p>
                      <QRCodeSVG 
                        value={`upi://pay?pa=amrinjameer@okicici&pn=Amrin%20Jameer&am=999.00&cu=INR&tn=ALHAQQ_Garments_PRO_Subscription`} 
                        size={120} 
                        level="H"
                        includeMargin={true}
                      />
                      <p style={{ color: '#666', marginTop: '0.5rem', fontSize: '0.8rem' }}>Paying ₹999.00 to ALHAQQ garments</p>
                    </div>
                  )}

                  <button 
                    className="btn" 
                    style={{ width: '100%', padding: '1rem', fontSize: '1rem', backgroundColor: 'black', color: 'white', border: '1px solid black', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}
                    onClick={processSimulatedPayment}
                    disabled={!paymentMethod}
                  >
                    PAY ₹999.00
                  </button>
                </div>
              ) : (
                // Step 2: Processing Payment State
                <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                  <Activity size={48} color="black" className="mb-4" style={{ animation: 'spin 2s linear infinite', margin: '0 auto' }} />
                  <h3>Processing Payment...</h3>
                  <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>Please do not close this window or press back.</p>
                  <div style={{ marginTop: '2rem', height: '4px', backgroundColor: '#f9f9f9', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
                    <div style={{ width: '50%', height: '100%', backgroundColor: 'black', transition: 'width 2.5s ease', animation: 'progress 2.5s forwards' }}></div>
                  </div>
                </div>
              )
            ) : (
              // Step 3: Success State
              <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                <CheckCircle size={64} color="black" className="mb-4" style={{ margin: '0 auto' }} />
                <h3 style={{ color: 'black', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 800 }}>PRO ACTIVATED</h3>
                <p style={{ color: 'var(--text-muted)', marginTop: '1rem', marginBottom: '2rem' }}>
                  Your payment of ₹999.00 was successful. Your 1-Year ALHAQQ PRO Membership is now active.
                </p>
                
                <div style={{ padding: '1.5rem', backgroundColor: '#f9f9f9', borderRadius: '0', border: '1px solid var(--border-color)', marginBottom: '2rem', textAlign: 'left' }}>
                  <p style={{ margin: 0, fontSize: '0.9rem' }}><strong>Subscription ID:</strong> {orderId}</p>
                  <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem' }}><strong>Valid Until:</strong> {new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toLocaleDateString()}</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <button 
                    className="btn" 
                    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', backgroundColor: 'transparent', border: '1px solid var(--border-color)', color: 'black', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}
                    onClick={generatePDF}
                  >
                    <Download size={20} /> Download Invoice
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
                      Shop Now
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

export default Pro;
