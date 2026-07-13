import { createContext, useContext, useState, useCallback, useRef } from "react";
import { useLanguage } from "./LanguageContext";

const ConfirmContext = createContext(null);

export function ConfirmProvider({ children }) {
  const [dialog, setDialog] = useState(null);
  const resolverRef = useRef(null);

  const confirm = useCallback((message) => {
    setDialog({ message });
    return new Promise((resolve) => {
      resolverRef.current = resolve;
    });
  }, []);

  const handleClose = (result) => {
    setDialog(null);
    if (resolverRef.current) {
      resolverRef.current(result);
      resolverRef.current = null;
    }
  };

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {dialog && (
        <ConfirmModal
          message={dialog.message}
          onCancel={() => handleClose(false)}
          onConfirm={() => handleClose(true)}
        />
      )}
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error("useConfirm harus dipakai di dalam ConfirmProvider");
  return ctx;
}

function ConfirmModal({ message, onCancel, onConfirm }) {
  const { t } = useLanguage();
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-lg bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 p-5 shadow-lg"
      >
        <p className="text-sm text-stone-800 dark:text-stone-200">{message}</p>
        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-3 py-1.5 rounded-full text-sm font-medium border border-stone-300 dark:border-zinc-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-zinc-800"
          >
            {t.confirmCancel}
          </button>
          <button
            onClick={onConfirm}
            className="px-3 py-1.5 rounded-full text-sm font-medium bg-red-600 hover:bg-red-700 text-white"
          >
            {t.confirmDelete}
          </button>
        </div>
      </div>
    </div>
  );
}