import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import BottomNav from "./BottomNav";
import type { PageId } from "../../types/page";

type AppShellProps = {
  children: React.ReactNode;
  activePage: PageId;
  onPageChange: (page: PageId) => void;
  onSearchClick: () => void;
};

export default function AppShell({
  children,
  activePage,
  onPageChange,
  onSearchClick,
}: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  function handlePageChange(page: PageId) {
    onPageChange(page);
    setMobileSidebarOpen(false);
  }

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Sidebar - دسکتاپ */}
      <div className="hidden md:block">
        <Sidebar
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen((o) => !o)}
          activePage={activePage}
          onPageChange={handlePageChange}
        />
      </div>

      {/* Sidebar - موبایل (Overlay) */}
      {mobileSidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-slate-900/50 z-40 md:hidden"
            onClick={() => setMobileSidebarOpen(false)}
            aria-hidden="true"
          />
          <div className="fixed inset-y-0 right-0 w-72 z-50 md:hidden">
            <Sidebar
              isOpen={true}
              onToggle={() => setMobileSidebarOpen(false)}
              activePage={activePage}
              onPageChange={handlePageChange}
            />
          </div>
        </>
      )}

      {/* محتوای اصلی */}
      <div
        className={`transition-all duration-300 ${
          sidebarOpen ? "md:mr-64" : "md:mr-20"
        }`}
      >
        <Topbar
          onMobileMenuClick={() => setMobileSidebarOpen(true)}
          activePage={activePage}
          onSearchClick={onSearchClick}
        />

        <main className="p-4 md:p-6 lg:p-8 pb-24 md:pb-8">{children}</main>
      </div>

      {/* BottomNav - موبایل */}
      <div className="md:hidden">
        <BottomNav activePage={activePage} onPageChange={handlePageChange} />
      </div>
    </div>
  );
}