}

### Phase 4: UI Components Development

#### 4.1 Notes Components
**File**: `src/components/notes/NoteCard.js`

```javascript
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { useNotesContext } from '../../contexts/NotesContext';
import { toast } from 'react-hot-toast';

function NoteCard({ note }) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { deleteNote, updateNote } = useNotesContext();

  const handleDelete = async () => {
    const result = await deleteNote(note.id);
    if (result.success) {
      toast.success('Note deleted successfully');
    } else {
      toast.error(result.error);
    }
    setShowDeleteConfirm(false);
  };

  const handleTogglePin = async () => {
    const result = await updateNote(note.id, { isPinned: !note.isPinned });
    if (result.success) {
      toast.success(note.isPinned ? 'Note unpinned' : 'Note pinned');
    } else {
      toast.error(result.error);
    }
  };

  const getColorClasses = (color) => {
    const colorMap = {
      yellow: 'bg-yellow-100 border-yellow-300',
      blue: 'bg-blue-100 border-blue-300',
      green: 'bg-green-100 border-green-300',
      pink: 'bg-pink-100 border-pink-300',
      purple: 'bg-purple-100 border-purple-300',
      gray: 'bg-gray-100 border-gray-300'
    };
    return colorMap[color] || colorMap.yellow;
  };

  return (
    <div className={`relative p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-md ${getColorClasses(note.color)}`}>
      {/* Pin indicator */}
      {note.isPinned && (
        <div className="absolute top-2 right-2">
          <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 3a2 2 0 00-2 2v1.816a2 2 0 00.586 1.414L5.5 11.243V14a2 2 0 002 2h5a2 2 0 002-2v-2.757l2.914-3.013A2 2 0 0018 6.816V5a2 2 0 00-2-2H4z" />
          </svg>
        </div>
      )}

      {/* Note content */}
      <Link to={`/note/${note.id}`} className="block">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
          {note.title || 'Untitled'}
        </h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-3">
          {note.content || 'No content'}
        </p>
      </Link>

      {/* Tags */}
      {note.tags && note.tags.length > 0 && (
        <div className="mb-3">
          {note.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="inline-block px-2 py-1 text-xs bg-white rounded-full mr-1 mb-1"
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
            onClick={() => setShowDeleteConfirm(true)}
            className="p-1 hover:bg-white rounded transition-colors text-red-500"
            title="Delete note"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
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
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default NoteCard;
```

**File**: `src/components/notes/NoteForm.js`

