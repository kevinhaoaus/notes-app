'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { useNotes } from '../../hooks/useNotes';

export default function NoteCard({ note }) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { deleteNote, togglePin } = useNotes();

  const handleDelete = async () => {
    const result = await deleteNote(note.id);
    setShowDeleteConfirm(false);
  };

  const handleTogglePin = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await togglePin(note);
  };

  const getColorClasses = (color) => {
    const colorMap = {
      yellow: 'bg-yellow-100 border-yellow-300 hover:bg-yellow-200',
      blue: 'bg-blue-100 border-blue-300 hover:bg-blue-200',
      green: 'bg-green-100 border-green-300 hover:bg-green-200',
      pink: 'bg-pink-100 border-pink-300 hover:bg-pink-200',
      purple: 'bg-purple-100 border-purple-300 hover:bg-purple-200',
      gray: 'bg-gray-100 border-gray-300 hover:bg-gray-200'
    };
    return colorMap[color] || colorMap.yellow;
  };

  const truncateText = (text, maxLength = 150) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <>
      <div className={`relative p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-md cursor-pointer ${getColorClasses(note.color)}`}>
        {/* Pin indicator */}
        {note.isPinned && (
          <div className="absolute top-2 right-2">
            <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4 3a2 2 0 00-2 2v1.816a2 2 0 00.586 1.414L5.5 11.243V14a2 2 0 002 2h5a2 2 0 002-2v-2.757l2.914-3.013A2 2 0 0018 6.816V5a2 2 0 00-2-2H4z" />
            </svg>
          </div>
        )}

        {/* Note content */}
        <Link href={`/note/${note.id}`} className="block">
          <h3 className="text-lg font-semibold text-gray-800 mb-2 pr-6">
            {note.title || 'Untitled'}
          </h3>
          <p className="text-gray-600 text-sm mb-3">
            {truncateText(note.content) || 'No content'}
          </p>
        </Link>

        {/* Tags */}
        {note.tags && note.tags.length > 0 && (
          <div className="mb-3">
            {note.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-block px-2 py-1 text-xs bg-white rounded-full mr-1 mb-1 text-gray-700"
              >
                #{tag}
              </span>
            ))}
            {note.tags.length > 3 && (
              <span className="text-xs text-gray-500">+{note.tags.length - 3} more</span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>
            {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
          </span>
          
          <div className="flex space-x-2">
            {/* Pin/Unpin button */}
            <button
              onClick={handleTogglePin}
              className="p-1 hover:bg-white rounded transition-colors"
              title={note.isPinned ? 'Unpin note' : 'Pin note'}
            >
              <svg className="w-4 h-4" fill={note.isPinned ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </button>

            {/* Delete button */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowDeleteConfirm(true);
              }}
              className="p-1 hover:bg-white rounded transition-colors text-red-500"
              title="Delete note"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm mx-4">
            <h3 className="text-lg font-semibold mb-2">Delete Note</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete this note? This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}