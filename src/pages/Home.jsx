import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { getPopularBooks, searchBooks, getBooksBySubject, GENRES } from "../api/openLibrary";
import BookCard from "../components/BookCard";
import { useLanguage } from "../context/LanguageContext";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

export default function Home() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const q = searchParams.get("q") || "";
  const subject = searchParams.get("subject") || "";
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [year, setYear] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    setYear("");

    let load;
    if (q) {
      load = searchBooks(q);
    } else if (subject) {
      load = getBooksBySubject(subject);
    } else {
      load = getPopularBooks();
    }

    load
      .then((data) => active && setBooks(data))
      .catch(() => active && setError(t.loadError))
      .finally(() => active && setLoading(false));

    return () => { active = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, subject]);

  const availableYears = useMemo(() => {
    const years = books.map((b) => b.first_publish_year).filter((y) => !!y);
    return [...new Set(years)].sort((a, b) => b - a);
  }, [books]);

  const filteredBooks = useMemo(() => {
    if (!year) return books;
    return books.filter((b) => String(b.first_publish_year) === String(year));
  }, [books, year]);

  const pageTitle = q
    ? t.searchResultTitle(q)
    : subject
    ? t.genre[subject] || t.categoryFallback
    : t.popularTitle;

  useDocumentTitle(pageTitle);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {!q && (
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => navigate("/")}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              !subject
                ? "bg-emerald-800 text-white dark:bg-amber-500 dark:text-zinc-950"
                : "border border-stone-200 dark:border-zinc-800 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-zinc-800"
            }`}
          >
            {t.allGenres}
          </button>
          {GENRES.map((id) => (
            <button
              key={id}
              onClick={() => navigate(`/?subject=${id}`)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                subject === id
                  ? "bg-emerald-800 text-white dark:bg-amber-500 dark:text-zinc-950"
                  : "border border-stone-200 dark:border-zinc-800 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-zinc-800"
              }`}
            >
              {t.genre[id] || id}
            </button>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="font-serif text-2xl font-bold text-stone-900 dark:text-stone-100">
          {pageTitle}
        </h2>

        {availableYears.length > 1 && (
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="text-sm px-3 py-1.5 rounded-full border border-stone-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-stone-700 dark:text-stone-300 outline-none focus:ring-2 focus:ring-emerald-700 dark:focus:ring-amber-400"
          >
            <option value="">{t.allYears}</option>
            {availableYears.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        )}
      </div>

      {error && (
        <div className="mt-4 px-4 py-3 rounded-lg border border-red-300 bg-red-50 text-red-700 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <p className="mt-6 text-stone-500 dark:text-stone-400 text-sm">{t.loading}</p>
      ) : filteredBooks.length === 0 ? (
        <p className="mt-6 text-stone-500 dark:text-stone-400 text-sm">{t.noBooksFound}</p>
      ) : (
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredBooks.map((b, i) => (
            <BookCard key={b.key || i} book={b} />
          ))}
        </div>
      )}
    </div>
  );
}