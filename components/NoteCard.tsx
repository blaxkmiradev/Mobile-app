
import React from 'react';
import { Note } from '../types';
import { ICONS } from '../constants';

interface NoteCardProps {
  note: Note;
  onClick: (note: Note) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
}

const NoteCard: React.FC<NoteCardProps> = ({ note, onClick, onDelete }) => {
  const dateStr = new Date(note.updatedAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric'
  });

  return (
    <div
      onClick={() => onClick(note)}
      className="relative group cursor-pointer rounded-3xl p-5 h-fit flex flex-col gap-3 transition-all hover:shadow-md border border-transparent hover:border-slate-200"
      style={{ backgroundColor: note.color || '#f7f2fa' }}
    >
      <div className="flex justify-between items-start">
        <h3 className="m3-font font-medium text-lg leading-tight line-clamp-2 pr-6">
          {note.title || 'Untitled'}
        </h3>
        <button
          onClick={(e) => onDelete(note.id, e)}
          className="opacity-0 group-hover:opacity-100 absolute top-3 right-3 p-2 text-slate-500 hover:text-red-500 hover:bg-white/50 rounded-full transition-all"
        >
          {ICONS.trash}
        </button>
      </div>
      
      <p className="text-slate-600 text-sm line-clamp-4 leading-relaxed">
        {note.content || 'No content...'}
      </p>

      <div className="mt-auto pt-2 flex justify-end">
        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
          {dateStr}
        </span>
      </div>
    </div>
  );
};

export default NoteCard;
