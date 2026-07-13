import { STATUS_OPTIONS, useReadingStatus } from "../context/ReadingStatusContext";
import { useLanguage } from "../context/LanguageContext";

const STATUS_LABEL_KEY = { want: "statusWant", reading: "statusReading", done: "statusDone" };

export default function StatusSelect({ book, className = "" }) {
  const { getStatus, setStatus } = useReadingStatus();
  const { t } = useLanguage();
  const current = getStatus(book.key);

  return (
    <select
      value={current}
      onClick={(e) => e.stopPropagation()}
      onChange={(e) => setStatus(book, e.target.value)}
      className={`text-xs rounded-full border px-2 py-1 outline-none cursor-pointer
        border-stone-300 dark:border-zinc-700 bg-white dark:bg-zinc-900
        text-stone-700 dark:text-stone-300 ${className}`}
    >
      <option value="">{t.markStatus}</option>
      {STATUS_OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>{t[STATUS_LABEL_KEY[opt.value]]}</option>
      ))}
    </select>
  );
}