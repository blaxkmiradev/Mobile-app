
import { Note } from '../types';

const STORAGE_KEY = 'notedpad_db';

export const storageService = {
  getNotes: (): Note[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return [];
      const parsed = JSON.parse(data);
      return (parsed.notes || []).sort((a: Note, b: Note) => b.updatedAt - a.updatedAt);
    } catch (e) {
      console.error("Failed to load notes", e);
      return [];
    }
  },

  saveNotes: (notes: Note[]): void => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ notes }));
    } catch (e) {
      console.error("Failed to save notes", e);
    }
  },

  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Note => {
    const notes = storageService.getNotes();
    const newNote: Note = {
      ...note,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    storageService.saveNotes([newNote, ...notes]);
    return newNote;
  },

  updateNote: (updatedNote: Note): void => {
    const notes = storageService.getNotes();
    const updatedNotes = notes.map(n => 
      n.id === updatedNote.id ? { ...updatedNote, updatedAt: Date.now() } : n
    );
    storageService.saveNotes(updatedNotes);
  },

  deleteNote: (id: string): void => {
    const notes = storageService.getNotes();
    storageService.saveNotes(notes.filter(n => n.id !== id));
  }
};
