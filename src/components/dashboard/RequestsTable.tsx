import { useEffect, useRef } from "react";
import { Inbox, ArrowUp, ArrowDown, ChevronsUpDown } from "lucide-react";
import RequestActions from "./RequestActions";
import { statusInfo } from "../../data/requests";
import { formatAmount } from "../../utils/formatAmount";
import { formatJalali, relativeTimeFromNow } from "../../utils/jalali";
import type {
  LoanRequest,
  SortConfig,
  SortField,
  Status,
} from "../../types/request";

type RequestsTableProps = {
  rows: LoanRequest[];
  selectedIds: string[];
  sort: SortConfig;
  onToggleSort: (field: SortField) => void;
  onToggleSelection: (id: string) => void;
  onToggleAll: () => void;
  onMove: (id: string, status: Status) => void;
  onRevert: (id: string) => void;
  onView: (id: string) => void;
  onRowClick: (id: string) => void;
};

const sortableColumns: { field: SortField; label: string }[] = [
  { field: "employee", label: "نام کارمند" },
  { field: "department", label: "واحد سازمانی" },
  { field: "amount", label: "مبلغ (تومان)" },
  { field: "date", label: "تاریخ ثبت" },
];

export default function RequestsTable({
  rows,
  selectedIds,
  sort,
  onToggleSort,
  onToggleSelection,
  onToggleAll,
  onMove,
  onRevert,
  onView,
  onRowClick,
}: RequestsTableProps) {
  const headCell = "p-4 text-[11px] font-semibold text-slate-500";

  const allPageSelected =
    rows.length > 0 && rows.every((request) => selectedIds.includes(request.id));
  const somePageSelected =
    !allPageSelected && rows.some((request) => selectedIds.includes(request.id));

  // حالت نیمه‌انتخاب با property خاص DOM (نه attribute) کنترل می‌شود
  const selectAllRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = somePageSelected;
    }
  }, [somePageSelected]);

  // آیکون وضعیت مرتب‌سازی متناسب با ستون فعال
  function sortIcon(field: SortField) {
    if (sort.field !== field) {
      return <ChevronsUpDown size={12} className="opacity-30" />;
    }
    return sort.direction === "asc" ? (
      <ArrowUp size={12} className="text-brand-600" />
    ) : (
      <ArrowDown size={12} className="text-brand-600" />
    );
  }

  return (
    <>
      {/* انتخاب همه - فقط دسکتاپ */}
      <div className="hidden md:flex items-center gap-2 px-4 py-2.5 bg-slate-50 border-b border-slate-100">
        <input
          ref={selectAllRef}
          type="checkbox"
          aria-label="انتخاب همه درخواست‌های این صفحه"
          checked={allPageSelected}
          onChange={onToggleAll}
          className="w-4 h-4 accent-brand-500 cursor-pointer"
        />
        <span className="text-[11px] text-slate-500">
          انتخاب همه درخواست‌های این صفحه
        </span>
      </div>

      {/* جدول - دسکتاپ */}
      <div className="hidden md:block">
        <table className="w-full text-right whitespace-nowrap">
          <thead className="bg-slate-50">
            <tr>
              <th className="p-4 w-12" />
              <th className={headCell}>شماره درخواست</th>

              {sortableColumns.map((column) => (
                <th key={column.field}>
                  <button
                    type="button"
                    onClick={() => onToggleSort(column.field)}
                    aria-label={`مرتب‌سازی بر اساس ${column.label}`}
                    className={`w-full flex items-center gap-1 p-4 text-[11px] font-semibold transition-colors hover:text-brand-600 ${
                      sort.field === column.field
                        ? "text-brand-700"
                        : "text-slate-500"
                    }`}
                  >
                    {column.label}
                    {sortIcon(column.field)}
                  </button>
                </th>
              ))}

              <th className={headCell}>وضعیت</th>
              <th className={`${headCell} w-20`}>عملیات</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((request) => {
              const info = statusInfo[request.status];
              const isSelected = selectedIds.includes(request.id);

              return (
                <tr
                  key={request.id}
                  onClick={() => onRowClick(request.id)}
                  className={`border-t border-slate-100 transition-colors cursor-pointer ${
                    isSelected ? "bg-brand-50/40" : "hover:bg-slate-50/60"
                  }`}
                >
                  <td className="p-4" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      aria-label={`انتخاب درخواست ${request.id}`}
                      checked={isSelected}
                      onChange={() => onToggleSelection(request.id)}
                      className="w-4 h-4 accent-brand-500 cursor-pointer"
                    />
                  </td>

                  <td className="p-4 text-xs text-brand-600 font-medium" dir="ltr">
                    {request.id}
                  </td>

                  <td className="p-4 text-xs font-bold text-slate-800">
                    {request.employee}
                  </td>

                  <td className="p-4 text-xs text-slate-600">
                    {request.department}
                  </td>

                  <td className="p-4 text-xs font-semibold text-slate-700 tabular-nums">
                    {formatAmount(request.amount)}
                  </td>

                  <td className="p-4">
                    <div className="text-xs text-slate-500 tabular-nums">
                      {formatJalali(request.date)}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {relativeTimeFromNow(request.date)}
                    </div>
                  </td>

                  <td className="p-4">
                    <span
                      className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-semibold"
                      style={{
                        color: info.colorHex,
                        backgroundColor: info.bgHex,
                      }}
                    >
                      {info.label}
                    </span>
                  </td>

                  <td className="p-4" onClick={(e) => e.stopPropagation()}>
                    <RequestActions
                      request={request}
                      onMove={onMove}
                      onRevert={onRevert}
                      onView={onView}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* انتخاب همه - موبایل */}
      <div className="md:hidden flex items-center gap-2 px-4 py-3 bg-slate-50 border-b border-slate-100">
        <input
          type="checkbox"
          aria-label="انتخاب همه درخواست‌های این صفحه"
          checked={allPageSelected}
          onChange={onToggleAll}
          className="w-4 h-4 accent-brand-500 cursor-pointer"
        />
        <span className="text-[11px] text-slate-500">
          انتخاب همه درخواست‌های این صفحه
        </span>
      </div>

      {/* کارت‌ها - موبایل */}
      <div className="md:hidden divide-y divide-slate-100">
        {rows.map((request) => {
          const info = statusInfo[request.status];
          const isSelected = selectedIds.includes(request.id);

          return (
            <div
              key={request.id}
              onClick={() => onRowClick(request.id)}
              className={`p-4 transition-colors cursor-pointer ${
                isSelected ? "bg-brand-50/40" : "hover:bg-slate-50/60"
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2 min-w-0">
                  <input
                    type="checkbox"
                    aria-label={`انتخاب درخواست ${request.id}`}
                    checked={isSelected}
                    onChange={() => onToggleSelection(request.id)}
                    onClick={(e) => e.stopPropagation()}
                    className="w-4 h-4 accent-brand-500 cursor-pointer shrink-0"
                  />
                  <span
                    className="text-[11px] text-brand-600 font-medium truncate"
                    dir="ltr"
                  >
                    {request.id}
                  </span>
                </div>

                <span
                  className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold shrink-0"
                  style={{
                    color: info.colorHex,
                    backgroundColor: info.bgHex,
                  }}
                >
                  {info.label}
                </span>
              </div>

              <div className="mb-3">
                <div className="text-sm font-bold text-slate-800">
                  {request.employee}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  {request.department}
                </div>
              </div>

              <div className="flex items-center justify-between gap-2">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-bold text-slate-700 tabular-nums">
                    {formatAmount(request.amount)}
                  </span>
                  <span
                    className="text-[10px] text-slate-400 tabular-nums"
                    title={relativeTimeFromNow(request.date)}
                  >
                    {formatJalali(request.date)}
                  </span>
                </div>

                <div onClick={(e) => e.stopPropagation()}>
                  <RequestActions
                    request={request}
                    onMove={onMove}
                    onRevert={onRevert}
                    onView={onView}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

// حالت خالی وقتی هیچ درخواستی پیدا نشد
export function EmptyRequests({ hasSearch }: { hasSearch: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 px-4 text-center">
      <div className="w-14 h-14 rounded-full bg-slate-100 grid place-items-center text-slate-400">
        <Inbox size={26} />
      </div>
      <strong className="text-slate-700 text-sm">درخواستی پیدا نشد</strong>
      <span className="text-xs text-slate-500 max-w-xs">
        {hasSearch
          ? "عبارت جست‌وجو را تغییر دهید یا فیلتر وضعیت را روی «همه مراحل» بگذارید."
          : "در حال حاضر درخواستی با این فیلتر وجود ندارد."}
      </span>
    </div>
  );
}