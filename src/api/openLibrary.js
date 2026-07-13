const BASE = "https://openlibrary.org";

// bikin URL gambar sampul buku dari cover_i
export const coverUrl = (id, size = "M") =>
  id ? `https://covers.openlibrary.org/b/id/${id}-${size}.jpg` : null;

// ambil daftar buku populer minggu ini
export async function getPopularBooks(limit = 24) {
  const res = await fetch(`${BASE}/trending/weekly.json?limit=${limit}`);
  if (!res.ok) throw new Error("Gagal memuat buku populer");
  const data = await res.json();
  return data.works || [];
}

// cari buku berdasarkan kata kunci
export async function searchBooks(query, limit = 24) {
  const res = await fetch(`${BASE}/search.json?q=${encodeURIComponent(query)}&limit=${limit}`);
  if (!res.ok) throw new Error("Pencarian gagal");
  const data = await res.json();
  return data.docs || [];
}

// ambil detail 1 buku (deskripsi, subjek, dll)
export async function getBookDetails(workKey) {
  const path = workKey.startsWith("/works/") ? workKey : `/works/${workKey}`;
  const res = await fetch(`${BASE}${path}.json`);
  if (!res.ok) throw new Error("Gagal memuat detail buku");
  return res.json();
}

// ubah "/works/OL12345W" jadi "OL12345W" saja (dipakai untuk URL route)
export function workId(key) {
  return key?.startsWith("/works/") ? key.replace("/works/", "") : key;
}

// ambil buku berdasarkan kategori/genre
export async function getBooksBySubject(subject, limit = 24) {
  const res = await fetch(`${BASE}/subjects/${subject}.json?limit=${limit}`);
  if (!res.ok) throw new Error("Gagal memuat buku kategori ini");
  const data = await res.json();
  // samakan bentuk datanya dengan yang dipakai BookCard (cover_i, author_name, dst)
  return (data.works || []).map((w) => ({
    key: w.key,
    title: w.title,
    cover_i: w.cover_id,
    author_name: w.authors ? w.authors.map((a) => a.name) : [],
    first_publish_year: w.first_publish_year,
  }));
}

export const GENRES = [
  "fiction",
  "business",
  "science",
  "romance",
  "fantasy",
  "history",
  "mystery_and_detective_stories",
  "self-help",
];

// ubah nama subject jadi format URL yang dipakai Open Library (huruf kecil, underscore)
export function slugifySubject(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

// cari buku serupa berdasarkan daftar subject, coba beberapa subject sampai dapat hasil
export async function getRelatedBooks(subjects, excludeKey, limit = 6) {
  if (!subjects || subjects.length === 0) return [];

  for (const subject of subjects.slice(0, 4)) {
    try {
      const slug = slugifySubject(subject);
      const books = await getBooksBySubject(slug, limit + 4);
      const filtered = books.filter((b) => b.key !== excludeKey);
      if (filtered.length > 0) return filtered.slice(0, limit);
    } catch (e) {
      // subject ini gagal/tidak ada datanya, coba subject berikutnya
    }
  }
  return [];
}