import { Undo2, Send } from "lucide-react";
import { formatAmount } from "../../utils/formatAmount";
import type { Status } from "../../types/request";

type BulkBarProps = {
  selectedCount: number;
  revertibleCount: number;
  onBulkMove: (status: Status) => void;
  onBulkRevert: () => void;
};

export default function BulkBar({
  selectedCount,
  revertibleCount,
  onBulkMove,
  onBulkRevert,
}: BulkBarProps) {
  if (selectedCount === 0) return null;

  const LABEL = "بازگردانی یک مرحله به عقب";

  // اگر همه انتخاب‌شده‌ها در اولین مرحله باشند، بازگردانی معنا ندارد
  const canRevert = revertibleCount > 0;
  const reason = canRevert
    ? `${formatAmount(revertibleCount)} درخواست یک مرحله به عقب بازمی‌گردد`
    : "همه درخواست‌های انتخاب‌شده در اولین مرحله هستند و مرحله قبلی ندارند";

  return (
    <div className="flex flex-wrap items-center gap-2 px-4 py-2.5 md:px-5 md:py-3 bg-brand-50 border-b border-brand-100">
      <span className="text-xs sm:text-sm font-bold text-brand-700 mr-auto">
        {formatAmount(selectedCount)} درخواست انتخاب شده
      </span>

      {/* بازگردانی: هر درخواست یک مرحله به عقب */}
      <button
        type="button"
        onClick={onBulkRevert}
        disabled={!canRevert}
        title={reason}
        // نام دسترس‌پذیر باید متن قابل‌مشاهده را در بر داشته باشد (WCAG 2.5.3)
        aria-label={canRevert ? undefined : `${LABEL} — ${reason}`}
        className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-lg text-[11px] sm:text-xs border transition-colors ${
          canRevert
            ? "bg-white border-amber-200 text-amber-700 hover:bg-amber-50 cursor-pointer"
            : "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed"
        }`}
      >
        <Undo2 size={13} className="shrink-0" />
        {/* متن کوتاه در موبایل تا نوار عملیات جمع بماند */}
        <span className="sm:hidden">بازگردانی</span>
        <span className="hidden sm:inline">{LABEL}</span>
      </button>

      {/* ارسال مستقیم به صف پرداخت */}
      <button
        type="button"
        onClick={() => onBulkMove("payment")}
        title="ارسال مستقیم همه درخواست‌ها به مرحله «در انتظار پرداخت»"
        className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-lg text-[11px] sm:text-xs bg-white border border-emerald-200 text-emerald-700 hover:bg-emerald-50 transition-colors"
      >
        <Send size={13} className="shrink-0" />
        <span className="sm:hidden">پرداخت</span>
        <span className="hidden sm:inline">ارسال به صف پرداخت</span>
      </button>
    </div>
  );
}