import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Heart, ArrowLeft, BookOpen } from "lucide-react";
import { getBookDetails, getRelatedBooks, coverUrl } from "../api/openLibrary";
import { useFavoriteAction } from "../hooks/useFavoriteAction";
import { useLanguage } from "../context/LanguageContext";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import StatusSelect from "../components/StatusSelect";
import BookCard from "../components/BookCard";

export default function BookDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isFavorite, handleToggleFavorite } = useFavoriteAction();
  const { t } = useLanguage();
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [related, setRelated] = useState([]);
  const [relatedLoading, setRelatedLoading] = useState(false);
  const [detailImgLoaded, setDetailImgLoaded] = useState(false);

  useDocumentTitle(detail?.title);

  useEffect(() => {
    setLoading(true);
    setDetail(null);
    setRelated([]);
    setDetailImgLoaded(false);
    getBookDetails(id)
      .then(setDetail)
      .catch(() => setDetail(null))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!detail?.subjects || detail.subjects.length === 0) return;
    let active = true;
    setRelatedLoading(true);
    getRelatedBooks(detail.subjects, detail.key, 6)
      .then((data) => active && setRelated(data))
      .catch(() => active && setRelated([]))
      .finally(() => active && setRelatedLoading(false));
    return () => { active = false; };
  }, [detail]);

  if (loading) return <div className="max-w-6xl mx-auto px-4 py-10 text-stone-500">{t.loadingDetail}</div>;
  if (!detail) return <div className="max-w-6xl mx-auto px-4 py-10 text-stone-500">{t.bookNotFound}</div>;

  const description = typeof detail.description === "string" ? detail.description : detail.description?.value;
  const cover = detail.covers?.[0] ? coverUrl(detail.covers[0], "L") : null;
  const bookKey = detail.key;
  const fav = isFavorite(bookKey);
  const bookForStatus = { key: bookKey, title: detail.title, cover_i: detail.covers?.[0] };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm mb-5 text-stone-500 hover:text-stone-900 dark:hover:text-stone-100">
        <ArrowLeft className="w-4 h-4" /> {t.back}
      </button>

      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8">
        <div>
          <div className="relative rounded-lg overflow-hidden border border-stone-200 dark:border-zinc-800 aspect-[2/3]">
            {cover ? (
              <>
                {!detailImgLoaded && (
                  <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-stone-200 via-stone-100 to-stone-200 dark:from-zinc-800 dark:via-zinc-700 dark:to-zinc-800 bg-[length:200%_100%]" />
                )}
                <img
                  src={cover}
                  alt={detail.title}
                  onLoad={() => setDetailImgLoaded(true)}
                  className={`w-full h-full object-cover transition-opacity duration-300 ${
                    detailImgLoaded ? "opacity-100" : "opacity-0"
                  }`}
                />
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-stone-200 dark:bg-zinc-800">
                <BookOpen className="w-10 h-10 text-stone-400" />
              </div>
            )}
          </div>

          <button
            onClick={() => handleToggleFavorite(bookForStatus)}
            className={`mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-full text-sm font-medium ${
              fav
                ? "border border-stone-300 dark:border-zinc-700 text-stone-900 dark:text-stone-100"
                : "bg-emerald-800 hover:bg-emerald-700 text-white dark:bg-amber-500 dark:text-zinc-950"
            }`}
          >
            <Heart className={`w-4 h-4 ${fav ? "fill-current" : ""}`} />
            {fav ? t.removeFavorite : t.addFavorite}
          </button>

          <div className="mt-3">
            <StatusSelect book={bookForStatus} className="w-full" />
          </div>
        </div>

        <div>
          <h1 className="font-serif text-3xl font-bold text-stone-900 dark:text-stone-100">{detail.title}</h1>
          {description && <p className="mt-6 text-sm leading-relaxed text-stone-600 dark:text-stone-400">{description}</p>}
          {detail.subjects?.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {detail.subjects.slice(0, 8).map((s) => (
                <span key={s} className="text-[11px] px-2 py-1 rounded-full border border-stone-200 dark:border-zinc-800 text-stone-600 dark:text-stone-400">
                  {s}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {(relatedLoading || related.length > 0) && (
        <div className="mt-12">
          <h2 className="font-serif text-xl font-bold text-stone-900 dark:text-stone-100 mb-4">
            {t.relatedBooks}
          </h2>
          {relatedLoading ? (
            <p className="text-sm text-stone-500 dark:text-stone-400">{t.searchingRelated}</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {related.map((b) => <BookCard key={b.key} book={b} />)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}