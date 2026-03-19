import { useState, useEffect, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { Package, ShoppingCart, Users, Plus } from 'lucide-react';
import AuthContext from '../context/AuthContext';
import ProductForm from '../components/ProductForm';

const AdminDashboard = () => {
  const { user, loading } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productCategoryFilter, setProductCategoryFilter] = useState('All');
  
  const fetchProducts = () => {
    axios.get('http://localhost:5000/api/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
  };

  const fetchOrders = () => {
    axios.get('http://localhost:5000/api/orders/all', {
      headers: { Authorization: `Bearer ${user.token}` }
    })
      .then(res => setOrders(res.data))
      .catch(err => console.error(err));
  };

  const fetchUsers = () => {
    axios.get('http://localhost:5000/api/users/all', {
      headers: { Authorization: `Bearer ${user.token}` }
    })
      .then(res => setUsersList(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    if (user?.role === 'admin') {
      if (activeTab === 'products') fetchProducts();
      if (activeTab === 'orders') fetchOrders();
      if (activeTab === 'users') fetchUsers();
    }
  }, [activeTab, user]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`http://localhost:5000/api/products/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        fetchProducts();
      } catch (err) {
        console.error('Error deleting product', err);
        alert('Failed to delete product');
      }
    }
  };

  const handleUpdateTracking = async (orderId, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/orders/${orderId}/tracking`, 
        { tracking_status: newStatus },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      // Optimistically update local state to avoid full re-fetch
      setOrders(orders.map(o => o.id === orderId ? { ...o, tracking_status: newStatus } : o));
    } catch (err) {
      console.error('Error updating tracking status', err);
      alert('Failed to update tracking status');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '4rem' }}>Loading...</div>;
  if (!user || user.role !== 'admin') return <Navigate to="/" />;

  return (
    <div style={{ padding: '2rem 0' }}>
      <h1 className="mb-4">Admin Dashboard</h1>
      
      <div style={{ gap: '1rem', marginBottom: '2rem', display: 'flex' }}>
        <button 
          className={`btn ${activeTab === 'products' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('products')}
        >
          <Package size={20} /> Products
        </button>
        <button 
          className={`btn ${activeTab === 'orders' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('orders')}
        >
          <ShoppingCart size={20} /> Orders
        </button>
        <button 
          className={`btn ${activeTab === 'users' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('users')}
        >
          <Users size={20} /> Users
        </button>
      </div>

      <div style={{ backgroundColor: 'var(--surface-color)', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
        {activeTab === 'products' && (
          <div>
            <div className="justify-between d-flex align-center mb-4">
              <h2>Manage Products</h2>
              <button className="btn btn-primary" onClick={() => { setEditingProduct(null); setShowForm(!showForm); }}>
                {showForm ? 'Cancel' : <><Plus size={20} /> Add Product</>}
              </button>
            </div>
            
            {showForm ? (
              <ProductForm 
                product={editingProduct} 
                token={user.token} 
                onSuccess={() => { setShowForm(false); fetchProducts(); }} 
              />
            ) : products.length === 0 ? <p>Loading...</p> : (
              <>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                  {['All', 'Boys T-Shirts', 'Girls T-Shirts', 'Unisex T-Shirts', 'Hoodies', 'Summer Outfits', 'Sweatshirts', 'Graphic T-Shirts'].map(cat => (
                    <button 
                      key={cat}
                      className={`btn ${productCategoryFilter === cat ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                      onClick={() => setProductCategoryFilter(cat)}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products
                    .filter(p => productCategoryFilter === 'All' ? true : 
                      (p.category && p.category.toLowerCase() === productCategoryFilter.toLowerCase())
                    )
                    .map(p => (
                    <tr key={p.id}>
                      <td>#{p.id}</td>
                      <td><img src={p.image_url?.startsWith('http') ? p.image_url : `http://localhost:5000${p.image_url}`} alt={p.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} /></td>
                      <td>{p.name}</td>
                      <td>{p.category || 'Uncategorized'}</td>
                      <td>₹{p.price.toFixed(2)}</td>
                      <td>{p.stock}</td>
                      <td>
                        <button className="btn-secondary badge badge-warning" style={{ marginRight: '0.5rem' }} onClick={() => handleEdit(p)}>Edit</button>
                        <button className="btn-secondary badge" style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)', color: 'var(--danger-color)' }} onClick={() => handleDelete(p.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </>
            )}
          </div>
        )}
        
        {activeTab === 'orders' && (
          <div>
            <h2 className="mb-4">Manage Orders</h2>
            {orders.length === 0 ? <p>No orders found.</p> : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Email</th>
                    <th>Total Price</th>
                    <th>Date</th>
                    <th>Tracking</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(o => (
                    <tr key={o.id}>
                      <td>#{o.id}</td>
                      <td>{o.user_name || 'N/A'}</td>
                      <td>{o.user_email || 'N/A'}</td>
                      <td style={{ fontWeight: 'bold' }}>₹{o.total_price.toFixed(2)}</td>
                      <td>{new Date(o.created_at).toLocaleDateString()}</td>
                      <td>
                        <select 
                          className="form-control" 
                          value={o.tracking_status || 'Processing'} 
                          onChange={(e) => handleUpdateTracking(o.id, e.target.value)}
                          style={{ 
                            padding: '0.25rem', 
                            fontSize: '0.85rem', 
                            backgroundColor: 
                               o.tracking_status === 'Delivered' ? 'rgba(34, 197, 94, 0.1)' : 
                               o.tracking_status === 'Shipped' ? 'rgba(59, 130, 246, 0.1)' : 
                               'var(--surface-color)',
                            borderColor: 
                               o.tracking_status === 'Delivered' ? 'var(--success-color)' : 
                               o.tracking_status === 'Shipped' ? 'var(--primary-color)' : 
                               'var(--border-color)',
                            color: 
                               o.tracking_status === 'Delivered' ? 'var(--success-color)' : 
                               o.tracking_status === 'Shipped' ? 'var(--primary-color)' : 
                               'var(--text-main)',
                            fontWeight: 600
                          }}
                        >
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Out for Delivery">Out for Delivery</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {activeTab === 'users' && (
          <div>
            <h2 className="mb-4">Manage Users</h2>
            {usersList.length === 0 ? <p>No users found.</p> : (
              <table className="table">
                <thead>
                  <tr>
                    <th>User ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                  </tr>
                </thead>
                <tbody>
                  {usersList.map(u => (
                    <tr key={u.id}>
                      <td>#{u.id}</td>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>
                        <span className={`badge ${u.role === 'admin' ? 'badge-primary' : 'badge-secondary'}`}>
                          {u.role}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
export default AdminDashboard;
