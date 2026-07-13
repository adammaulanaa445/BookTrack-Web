import { useMemo, useState } from "react";
import { useFavorites } from "../context/FavoritesContext";
import { useLanguage } from "../context/LanguageContext";
import { sortBooks, SORT_OPTIONS } from "../utils/sortBooks";
import BookCard from "../components/BookCard";
import { BookOpen } from "lucide-react";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

const SORT_LABEL_KEY = { recent: "sortRecent", az: "sortAZ", year: "sortYear" };

export default function Favorites() {
  const { favorites } = useFavorites();
  const { t } = useLanguage();
  useDocumentTitle(t.favoritesTitle);
  const [sortBy, setSortBy] = useState("recent");

  const sorted = useMemo(() => sortBooks(favorites, sortBy), [favorites, sortBy]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="font-serif text-2xl font-bold text-stone-900 dark:text-stone-100">{t.favoritesTitle}</h2>

        {favorites.length > 1 && (
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

      {favorites.length === 0 ? (
        <div className="mt-6 flex flex-col items-center justify-center text-center gap-3 py-20 border border-dashed rounded-lg border-stone-200 dark:border-zinc-800">
          <BookOpen className="w-10 h-10 text-stone-400" />
          <p className="text-sm max-w-xs text-stone-500 dark:text-stone-400">{t.favoritesEmpty}</p>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {sorted.map((b) => <BookCard key={b.key} book={b} />)}
        </div>
      )}
    </div>
  );
}