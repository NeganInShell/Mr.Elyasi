import { useEffect, useMemo, useRef, useState } from "react";
import { Search, X, CornerDownLeft } from "lucide-react";
import { statusInfo } from "../../data/requests";
import { formatAmount, normalizePersian } from "../../utils/formatAmount";
import { formatJalali } from "../../utils/jalali";
import type { LoanRequest } from "../../types/request";

const MAX_RESULTS = 7;

type QuickSearchProps = {
  requests: LoanRequest[];
  isOpen: boolean;
  onClose: () => void;
  onSelect: (requestId: string) => void;
};

// محتوای داخلی: با تغییر isOpen کاملاً بازنشانی می‌شود تا نیازی به
// setState در effect نباشد و وضعیت هر بار از صفر شروع شود.
function QuickSearchDialog({
  requests,
  onClose,
  onSelect,
}: Omit<QuickSearchProps, "isOpen">) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    // همان رفتار جست‌وجوی لیست: ارقام فارسی، کیبورد عربی و نیم‌فاصله یکسان‌سازی می‌شوند
    const q = normalizePersian(query);
    if (q === "") return [];

    return requests
      .filter(
        (request) =>
          normalizePersian(request.employee).includes(q) ||
          normalizePersian(request.id).includes(q) ||
          normalizePersian(request.department).includes(q)
      )
      .slice(0, MAX_RESULTS);
  }, [requests, query]);

  // فوکوس خودکار روی ورودی هنگام باز شدن
  useEffect(() => {
    const frame = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(frame);
  }, []);

  // پیمایش با کیبورد
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      } else if (event.key === "ArrowDown") {
        event.preventDefault();
        setActiveIndex((index) => Math.min(index + 1, results.length - 1));
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        setActiveIndex((index) => Math.max(index - 1, 0));
      } else if (event.key === "Enter" && results[activeIndex]) {
        event.preventDefault();
        onSelect(results[activeIndex].id);
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [results, activeIndex, onSelect, onClose]);

  // جلوگیری از اسکرول پس‌زمینه هنگام باز بودن
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[12vh] px-4"
      role="dialog"
      aria-modal="true"
      aria-label="جست‌وجوی سریع درخواست‌ها"
    >
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-dropdown">
        {/* ورودی */}
        <div className="flex items-center gap-3 px-4 border-b border-slate-100">
          <Search size={18} className="text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActiveIndex(0);
            }}
            placeholder="نام کارمند، شماره درخواست یا واحد سازمانی..."
            aria-label="جست‌وجوی سریع"
            className="flex-1 h-14 border-0 outline-none text-sm text-slate-700 bg-transparent placeholder:text-slate-400"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="بستن جست‌وجو"
            className="w-7 h-7 rounded-md grid place-items-center text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors shrink-0"
          >
            <X size={16} />
          </button>
        </div>

        {/* نتایج */}
        <div className="max-h-[50vh] overflow-y-auto">
          {query.trim() === "" ? (
            <div className="px-4 py-8 text-center text-xs text-slate-400">
              نام کارمند، شماره درخواست یا واحد سازمانی را بنویسید
            </div>
          ) : results.length === 0 ? (
            <div className="px-4 py-8 text-center text-xs text-slate-400">
              نتیجه‌ای پیدا نشد
            </div>
          ) : (
            <ul className="py-2">
              {results.map((request, index) => {
                const info = statusInfo[request.status];

                return (
                  <li key={request.id}>
                    <button
                      type="button"
                      onMouseEnter={() => setActiveIndex(index)}
                      onClick={() => {
                        onSelect(request.id);
                        onClose();
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-right transition-colors ${
                        index === activeIndex ? "bg-brand-50" : ""
                      }`}
                    >
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: info.colorHex }}
                        aria-hidden="true"
                      />

                      <span className="min-w-0 flex-1">
                        <span className="flex items-baseline gap-2 min-w-0">
                          <span className="text-sm font-bold text-slate-800 truncate">
                            {request.employee}
                          </span>
                          <span
                            className="text-[11px] text-slate-400 truncate shrink-0"
                            dir="ltr"
                          >
                            {request.id}
                          </span>
                        </span>
                        <span className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500">
                          <span className="truncate">{request.department}</span>
                          <span aria-hidden="true">·</span>
                          <span className="tabular-nums shrink-0">
                            {formatAmount(request.amount)}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span className="tabular-nums shrink-0">
                            {formatJalali(request.date)}
                          </span>
                        </span>
                      </span>

                      <span
                        className="px-2 py-0.5 rounded-md text-[10px] font-semibold shrink-0"
                        style={{ color: info.colorHex, backgroundColor: info.bgHex }}
                      >
                        {info.label}
                      </span>

                      {index === activeIndex && (
                        <CornerDownLeft
                          size={13}
                          className="text-slate-400 shrink-0"
                        />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* راهنمای کلیدها */}
        <div className="flex items-center gap-4 px-4 py-2.5 bg-slate-50 border-t border-slate-100 text-[10px] text-slate-400">
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded border border-slate-200 bg-white font-sans">
              ↑
            </kbd>
            <kbd className="px-1.5 py-0.5 rounded border border-slate-200 bg-white font-sans">
              ↓
            </kbd>
            حرکت
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded border border-slate-200 bg-white font-sans">
              Enter
            </kbd>
            انتخاب
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded border border-slate-200 bg-white font-sans">
              Esc
            </kbd>
            بستن
          </span>
        </div>
      </div>
    </div>
  );
}

export default function QuickSearch({ isOpen, ...props }: QuickSearchProps) {
  // کلید باعث می‌شود با هر بار باز شدن، وضعیت داخلی از صفر شروع شود
  if (!isOpen) return null;
  return <QuickSearchDialog key="open" {...props} />;
}