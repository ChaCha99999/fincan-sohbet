import { useState, useEffect, useCallback } from 'react';
import type { Table } from '../types';

const SESSION_STORAGE_KEY = 'fincan_active_table';

export const useTableSession = () => {
  const [activeTable, setActiveTableState] = useState<Table | null>(() => {
    try {
      const stored = sessionStorage.getItem(SESSION_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const setActiveTable = useCallback((table: Table | null) => {
    setActiveTableState(table);
    try {
      if (table) {
        sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(table));
      } else {
        sessionStorage.removeItem(SESSION_STORAGE_KEY);
      }
    } catch (e) {
      console.warn('SessionStorage error:', e);
    }
  }, []);

  useEffect(() => {
    const handleStorage = () => {
      try {
        const stored = sessionStorage.getItem(SESSION_STORAGE_KEY);
        setActiveTableState(stored ? JSON.parse(stored) : null);
      } catch {
        setActiveTableState(null);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return { activeTable, setActiveTable };
};
