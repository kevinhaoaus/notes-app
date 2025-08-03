'use client';

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
  sortOrder: 'desc',
  selectedColor: '',
  selectedTags: []
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
  SET_COLOR_FILTER: 'SET_COLOR_FILTER',
  SET_TAG_FILTER: 'SET_TAG_FILTER',
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
    
    case NOTES_ACTIONS.SET_COLOR_FILTER:
      return { ...state, selectedColor: action.payload };
    
    case NOTES_ACTIONS.SET_TAG_FILTER:
      return { ...state, selectedTags: action.payload };
    
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
        console.error('NotesContext - subscription error:', error);
        dispatch({ type: NOTES_ACTIONS.SET_ERROR, payload: error.message });
      }
    );

    return unsubscribe;
  }, [user]);

  // Filter and sort notes based on current state
  const getFilteredNotes = () => {
    let filtered = [...state.notes];

    // Apply search filter
    if (state.searchTerm) {
      const searchLower = state.searchTerm.toLowerCase();
      filtered = filtered.filter(note => {
        const titleMatch = note.title?.toLowerCase().includes(searchLower);
        const contentMatch = note.content?.toLowerCase().includes(searchLower);
        const tagMatch = note.tags?.some(tag => tag.toLowerCase().includes(searchLower));
        return titleMatch || contentMatch || tagMatch;
      });
    }

    // Apply color filter
    if (state.selectedColor) {
      filtered = filtered.filter(note => note.color === state.selectedColor);
    }

    // Apply tag filter
    if (state.selectedTags.length > 0) {
      filtered = filtered.filter(note =>
        state.selectedTags.some(tag => note.tags?.includes(tag))
      );
    }

    // Sort notes
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (state.sortBy) {
        case 'title':
          aValue = a.title?.toLowerCase() || '';
          bValue = b.title?.toLowerCase() || '';
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        case 'updatedAt':
        default:
          aValue = new Date(a.updatedAt);
          bValue = new Date(b.updatedAt);
          break;
      }

      if (state.sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    // Separate pinned notes
    const pinnedNotes = filtered.filter(note => note.isPinned);
    const unpinnedNotes = filtered.filter(note => !note.isPinned);

    return [...pinnedNotes, ...unpinnedNotes];
  };

  // Notes operations
  const notesOperations = {
    createNote: async (noteData) => {
      try {
        if (!user || !user.uid) {
          throw new Error('User not authenticated');
        }
        
        const note = await createNote(user.uid, noteData);
        return { success: true, note };
      } catch (error) {
        console.error('NotesContext createNote error:', error);
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

    setColorFilter: (color) => {
      dispatch({ type: NOTES_ACTIONS.SET_COLOR_FILTER, payload: color });
    },

    setTagFilter: (tags) => {
      dispatch({ type: NOTES_ACTIONS.SET_TAG_FILTER, payload: tags });
    },

    clearError: () => {
      dispatch({ type: NOTES_ACTIONS.CLEAR_ERROR });
    }
  };

  const value = {
    ...state,
    ...notesOperations,
    filteredNotes: getFilteredNotes()
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