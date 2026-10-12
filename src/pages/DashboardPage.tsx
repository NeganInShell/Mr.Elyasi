// ============================================
// آیکون‌ها
// ============================================
import { ArrowLeft } from "lucide-react";

// ============================================
// کامپوننت‌های داخلی پروژه
// ============================================
import PageHeader from "../components/ui/PageHeader";
import StatsGrid from "../components/dashboard/StatsGrid";
import DashboardCharts from "../components/dashboard/DashboardCharts";

// ============================================
// توابع کمکی
// formatAmount → قالب‌بندی مبلغ با ارقام فارسی و جداکننده هزارگان
// ============================================
import { formatAmount } from "../utils/formatAmount";

import type { LoanRequest, Status } from "../types/request";

// ============================================
// Props این صفحه
//
// requests     → لیست همه درخواست‌ها (برای StatsGrid و نمودارها)
// onStageSelect → وقتی کاربر روی کارت مرحله کلیک کرد،
//                 به App خبر می‌ده که فیلتر رو عوض کنه
// ============================================
type DashboardPageProps = {
  requests: LoanRequest[];
  onStageSelect: (status: Status) => void;
};

// ============================================
// صفحه‌ی داشبورد — نمای کلی
//
// این صفحه چیکار می‌کنه؟
//   ۱. هدر با عنوان + مجموع مبالغ
//   ۲. ۴ کارت KPI (StatsGrid)
//   ۳. ۳ نمودار (DashboardCharts)
//   ۴. راهنمای میان‌بر
// ============================================
export default function DashboardPage({
  requests,
  onStageSelect,
}: DashboardPageProps) {

  // ============================================
  // محاسبه‌ی مجموع مبالغ همه‌ی درخواست‌ها
  //
  // reduce → آرایه رو به یه مقدار تبدیل می‌کنه
  //   sum → مقدار انباشته (از 0 شروع می‌شه)
  //   r   → هر درخواست
  //   sum + r.amount → جمع کن
  // ============================================
  const totalAmount = requests.reduce((sum, r) => sum + r.amount, 0);

  return (
    <>
      {/* ============================================
          هدر صفحه — عنوان، توضیح و مجموع مبالغ
          چرا action? چون می‌خوایم مجموع مبالغ سمت چپ هدر باشه
      ============================================ */}
      <PageHeader
        title="نمای کلی"
        description="خلاصه وضعیت درخواست‌ها و روند گردش کار در سازمان"
        action={
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-slate-200">
            <span className="text-[11px] text-slate-500">مجموع مبالغ</span>
            <span className="text-sm font-extrabold text-slate-800 tabular-nums">
              {formatAmount(totalAmount)}
            </span>
            <span className="text-[10px] text-slate-400">تومان</span>
          </div>
        }
      />

      {/* ============================================
          مراحل گردش کار — ۴ کارت KPI
          
          نکته: activeStatus="all" یعنی «هیچ مرحله‌ای فعال نیست»
          چون توی داشبورد، فیلتر اعمال نمی‌شه؛ فقط نمایش.
          
          onStatusChange → وقتی کاربر روی کارت کلیک کرد،
          همون status به App پاس داده می‌شه.
      ============================================ */}
      <StatsGrid
        requests={requests}
        activeStatus="all"
        onStatusChange={onStageSelect}
      />

      {/* ============================================
          نمودارها — دونات + میله‌ای + نوار پیشرفت
      ============================================ */}
      <DashboardCharts requests={requests} />

      {/* ============================================
          راهنمای میان‌بر
          به کاربر می‌گه چطور از این صفحه استفاده کنه
      ============================================ */}
      <div className="mt-4 flex items-center gap-2 px-4 py-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-500">
        <ArrowLeft size={14} className="shrink-0 text-brand-500" />
        برای جست‌وجو و بررسی درخواست‌ها، وارد صفحه
        <span className="font-bold text-slate-700">«درخواست‌ها»</span>
        شوید. با کلیک روی هر کارت مرحله بالا، لیست فیلترشده همان مرحله باز می‌شود.
      </div>
    </>
  );
}