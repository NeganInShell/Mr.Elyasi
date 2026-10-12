import { ArrowLeft } from "lucide-react";
import { stages, statusInfo } from "../../data/requests";
import { formatAmount } from "../../utils/formatAmount";
import type { LoanRequest, Status, StatusFilter } from "../../types/request";

type StatsGridProps = {
  requests: LoanRequest[];
  activeStatus: StatusFilter;
  onStatusChange: (status: Status) => void;
  showActiveState?: boolean;
};

export default function StatsGrid({
  requests,
  activeStatus,
  onStatusChange,
  showActiveState = false,
}: StatsGridProps) {
  return (
    <section
      className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6"
      aria-label="مراحل درخواست‌ها"
    >
      {stages.map((stage) => {
        const Icon = stage.icon;
        const info = statusInfo[stage.id];

        const count = requests.filter(
          (request) => request.status === stage.id
        ).length;

        const isSelected = showActiveState && activeStatus === stage.id;

        return (
          <button
            key={stage.id}
            type="button"
            onClick={() => onStatusChange(stage.id)}
            className={`group relative text-right p-4 md:p-5 rounded-xl bg-white border transition-all ${
              isSelected
                ? "border-brand-500 shadow-md ring-2 ring-brand-100"
                : "border-slate-200 hover:border-brand-300 hover:shadow-md"
            }`}
          >
            {/* آیکون */}
            <div
              className="w-10 h-10 md:w-11 md:h-11 rounded-lg grid place-items-center mb-3 md:mb-4"
              style={{
                color: info.colorHex,
                backgroundColor: info.bgHex,
              }}
            >
              <Icon size={20} />
            </div>

            {/* برچسب */}
            <div className="text-xs md:text-sm text-slate-500 font-medium">
              {info.label}
            </div>

            {/* تعداد */}
            <div className="text-2xl md:text-3xl font-extrabold text-slate-800 mt-1">
              {formatAmount(count)}
            </div>

            {/* توضیح */}
            <div className="flex items-center gap-1 mt-2 text-[10px] md:text-xs text-slate-400">
              <span className="truncate">{stage.description}</span>
              <ArrowLeft
                size={12}
                className="shrink-0 transition-transform group-hover:-translate-x-0.5"
              />
            </div>

            {/* نشانگر انتخاب */}
            {isSelected && (
              <span className="absolute top-3 left-3 w-2 h-2 rounded-full bg-brand-500" />
            )}
          </button>
        );
      })}
    </section>
  );
}