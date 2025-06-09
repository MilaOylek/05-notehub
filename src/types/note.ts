export type Tag = "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";

export interface Note {
  id: number;
  title: string;
  content: string;
  tag: Tag;
}

export interface PaginatedResponse<T> {
  notes: T[];
  totalPages: number;
  currentPage: number;
}

export interface CreateNotePayload {
  title: string;
  content: string;
  tag: Tag;
}