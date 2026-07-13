import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "booktrack-search-history";
const MAX_HISTORY = 8;

export function useSearchHistory() {
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  }, [history]);

  const addSearch = useCallback((query) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    setHistory((prev) => {
      // hapus dulu kalau query yang sama sudah ada, biar naik ke paling atas (tidak duplikat)
      const filtered = prev.filter((q) => q.toLowerCase() !== trimmed.toLowerCase());
      return [trimmed, ...filtered].slice(0, MAX_HISTORY);
    });
  }, []);

  const removeSearch = useCallback((query) => {
    setHistory((prev) => prev.filter((q) => q !== query));
  }, []);

  const clearHistory = useCallback(() => setHistory([]), []);

  return { history, addSearch, removeSearch, clearHistory };
}