// ============================================
// هوک‌های React:
//   useState   → نگه‌داشتن state
//   useEffect  → side effect (اینجا: میونبر Ctrl+K)
//   useCallback → پایدار نگه‌داشتن تابع (جلوگیری از re-render)
// ============================================
import { useCallback, useEffect, useState } from "react";

// ============================================
// کامپوننت‌های اصلی
// ============================================
import AppShell from "./components/layout/AppShell";
import QuickSearch from "./components/ui/QuickSearch";
import DashboardPage from "./pages/DashboardPage";
import RequestsPage from "./pages/RequestsPage";
import PlaceholderPage from "./pages/PlaceholderPage";
import RequestDetail from "./components/dashboard/RequestDetail";

// ============================================
// هوک اصلی (مغز برنامه)
// همه‌ی state داده، فیلتر، جستجو، صفحه‌بندی اینجاست
// ============================================
import { useLoanRequests } from "./hooks/useLoanRequests";

import type { Status } from "./types/request";
import type { PageId } from "./types/page";


function App() {
  // ============================================
  // state های سطح اپ
  // ============================================

  // صفحه فعال (کدوم بخش نمایش داده بشه)
  const [activePage, setActivePage] = useState<PageId>("dashboard");

  // شناسه درخواست انتخاب‌شده برای نمایش جزئیات
  // چرا فقط id و نه کل آبجکت؟ چون data توی hook هست؛
  // اینجا فقط می‌گیم «کدوم درخواست رو نشون بده»
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);

  // باز/بسته بودن QuickSearch (Ctrl+K)
  const [isQuickSearchOpen, setIsQuickSearchOpen] = useState(false);

  // ============================================
  // هوک اصلی — همه‌ی داده و منطق
  // ============================================
  const loanRequests = useLoanRequests();

  // ============================================
  // باز کردن جزئیات درخواست
  // چرا useCallback؟ چون به QuickSearch پاس داده می‌شه
  // و می‌خوایم رفرنس ثابت بمونه (جلوگیری از re-render)
  // ============================================
  const openDetail = useCallback((requestId: string) => {
    setActivePage("requests");
    setSelectedRequest(requestId);
  }, []);

  // ============================================
  // میان‌بر Ctrl+K (یا Cmd+K در مک) برای جست‌وجوی سریع
  //
  // چرا useEffect؟
  //   چون باید به رویداد کلید در سطح document گوش بدیم.
  // چرا cleanup؟
  //   جلوگیری از memory leak — listener قبلی حذف می‌شه.
  // ============================================
  useEffect(() => {
    function handleShortcut(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();  // جلوگیری از رفتار پیش‌فرض مرورگر
        setIsQuickSearchOpen((open) => !open);  // toggle
      }
    }

    document.addEventListener("keydown", handleShortcut);
    return () => document.removeEventListener("keydown", handleShortcut);
  }, []);

  // ============================================
  // کلیک روی کارت مرحله در داشبورد:
  //   ۱. فیلتر همون مرحله فعال می‌شه
  //   ۲. به صفحه درخواست‌ها می‌ره
  //   ۳. هر جزئیات قبلی پاک می‌شه
  // ============================================
  function handleStageSelect(status: Status) {
    loanRequests.setActiveStatus(status);
    setSelectedRequest(null);
    setActivePage("requests");
  }

  // ============================================
  // انتخاب صفحه از منو
  //
  // چرا selectedRequest رو null می‌کنیم؟
  //   چون اگه کاربر توی جزئیات یه درخواست بود و از منو
  //   صفحه‌ی دیگه رو انتخاب کرد، باید برگرده به لیست.
  //   وگرنه گیر می‌کنه.
  // ============================================
  function handlePageChange(page: PageId) {
    setActivePage(page);
    setSelectedRequest(null);
  }

  // ============================================
  // پیدا کردن درخواست انتخاب‌شده از روی id
  //
  // چرا find؟
  //   چون state فقط id رو نگه می‌داره و data توی hook هست.
  // چرا ?? null؟
  //   اگه درخواست پیدا نشد (مثلاً حذف شده)، null برگردون.
  // ============================================
  const activeDetail = selectedRequest
    ? loanRequests.requests.find((r) => r.id === selectedRequest) ?? null
    : null;

  return (
    <>
      {/* ============================================
          پوسته اصلی — Sidebar + Topbar + BottomNav
          children = محتوای صفحه‌ی فعلی
      ============================================ */}
      <AppShell
        activePage={activePage}
        onPageChange={handlePageChange}
        onSearchClick={() => setIsQuickSearchOpen(true)}
      >
        {/* ============================================
            صفحه ۱: داشبورد — نمای کلی
            StatsGrid + نمودارها
        ============================================ */}
        {activePage === "dashboard" && (
          <DashboardPage
            requests={loanRequests.requests}
            onStageSelect={handleStageSelect}
          />
        )}

        {/* ============================================
            صفحه ۲: درخواست‌ها — دو حالت:
              الف) لیست درخواست‌ها (RequestsPage)
              ب) جزئیات یه درخواست (RequestDetail)
            کدوم؟ بستگی به selectedRequest داره.
        ============================================ */}
        {activePage === "requests" &&
          (activeDetail ? (
            <RequestDetail
              request={activeDetail}
              onBack={() => setSelectedRequest(null)}
            />
          ) : (
            // Spread: همه‌ی props هوک رو یه‌جا پاس می‌ده
            <RequestsPage {...loanRequests} onRowClick={openDetail} />
          ))}

        {/* ============================================
            صفحه ۳: کارمندان (placeholder)
        ============================================ */}
        {activePage === "employees" && (
          <PlaceholderPage
            title="کارمندان"
            description="فهرست کارکنان، سوابق تسهیلات و وضعیت بدهی"
          />
        )}

        {/* ============================================
            صفحه ۴: راهنما (placeholder)
        ============================================ */}
        {activePage === "help" && (
          <PlaceholderPage
            title="راهنمای سامانه"
            description="راهنمای گام‌به‌گام استفاده از سامانه مدیریت تسهیلات"
          />
        )}
      </AppShell>

      {/* ============================================
          QuickSearch (Ctrl+K)
          یه مودال سراسری که همیشه بالای همه‌ی محتواست
      ============================================ */}
      <QuickSearch
        requests={loanRequests.requests}
        isOpen={isQuickSearchOpen}
        onClose={() => setIsQuickSearchOpen(false)}
        onSelect={openDetail}
      />
    </>
  );
}

export default App;