```javascript
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useNotesContext } from '../../contexts/NotesContext';
import Button from '../common/Button';
import RichTextEditor from './RichTextEditor';

function NoteForm({ noteId = null, initialData = null }) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    color: 'yellow',
    tags: []
  });
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(!!noteId);

  const navigate = useNavigate();
  const { createNote, updateNote } = useNotesContext();

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

  const handleContentChange = (content) => {
    setFormData(prev => ({
      ...prev,
      content
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
      toast.error('Please add a title or content');
      return;
    }

    setLoading(true);

    try {
      let result;
      
      if (isEditing && noteId) {
        result = await updateNote(noteId, formData);
        if (result.success) {
          toast.success('Note updated successfully');
        }
      } else {
        result = await createNote(formData);
        if (result.success) {
          toast.success('Note created successfully');
          navigate('/');
        }
      }

      if (!result.success) {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
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
            className="w-full text-2xl font-bold border-none outline-none bg-transparent placeholder-gray-400"
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
                    ? 'border-gray-800' 
                    : 'border-gray-300'
                }`}
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
              className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleAddTag(e);
                }
              }}
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
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
          <RichTextEditor
            value={formData.content}
            onChange={handleContentChange}
            placeholder="Start writing your note..."
          />
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/')}
          >
            Cancel
          </Button>
          
          <div className="flex space-x-3">
            <Button
              type="submit"
              loading={loading}
            >
              {isEditing ? 'Update Note' : 'Create Note'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default NoteForm;
```

**File**: `src/components/notes/SearchBar.js`

```javascript
import React, { useState, useEffect } from 'react';
import { useNotesContext } from '../../contexts/NotesContext';

function SearchBar() {
  const [localSearchTerm, setLocalSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const { searchTerm, setSearchTerm, sortBy, sortOrder, setSorting } = useNotesContext();

  // Debounced search
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      setSearchTerm(localSearchTerm);
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [localSearchTerm, setSearchTerm]);

  // Initialize local search term
  useEffect(() => {
    setLocalSearchTerm(searchTerm);
  }, [searchTerm]);

  const handleSortChange = (newSortBy) => {
    const newSortOrder = sortBy === newSortBy && sortOrder === 'desc' ? 'asc' : 'desc';
    setSorting(newSortBy, newSortOrder);
  };

  const sortOptions = [
    { value: 'updatedAt', label: 'Last Modified' },
    { value: 'createdAt', label: 'Date Created' },
    { value: 'title', label: 'Title' }
  ];

  return (
    <div className="mb-6 space-y-4">
      {/* Search input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          value={localSearchTerm}
          onChange={(e) => setLocalSearchTerm(e.target.value)}
          placeholder="Search notes..."
          className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        
        {/* Clear search button */}
        {localSearchTerm && (
          <button
            onClick={() => setLocalSearchTerm('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Filters and sorting */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
          </svg>
          <span>Filters</span>
        </button>

        {/* Sort dropdown */}
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
            className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          
          {/* Sort order indicator */}
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <svg 
              className={`w-4 h-4 text-gray-400 transition-transform ${sortOrder === 'asc' ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Extended filters */}
      {showFilters && (
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Color filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Color
              </label>
              <select className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">All colors</option>
                <option value="yellow">Yellow</option>
                <option value="blue">Blue</option>
                <option value="green">Green</option>
                <option value="pink">Pink</option>
                <option value="purple">Purple</option>
                <option value="gray">Gray</option>
              </select>
            </div>

            {/* Date range filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date Range
              </label>
              <select className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">All time</option>
                <option value="today">Today</option>
                <option value="week">This week</option>
                <option value="month">This month</option>
                <option value="year">This year</option>
              </select>
            </div>

            {/* Pin status filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pin Status
              </label>
              <select className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">All notes</option>
                <option value="pinned">Pinned only</option>
                <option value="unpinned">Unpinned only</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchBar;
```

### Phase 5: Page Components

#### 5# Notes App with Firebase Auth & Database - Development Plan

## Project Overview
Build a full-featured personal notes application with user authentication, real-time database synchronization, and persistent data storage using Firebase services. Focus on learning backend integration, authentication flows, and database operations.

## Core Requirements

### Functional Requirements
- User registration and login with email/password
- Password reset functionality via email
- Protected routes requiring authentication
- Create, read, update, delete (CRUD) operations for notes
- Real-time synchronization across devices
- Search and filter notes functionality
- Rich text editing capabilities
- Responsive design for mobile and desktop
- Offline support with data sync when reconnected

### Technical Requirements
- **Frontend**: React.js with functional components and hooks
- **Backend**: Firebase (Firestore database, Authentication)
- **Routing**: React Router v6 for navigation
- **Styling**: Tailwind CSS for responsive design
- **State Management**: React Context API + useReducer
- **Form Handling**: Custom hooks and validation

## File Structure
```
notes-app/
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   ├── LoginForm.js         # Login form component
│   │   │   ├── RegisterForm.js      # Registration form component
│   │   │   ├── ResetPassword.js     # Password reset component
│   │   │   └── AuthGuard.js         # Protected route wrapper
│   │   ├── notes/
│   │   │   ├── NoteCard.js          # Individual note display
│   │   │   ├── NoteForm.js          # Note creation/editing form
│   │   │   ├── NotesList.js         # Notes grid/list container
│   │   │   ├── SearchBar.js         # Search and filter component
│   │   │   └── RichTextEditor.js    # Text editor with formatting
│   │   ├── layout/
│   │   │   ├── Header.js            # App header with navigation
│   │   │   ├── Sidebar.js           # Navigation sidebar
│   │   │   ├── Loading.js           # Loading spinner component
│   │   │   └── ErrorMessage.js      # Error display component
│   │   └── common/
│   │       ├── Button.js            # Reusable button component
│   │       ├── Input.js             # Reusable input component
│   │       └── Modal.js             # Modal dialog component
│   ├── pages/
│   │   ├── Login.js                 # Login page
│   │   ├── Register.js              # Registration page
│   │   ├── Dashboard.js             # Main notes dashboard
│   │   ├── NoteDetail.js            # Individual note view/edit
│   │   └── Profile.js               # User profile settings
│   ├── contexts/
│   │   ├── AuthContext.js           # Authentication state management
│   │   ├── NotesContext.js          # Notes data management
│   │   └── ThemeContext.js          # UI theme management
│   ├── hooks/
│   │   ├── useAuth.js               # Authentication logic hook
│   │   ├── useNotes.js              # Notes operations hook
│   │   ├── useFirestore.js          # Firestore operations hook
│   │   └── useLocalStorage.js       # Local storage management
│   ├── services/
│   │   ├── firebase/
│   │   │   ├── config.js            # Firebase configuration
│   │   │   ├── auth.js              # Authentication functions
│   │   │   ├── firestore.js         # Database operations
│   │   │   └── storage.js           # File storage (optional)
│   │   └── api/
│   │       ├── notesAPI.js          # Notes CRUD operations
│   │       └── userAPI.js           # User management operations
│   ├── utils/
│   │   ├── validation.js            # Form validation helpers
│   │   ├── formatting.js            # Date/text formatting utilities
│   │   ├── constants.js             # App constants and config
│   │   └── helpers.js               # General utility functions
│   ├── styles/
│   │   ├── globals.css              # Global styles and Tailwind imports
│   │   └── components.css           # Component-specific styles
│   ├── App.js                       # Main application component
│   ├── index.js                     # Application entry point
│   └── setupTests.js                # Test configuration
├── .env.example                     # Environment variables template
├── .env.local                       # Local environment variables
├── .gitignore                       # Git ignore configuration
├── package.json                     # Dependencies and scripts
├── tailwind.config.js               # Tailwind CSS configuration
└── README.md                        # Project documentation
```

## Detailed Implementation Plan

### Phase 1: Project Setup and Firebase Configuration

#### 1.1 Initial Project Setup
**Estimated Time**: 2-3 hours

**Create React App and Install Dependencies**:
```bash
# Create React application
npx create-react-app notes-app
cd notes-app

# Install required dependencies
npm install firebase react-router-dom tailwindcss autoprefixer postcss

# Install additional utilities
npm install react-hot-toast date-fns uuid

# Install development dependencies
npm install --save-dev @tailwindcss/forms @tailwindcss/typography
```

**Tailwind CSS Setup**:
```bash
# Initialize Tailwind CSS
npx tailwindcss init -p

# Configure tailwind.config.js
# Add paths to all template files
# Include Tailwind plugins for forms and typography
```

#### 1.2 Firebase Project Configuration
**File**: `src/services/firebase/config.js`

```javascript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration object
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Export the app instance
export default app;
```

**Environment Variables Setup**:
```bash
# .env.local file
REACT_APP_FIREBASE_API_KEY=your_api_key_here
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

**Firebase Security Rules**:
```javascript
// Firestore Security Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Notes are private to each user
    match /notes/{noteId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && 
        request.auth.uid == request.resource.data.userId;
    }
  }
}
```

#### 1.3 Basic App Structure
**File**: `src/App.js`

```javascript
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Context Providers
import { AuthContextProvider } from './contexts/AuthContext';
import { NotesContextProvider } from './contexts/NotesContext';
import { ThemeContextProvider } from './contexts/ThemeContext';

// Components
import AuthGuard from './components/auth/AuthGuard';
import Header from './components/layout/Header';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import NoteDetail from './pages/NoteDetail';
import Profile from './pages/Profile';

// Styles
import './styles/globals.css';

function App() {
  return (
    <ThemeContextProvider>
      <AuthContextProvider>
        <NotesContextProvider>
          <Router>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
              <Header />
              
              <main className="container mx-auto px-4 py-8">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  
                  {/* Protected Routes */}
                  <Route path="/" element={
                    <AuthGuard>
                      <Dashboard />
                    </AuthGuard>
                  } />
                  
                  <Route path="/note/:id" element={
                    <AuthGuard>
                      <NoteDetail />
                    </AuthGuard>
                  } />
                  
                  <Route path="/profile" element={
                    <AuthGuard>
                      <Profile />
                    </AuthGuard>
                  } />
                </Routes>
              </main>
              
              {/* Toast notifications */}
              <Toaster 
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#363636',
                    color: '#fff',
                  },
                }}
              />
            </div>
          </Router>
        </NotesContextProvider>
      </AuthContextProvider>
    </ThemeContextProvider>
  );
}

export default App;
```

### Phase 2: Authentication System Implementation

#### 2.1 Authentication Context and Hooks
**File**: `src/contexts/AuthContext.js`

```javascript
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/firebase/config';

// Initial state
const initialState = {
  user: null,
  loading: true,
  error: null
};

// Action types
const AUTH_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_USER: 'SET_USER',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  LOGOUT: 'LOGOUT'
};

// Reducer function
function authReducer(state, action) {
  switch (action.type) {
    case AUTH_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    
    case AUTH_ACTIONS.SET_USER:
      return { 
        ...state, 
        user: action.payload, 
        loading: false, 
        error: null 
      };
    
    case AUTH_ACTIONS.SET_ERROR:
      return { 
        ...state, 
        error: action.payload, 
        loading: false 
      };
    
    case AUTH_ACTIONS.CLEAR_ERROR:
      return { ...state, error: null };
    
    case AUTH_ACTIONS.LOGOUT:
      return { 
        ...state, 
        user: null, 
        loading: false, 
        error: null 
      };
    
    default:
      return state;
  }
}

// Create context
const AuthContext = createContext();

// Context provider component
export function AuthContextProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        dispatch({
          type: AUTH_ACTIONS.SET_USER,
          payload: {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            emailVerified: user.emailVerified
          }
        });
      } else {
        // User is signed out
        dispatch({ type: AUTH_ACTIONS.LOGOUT });
      }
    });

    // Cleanup subscription
    return unsubscribe;
  }, []);

  const value = {
    ...state,
    dispatch
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthContextProvider');
  }
  return context;
}

