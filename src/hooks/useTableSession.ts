import { useState, useEffect, useCallback } from 'react';
import type { Table } from '../types';

const STORAGE_KEY = 'fincan_active_table';

const getStoredTable = (): Table | null => {
  try {
    const fromSession = sessionStorage.getItem(STORAGE_KEY);
    if (fromSession) return JSON.parse(fromSession);
    const fromLocal = localStorage.getItem(STORAGE_KEY);
    if (fromLocal) return JSON.parse(fromLocal);
    return null;
  } catch {
    return null;
  }
};

export const useTableSession = () => {
  const [activeTable, setActiveTableState] = useState<Table | null>(getStoredTable);

  const setActiveTable = useCallback((table: Table | null) => {
    setActiveTableState(table);
    try {
      if (table) {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(table));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(table));
      } else {
        sessionStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (e) {
      console.warn('Storage error:', e);
    }
  }, []);

  useEffect(() => {
    const handleStorage = () => {
      setActiveTableState(getStoredTable());
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return { activeTable, setActiveTable };
};
