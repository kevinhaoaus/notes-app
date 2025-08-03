'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '../../hooks/useAuth';
import Button from '../common/Button';

export default function Header() {
  const { user, logout, isAuthenticated } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center">
            <svg className="w-8 h-8 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="text-xl font-bold text-gray-900">Notes</span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center space-x-4">
            <Link 
              href="/create"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Note
            </Link>

            {/* User menu */}
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-700">
                {user?.displayName || user?.email}
              </span>
              <Button variant="outline" onClick={handleLogout} className="text-sm">
                Logout
              </Button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}