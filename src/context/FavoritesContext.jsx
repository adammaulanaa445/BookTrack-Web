import { createContext, useContext, useEffect, useState, useCallback } from "react";

const FavoritesContext = createContext(null);
const STORAGE_KEY = "booktrack-favorites";

export function FavoritesProvider({ children }) {
  // ambil data favorit dari localStorage saat pertama kali dibuka
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // setiap kali favorites berubah, simpan lagi ke localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const isFavorite = useCallback(
    (key) => favorites.some((b) => b.key === key),
    [favorites]
  );


const toggleFavorite = useCallback((book) => {
  setFavorites((prev) => {
    if (prev.some((b) => b.key === book.key)) {
      return prev.filter((b) => b.key !== book.key);
    }
    return [
      ...prev,
      {
        key: book.key,
        title: book.title,
        author_name: book.author_name,
        cover_i: book.cover_i,
        first_publish_year: book.first_publish_year,
        addedAt: Date.now(),
      },
    ];
  });
}, []);

  return (
    <FavoritesContext.Provider value={{ favorites, isFavorite, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

// hook custom biar gampang dipakai: const { favorites } = useFavorites();
export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites harus dipakai di dalam FavoritesProvider");
  return ctx;
}