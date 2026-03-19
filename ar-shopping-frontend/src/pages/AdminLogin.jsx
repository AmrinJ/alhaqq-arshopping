import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { ShieldAlert } from 'lucide-react';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      
      // Verify that this user actually has admin privileges in the DB as a fallback
      if (data.role !== 'admin') {
        setError("Access Denied: You do not have administrator privileges.");
        return; // Stop the login process
      }
      
      login(data);
      navigate('/admin'); // Redirect straight to dashboard on success
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    }
  };

  return (
    <div className="admin-card animate-fade-in-up">
      <div className="admin-icon-wrapper">
        <ShieldAlert size={56} color="var(--danger-color)" />
      </div>
      <h2 className="text-center mb-1" style={{ fontSize: '2rem', fontWeight: '300' }}>Admin Portal</h2>
      <p className="text-center mb-5" style={{ color: 'var(--text-muted)' }}>Secure login for authorized personnel only.</p>
      
      {error && <div className="admin-error-box">{error}</div>}
      
      <form onSubmit={submitHandler}>
        <div className="form-group mb-4">
          <label className="form-label">Admin Email</label>
          <input type="email" required className="form-control" placeholder="Enter administrative email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="form-group mb-5">
          <label className="form-label">Password</label>
          <input type="password" required className="form-control" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit" className="btn btn-danger-solid" style={{ fontWeight: '600', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          Secure Login
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
