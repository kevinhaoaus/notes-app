'use client';

import AuthGuard from '../../components/auth/AuthGuard';
import Header from '../../components/layout/Header';
import NoteForm from '../../components/notes/NoteForm';

function CreateNoteContent() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create New Note</h1>
          <p className="text-gray-600 mt-2">
            Start writing your thoughts, ideas, and reminders.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <NoteForm />
        </div>
      </main>
    </div>
  );
}

export default function CreateNotePage() {
  return (
    <AuthGuard>
      <CreateNoteContent />
    </AuthGuard>
  );
}