'use client';

import { useAuth } from '../../hooks/useAuth';
import { useNotes } from '../../hooks/useNotes';
import AuthGuard from '../../components/auth/AuthGuard';
import Header from '../../components/layout/Header';
import SearchBar from '../../components/notes/SearchBar';
import NotesList from '../../components/notes/NotesList';

function DashboardContent() {
  const { user } = useAuth();
  const { totalNotes, hasNotes } = useNotes();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.displayName || user?.email?.split('@')[0]}!
          </h1>
          <p className="text-gray-600 mt-2">
            {hasNotes ? `You have ${totalNotes} note${totalNotes === 1 ? '' : 's'}` : 'Start by creating your first note'}
          </p>
        </div>

        {/* Search and filters */}
        <SearchBar />

        {/* Notes list */}
        <NotesList />
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  );
}