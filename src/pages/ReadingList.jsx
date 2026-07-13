import { useMemo, useState } from "react";
import { STATUS_OPTIONS, useReadingStatus } from "../context/ReadingStatusContext";
import { useLanguage } from "../context/LanguageContext";
import { sortBooks, SORT_OPTIONS } from "../utils/sortBooks";
import BookCard from "../components/BookCard";
import ProgressInput from "../components/ProgresInput";
import { BookMarked } from "lucide-react";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

const STATUS_LABEL_KEY = { want: "statusWant", reading: "statusReading", done: "statusDone" };
const SORT_LABEL_KEY = { recent: "sortRecent", az: "sortAZ", year: "sortYear" };

export default function ReadingList() {
  const { listByStatus } = useReadingStatus();
  const { t } = useLanguage();
  useDocumentTitle(t.readingListTitle);
  const [active, setActive] = useState("want");
  const [sortBy, setSortBy] = useState("recent");

  const books = listByStatus(active);
  const sorted = useMemo(() => sortBooks(books, sortBy), [books, sortBy]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h2 className="font-serif text-2xl font-bold text-stone-900 dark:text-stone-100">{t.readingListTitle}</h2>

      <div className="flex items-center justify-between flex-wrap gap-3 mt-4 mb-6">
        <div className="flex flex-wrap gap-2">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setActive(opt.value)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                active === opt.value
                  ? "bg-emerald-800 text-white dark:bg-amber-500 dark:text-zinc-950"
                  : "border border-stone-200 dark:border-zinc-800 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-zinc-800"
              }`}
            >
              {t[STATUS_LABEL_KEY[opt.value]]}
            </button>
          ))}
        </div>

        {books.length > 1 && (
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-sm px-3 py-1.5 rounded-full border border-stone-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-stone-700 dark:text-stone-300 outline-none focus:ring-2 focus:ring-emerald-700 dark:focus:ring-amber-400"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>{t[SORT_LABEL_KEY[opt]]}</option>
            ))}
          </select>
        )}
      </div>

      {books.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center gap-3 py-20 border border-dashed rounded-lg border-stone-200 dark:border-zinc-800">
          <BookMarked className="w-10 h-10 text-stone-400" />
          <p className="text-sm max-w-xs text-stone-500 dark:text-stone-400">{t.readingListEmpty}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {sorted.map((b) => (
            <div key={b.key}>
              <BookCard book={b} />
              {active === "reading" && <ProgressInput book={b} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}