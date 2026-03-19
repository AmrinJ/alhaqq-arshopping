import React, { forwardRef } from 'react';
import { ShoppingBag } from 'lucide-react';

const Invoice = forwardRef(({ data }, ref) => {
  if (!data) return null;

  return (
    <div 
      ref={ref} 
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        width: '800px',
        minHeight: '1131px', // A4 aspect ratio at 96 DPI
        backgroundColor: 'white',
        fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
        color: 'black',
        padding: '0',
        zIndex: -1000, // Hidden behind the checkout modal overlay which is zIndex: 100
        opacity: 1, // Must be 1 for html2canvas
        visibility: 'visible', // Must be visible for html2canvas
        boxSizing: 'border-box'
      }}
    >
      {/* --- BACKGROUND SHAPES --- */}
      {/* Top Background Shapes */}
      <svg width="800" height="150" style={{ position: 'absolute', top: 0, left: 0, zIndex: 0 }}>
        {/* Top Gold Polygon */}
        <polygon points="100,0 800,0 800,80 150,80" fill="#d4af37" />
        {/* Top Dark Polygon */}
        <polygon points="0,0 800,0 800,40 400,80 0,20" fill="#1b1236" />
      </svg>
      
      {/* Bottom Background Shapes */}
      <svg width="800" height="150" style={{ position: 'absolute', bottom: 0, left: 0, zIndex: 0 }}>
        {/* Bottom Gold Polygon */}
        <polygon points="0,150 700,150 650,70 0,70" fill="#d4af37" />
        {/* Bottom Dark Polygon */}
        <polygon points="0,150 800,150 800,110 400,70 0,130" fill="#1b1236" />
      </svg>

      {/* --- INVOICE CONTENT --- */}
      <div style={{ position: 'relative', zIndex: 1, padding: '100px 50px 50px 50px', height: '100%', display: 'flex', flexDirection: 'column' }}>
        
        {/* Header Content */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
          
          {/* Logo & Company Name */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            {/* Simulated Round Logo */}
            <div style={{ 
              width: '90px', 
              height: '90px', 
              borderRadius: '50%', 
              backgroundColor: '#1b1236', 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center', 
              justifyContent: 'center',
              border: '3px solid #d4af37',
              color: '#d4af37'
            }}>
              <ShoppingBag size={30} style={{ marginBottom: '5px' }} />
              <div style={{ fontSize: '10px', fontWeight: 'bold', lineHeight: '1', textAlign: 'center' }}>
                ALHAQQ<br/><span style={{ fontSize: '7px' }}>GARMENTS</span>
              </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 800, letterSpacing: '2px', lineHeight: '1.2' }}>AL-HAQQ</h1>
              <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 800, letterSpacing: '2px', lineHeight: '1.2' }}>GARMENTS</h1>
            </div>
          </div>

          {/* Contact Details */}
          <div style={{ textAlign: 'right', fontSize: '12px', lineHeight: '1.6', fontWeight: 500, color: '#333' }}>
            <div>+91 9942845670</div>
            <div>alhaqqgarments@gmail.com</div>
            <div>mohamedjameer@gmail.com</div>
            <div>143-A Munniappan kovil street, P.N Road</div>
            <div>Tiruppur-641603</div>
            <div style={{ fontWeight: 800, marginTop: '2px' }}>GSTIN: 33ANUPJ6028N1ZF</div>
          </div>

        </div>

        {/* Thick Divider Line */}
        <div style={{ width: '100%', height: '3px', backgroundColor: '#1b1236', marginBottom: '15px' }}></div>

        {/* Date line */}
        <div style={{ textAlign: 'right', fontWeight: 700, fontSize: '14px', marginBottom: '40px' }}>
          {data.date || new Date().toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' })}
        </div>
        
        {/* Dynamic Data Content */}
        <div style={{ flex: 1 }}>
            
            {/* Customer Details & Invoice Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px' }}>
                <div>
                    <h3 style={{ margin: '0 0 10px 0', fontSize: '18px', color: '#1b1236' }}>BILL TO:</h3>
                    {data.customerName ? (
                        <>
                            <div style={{ fontWeight: 600, fontSize: '14px' }}>{data.customerName}</div>
                            {data.customerAddress && <div style={{ fontSize: '12px', color: '#555', marginTop: '5px' }}>{data.customerAddress}</div>}
                            {data.customerPhone && <div style={{ fontSize: '12px', color: '#555' }}>Ph: {data.customerPhone}</div>}
                        </>
                    ) : (
                        <div style={{ fontSize: '14px', fontStyle: 'italic', color: '#777' }}>Walk-in Customer</div>
                    )}
                </div>
                <div style={{ textAlign: 'right' }}>
                    <h2 style={{ margin: '0 0 10px 0', fontSize: '24px', fontWeight: 800, color: '#1b1236' }}>INVOICE</h2>
                    <div style={{ fontSize: '14px' }}><strong>Invoice No:</strong> {data.orderId}</div>
                    <div style={{ fontSize: '14px' }}><strong>Payment:</strong> {data.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Paid Online'}</div>
                </div>
            </div>

            {/* Line Items Table */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '30px' }}>
                <thead>
                    <tr style={{ backgroundColor: '#1b1236', color: 'white' }}>
                        <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', textTransform: 'uppercase' }}>Description</th>
                        <th style={{ padding: '12px', textAlign: 'center', fontSize: '14px', textTransform: 'uppercase' }}>Qty</th>
                        <th style={{ padding: '12px', textAlign: 'right', fontSize: '14px', textTransform: 'uppercase' }}>Price</th>
                        <th style={{ padding: '12px', textAlign: 'right', fontSize: '14px', textTransform: 'uppercase' }}>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {data.items.map((item, index) => (
                        <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
                            <td style={{ padding: '15px 12px', fontSize: '14px' }}>
                                <div style={{ fontWeight: 600 }}>{item.name}</div>
                                {item.size && <div style={{ fontSize: '12px', color: '#666', marginTop: '3px' }}>Size: {item.size}</div>}
                            </td>
                            <td style={{ padding: '15px 12px', textAlign: 'center', fontSize: '14px' }}>{item.quantity}</td>
                            <td style={{ padding: '15px 12px', textAlign: 'right', fontSize: '14px' }}>₹{item.price.toFixed(2)}</td>
                            <td style={{ padding: '15px 12px', textAlign: 'right', fontSize: '14px', fontWeight: 600 }}>₹{(item.price * item.quantity).toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Totals */}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <div style={{ width: '300px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', borderBottom: '1px solid #ddd', fontSize: '14px' }}>
                        <span style={{ fontWeight: 600 }}>Subtotal</span>
                        <span>₹{data.subtotal.toFixed(2)}</span>
                    </div>
                    {data.shipping > 0 && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', borderBottom: '1px solid #ddd', fontSize: '14px' }}>
                            <span style={{ fontWeight: 600 }}>Shipping & Handling</span>
                            <span>₹{data.shipping.toFixed(2)}</span>
                        </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 12px', backgroundColor: '#f9f9f9', fontSize: '18px', fontWeight: 800, marginTop: '10px', borderTop: '2px solid #1b1236' }}>
                        <span>TOTAL</span>
                        <span>₹{data.total.toFixed(2)}</span>
                    </div>
                </div>
            </div>
            
            {/* Thank you note */}
            <div style={{ marginTop: '50px', textAlign: 'center', fontStyle: 'italic', color: '#555' }}>
                Thank you for your business! If you have any questions about this invoice, please contact us.
            </div>

        </div>

      </div>
    </div>
  );
});

export default Invoice;
