import { useState, useEffect } from 'react';
import axios from 'axios';

const ProductForm = ({ product, token, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [modelFile, setModelFile] = useState(null);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const AVAILABLE_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description || '',
        price: product.price,
        stock: product.stock,
        category: product.category || ''
      });
      if (product.sizes) setSelectedSizes(product.sizes);
    }
  }, [product]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSizeToggle = (size) => {
    setSelectedSizes(prev => 
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const submitData = new FormData();
    Object.keys(formData).forEach(key => submitData.append(key, formData[key]));
    submitData.append('sizes', JSON.stringify(selectedSizes));
    submitData.append('colors', JSON.stringify([])); // Send empty array to backend
    if (imageFile) submitData.append('image', imageFile);
    if (modelFile) submitData.append('ar_model', modelFile);

    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      if (product) {
        await axios.put(`http://localhost:5000/api/products/${product.id}`, submitData, config);
      } else {
        await axios.post('http://localhost:5000/api/products', submitData, config);
      }
      onSuccess();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Error saving product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--surface-hover)', padding: '2rem', borderRadius: 'var(--radius-md)' }}>
      <h3 className="mb-4">{product ? 'Edit Product' : 'Add New Product'}</h3>
      {error && <div style={{ color: 'var(--danger-color)', marginBottom: '1rem' }}>{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Name</label>
            <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">Category</label>
            <select className="form-control" name="category" value={formData.category} onChange={handleChange} required>
              <option value="" disabled>Select Category</option>
              <option value="Boys T-Shirts">Boys T-Shirts</option>
              <option value="Girls T-Shirts">Girls T-Shirts</option>
              <option value="Unisex T-Shirts">Unisex T-Shirts</option>
              <option value="Hoodies">Hoodies</option>
              <option value="Summer Outfits">Summer Outfits</option>
              <option value="Sweatshirts">Sweatshirts</option>
              <option value="Graphic T-Shirts">Graphic T-Shirts</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Price (₹)</label>
            <input type="number" step="0.01" className="form-control" name="price" value={formData.price} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">Stock Quantity</label>
            <input type="number" className="form-control" name="stock" value={formData.stock} onChange={handleChange} required />
          </div>
        </div>
        
        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea className="form-control" name="description" value={formData.description} onChange={handleChange} rows="3"></textarea>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label className="form-label">Available Sizes</label>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {AVAILABLE_SIZES.map(size => (
                <button
                  type="button"
                  key={size}
                  onClick={() => handleSizeToggle(size)}
                  style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    border: `1px solid ${selectedSizes.includes(size) ? 'var(--primary-color)' : 'var(--border-color)'}`,
                    backgroundColor: selectedSizes.includes(size) ? 'rgba(59, 130, 246, 0.1)' : 'var(--surface-color)',
                    color: selectedSizes.includes(size) ? 'var(--primary-color)' : 'var(--text-main)',
                    cursor: 'pointer'
                  }}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Product Image</label>
            <input type="file" className="form-control" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />
            {product && product.image_url && <small style={{ color: 'var(--text-muted)' }}>Leave blank to keep current image</small>}
          </div>
          <div className="form-group">
            <label className="form-label">3D Model (GLB/GLTF) - Required for AR</label>
            <input type="file" className="form-control" accept=".glb,.gltf" onChange={(e) => setModelFile(e.target.files[0])} />
            {product && product.ar_model_url && <small style={{ color: 'var(--text-muted)' }}>Leave blank to keep current model</small>}
          </div>
        </div>

        <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
          <button type="button" className="btn btn-secondary" onClick={onSuccess}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : 'Save Product'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
