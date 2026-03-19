import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('http://localhost:5000/api/auth/register', { name, email, password });
      login(data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '4rem auto', backgroundColor: 'var(--surface-color)', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
      <h2 className="text-center mb-4">Register</h2>
      {error && <div style={{ color: 'var(--danger-color)', marginBottom: '1rem', textAlign: 'center', backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '0.5rem', borderRadius: 'var(--radius-sm)' }}>{error}</div>}
      <form onSubmit={submitHandler}>
        <div className="form-group">
          <label className="form-label">Name</label>
          <input type="text" required className="form-control" placeholder="Enter name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input type="email" required className="form-control" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="form-group mb-4">
          <label className="form-label">Password</label>
          <input type="password" required className="form-control" placeholder="Create password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit" className="btn btn-primary mb-3" style={{ width: '100%' }}>Register</button>
          <div className="text-center" style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Already have an account? <Link to="/login" style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>Login</Link>
          </div>
        </form>
      </div>
    );
  };
  export default Register;
