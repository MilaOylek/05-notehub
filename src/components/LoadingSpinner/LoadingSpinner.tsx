import styles from './LoadingSpinner.module.css';

function LoadingSpinner() {
  return (
    <div className={styles.spinnerContainer}>
      <div className={styles.spinner}></div>
      <p>Loading...</p>
    </div>
  );
}

export default LoadingSpinner;