import { ChevronRight, ChevronLeft } from "lucide-react";
import { formatAmount, toFaDigits } from "../../utils/formatAmount";

const PAGE_SIZES = [10, 20, 50];

type PaginationProps = {
  page: number;
  pageCount: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
};

// ساخت فهرست شماره صفحات با فاصله‌گذاری هوشمند: ۱ ۲ ۳ … ۸
function buildPageItems(page: number, pageCount: number): (number | "gap")[] {
  if (pageCount <= 7) {
    return Array.from({ length: pageCount }, (_, index) => index + 1);
  }

  const items: (number | "gap")[] = [1];
  const start = Math.max(2, page - 1);
  const end = Math.min(pageCount - 1, page + 1);

  if (start > 2) items.push("gap");
  for (let current = start; current <= end; current++) items.push(current);
  if (end < pageCount - 1) items.push("gap");

  items.push(pageCount);
  return items;
}

export default function Pagination({
  page,
  pageCount,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) {
  if (total === 0) return null;

  const firstItem = (page - 1) * pageSize + 1;
  const lastItem = Math.min(page * pageSize, total);

  const navButton =
    "w-9 h-9 rounded-lg grid place-items-center border transition-colors shrink-0 disabled:opacity-40 disabled:cursor-not-allowed";

  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 px-4 md:px-5 py-3 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-500">
      {/* خلاصه نتایج */}
      <span className="whitespace-nowrap">
        نمایش {toFaDigits(firstItem)} تا {toFaDigits(lastItem)} از{" "}
        {formatAmount(total)} درخواست
      </span>

      {/* شماره صفحات */}
      {pageCount > 1 && (
        <nav aria-label="صفحه‌بندی" className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
            aria-label="صفحه قبل"
            className={`${navButton} border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:hover:bg-white`}
          >
            <ChevronRight size={16} />
          </button>

          {buildPageItems(page, pageCount).map((item, index) =>
            item === "gap" ? (
              <span
                key={`gap-${index}`}
                aria-hidden="true"
                className="w-6 text-center text-slate-400 select-none"
              >
                …
              </span>
            ) : (
              <button
                key={item}
                type="button"
                onClick={() => onPageChange(item)}
                aria-label={`صفحه ${toFaDigits(item)}`}
                aria-current={item === page ? "page" : undefined}
                className={`h-9 min-w-9 px-2 rounded-lg border tabular-nums transition-colors ${
                  item === page
                    ? "bg-brand-500 border-brand-500 text-white font-bold"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
                }`}
              >
                {toFaDigits(item)}
              </button>
            )
          )}

          <button
            type="button"
            onClick={() => onPageChange(page + 1)}
            disabled={page === pageCount}
            aria-label="صفحه بعد"
            className={`${navButton} border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:hover:bg-white`}
          >
            <ChevronLeft size={16} />
          </button>
        </nav>
      )}

      {/* انتخاب تعداد در هر صفحه */}
      <label className="flex items-center gap-2 whitespace-nowrap">
        <span className="hidden sm:inline">در هر صفحه:</span>
        <select
          value={pageSize}
          onChange={(event) => onPageSizeChange(Number(event.target.value))}
          aria-label="تعداد درخواست در هر صفحه"
          className="h-8 px-2 rounded-md border border-slate-200 bg-white text-[11px] text-slate-600 outline-none focus:border-brand-500 cursor-pointer"
        >
          {PAGE_SIZES.map((size) => (
            <option key={size} value={size}>
              {toFaDigits(size)}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}