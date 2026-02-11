
import React, { useState, useEffect, useMemo } from 'react';
import { Note, ViewMode } from './types';
import { storageService } from './services/storageService';
import NoteCard from './components/NoteCard';
import NoteEditor from './components/NoteEditor';
import EmptyState from './components/EmptyState';
import { ICONS } from './constants';

/**
 * This React version serves as the high-fidelity simulator for the 
 * Native Android code provided in the source files.
 */
const App: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setNotes(storageService.getNotes());
  }, []);

  const triggerHaptic = (style: 'light' | 'medium' | 'heavy' = 'light') => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      const patterns = { light: 10, medium: 30, heavy: [50, 30, 50] };
      navigator.vibrate(patterns[style]);
    }
  };

  const filteredNotes = useMemo(() => {
    if (!searchQuery.trim()) return notes;
    const q = searchQuery.toLowerCase();
    return notes.filter(n => n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q));
  }, [notes, searchQuery]);

  const handleAddNote = () => {
    triggerHaptic('light');
    setActiveNote(null);
    setViewMode('editor');
  };

  const handleEditNote = (note: Note) => {
    triggerHaptic('light');
    setActiveNote(note);
    setViewMode('editor');
  };

  const handleSaveNote = (title: string, content: string, color: string) => {
    if (!title && !content) return; 
    triggerHaptic('medium');
    if (activeNote) {
      storageService.updateNote({ ...activeNote, title, content, color });
    } else {
      storageService.addNote({ title, content, color });
    }
    setNotes(storageService.getNotes());
  };

  const handleDeleteNote = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    triggerHaptic('heavy');
    if (confirm("Delete this note?")) {
      storageService.deleteNote(id);
      setNotes(storageService.getNotes());
    }
  };

  return (
    <div className="h-full w-full bg-[#fef7ff] overflow-hidden">
      {viewMode === 'list' ? (
        <div className="flex flex-col h-full animate-in fade-in duration-500 overflow-hidden">
          <header className="px-6 pt-12 pb-6 shrink-0">
            <h1 className="m3-font text-4xl font-bold mb-6 text-slate-800 tracking-tight">Notedpad</h1>
            <div className="relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#6750A4] transition-colors">{ICONS.search}</div>
              <input
                type="text"
                placeholder="Search your notes"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 pl-12 pr-4 bg-[#f3edf7] rounded-full border-none outline-none focus:bg-white focus:ring-1 focus:ring-[#6750A4] transition-all text-slate-800"
              />
            </div>
          </header>
          <main className="flex-1 overflow-y-auto px-6 pb-32">
            {filteredNotes.length === 0 ? <EmptyState message={searchQuery ? "No matches" : "Empty list"} /> : (
              <div className="grid grid-cols-2 gap-3">
                {filteredNotes.map(note => <NoteCard key={note.id} note={note} onClick={handleEditNote} onDelete={handleDeleteNote} />)}
              </div>
            )}
          </main>
          <button onClick={handleAddNote} className="fixed bottom-8 right-8 w-16 h-16 flex items-center justify-center bg-[#D0BCFF] text-[#21005D] rounded-2xl shadow-lg active:scale-90 transition-all z-50">
            {ICONS.plus}
          </button>
        </div>
      ) : (
        <NoteEditor note={activeNote} onSave={handleSaveNote} onBack={() => setViewMode('list')} />
      )}
    </div>
  );
};

export default App;
