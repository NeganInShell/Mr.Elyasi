import { Check, Clock } from "lucide-react";
import { workflowOrder, statusInfo } from "../../data/requests";
import { toFaDigits } from "../../utils/formatAmount";
import type { Status } from "../../types/request";

type StatusTimelineProps = {
  currentStatus: Status;
};

export default function StatusTimeline({ currentStatus }: StatusTimelineProps) {
  const currentIndex = workflowOrder.indexOf(currentStatus);

  return (
    <ol className="flex items-start justify-between" dir="rtl">
      {workflowOrder.map((status, index) => {
        const info = statusInfo[status];
        const isCompleted = index < currentIndex;
        const isCurrent = index === currentIndex;

        // وضعیت هر مرحله برای صفحه‌خوان قابل اعلام باشد
        const state = isCompleted
          ? "تکمیل‌شده"
          : isCurrent
          ? "مرحله فعلی"
          : "انجام‌نشده";

        return (
          <li
            key={status}
            className="flex items-start flex-1 last:flex-none"
            aria-label={`مرحله ${index + 1} از ${workflowOrder.length} — ${info.label}، ${state}`}
          >
            {/* دایره و برچسب */}
            <div className="flex flex-col items-center gap-1.5 sm:gap-2 shrink-0 w-[68px] sm:w-[86px]">
              <div
                aria-hidden="true"
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full grid place-items-center transition-all ${
                  isCompleted
                    ? "bg-emerald-500 text-white"
                    : isCurrent
                    ? "bg-brand-500 text-white ring-4 ring-brand-100"
                    : "bg-slate-100 text-slate-400"
                }`}
              >
                {isCompleted ? (
                  <Check size={16} className="sm:hidden" />
                ) : isCompleted ? (
                  <Check size={18} className="hidden sm:block" />
                ) : isCurrent ? (
                  <Clock size={16} className="sm:hidden" />
                ) : isCurrent ? (
                  <Clock size={18} className="hidden sm:block" />
                ) : (
                  <span className="text-xs font-bold">{toFaDigits(index + 1)}</span>
                )}
              </div>

              <span
                aria-hidden="true"
                className={`text-[9px] sm:text-xs font-medium text-center leading-tight ${
                  isCompleted || isCurrent ? "text-slate-700" : "text-slate-400"
                }`}
              >
                {info.label}
              </span>

              {/* نشان وضعیت برای صفحه‌خوان */}
              <span className="sr-only">{state}</span>
            </div>

            {/* خط اتصال — در موبایل نازک‌تر تا هرگز فشرده نشود */}
            {index < workflowOrder.length - 1 && (
              <div
                aria-hidden="true"
                className={`flex-1 h-0.5 mt-4 sm:mt-5 mx-1 sm:mx-2 rounded-full transition-colors ${
                  isCompleted ? "bg-emerald-500" : "bg-slate-200"
                }`}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}