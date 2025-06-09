import { useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce';

import styles from './SearchBox.module.css';

interface SearchBoxProps {
  onSearch: (searchTerm: string) => void;
}

function SearchBox({ onSearch }: SearchBoxProps) {
  const [inputValue, setInputValue] = useState('');
  const [debouncedSearchTerm] = useDebounce(inputValue, 500);

  useEffect(() => {
    if (debouncedSearchTerm !== undefined) {
       onSearch(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm, onSearch]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  return (
    <input
      className={styles.input}
      type="text"
      placeholder="Search notes"
      value={inputValue}
      onChange={handleChange}
    />
  );
}

export default SearchBox;