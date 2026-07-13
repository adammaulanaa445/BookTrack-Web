import { createContext, useContext, useEffect, useState, useCallback } from "react";

const ReadingStatusContext = createContext(null);
const STORAGE_KEY = "booktrack-reading-status";

export const STATUS_OPTIONS = [
  { value: "want", color: "text-sky-600 dark:text-sky-400" },
  { value: "reading", color: "text-amber-700 dark:text-amber-400" },
  { value: "done", color: "text-emerald-700 dark:text-emerald-400" },
];

export function ReadingStatusProvider({ children }) {
  const [statusMap, setStatusMap] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(statusMap));
  }, [statusMap]);

  const getStatus = useCallback((key) => statusMap[key]?.status || "", [statusMap]);

  const getProgress = useCallback(
    (key) => ({
      current: statusMap[key]?.current || 0,
      total: statusMap[key]?.total || 0,
    }),
    [statusMap]
  );

  const setStatus = useCallback((book, status) => {
  setStatusMap((prev) => {
    const next = { ...prev };
    if (!status) {
      delete next[book.key];
    } else {
      next[book.key] = {
        ...prev[book.key],
        status,
        title: book.title,
        author_name: book.author_name,
        cover_i: book.cover_i,
        first_publish_year: book.first_publish_year,
        addedAt: prev[book.key]?.addedAt || Date.now(), // simpan waktu pertama kali ditandai
      };
    }
    return next;
  });
}, []);

  const setProgress = useCallback((book, current, total) => {
    setStatusMap((prev) => {
      const existing = prev[book.key];
      if (!existing) return prev;
      return {
        ...prev,
        [book.key]: {
          ...existing,
          current: Math.max(0, Number(current) || 0),
          total: Math.max(0, Number(total) || 0),
        },
      };
    });
  }, []);

  const listByStatus = useCallback(
    (status) =>
      Object.entries(statusMap)
        .filter(([, v]) => v.status === status)
        .map(([key, v]) => ({ key, ...v })),
    [statusMap]
  );

  return (
    <ReadingStatusContext.Provider
      value={{ getStatus, setStatus, getProgress, setProgress, listByStatus }}
    >
      {children}
    </ReadingStatusContext.Provider>
  );
}

export function useReadingStatus() {
  const ctx = useContext(ReadingStatusContext);
  if (!ctx) throw new Error("useReadingStatus harus dipakai di dalam ReadingStatusProvider");
  return ctx;
}