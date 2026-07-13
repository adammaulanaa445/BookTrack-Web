import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import BookDetails from "./pages/BookDetails";
import Favorites from "./pages/Favorites";
import { FavoritesProvider } from "./context/FavoritesContext";
import { LanguageProvider } from "./context/LanguageContext";
import { ToastProvider } from "./context/ToastContext";
import { ConfirmProvider } from "./context/ConfirmContext";

export default function App() {
  const [dark, setDark] = useState(() => localStorage.getItem("booktrack-theme") === "dark");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("booktrack-theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <LanguageProvider>
      <ToastProvider>
        <ConfirmProvider>
          <FavoritesProvider>
            <div className="min-h-screen bg-stone-50 dark:bg-zinc-950">
              <Navbar dark={dark} setDark={setDark} />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/book/:id" element={<BookDetails />} />
                <Route path="/favorites" element={<Favorites />} />
              </Routes>
            </div>
          </FavoritesProvider>
        </ConfirmProvider>
      </ToastProvider>
    </LanguageProvider>
  );
}