import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import NoteForm from "../NoteForm/NoteForm";
import styles from "./NoteModal.module.css";

interface NoteModalProps {
  onClose: () => void;
}

function NoteModal({ onClose }: NoteModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const originalOverflowStyle = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.body.style.overflow = originalOverflowStyle;

      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return createPortal(
    <div className={styles.backdrop} role="dialog" aria-modal="true">
      <div className={styles.modal} ref={modalRef}>
        <NoteForm onClose={onClose} />
      </div>
    </div>,
    document.body
  );
}

export default NoteModal;
