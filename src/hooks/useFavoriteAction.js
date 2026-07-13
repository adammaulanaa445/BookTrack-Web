import { useFavorites } from "../context/FavoritesContext";
import { useConfirm } from "../context/ConfirmContext";
import { useToast } from "../context/ToastContext";
import { useLanguage } from "../context/LanguageContext";

export function useFavoriteAction() {
  const { isFavorite, toggleFavorite } = useFavorites();
  const confirm = useConfirm();
  const { showToast } = useToast();
  const { t } = useLanguage();

  const handleToggleFavorite = async (book) => {
    const fav = isFavorite(book.key);

    if (!fav) {
      toggleFavorite(book);
      showToast({ message: t.addedToFavorites });
      return;
    }

    const ok = await confirm(t.confirmRemoveFavorite(book.title));
    if (!ok) return;

    toggleFavorite(book); // menghapus
    showToast({
      message: t.removedFromFavorites,
      actionLabel: t.undo,
      onAction: () => toggleFavorite(book), // toggle lagi = tambah balik buku yang sama
    });
  };

  return { isFavorite, handleToggleFavorite };
}