export { AUTH_ACTIONS };
```

#### 2.2 Authentication Service Functions
**File**: `src/services/firebase/auth.js`

```javascript
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  sendEmailVerification
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './config';

// Register new user
export async function registerUser(email, password, displayName) {
  try {
    // Create user account
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update user profile with display name
    await updateProfile(user, {
      displayName: displayName
    });

    // Send email verification
    await sendEmailVerification(user);

    // Create user document in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email: email,
      displayName: displayName,
      createdAt: new Date().toISOString(),
      emailVerified: false,
      preferences: {
        theme: 'light',
        notesPerPage: 12,
        defaultNoteColor: 'yellow'
      }
    });

    return {
      success: true,
      user: {
        uid: user.uid,
        email: user.email,
        displayName: displayName,
        emailVerified: user.emailVerified
      }
    };
  } catch (error) {
    return {
      success: false,
      error: getAuthErrorMessage(error.code)
    };
  }
}

// Login user
export async function loginUser(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    return {
      success: true,
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        emailVerified: user.emailVerified
      }
    };
  } catch (error) {
    return {
      success: false,
      error: getAuthErrorMessage(error.code)
    };
  }
}

// Logout user
export async function logoutUser() {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to logout. Please try again.'
    };
  }
}

// Reset password
export async function resetPassword(email) {
  try {
    await sendPasswordResetEmail(auth, email);
    return {
      success: true,
      message: 'Password reset email sent. Check your inbox.'
    };
  } catch (error) {
    return {
      success: false,
      error: getAuthErrorMessage(error.code)
    };
  }
}

