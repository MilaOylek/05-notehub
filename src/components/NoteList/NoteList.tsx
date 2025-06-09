import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteNote } from "../../services/noteService";
import { type Note } from "../../types/note";
import styles from "./NoteList.module.css";
import axios from "axios";

interface NoteListProps {
  notes: Note[];
}

function NoteList({ notes }: NoteListProps) {
  const queryClient = useQueryClient();

  const deleteNoteMutation = useMutation<
    Note,
    Error,
    number
  >({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
    onError: (err) => {
      console.error("Failed to delete note:", err);
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        console.error("API Error details:", err.response.data.message);
      }
    },
  });

  const handleDeleteNote = (id: number) => {
    deleteNoteMutation.mutate(id);
  };

  if (notes.length === 0) {
    return <p>No notes for this page.</p>;
  }

  return (
    <ul className={styles.list}>
      {notes.map((note: Note) => (
        <li key={note.id} className={styles.listItem}>
          <h2 className={styles.title}>{note.title}</h2>
          <p className={styles.content}>{note.content}</p>
          <div className={styles.footer}>
            {note.tag && <span className={styles.tag}>{note.tag}</span>}
            <button
              className={styles.button}
              onClick={() => handleDeleteNote(note.id)}
              disabled={deleteNoteMutation.isPending}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default NoteList;