export const SORT_OPTIONS = ["recent", "az", "year"];

export function sortBooks(books, sortBy) {
  const copy = [...books];

  if (sortBy === "az") {
    return copy.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
  }

  if (sortBy === "year") {
    return copy.sort((a, b) => (b.first_publish_year || 0) - (a.first_publish_year || 0));
  }

  // default: "recent" -> terbaru ditambahkan duluan
  return copy.sort((a, b) => (b.addedAt || 0) - (a.addedAt || 0));
}