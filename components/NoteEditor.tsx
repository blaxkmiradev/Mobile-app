
import React, { useState, useEffect } from 'react';
import { Note } from '../types';
import { ICONS, MD3_COLORS } from '../constants';

interface NoteEditorProps {
  note: Note | null;
  onSave: (title: string, content: string, color: string) => void;
  onBack: () => void;
}

const NoteEditor: React.FC<NoteEditorProps> = ({ note, onSave, onBack }) => {
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [color, setColor] = useState(note?.color || MD3_COLORS[0]);

  useEffect(() => {
    const timer = setTimeout(() => {
      // Auto-save logic could go here, but for simplicity we save on back
    }, 1000);
    return () => clearTimeout(timer);
  }, [title, content, color]);

  const handleBack = () => {
    onSave(title, content, color);
    onBack();
  };

  return (
    <div className="flex flex-col h-full overflow-hidden animate-in slide-in-from-right duration-300" style={{ backgroundColor: color }}>
      {/* App Bar */}
      <header className="flex items-center justify-between px-4 h-16 shrink-0">
        <button 
          onClick={handleBack}
          className="p-2 hover:bg-black/5 rounded-full transition-colors"
        >
          {ICONS.arrowLeft}
        </button>
        
        <div className="flex gap-2 items-center">
          {MD3_COLORS.map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              className={`w-6 h-6 rounded-full border border-black/10 transition-transform ${color === c ? 'scale-125 ring-2 ring-slate-400' : ''}`}
              style={{ backgroundColor: c }}
            />
          ))}
          <div className="w-px h-6 bg-black/10 mx-2" />
          <button 
            onClick={handleBack}
            className="p-2 hover:bg-black/5 rounded-full transition-colors text-slate-700"
          >
            {ICONS.check}
          </button>
        </div>
      </header>

      {/* Inputs */}
      <main className="flex-1 flex flex-col p-6 overflow-y-auto">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="m3-font text-3xl font-medium bg-transparent border-none outline-none placeholder:text-slate-400 mb-6"
          autoFocus={!note}
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start typing..."
          className="flex-1 bg-transparent border-none outline-none resize-none text-lg leading-relaxed placeholder:text-slate-400"
        />
      </main>
      
      <footer className="h-12 flex items-center px-6 shrink-0 text-xs text-slate-500 font-medium border-t border-black/5">
        Edited {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </footer>
    </div>
  );
};

export default NoteEditor;
