import { useMemo, useState } from "react";
import {
  ArrowRight,
  FileText,
  Image as ImageIcon,
  CheckCircle2,
  Clock,
  XCircle,
  Building2,
  History,
  FileCheck,
  MessageSquare,
  CalendarDays,
} from "lucide-react";
import StatusTimeline from "./StatusTimeline";
import { getRequestDetail, statusInfo } from "../../data/requests";
import { formatAmount } from "../../utils/formatAmount";
import { formatJalali, relativeTimeFromNow } from "../../utils/jalali";
import type { LoanRequest } from "../../types/request";

type RequestDetailProps = {
  request: LoanRequest;
  onBack: () => void;
};

type TabId = "documents" | "inquiries" | "history";

const tabs: { id: TabId; label: string; icon: typeof FileText }[] = [
  { id: "documents", label: "مدارک", icon: FileCheck },
  { id: "inquiries", label: "استعلام‌ها", icon: MessageSquare },
  { id: "history", label: "تاریخچه", icon: History },
];

const documentStatusConfig = {
  approved: {
    icon: CheckCircle2,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    label: "تأیید شده",
  },
  pending: {
    icon: Clock,
    color: "text-amber-600",
    bg: "bg-amber-50",
    label: "در انتظار",
  },
  rejected: {
    icon: XCircle,
    color: "text-rose-600",
    bg: "bg-rose-50",
    label: "رد شده",
  },
};

export default function RequestDetail({ request, onBack }: RequestDetailProps) {
  const [activeTab, setActiveTab] = useState<TabId>("documents");

  // مدارک، استعلام‌ها و تاریخچه فقط با تغییر درخواست تغییر می‌کنند
  const detail = useMemo(() => getRequestDetail(request), [request]);
  const info = statusInfo[request.status];

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-slate-600 hover:text-brand-600 transition-colors"
      >
        <ArrowRight size={18} />
        <span>بازگشت به لیست</span>
      </button>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="p-5 md:p-6 border-b border-slate-100">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="text-xs font-medium px-2 py-1 rounded"
                  style={{ color: info.colorHex, backgroundColor: info.bgHex }}
                >
                  {info.label}
                </span>
                <span className="text-xs text-slate-500 font-medium" dir="ltr">
                  {request.id}
                </span>
              </div>

              <h1 className="text-xl md:text-2xl font-bold text-slate-800">
                {request.employee}
              </h1>

              <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-slate-500">
                <span className="flex items-center gap-1">
                  <Building2 size={14} />
                  {request.department}
                </span>
                <span>•</span>
                <div className="flex items-center gap-1.5">
                  <CalendarDays size={14} />
                  <span className="tabular-nums">
                    {formatJalali(request.date, "full")}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    ({relativeTimeFromNow(request.date)})
                  </span>
                </div>
              </div>
            </div>

            <div className="text-left">
              <div className="text-xs text-slate-500 mb-1">مبلغ درخواستی</div>
              <div className="text-lg md:text-xl font-extrabold text-slate-800 tabular-nums">
                {formatAmount(request.amount)}
              </div>
              <div className="text-[10px] text-slate-400">تومان</div>
            </div>
          </div>
        </div>

        <div className="p-5 md:p-8 border-b border-slate-100 bg-slate-50/40">
          <h3 className="text-sm font-bold text-slate-700 mb-6">
            وضعیت گردش کار
          </h3>
          <StatusTimeline currentStatus={request.status} />
        </div>

        <div className="border-b border-slate-100">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 md:px-6 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                    isActive
                      ? "text-brand-600 border-brand-500"
                      : "text-slate-500 border-transparent hover:text-slate-700"
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-5 md:p-6">
          {activeTab === "documents" && (
            <div className="space-y-2">
              {detail.documents.map((doc) => {
                const config = documentStatusConfig[doc.status];
                const StatusIcon = config.icon;
                const DocIcon = doc.type === "image" ? ImageIcon : FileText;

                return (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between gap-3 p-3 rounded-lg border border-slate-100 hover:bg-slate-50/60 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 grid place-items-center text-slate-500 shrink-0">
                        <DocIcon size={18} />
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-slate-700 truncate">
                          {doc.name}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5 tabular-nums">
                          آپلود: {formatJalali(doc.uploadedAt)}
                        </div>
                      </div>
                    </div>

                    <span
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-medium shrink-0 ${config.bg} ${config.color}`}
                    >
                      <StatusIcon size={12} />
                      {config.label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === "inquiries" && (
            <div className="space-y-2">
              {detail.inquiries.map((inq) => {
                const config = documentStatusConfig[inq.status];
                const StatusIcon = config.icon;

                return (
                  <div
                    key={inq.id}
                    className="flex items-start justify-between gap-3 p-3 rounded-lg border border-slate-100"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 grid place-items-center text-slate-500 shrink-0">
                        <Building2 size={18} />
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-slate-700">
                          {inq.department}
                        </div>
                        {inq.note && (
                          <div className="text-xs text-slate-500 mt-1">
                            {inq.note}
                          </div>
                        )}
                        {inq.respondedAt && (
                          <div className="text-[10px] text-slate-400 mt-1 tabular-nums">
                            پاسخ: {formatJalali(inq.respondedAt)}
                          </div>
                        )}
                      </div>
                    </div>

                    <span
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-medium shrink-0 ${config.bg} ${config.color}`}
                    >
                      <StatusIcon size={12} />
                      {config.label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === "history" && (
            <div className="relative">
              <div className="absolute right-[15px] top-2 bottom-2 w-0.5 bg-slate-200" />

              <div className="space-y-4">
                {detail.history.map((event) => (
                  <div key={event.id} className="flex items-start gap-3 relative">
                    <div className="w-8 h-8 rounded-full bg-white border-2 border-brand-500 grid place-items-center shrink-0 z-10">
                      <div className="w-2 h-2 rounded-full bg-brand-500" />
                    </div>

                    <div className="flex-1 min-w-0 pt-1">
                      <div className="text-sm font-medium text-slate-700">
                        {event.action}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        توسط: {event.actor}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5 tabular-nums">
                        {formatJalali(event.date, "long")} ساعت{" "}
                        {event.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
