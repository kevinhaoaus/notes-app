'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AuthGuard from '../../../components/auth/AuthGuard';
import Header from '../../../components/layout/Header';
import NoteForm from '../../../components/notes/NoteForm';
import Button from '../../../components/common/Button';
import { getNoteById } from '../../../services/api/notesAPI';
import { formatDistanceToNow } from 'date-fns';

function NoteDetailContent() {
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  
  const params = useParams();
  const router = useRouter();
  const noteId = params.id;

  useEffect(() => {
    const fetchNote = async () => {
      try {
        setLoading(true);
        const fetchedNote = await getNoteById(noteId);
        setNote(fetchedNote);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (noteId) {
      fetchNote();
    }
  }, [noteId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading note...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !note) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Note not found</h3>
            <p className="text-gray-500 mb-4">The note you're looking for doesn't exist or has been deleted.</p>
            <Button onClick={() => router.push('/dashboard')}>
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const getColorClasses = (color) => {
    const colorMap = {
      yellow: 'bg-yellow-50 border-yellow-200',
      blue: 'bg-blue-50 border-blue-200',
      green: 'bg-green-50 border-green-200',
      pink: 'bg-pink-50 border-pink-200',
      purple: 'bg-purple-50 border-purple-200',
      gray: 'bg-gray-50 border-gray-200'
    };
    return colorMap[color] || colorMap.yellow;
  };

  if (isEditing) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit Note</h1>
              <p className="text-gray-600 mt-2">Make changes to your note.</p>
            </div>
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel Edit
            </Button>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <NoteForm noteId={noteId} initialData={note} />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {note.title || 'Untitled'}
            </h1>
            <p className="text-gray-600 mt-2">
              {note.isPinned && '📌 Pinned • '}
              Last updated {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
            </p>
          </div>
          <Button onClick={() => setIsEditing(true)}>
            Edit Note
          </Button>
        </div>

        <div className={`bg-white rounded-lg shadow-sm border p-6 ${getColorClasses(note.color)}`}>
          {/* Tags */}
          {note.tags && note.tags.length > 0 && (
            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                {note.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-block px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Content */}
          <div className="prose max-w-none">
            {note.content ? (
              <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                {note.content}
              </div>
            ) : (
              <div className="text-gray-500 italic">
                No content in this note.
              </div>
            )}
          </div>

          {/* Metadata */}
          <div className="mt-8 pt-6 border-t border-gray-200 text-sm text-gray-500">
            <div className="flex justify-between">
              <span>Created {formatDistanceToNow(new Date(note.createdAt), { addSuffix: true })}</span>
              <span>Note ID: {note.id}</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function NoteDetailPage() {
  return (
    <AuthGuard>
      <NoteDetailContent />
    </AuthGuard>
  );
}