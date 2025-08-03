'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';
import Button from '../common/Button';
import Input from '../common/Input';
import { validateForm } from '../../utils/validation';

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  const { register, user } = useAuth();

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
    
    // Custom validation for password confirmation
    const customValidation = {};
    if (formData.password !== formData.confirmPassword) {
      customValidation.confirmPassword = 'Passwords do not match';
    }

    // Validate form
    const validation = validateForm(formData, {
      displayName: {
        required: true,
        label: 'Full Name',
        validate: (value) => value.trim().length >= 2,
        message: 'Name must be at least 2 characters long'
      },
      email: {
        required: true,
        label: 'Email',
        validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        message: 'Please enter a valid email address'
      },
      password: {
        required: true,
        label: 'Password',
        validate: (value) => value.length >= 6,
        message: 'Password must be at least 6 characters long'
      },
      confirmPassword: {
        required: true,
        label: 'Confirm Password'
      }
    });

    const allErrors = { ...validation.errors, ...customValidation };

    if (!validation.isValid || Object.keys(customValidation).length > 0) {
      setErrors(allErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const result = await register(formData.email, formData.password, formData.displayName);
      
      if (result.success) {
        router.push('/login');
      }
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link
              href="/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              sign in to your existing account
            </Link>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              name="displayName"
              value={formData.displayName}
              onChange={handleChange}
              error={errors.displayName}
              required
              autoComplete="name"
            />

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
              autoComplete="new-password"
            />

            <Input
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              required
              autoComplete="new-password"
            />
          </div>

          <Button
            type="submit"
            loading={loading}
            className="w-full"
          >
            Create Account
          </Button>

          <p className="text-xs text-gray-500 text-center">
            By creating an account, you agree to our Terms of Service and Privacy Policy.
          </p>
        </form>
      </div>
    </div>
  );
}