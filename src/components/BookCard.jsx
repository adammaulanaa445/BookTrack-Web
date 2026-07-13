import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, BookOpen } from "lucide-react";
import { coverUrl, workId } from "../api/openLibrary";
import { useFavoriteAction } from "../hooks/useFavoriteAction";
import { useLanguage } from "../context/LanguageContext";
import StatusSelect from "./StatusSelect";


export default function BookCard({ book }) {
  const { isFavorite, handleToggleFavorite } = useFavoriteAction();
  const { t } = useLanguage();
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const id = workId(book.key);
  const author = book.author_name?.[0] || t.unknownAuthor;
  const fav = isFavorite(book.key);
  const cover = coverUrl(book.cover_i);

  return (
    <div className="group relative rounded-lg overflow-hidden border border-stone-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm hover:shadow-md transition-shadow">
      <Link to={`/book/${id}`} className="block">
        <div className="relative aspect-[2/3] w-full overflow-hidden bg-stone-200 dark:bg-zinc-800">
          {cover && !imgError ? (
            <>
              {!imgLoaded && (
                <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-stone-200 via-stone-100 to-stone-200 dark:from-zinc-800 dark:via-zinc-700 dark:to-zinc-800 bg-[length:200%_100%]" />
              )}
              <img
                src={cover}
                alt={book.title}
                loading="lazy"
                onLoad={() => setImgLoaded(true)}
                onError={() => setImgError(true)}
                className={`w-full h-full object-cover transition-opacity duration-300 ${
                  imgLoaded ? "opacity-100" : "opacity-0"
                }`}
              />
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-stone-400 dark:text-zinc-600" />
            </div>
          )}
        </div>
        <div className="p-3">
          <h3 className="font-serif font-semibold text-sm leading-snug line-clamp-2 text-stone-900 dark:text-stone-100">
            {book.title}
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-1">{author}</p>
          {book.first_publish_year && (
            <p className="text-[11px] mt-1 text-amber-700 dark:text-amber-400 font-medium">
              {book.first_publish_year}
            </p>
          )}
        </div>
      </Link>

      <button
        onClick={() => handleToggleFavorite(book)}
        aria-label={fav ? t.removeFavorite : t.addFavorite}
        className="absolute top-2 right-2 rounded-full p-1.5 bg-black/40 hover:bg-black/60 transition-colors"
      >
        <Heart className={`w-4 h-4 ${fav ? "fill-amber-400 text-amber-400" : "text-white"}`} />
      </button>

      <div className="px-3 pb-3">
        <StatusSelect book={book} className="w-full" />
      </div>
    </div>
  );
}