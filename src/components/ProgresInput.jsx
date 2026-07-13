import { useState, useEffect } from "react";
import { useReadingStatus } from "../context/ReadingStatusContext";
import { useLanguage } from "../context/LanguageContext";
import ProgressBar from "./ProgresBar";

export default function ProgressInput({ book }) {
  const { getProgress, setProgress } = useReadingStatus();
  const { t } = useLanguage();
  const saved = getProgress(book.key);
  const [current, setCurrent] = useState(saved.current);
  const [total, setTotal] = useState(saved.total);

  useEffect(() => {
    setCurrent(saved.current);
    setTotal(saved.total);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [book.key]);

  const handleSave = () => setProgress(book, current, total);

  return (
    <div className="mt-4 p-3 rounded-lg border border-stone-200 dark:border-zinc-800">
      <p className="text-xs font-medium text-stone-600 dark:text-stone-400 mb-2">{t.readingProgress}</p>
      <div className="flex items-center gap-2">
        <input
          type="number"
          min="0"
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
          onBlur={handleSave}
          placeholder={t.currentPage}
          className="w-1/2 text-sm px-2 py-1.5 rounded border border-stone-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-stone-900 dark:text-stone-100 outline-none focus:ring-2 focus:ring-emerald-700 dark:focus:ring-amber-400"
        />
        <span className="text-stone-400">/</span>
        <input
          type="number"
          min="0"
          value={total}
          onChange={(e) => setTotal(e.target.value)}
          onBlur={handleSave}
          placeholder={t.totalPages}
          className="w-1/2 text-sm px-2 py-1.5 rounded border border-stone-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-stone-900 dark:text-stone-100 outline-none focus:ring-2 focus:ring-emerald-700 dark:focus:ring-amber-400"
        />
      </div>
      {total > 0 && <ProgressBar current={current} total={total} className="mt-3" />}
    </div>
  );
}