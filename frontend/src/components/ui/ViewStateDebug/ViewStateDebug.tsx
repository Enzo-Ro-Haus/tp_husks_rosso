import React from 'react';
import { useViewState } from '../../../hooks/useViewState';
import styles from './ViewStateDebug.module.css';

interface ViewStateDebugProps {
  show?: boolean;
}

export const ViewStateDebug: React.FC<ViewStateDebugProps> = ({ show = false }) => {
  const { adminView, clientView, resetAllViews } = useViewState();

  if (!show) return null;

  return (
    <div className={styles.debugContainer}>
      <h4>🔍 View State Debug</h4>
      <div className={styles.debugInfo}>
        <p><strong>Admin View:</strong> {adminView}</p>
        <p><strong>Client View:</strong> {clientView}</p>
      </div>
      <div className={styles.debugActions}>
        <button 
          onClick={resetAllViews}
          className={styles.resetButton}
        >
          Reset All Views
        </button>
      </div>
    </div>
  );
}; 