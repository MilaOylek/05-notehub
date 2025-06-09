import axios from "axios";
import { type Note, type PaginatedResponse } from "../types/note";

export type Tag = "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";

const API_BASE_URL = "https://notehub-public.goit.study/api";
const TOKEN = import.meta.env.VITE_NOTEHUB_TOKEN;

if (!TOKEN) {
  console.error(
    "VITE_NOTEHUB_TOKEN is not set. Please check your .env.local file."
  );
}
const notehubApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Authorization: `Bearer ${TOKEN}`,
    "Content-Type": "application/json",
  },
});

export const fetchNotes = async (
  page: number = 1,
  perPage: number = 12,
  search: string = ""
): Promise<PaginatedResponse<Note>> => {
  try {
    const params: { page: number; perPage: number; search?: string } = {
      page,
      perPage,
    };

    if (search) {
      params.search = search;
    }

    const response = await notehubApi.get("/notes", {
      params,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error fetching notes:",
        error.response?.data || error.message
      );
      if (error.response?.data?.validation) {
        console.error("Validation details:", error.response.data.validation);
      }
      throw new Error(error.response?.data?.message || "Failed to fetch notes");
    }
    throw error;
  }
};

export interface CreateNotePayload {
  title: string;
  content: string;
  tag: Tag;
}

export const createNote = async (
  noteData: CreateNotePayload
): Promise<Note> => {
  try {
    const response = await notehubApi.post("/notes", noteData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error creating note:",
        error.response?.data || error.message
      );

      if (error.response?.data?.validation) {
        console.error(
          "API Validation details:",
          error.response.data.validation
        );
      }
      throw new Error(error.response?.data?.message || "Failed to create note");
    }
    throw error;
  }
};

export interface DeleteNoteResponse {
  message: string;
}

export const deleteNote = async (id: string): Promise<DeleteNoteResponse> => {
  try {
    const response = await notehubApi.delete(`/notes/${id}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error deleting note:",
        error.response?.data || error.message
      );
      throw new Error(error.response?.data?.message || "Failed to delete note");
    }
    throw error;
  }
};
