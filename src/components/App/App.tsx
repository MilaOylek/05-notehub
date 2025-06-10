import { useState, useCallback, useEffect } from "react";
import { useDebounce } from "use-debounce";

import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";

import { fetchNotes } from "../../services/noteService";
import { type PaginatedResponse} from "../../types/note";
import { type Note } from "../../types/note";

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
  const [rawSearchTerm, setRawSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(rawSearchTerm, 500);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading, error, isError, isFetching } = useQuery<
    PaginatedResponse<Note>,
    Error
  >({
    queryKey: ["notes", currentPage, debouncedSearchTerm],
    queryFn: () => fetchNotes(currentPage, 12, debouncedSearchTerm),
    staleTime: 5 * 60 * 1000,
   
    placeholderData: (previousData) => previousData,
  });

  const [lastFetchedSearchTerm, setLastFetchedSearchTerm] = useState("");

  useEffect(() => {
    if (debouncedSearchTerm !== lastFetchedSearchTerm) {
      setCurrentPage(1);
      setLastFetchedSearchTerm(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm, lastFetchedSearchTerm]);

  const handlePageChange = useCallback((selectedItem: { selected: number }) => {
    const newPage = selectedItem.selected + 1;
    setCurrentPage(newPage);
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setRawSearchTerm(value);
  }, []);

  const handleCreateNoteClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };


  if (isLoading && !data) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return <ErrorMessage message={error?.message || "Failed to load notes."} />;
  }

  return (
    <div className={styles.app}>
      <header className={styles.toolbar}>
        <SearchBox value={rawSearchTerm} onChange={handleSearchChange} />
        {data && data.totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={data.totalPages}
            onPageChange={handlePageChange}
          />
        )}
        <button className={styles.button} onClick={handleCreateNoteClick}>
          Create note +
        </button>
      </header>

      {isFetching && <LoadingSpinner overlay={true} />}

      {data && data.notes && data.notes.length > 0 ? (
        <NoteList notes={data.notes} />
      ) : (
        <p className={styles.noNotesMessage}>No notes found.</p>
      )}

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