import { useNotesContext } from '../contexts/NotesContext';
import { toast } from 'react-hot-toast';

export function useNotes() {
  const {
    notes,
    filteredNotes,
    loading,
    error,
    searchTerm,
    sortBy,
    sortOrder,
    selectedColor,
    selectedTags,
    createNote,
    updateNote,
    deleteNote,
    setSearchTerm,
    setSorting,
    setColorFilter,
    setTagFilter,
    clearError
  } = useNotesContext();

  const handleCreateNote = async (noteData) => {
    try {
      const result = await createNote(noteData);
      
      if (result.success) {
        toast.success('Note created successfully!');
        return { success: true, note: result.note };
      } else {
        toast.error(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      toast.error('Failed to create note: ' + error.message);
      return { success: false, error: 'Failed to create note: ' + error.message };
    }
  };

  const handleUpdateNote = async (noteId, updates) => {
    try {
      const result = await updateNote(noteId, updates);
      
      if (result.success) {
        toast.success('Note updated successfully!');
        return { success: true, note: result.note };
      } else {
        toast.error(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      toast.error('Failed to update note');
      return { success: false, error: 'Failed to update note' };
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      const result = await deleteNote(noteId);
      
      if (result.success) {
        toast.success('Note deleted successfully!');
        return { success: true };
      } else {
        toast.error(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      toast.error('Failed to delete note');
      return { success: false, error: 'Failed to delete note' };
    }
  };

  const handleTogglePin = async (note) => {
    const updates = { isPinned: !note.isPinned };
    const result = await handleUpdateNote(note.id, updates);
    
    if (result.success) {
      toast.success(note.isPinned ? 'Note unpinned' : 'Note pinned');
    }
    
    return result;
  };

  const handleSortChange = (newSortBy) => {
    const newSortOrder = sortBy === newSortBy && sortOrder === 'desc' ? 'asc' : 'desc';
    setSorting(newSortBy, newSortOrder);
  };

  // Get unique tags from all notes
  const getAllTags = () => {
    const allTags = new Set();
    notes.forEach(note => {
      note.tags?.forEach(tag => allTags.add(tag));
    });
    return Array.from(allTags).sort();
  };

  // Get notes count by color
  const getNotesByColor = () => {
    const colorCount = {};
    notes.forEach(note => {
      const color = note.color || 'yellow';
      colorCount[color] = (colorCount[color] || 0) + 1;
    });
    return colorCount;
  };

  // Get pinned notes
  const getPinnedNotes = () => {
    return filteredNotes.filter(note => note.isPinned);
  };

  // Get unpinned notes
  const getUnpinnedNotes = () => {
    return filteredNotes.filter(note => !note.isPinned);
  };

  return {
    // State
    notes,
    filteredNotes,
    loading,
    error,
    searchTerm,
    sortBy,
    sortOrder,
    selectedColor,
    selectedTags,
    
    // Operations
    createNote: handleCreateNote,
    updateNote: handleUpdateNote,
    deleteNote: handleDeleteNote,
    togglePin: handleTogglePin,
    
    // Filters and search
    setSearchTerm,
    setSorting: handleSortChange,
    setColorFilter,
    setTagFilter,
    clearError,
    
    // Utility functions
    getAllTags,
    getNotesByColor,
    getPinnedNotes,
    getUnpinnedNotes,
    
    // Computed values
    totalNotes: notes.length,
    hasNotes: notes.length > 0,
    isEmpty: notes.length === 0
  };
}