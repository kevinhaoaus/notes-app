'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useNotes } from '../../hooks/useNotes';
import Button from '../common/Button';

export default function NoteForm({ noteId = null, initialData = null }) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    color: 'yellow',
    tags: []
  });
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(!!noteId);

  const router = useRouter();
  const { createNote, updateNote } = useNotes();

  // Load initial data for editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        content: initialData.content || '',
        color: initialData.color || 'yellow',
        tags: initialData.tags || []
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() && !formData.content.trim()) {
      alert('Please add a title or content to save the note.');
      return;
    }

    setLoading(true);

    try {
      let result;
      
      if (isEditing && noteId) {
        result = await updateNote(noteId, formData);
        if (result.success) {
          router.push(`/note/${noteId}`);
        }
      } else {
        result = await createNote(formData);
        if (result.success) {
          router.push('/dashboard');
        } else {
          console.error('Create note failed:', result.error);
          alert('Failed to create note: ' + result.error);
        }
      }

    } catch (error) {
      console.error('Note operation error:', error);
      alert('An error occurred while saving the note: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const colorOptions = [
    { value: 'yellow', label: 'Yellow', class: 'bg-yellow-200' },
    { value: 'blue', label: 'Blue', class: 'bg-blue-200' },
    { value: 'green', label: 'Green', class: 'bg-green-200' },
    { value: 'pink', label: 'Pink', class: 'bg-pink-200' },
    { value: 'purple', label: 'Purple', class: 'bg-purple-200' },
    { value: 'gray', label: 'Gray', class: 'bg-gray-200' }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Note title..."
            className="w-full text-2xl font-bold border-none outline-none bg-transparent placeholder-gray-400 focus:ring-0"
          />
        </div>

        {/* Color selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Note Color
          </label>
          <div className="flex space-x-2">
            {colorOptions.map((color) => (
              <button
                key={color.value}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, color: color.value }))}
                className={`w-8 h-8 rounded-full border-2 ${color.class} ${
                  formData.color === color.value 
                    ? 'border-gray-800 ring-2 ring-gray-300' 
                    : 'border-gray-300'
                } transition-all duration-200 hover:scale-110`}
                title={color.label}
              />
            ))}
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tags
          </label>
          
          {/* Existing tags */}
          <div className="flex flex-wrap gap-2 mb-2">
            {formData.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
              >
                #{tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>

          {/* Add new tag */}
          <div className="flex">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="Add a tag..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleAddTag(e);
                }
              }}
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 transition-colors"
            >
              Add
            </button>
          </div>
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Content
          </label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="Start writing your note..."
            rows={12}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/dashboard')}
          >
            Cancel
          </Button>
          
          <Button
            type="submit"
            loading={loading}
            disabled={!formData.title.trim() && !formData.content.trim()}
          >
            {isEditing ? 'Update Note' : 'Create Note'}
          </Button>
        </div>
      </form>
    </div>
  );
}