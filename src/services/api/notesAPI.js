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
  getDoc,
  getDocs
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
      const notes = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
          updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString()
        };
      });
      
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
    throw new Error('Failed to create note: ' + error.message);
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

// Search notes by title and content
export async function searchUserNotes(userId, searchTerm) {
  try {
    const q = query(
      notesCollection,
      where('userId', '==', userId),
      orderBy('updatedAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    const allNotes = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString(),
      updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString()
    }));

    // Filter notes on client side (Firestore doesn't support full-text search)
    const filteredNotes = allNotes.filter(note => {
      const searchLower = searchTerm.toLowerCase();
      const titleMatch = note.title?.toLowerCase().includes(searchLower);
      const contentMatch = note.content?.toLowerCase().includes(searchLower);
      const tagMatch = note.tags?.some(tag => tag.toLowerCase().includes(searchLower));
      
      return titleMatch || contentMatch || tagMatch;
    });

    return filteredNotes;
  } catch (error) {
    console.error('Error searching notes:', error);
    throw new Error('Failed to search notes');
  }
}