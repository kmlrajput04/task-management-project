import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import AuthLayout from '../components/auth/AuthLayout';
import LoginForm from '../components/auth/LoginForm';
import useAuth from '../hooks/useAuth';
import authService from '../services/auth.service';

export const LoginPage = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleLoginSubmit = async (credentials) => {
    try {
      setLoading(true);
      setError('');
      
      const res = await authService.login(credentials);
      if (res.success && res.data) {
        login(res.data);
        toast.success('Signed in successfully');
        navigate('/', { replace: true });
      } else {
        setError('Login failed: Invalid server response.');
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
      toast.error(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <LoginForm onSubmit={handleLoginSubmit} loading={loading} error={error} />
    </AuthLayout>
  );
};

export default LoginPage;
