import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { User, ShieldAlert } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      login(data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    }
  };

  return (
    <div className="container" style={{ padding: '6rem 0', minHeight: '70vh' }}>
      
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 300, marginBottom: '1rem' }}>Login</h1>
        <p style={{ color: 'var(--text-muted)' }}>Welcome back to Tees. Please enter your details.</p>
      </div>

      <div style={{ display: 'flex', gap: '3rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        
        {/* Customer Login Section */}
        <div style={{ flex: '1 1 400px', maxWidth: '500px', border: '1px solid black', padding: '3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid #e5e5e5', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
            <User size={24} />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 300, margin: 0 }}>Customer</h2>
          </div>
          
          {error && <div style={{ color: 'var(--danger-color)', marginBottom: '1.5rem', padding: '1rem', border: '1px solid var(--danger-color)', fontSize: '0.9rem' }}>{error}</div>}
          
          <form onSubmit={submitHandler}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.05em', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Email Address *</label>
              <input 
                type="email" 
                required 
                style={{ width: '100%', padding: '1rem', border: '1px solid #e5e5e5', fontSize: '1rem', borderRadius: 0, outline: 'none' }} 
                placeholder="Enter email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
              />
            </div>
            <div style={{ marginBottom: '2.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.05em', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Password *</label>
              <input 
                type="password" 
                required 
                style={{ width: '100%', padding: '1rem', border: '1px solid #e5e5e5', fontSize: '1rem', borderRadius: 0, outline: 'none' }} 
                placeholder="Enter password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
              />
            </div>
            
            <button type="submit" className="btn btn-primary btn-dark" style={{ width: '100%', padding: '1.25rem' }}>SIGN IN</button>
            
            <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              New customer? <Link to="/register" style={{ color: 'black', fontWeight: 600, borderBottom: '1px solid black' }}>Create an account</Link>
            </div>
            
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
               <Link to="/admin-login" style={{ fontSize: '0.8rem', color: '#999', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                 <ShieldAlert size={14} /> Admin Portal
               </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
