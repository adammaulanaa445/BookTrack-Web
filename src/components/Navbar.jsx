import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Moon, Sun, LibraryBig, Heart, Languages, Clock, X } from "lucide-react";
import { useFavorites } from "../context/FavoritesContext";
import { useLanguage } from "../context/LanguageContext";
import { useSearchHistory } from "../hooks/useSearchHistory";

export default function Navbar({ dark, setDark }) {
  const [query, setQuery] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const navigate = useNavigate();
  const { favorites } = useFavorites();
  const { lang, toggleLanguage, t } = useLanguage();
  const { history, addSearch, removeSearch, clearHistory } = useSearchHistory();
  const blurTimeoutRef = useRef(null);

  const runSearch = (q) => {
    const trimmed = q.trim();
    if (!trimmed) return;
    addSearch(trimmed);
    setQuery(trimmed);
    setShowHistory(false);
    navigate(`/?q=${encodeURIComponent(trimmed)}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    runSearch(query);
  };

  const handleFocus = () => {
    clearTimeout(blurTimeoutRef.current);
    setShowHistory(true);
  };

  const handleBlur = () => {
    blurTimeoutRef.current = setTimeout(() => setShowHistory(false), 150);
  };

  return (
    <header className="sticky top-0 z-20 border-b border-stone-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/95 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-3">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <LibraryBig className="w-6 h-6 text-amber-700 dark:text-amber-400" />
          <span className="font-serif text-xl font-bold text-stone-900 dark:text-stone-100">BookTrack</span>
        </Link>

        <form onSubmit={handleSubmit} className="flex-1 flex items-center gap-2 relative">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholder={t.searchPlaceholder}
              className="w-full pl-9 pr-3 py-2 rounded-full border border-stone-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm outline-none focus:ring-2 focus:ring-emerald-700 dark:focus:ring-amber-400 text-stone-900 dark:text-stone-100"
            />

            {showHistory && history.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 rounded-lg border border-stone-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-lg z-30 overflow-hidden">
                <div className="flex items-center justify-between px-3 py-2 border-b border-stone-100 dark:border-zinc-800">
                  <span className="flex items-center gap-1.5 text-xs font-medium text-stone-500 dark:text-stone-400">
                    <Clock className="w-3.5 h-3.5" /> {t.recentSearches}
                  </span>
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={clearHistory}
                    className="text-xs text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
                  >
                    {t.clearAll}
                  </button>
                </div>
                <ul>
                  {history.map((q) => (
                    <li key={q} className="flex items-center justify-between group">
                      <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => runSearch(q)}
                        className="flex-1 text-left px-3 py-2 text-sm text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-zinc-800"
                      >
                        {q}
                      </button>
                      <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => removeSearch(q)}
                        aria-label="Hapus"
                        className="px-2 opacity-0 group-hover:opacity-100 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <button type="submit" className="px-4 py-2 rounded-full text-sm font-medium bg-emerald-800 hover:bg-emerald-700 text-white dark:bg-amber-500 dark:hover:bg-amber-400 dark:text-zinc-950">
            {t.search}
          </button>
        </form>

        <div className="flex items-center gap-2 shrink-0">
          <Link to="/favorites" className="relative px-3 py-2 rounded-full text-sm font-medium text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-zinc-800 flex items-center gap-1">
            <Heart className="w-4 h-4" /> {t.favoritesNav}
            {favorites.length > 0 && (
              <span className="text-[10px] rounded-full px-1.5 bg-stone-200 dark:bg-zinc-700">
                {favorites.length}
              </span>
            )}
          </Link>
          <button
            onClick={toggleLanguage}
            aria-label="Ganti bahasa / Change language"
            className="flex items-center gap-1 px-2.5 py-2 rounded-full text-xs font-semibold hover:bg-stone-100 dark:hover:bg-zinc-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-zinc-800"
          >
            <Languages className="w-3.5 h-3.5" /> {lang === "id" ? "ID" : "EN"}
          </button>
          <button
            onClick={() => setDark((d) => !d)}
            aria-label="Ganti mode gelap/terang"
            className="p-2 rounded-full hover:bg-stone-100 dark:hover:bg-zinc-800 text-stone-900 dark:text-stone-100"
          >
            {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
}