// Get user profile data
export async function getUserProfile(uid) {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return {
        success: true,
        data: userDoc.data()
      };
    } else {
      return {
        success: false,
        error: 'User profile not found'
      };
    }
  } catch (error) {
    return {
      success: false,
      error: 'Failed to load user profile'
    };
  }
}

// Helper function to convert Firebase auth error codes to user-friendly messages
function getAuthErrorMessage(errorCode) {
  const errorMessages = {
    'auth/user-not-found': 'No account found with this email address.',
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/email-already-in-use': 'An account with this email already exists.',
    'auth/weak-password': 'Password should be at least 6 characters long.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
    'auth/network-request-failed': 'Network error. Please check your connection.',
    'auth/requires-recent-login': 'Please logout and login again to perform this action.'
  };

  return errorMessages[errorCode] || 'An unexpected error occurred. Please try again.';
}
```

#### 2.3 Authentication Components
**File**: `src/components/auth/LoginForm.js`

```javascript
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { loginUser } from '../../services/firebase/auth';
import { useAuthContext } from '../../contexts/AuthContext';
import Button from '../common/Button';
import Input from '../common/Input';
import { validateEmail, validatePassword } from '../../utils/validation';

function LoginForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { user } = useAuthContext();

  // Redirect if already logged in
  React.useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

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

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const result = await loginUser(formData.email, formData.password);
      
      if (result.success) {
        toast.success('Welcome back!');
        navigate('/');
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
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
              to="/register"
              className="font-medium text-indigo-600 hover:text-indigo-500"
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
              to="/reset-password"
              className="text-sm text-indigo-600 hover:text-indigo-500"
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

export default LoginForm;
```

### Phase 3: Notes Data Management

#### 3.1 Notes Context and State Management
**File**: `src/contexts/NotesContext.js`

```javascript
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useAuthContext } from './AuthContext';
import { 
  subscribeToUserNotes, 
  createNote, 
  updateNote, 
  deleteNote 
} from '../services/api/notesAPI';

