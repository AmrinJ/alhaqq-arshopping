import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { User, Package, Settings, LogOut, Clock, Download, CheckCircle, Truck, MapPin } from 'lucide-react';
import AuthContext from '../context/AuthContext';

const Profile = () => {
  const { user, logout, login } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' or 'settings'
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zip: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/orders/myorders`, config);
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchProfile = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/profile`, config);
        setProfileData({
          name: data.name || user.name || '',
          phone: data.phone || '',
          street: data.street || '',
          city: data.city || '',
          state: data.state || '',
          zip: data.zip || ''
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchOrders();
    fetchProfile();
  }, [user, navigate]);

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to remove this order from your history?')) {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        await axios.delete(`${import.meta.env.VITE_API_URL}/api/orders/${orderId}`, config);
        setOrders(orders.filter(o => o.id !== orderId));
      } catch (error) {
        console.error("Error deleting order:", error);
        alert('Failed to delete order history.');
      }
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.put(`${import.meta.env.VITE_API_URL}/api/users/profile`, profileData, config);
      
      // Update local context name if it changed
      if (data.name !== user.name) {
          login({ ...user, name: data.name });
      }
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
       console.error("Error updating profile", error);
       alert('Failed to update profile');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  return (
    <div style={{ padding: '3rem 5%', maxWidth: '1200px', margin: '0 auto', minHeight: '60vh' }}>
      <div className="mb-4" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', backgroundColor: 'var(--surface-color)', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--primary-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 'bold', boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)' }}>
          {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
        </div>
        <div>
          <h1 style={{ marginBottom: '0.25rem', fontSize: '2rem' }}>Welcome, {user.name || 'User'}</h1>
          <p style={{ color: 'var(--text-muted)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem' }}>
            <User size={18} /> {user.email}
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '2rem', marginTop: '3rem', flexWrap: 'wrap' }}>
        {/* Sidebar Nav */}
        <div style={{ flex: '1 1 250px', maxWidth: '300px' }}>
          <div style={{ backgroundColor: 'var(--surface-color)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
            <button 
              onClick={() => setActiveTab('orders')}
              style={{ width: '100%', padding: '1rem', textAlign: 'left', background: activeTab === 'orders' ? 'rgba(99, 102, 241, 0.1)' : 'none', border: 'none', borderBottom: '1px solid var(--border-color)', borderLeft: activeTab === 'orders' ? '4px solid var(--primary-color)' : '4px solid transparent', display: 'flex', alignItems: 'center', gap: '0.75rem', color: activeTab === 'orders' ? 'var(--primary-color)' : 'var(--text-main)', fontWeight: activeTab === 'orders' ? 600 : 400, cursor: 'pointer', transition: 'all 0.2s' }}
            >
              <Package size={20} /> Order History
            </button>
            <button 
              onClick={() => setActiveTab('settings')}
              style={{ width: '100%', padding: '1rem', textAlign: 'left', background: activeTab === 'settings' ? 'rgba(99, 102, 241, 0.1)' : 'none', border: 'none', borderBottom: '1px solid var(--border-color)', borderLeft: activeTab === 'settings' ? '4px solid var(--primary-color)' : '4px solid transparent', display: 'flex', alignItems: 'center', gap: '0.75rem', color: activeTab === 'settings' ? 'var(--primary-color)' : 'var(--text-main)', fontWeight: activeTab === 'settings' ? 600 : 400, cursor: 'pointer', transition: 'all 0.2s' }}
            >
              <Settings size={20} /> Account Settings
            </button>
            <button 
              onClick={handleLogout}
              style={{ width: '100%', padding: '1rem', textAlign: 'left', background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--danger-color)', cursor: 'pointer', transition: 'all 0.2s' }}
            >
              <LogOut size={20} /> Logout
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div style={{ flex: '3 1 600px' }}>
          {activeTab === 'orders' && (
            <div>
              <h2 className="mb-4">Order History</h2>
              
              {loading ? (
                <p>Loading your orders...</p>
              ) : orders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: 'var(--surface-color)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--border-color)' }}>
                  <Package size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem auto' }} />
                  <h4>No Orders Found</h4>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>You haven't placed any orders yet.</p>
                  <button className="btn btn-primary" onClick={() => navigate('/shop')}>Start Shopping</button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {orders.map(order => (
                    <div key={order.id} style={{ backgroundColor: 'var(--surface-color)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
                      {/* Order Header */}
                      <div style={{ padding: '1rem 1.5rem', backgroundColor: 'rgba(0,0,0,0.02)', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                        <div>
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block' }}>ORDER PLACED</span>
                          <span style={{ fontWeight: 600 }}>{new Date(order.created_at).toLocaleDateString()}</span>
                        </div>
                        <div>
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block' }}>TOTAL</span>
                          <span style={{ fontWeight: 600 }}>₹{order.total_price.toFixed(2)}</span>
                        </div>
                        <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block' }}>ORDER # {order.id}</span>
                          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.85rem', color: 'var(--primary-color)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                               <Download size={14} /> Invoice
                            </span>
                            <span onClick={() => handleDeleteOrder(order.id)} style={{ fontSize: '0.85rem', color: 'var(--danger-color)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', opacity: 0.8 }} title="Remove from History">
                               X Delete
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Order Tracking Timeline */}
                      <div style={{ padding: '1.5rem 1.5rem 0 1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                           <h5 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                             <Truck size={18} /> Shipping Status: <span style={{ color: 'var(--primary-color)' }}>{order.tracking_status || 'Processing'}</span>
                           </h5>
                           {order.expected_delivery && (
                             <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                               Expected: {new Date(order.expected_delivery).toLocaleDateString()}
                             </span>
                           )}
                        </div>
                        
                        {/* Progress Bar Graphic */}
                        <div style={{ position: 'relative', marginTop: '1.5rem', marginBottom: '1.5rem' }}>
                          <div style={{ position: 'absolute', top: '50%', left: '0', right: '0', height: '4px', backgroundColor: 'var(--border-color)', transform: 'translateY(-50%)', zIndex: 0, borderRadius: '2px' }}></div>
                          
                          {/* Calculate progress width */}
                          {(() => {
                             const stages = ['Processing', 'Shipped', 'Out for Delivery', 'Delivered'];
                             const currentStage = stages.indexOf(order.tracking_status || 'Processing');
                             const progressWidth = currentStage === -1 ? 0 : (currentStage / (stages.length - 1)) * 100;
                             
                             return (
                               <>
                                 <div style={{ position: 'absolute', top: '50%', left: '0', width: `${progressWidth}%`, height: '4px', backgroundColor: 'var(--success-color)', transform: 'translateY(-50%)', zIndex: 1, borderRadius: '2px', transition: 'width 0.5s ease-in-out' }}></div>
                                 <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', zIndex: 2 }}>
                                   {stages.map((stage, i) => (
                                     <div key={stage} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '80px', transform: 'translateX(-40px)' }}>
                                       <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: i <= currentStage ? 'var(--success-color)' : 'var(--surface-color)', border: `3px solid ${i <= currentStage ? 'var(--success-color)' : 'var(--border-color)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                                         {i <= currentStage && <CheckCircle size={14} />}
                                       </div>
                                       <span style={{ fontSize: '0.75rem', marginTop: '0.4rem', color: i <= currentStage ? 'var(--text-main)' : 'var(--text-muted)', fontWeight: i <= currentStage ? 600 : 400, textAlign: 'center' }}>
                                         {stage}
                                       </span>
                                     </div>
                                   ))}
                                 </div>
                               </>
                             );
                          })()}
                        </div>
                      </div>

                      {/* Order Items */}
                      <div style={{ padding: '1.5rem' }}>
                        {(order.orderItems || []).map((item, index) => (
                           <div key={index} style={{ display: 'flex', gap: '1.5rem', marginBottom: index !== order.orderItems.length - 1 ? '1.5rem' : 0, paddingBottom: index !== order.orderItems.length - 1 ? '1.5rem' : 0, borderBottom: index !== order.orderItems.length - 1 ? '1px solid var(--border-color)' : 'none' }}>
                             <div style={{ width: '80px', height: '80px', backgroundColor: 'white', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
                               <img src={`${import.meta.env.VITE_API_URL}${item.image_url}`} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                             </div>
                             <div style={{ flex: 1 }}>
                               <h5 style={{ margin: '0 0 0.5rem 0' }}>{item.name}</h5>
                               <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Size: {item.size || 'N/A'}</p>
                               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                                 <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Qty: {item.quantity}</span>
                                 <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>₹{(item.price * item.quantity).toFixed(2)}</span>
                               </div>
                             </div>
                           </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ margin: 0 }}>Account Settings</h2>
                {!isEditing ? (
                  <button className="btn btn-secondary" onClick={() => setIsEditing(true)} style={{ padding: '0.5rem 1rem' }}>Edit Profile</button>
                ) : (
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="btn btn-secondary" onClick={() => setIsEditing(false)} style={{ padding: '0.5rem 1rem' }}>Cancel</button>
                    <button className="btn btn-primary" onClick={handleProfileUpdate} style={{ padding: '0.5rem 1rem' }}>Save Changes</button>
                  </div>
                )}
              </div>
              <div style={{ backgroundColor: 'var(--surface-color)', padding: '2.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
                <h4 style={{ marginBottom: '1.5rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)', color: 'var(--primary-color)' }}>Personal Information</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2.5rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-muted)' }}>Full Name</label>
                    <input type="text" name="name" className="form-control" value={profileData.name} onChange={handleInputChange} style={{ width: '100%', padding: '0.85rem', backgroundColor: isEditing ? 'white' : 'var(--bg-color)', border: isEditing ? '1px solid var(--primary-color)' : '1px solid var(--border-color)' }} disabled={!isEditing} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-muted)' }}>Email Address</label>
                    <input type="email" className="form-control" value={user.email} style={{ width: '100%', padding: '0.85rem', backgroundColor: 'var(--bg-color)', color: 'var(--text-muted)' }} disabled title="Email cannot be changed" />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-muted)' }}>Phone Number</label>
                    <input type="tel" name="phone" className="form-control" value={profileData.phone} onChange={handleInputChange} placeholder="+91 98765 43210" style={{ width: '100%', padding: '0.85rem', backgroundColor: isEditing ? 'white' : 'var(--bg-color)', border: isEditing ? '1px solid var(--primary-color)' : '1px solid var(--border-color)' }} disabled={!isEditing} />
                  </div>
                </div>

                <h4 style={{ marginBottom: '1.5rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)', color: 'var(--primary-color)' }}>Shipping Address</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-muted)' }}>Street Address</label>
                    <input type="text" name="street" className="form-control" value={profileData.street} onChange={handleInputChange} placeholder="123 Shopping Avenue, Block B" style={{ width: '100%', padding: '0.85rem', backgroundColor: isEditing ? 'white' : 'var(--bg-color)', border: isEditing ? '1px solid var(--primary-color)' : '1px solid var(--border-color)' }} disabled={!isEditing} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-muted)' }}>City</label>
                    <input type="text" name="city" className="form-control" value={profileData.city} onChange={handleInputChange} placeholder="Mumbai" style={{ width: '100%', padding: '0.85rem', backgroundColor: isEditing ? 'white' : 'var(--bg-color)', border: isEditing ? '1px solid var(--primary-color)' : '1px solid var(--border-color)' }} disabled={!isEditing} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-muted)' }}>State</label>
                    <input type="text" name="state" className="form-control" value={profileData.state} onChange={handleInputChange} placeholder="Maharashtra" style={{ width: '100%', padding: '0.85rem', backgroundColor: isEditing ? 'white' : 'var(--bg-color)', border: isEditing ? '1px solid var(--primary-color)' : '1px solid var(--border-color)' }} disabled={!isEditing} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-muted)' }}>Postal Code</label>
                    <input type="text" name="zip" className="form-control" value={profileData.zip} onChange={handleInputChange} placeholder="400001" style={{ width: '100%', padding: '0.85rem', backgroundColor: isEditing ? 'white' : 'var(--bg-color)', border: isEditing ? '1px solid var(--primary-color)' : '1px solid var(--border-color)' }} disabled={!isEditing} />
                  </div>
                </div>

              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
