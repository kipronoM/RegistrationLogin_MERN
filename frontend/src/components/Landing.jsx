import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMe, getProtectedData } from '../api';

const Landing = () => {
  const [user, setUser] = useState(null);
  const [protectedData, setProtectedData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        // Get user data from API
        const userResponse = await getMe();
        setUser(userResponse.data);

        // Get protected data example
        const protectedResponse = await getProtectedData();
        setProtectedData(protectedResponse.data);

      } catch (err) {
        setError('Failed to fetch user data');
        if (err.response?.status === 401) {
          logout();
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="landing-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="landing-container">
        <div className="error-message">{error}</div>
        <button onClick={logout}>Go to Login</button>
      </div>
    );
  }

  return (
    <div className="landing-container">
      <div className="landing-card">
        <div className="header">
          <h1>Welcome to Dashboard</h1>
          <button onClick={logout} className="logout-btn">
            Logout
          </button>
        </div>

        {user && (
          <div className="user-info">
            <h2>User Information</h2>
            <div className="info-item">
              <strong>ID:</strong> {user.id}
            </div>
            <div className="info-item">
              <strong>Name:</strong> {user.name}
            </div>
            <div className="info-item">
              <strong>Email:</strong> {user.email}
            </div>
          </div>
        )}

        {protectedData && (
          <div className="protected-data">
            <h2>Protected Route Data</h2>
            <p>{protectedData.message}</p>
            <div className="user-details">
              <strong>Authenticated User:</strong> {protectedData.user.name}
            </div>
          </div>
        )}

        <div className="features">
          <h2>Dashboard Features</h2>
          <ul>
            <li>✅ JWT Authentication</li>
            <li>✅ Protected Routes</li>
            <li>✅ User Session Management</li>
            <li>✅ Secure Password Hashing</li>
            <li>✅ Input Validation</li>
            <li>✅ Vite Fast Refresh</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Landing;