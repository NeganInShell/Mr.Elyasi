import { Menu, Search } from "lucide-react";
import NotificationDropdown from "../ui/NotificationDropdown";
import ProfileDropdown from "../ui/ProfileDropdown";
import { pageTitles } from "../../types/page";
import type { PageId } from "../../types/page";

type TopbarProps = {
  onMobileMenuClick: () => void;
  activePage: PageId;
  onSearchClick: () => void;
};

export default function Topbar({
  onMobileMenuClick,
  activePage,
  onSearchClick,
}: TopbarProps) {
  const current = pageTitles[activePage];

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 h-16 px-4 md:px-6 flex items-center justify-between gap-4">
      {/* سمت راست: دکمه منو + بردکرامب */}
      <div className="flex items-center gap-3 min-w-0">
        {/* دکمه همبرگری - فقط موبایل */}
        <button
          type="button"
          onClick={onMobileMenuClick}
          aria-label="باز کردن منو"
          className="md:hidden w-10 h-10 rounded-lg grid place-items-center text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <Menu size={20} />
        </button>

        {/* بردکرامب */}
        <div className="flex items-center gap-2 text-sm min-w-0">
          <span className="text-slate-400 hidden sm:inline truncate">
            {current.parent}
          </span>
          <span className="text-slate-300 hidden sm:inline">/</span>
          <span className="font-medium text-slate-700 truncate">
            {current.label}
          </span>
        </div>
      </div>

      {/* سمت چپ: اکشن‌ها */}
      <div className="flex items-center gap-2 md:gap-3 shrink-0">
        <button
          type="button"
          onClick={onSearchClick}
          aria-label="جست‌وجوی سریع"
          className="hidden sm:flex items-center gap-2 h-9 px-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-400 hover:border-slate-300 hover:bg-white transition-colors"
        >
          <Search size={15} />
          <span className="text-xs">جست‌وجوی سریع</span>
          <kbd className="hidden md:inline px-1.5 py-0.5 rounded border border-slate-200 bg-white text-[10px] font-sans text-slate-500">
            Ctrl K
          </kbd>
        </button>

        <button
          type="button"
          onClick={onSearchClick}
          aria-label="جست‌وجوی سریع"
          className="sm:hidden w-10 h-10 rounded-lg grid place-items-center text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <Search size={19} />
        </button>

        <NotificationDropdown />
        <ProfileDropdown />
      </div>
    </header>
  );
}