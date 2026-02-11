
export interface Note {
  id: string;
  title: string;
  content: string;
  updatedAt: number;
  createdAt: number;
  color?: string;
}

export type ViewMode = 'list' | 'editor';

export interface StorageState {
  notes: Note[];
}