// Initial state
const initialState = {
  notes: [],
  loading: true,
  error: null,
  searchTerm: '',
  sortBy: 'updatedAt',
  sortOrder: 'desc'
};

// Action types
const NOTES_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_NOTES: 'SET_NOTES',
  ADD_NOTE: 'ADD_NOTE',
  UPDATE_NOTE: 'UPDATE_NOTE',
  DELETE_NOTE: 'DELETE_NOTE',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_SEARCH_TERM: 'SET_SEARCH_TERM',
  SET_SORT: 'SET_SORT',
  RESET_STATE: 'RESET_STATE'
};

// Reducer function
function notesReducer(state, action) {
  switch (action.type) {
    case NOTES_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    
    case NOTES_ACTIONS.SET_NOTES:
      return { 
        ...state, 
        notes: action.payload, 
        loading: false,
        error: null 
      };
    
    case NOTES_ACTIONS.ADD_NOTE:
      return { 
        ...state, 
        notes: [action.payload, ...state.notes] 
      };
    
    case NOTES_ACTIONS.UPDATE_NOTE:
      return {
        ...state,
        notes: state.notes.map(note =>
          note.id === action.payload.id ? action.payload : note
        )
      };
    
    case NOTES_ACTIONS.DELETE_NOTE:
      return {
        ...state,
        notes: state.notes.filter(note => note.id !== action.payload)
      };
    
    case NOTES_ACTIONS.SET_ERROR:
      return { 
        ...state, 
        error: action.payload, 
        loading: false 
      };
    
    case NOTES_ACTIONS.CLEAR_ERROR:
      return { ...state, error: null };
    
    case NOTES_ACTIONS.SET_SEARCH_TERM:
      return { ...state, searchTerm: action.payload };
    
    case NOTES_ACTIONS.SET_SORT:
      return { 
        ...state, 
        sortBy: action.payload.sortBy,
        sortOrder: action.payload.sortOrder 
      };
    
    case NOTES_ACTIONS.RESET_STATE:
      return initialState;
    
    default:
      return state;
  }
}

// Create context
const NotesContext = createContext();

// Context provider component
export function NotesContextProvider({ children }) {
  const [state, dispatch] = useReducer(notesReducer, initialState);
  const { user } = useAuthContext();

  // Subscribe to user's notes when authenticated
  useEffect(() => {
    if (!user) {
      dispatch({ type: NOTES_ACTIONS.RESET_STATE });
      return;
    }

    dispatch({ type: NOTES_ACTIONS.SET_LOADING, payload: true });

    // Subscribe to real-time updates
    const unsubscribe = subscribeToUserNotes(
      user.uid,
      (notes) => {
        dispatch({ type: NOTES_ACTIONS.SET_NOTES, payload: notes });
      },
      (error) => {
        dispatch({ type: NOTES_ACTIONS.SET_ERROR, payload: error.message });
      }
    );

    return unsubscribe;
  }, [user]);

  // Notes operations
  const notesOperations = {
    createNote: async (noteData) => {
      try {
        const note = await createNote(user.uid, noteData);
        return { success: true, note };
      } catch (error) {
        dispatch({ type: NOTES_ACTIONS.SET_ERROR, payload: error.message });
        return { success: false, error: error.message };
      }
    },

    updateNote: async (noteId, updates) => {
      try {
        const updatedNote = await updateNote(noteId, updates);
        return { success: true, note: updatedNote };
      } catch (error) {
        dispatch({ type: NOTES_ACTIONS.SET_ERROR, payload: error.message });
        return { success: false, error: error.message };
      }
    },

    deleteNote: async (noteId) => {
      try {
        await deleteNote(noteId);
        return { success: true };
      } catch (error) {
        dispatch({ type: NOTES_ACTIONS.SET_ERROR, payload: error.message });
        return { success: false, error: error.message };
      }
    },

    setSearchTerm: (term) => {
      dispatch({ type: NOTES_ACTIONS.SET_SEARCH_TERM, payload: term });
    },

    setSorting: (sortBy, sortOrder) => {
      dispatch({ 
        type: NOTES_ACTIONS.SET_SORT, 
        payload: { sortBy, sortOrder } 
      });
    },

    clearError: () => {
      dispatch({ type: NOTES_ACTIONS.CLEAR_ERROR });
    }
  };

  const value = {
    ...state,
    ...notesOperations
  };

  return (
    <NotesContext.Provider value={value}>
      {children}
    </NotesContext.Provider>
  );
}

