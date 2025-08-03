'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';
import Button from '../common/Button';
import Input from '../common/Input';
import { validateForm } from '../../utils/validation';

export default function LoginForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  const { login, user } = useAuth();

  // Redirect if already logged in
  React.useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const validation = validateForm(formData, {
      email: {
        required: true,
        label: 'Email',
        validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        message: 'Please enter a valid email address'
      },
      password: {
        required: true,
        label: 'Password'
      }
    });

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link
              href="/register"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              create a new account
            </Link>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input
              label="Email address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              required
              autoComplete="email"
            />
            
            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              required
              autoComplete="current-password"
            />
          </div>

          <div className="flex items-center justify-between">
            <Link
              href="/reset-password"
              className="text-sm text-blue-600 hover:text-blue-500"
            >
              Forgot your password?
            </Link>
          </div>

          <Button
            type="submit"
            loading={loading}
            className="w-full"
          >
            Sign in
          </Button>
        </form>
      </div>
    </div>
  );
}