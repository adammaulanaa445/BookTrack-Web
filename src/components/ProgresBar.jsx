import { useLanguage } from "../context/LanguageContext";

export default function ProgressBar({ current, total, className = "" }) {
  const { t } = useLanguage();
  if (!total) return null;
  const pct = Math.min(100, Math.round((current / total) * 100));

  return (
    <div className={className}>
      <div className="flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400 mb-1">
        <span>{t.pagesLabel(current, total)}</span>
        <span>{pct}%</span>
      </div>
      <div className="w-full h-1.5 rounded-full bg-stone-200 dark:bg-zinc-800 overflow-hidden">
        <div
          className="h-full rounded-full bg-emerald-700 dark:bg-amber-500 transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}