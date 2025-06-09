export interface Note {
  id: number;
  title: string;
  content: string;
  tag: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  notes: T[];
  totalPages: number;
}

export type Tag = "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";
