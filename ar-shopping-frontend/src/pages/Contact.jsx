import { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setFormData({ name: '', email: '', message: '' });
    }, 1500);
  };

  return (
    <div style={{ padding: '4rem 5%', maxWidth: '1200px', margin: '0 auto' }}>
      <div className="animate-fade-in-up" style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem' }}>Get in Touch</h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
          Have a question about our AR technology, your recent order, or just want to say hello? We'd love to hear from you.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'start' }}>
        
        {/* Contact Info Column */}
        <div className="animate-fade-in-up delay-100" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div>
            <h3 className="mb-4">Contact Information</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: 1.6 }}>
              Fill out the form and our team will get back to you within 24 hours. Alternatively, reach out directly using the details below.
            </p>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: 'rgba(99, 102, 241, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Phone color="var(--primary-color)" size={24} />
            </div>
            <div>
              <p style={{ margin: 0, fontWeight: 600 }}>Phone Support</p>
              <p style={{ margin: 0, color: 'var(--text-muted)' }}>+91 98765 43210</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Mail color="var(--success-color)" size={24} />
            </div>
            <div>
              <p style={{ margin: 0, fontWeight: 600 }}>Email Address</p>
              <p style={{ margin: 0, color: 'var(--text-muted)' }}>support@alhaqqgarments.com</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: 'rgba(245, 158, 11, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MapPin color="#f59e0b" size={24} />
            </div>
            <div>
              <p style={{ margin: 0, fontWeight: 600 }}>Office Location</p>
              <p style={{ margin: 0, color: 'var(--text-muted)' }}>123 Fashion Street, Mumbai, India</p>
            </div>
          </div>
        </div>

        {/* Form Column */}
        <div className="animate-fade-in-up delay-200" style={{ backgroundColor: 'var(--surface-color)', padding: '2.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)' }}>
          {isSuccess ? (
            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
              <CheckCircle size={64} color="var(--success-color)" style={{ margin: '0 auto 1.5rem auto' }} />
              <h3 style={{ marginBottom: '1rem' }}>Message Sent!</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Thank you for reaching out. A support representative will review your message shortly.</p>
              <button className="btn btn-secondary" onClick={() => setIsSuccess(false)}>Send Another Message</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group mb-4">
                <label className="form-label" style={{ fontWeight: 600 }}>Full Name</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="John Doe" 
                  required 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  style={{ padding: '0.75rem' }}
                />
              </div>
              <div className="form-group mb-4">
                <label className="form-label" style={{ fontWeight: 600 }}>Email Address</label>
                <input 
                  type="email" 
                  className="form-control" 
                  placeholder="john@example.com" 
                  required 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  style={{ padding: '0.75rem' }}
                />
              </div>
              <div className="form-group mb-4">
                <label className="form-label" style={{ fontWeight: 600 }}>How can we help?</label>
                <textarea 
                  className="form-control" 
                  rows="5" 
                  placeholder="Tell us about your issue..." 
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  style={{ padding: '0.75rem', resize: 'vertical' }}
                ></textarea>
              </div>
              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ width: '100%', padding: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '1.05rem' }}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : <><Send size={18} /> Send Message</>}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;
