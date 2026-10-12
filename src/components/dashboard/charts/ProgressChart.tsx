import { TrendingUp, Clock, AlertCircle } from "lucide-react";
import type { LoanRequest } from "../../../types/request";
import { formatAmount } from "../../../utils/formatAmount";

type ProgressChartProps = {
  requests: LoanRequest[];
};

export default function ProgressChart({ requests }: ProgressChartProps) {
  const total = requests.length;

  const completed = requests.filter((r) => r.status === "payment").length;
  const inProgress = requests.filter(
    (r) => r.status === "documents" || r.status === "committee"
  ).length;
  const pending = requests.filter((r) => r.status === "initial").length;

  const items = [
    {
      id: "completed",
      label: "تکمیل‌شده",
      description: "آماده پرداخت",
      value: completed,
      color: "#219a70",
      bg: "bg-emerald-50",
      textColor: "text-emerald-600",
      Icon: TrendingUp,
    },
    {
      id: "in-progress",
      label: "در جریان",
      description: "در حال بررسی",
      value: inProgress,
      color: "#bd8524",
      bg: "bg-amber-50",
      textColor: "text-amber-600",
      Icon: Clock,
    },
    {
      id: "pending",
      label: "در انتظار",
      description: "بررسی‌نشده",
      value: pending,
      color: "#4670dc",
      bg: "bg-blue-50",
      textColor: "text-blue-600",
      Icon: AlertCircle,
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 md:p-5">
      <div className="mb-4">
        <h3 className="text-sm md:text-base font-bold text-slate-800">
          وضعیت کلی پیشرفت
        </h3>
        <p className="text-[11px] md:text-xs text-slate-500 mt-0.5">
          نگاه یکپارچه به روند
        </p>
      </div>

      <div className="space-y-4">
        {items.map((item) => {
          const percent =
            total > 0 ? Math.round((item.value / total) * 100) : 0;
          const Icon = item.Icon;
          return (
            <div key={item.id}>
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className={`w-7 h-7 rounded-lg grid place-items-center shrink-0 ${item.bg} ${item.textColor}`}
                  >
                    <Icon size={14} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-700">
                      {item.label}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">
                      {item.description}
                    </div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-sm font-extrabold text-slate-800 tabular-nums">
                    {formatAmount(item.value)}
                  </span>
                  <span className="text-[10px] text-slate-400 mr-1">
                    ({formatAmount(percent)}٪)
                  </span>
                </div>
              </div>

              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${percent}%`,
                    backgroundColor: item.color,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