// Custom hook to use notes context
export function useNotesContext() {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotesContext must be used within a NotesContextProvider');
  }
  return context;
}

export { NOTES_ACTIONS };
```

#### 3.2 Firestore Database Operations
**File**: `src/services/api/notesAPI.js`

```javascript
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  getDoc
} from 'firebase/firestore';
import { db } from '../firebase/config';

// Collection reference
const notesCollection = collection(db, 'notes');

// Subscribe to user's notes with real-time updates
export function subscribeToUserNotes(userId, onSuccess, onError) {
  const q = query(
    notesCollection,
    where('userId', '==', userId),
    orderBy('updatedAt', 'desc')
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const notes = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || new Date().toISOString()
      }));
      onSuccess(notes);
    },
    onError
  );
}

// Create a new note
export async function createNote(userId, noteData) {
  try {
    const noteWithMetadata = {
      ...noteData,
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      color: noteData.color || 'yellow',
      isPinned: false,
      tags: noteData.tags || []
    };

    const docRef = await addDoc(notesCollection, noteWithMetadata);
    
    // Return the note with the generated ID
    return {
      id: docRef.id,
      ...noteWithMetadata,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error creating note:', error);
    throw new Error('Failed to create note');
  }
}

// Update an existing note
export async function updateNote(noteId, updates) {
  try {
    const noteRef = doc(notesCollection, noteId);
    
    const updateData = {
      ...updates,
      updatedAt: serverTimestamp()
    };

    await updateDoc(noteRef, updateData);
    
    // Get the updated document
    const updatedDoc = await getDoc(noteRef);
    
    if (updatedDoc.exists()) {
      return {
        id: updatedDoc.id,
        ...updatedDoc.data(),
        createdAt: updatedDoc.data().createdAt?.toDate?.()?.toISOString(),
        updatedAt: new Date().toISOString()
      };
    } else {
      throw new Error('Note not found after update');
    }
  } catch (error) {
    console.error('Error updating note:', error);
    throw new Error('Failed to update note');
  }
}

// Delete a note
export async function deleteNote(noteId) {
  try {
    const noteRef = doc(notesCollection, noteId);
    await deleteDoc(noteRef);
  } catch (error) {
    console.error('Error deleting note:', error);
    throw new Error('Failed to delete note');
  }
}

// Get a single note by ID
export async function getNoteById(noteId) {
  try {
    const noteRef = doc(notesCollection, noteId);
    const noteDoc = await getDoc(noteRef);
    
    if (noteDoc.exists()) {
      return {
        id: noteDoc.id,
        ...noteDoc.data(),
        createdAt: noteDoc.data().createdAt?.toDate?.()?.toISOString(),
        updatedAt: noteDoc.data().updatedAt?.toDate?.()?.toISOString()
      };
    } else {
      throw new Error('Note not found');
    }
  } catch (error) {
    console.error('Error fetching note:', error);
    throw new Error('Failed to fetch note');
  }
}

// Toggle note pin status
export async function toggleNotePinStatus(noteId) {
  try {
    const noteRef = doc(notesCollection, noteId);
    const noteDoc = await getDoc(noteRef);
    
    if (noteDoc.exists()) {
      const currentPinStatus = noteDoc.data().isPinned || false;
      await updateNote(noteId, { isPinned: !currentPinStatus });
      return !currentPinStatus;
    } else {
      throw new Error('Note not found');
    }
  } catch (error) {
    console.error('Error toggling pin status:', error);
    throw new Error('Failed to toggle pin status');
  }
}