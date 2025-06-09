import { useState, useCallback } from "react";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";

import { fetchNotes } from "../../services/noteService";
import { type PaginatedResponse, type Note } from "../../types/note";
import NoteList from "../NoteList/NoteList";
import Pagination from "../Pagination/Pagination";
import SearchBox from "../SearchBox/SearchBox";
import NoteModal from "../NoteModal/NoteModal";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import styles from "./App.module.css";

const queryClient = new QueryClient();

function AppContent() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading, error, isError } = useQuery<
    PaginatedResponse<Note>,
    Error,
    PaginatedResponse<Note>,
    (string | number)[]
  >({
    queryKey: ["notes", currentPage, searchTerm],
    queryFn: () => fetchNotes(currentPage, 12, searchTerm),
    staleTime: 5 * 60 * 1000,
  });

  const handlePageChange = useCallback((selectedItem: { selected: number }) => {
    const newPage = selectedItem.selected + 1;
    setCurrentPage(newPage);
  }, []);

  const handleSearchChange = useCallback((value: string) => { 
    if (value !== searchTerm) {
      setSearchTerm(value);
      setCurrentPage(1);
    } 
    }, [searchTerm]);

  const handleCreateNoteClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return <ErrorMessage message={error?.message || "Failed to load notes."} />;
  }

  if (!data || !data.notes || data.notes.length === 0) {
    return <p>No notes found.</p>;
  }

  return (
    <div className={styles.app}>
      <header className={styles.toolbar}>
        {}
        <SearchBox onSearch={handleSearchChange} />
        <Pagination
          currentPage={currentPage}
          totalPages={data.totalPages}
          onPageChange={handlePageChange}
        />
        <button className={styles.button} onClick={handleCreateNoteClick}>
          Create note +
        </button>
      </header>

      <NoteList notes={data.notes} />

      {isModalOpen && <NoteModal onClose={handleCloseModal} />}
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}

export default App;