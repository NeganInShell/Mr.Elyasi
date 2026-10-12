import {
  Wallet,
  LayoutDashboard,
  FileText,
  Users,
  CircleHelp,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import type { PageId } from "../../types/page";

type SidebarProps = {
  isOpen: boolean;
  onToggle: () => void;
  activePage: PageId;
  onPageChange: (page: PageId) => void;
};

const navItems: { id: PageId; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "dashboard", label: "داشبورد", icon: LayoutDashboard },
  { id: "requests", label: "درخواست‌ها", icon: FileText },
  { id: "employees", label: "کارمندان", icon: Users },
];

export default function Sidebar({
  isOpen,
  onToggle,
  activePage,
  onPageChange,
}: SidebarProps) {
  return (
    <aside
      className={`fixed top-0 right-0 h-screen bg-navy-900 text-slate-300 z-20 flex flex-col transition-all duration-300 ${
        isOpen ? "w-64" : "w-20"
      }`}
    >
      {/* دکمه باز/بسته — روی هدر قرار می‌گیرد تا همیشه در دسترس باشد */}
      <button
        type="button"
        onClick={onToggle}
        aria-label={isOpen ? "بستن منو" : "باز کردن منو"}
        className="absolute -left-4 top-6 w-8 h-8 rounded-full bg-white shadow-md border border-slate-200 grid place-items-center text-slate-600 hover:text-brand-600 transition-colors z-[60]"
      >
        {isOpen ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      {/* برند و لوگو */}
      <div className="flex items-center gap-3 p-4 border-b border-navy-700">
        <div className="w-10 h-10 rounded-xl bg-brand-500 text-white grid place-items-center shrink-0">
          <Wallet size={22} />
        </div>
        {isOpen && (
          <div className="min-w-0">
            <div className="text-white font-bold text-sm truncate">
              همراه سازمان
            </div>
            <div className="text-slate-400 text-[10px] mt-0.5 truncate">
              سامانه مدیریت تسهیلات
            </div>
          </div>
        )}
      </div>

      {/* منوی ناوبری */}
      <nav className="flex-1 overflow-y-auto p-3">
        {isOpen && (
          <div className="text-[11px] text-slate-500 px-3 mb-2">
            منوی اصلی
          </div>
        )}

        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;

            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => onPageChange(item.id)}
                  aria-current={isActive ? "page" : undefined}
                  title={!isOpen ? item.label : undefined}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm ${
                    isActive
                      ? "bg-brand-700 text-white"
                      : "text-slate-300 hover:bg-navy-700 hover:text-white"
                  } ${!isOpen ? "justify-center" : ""}`}
                >
                  <Icon size={19} className="shrink-0" />
                  {isOpen && <span className="truncate">{item.label}</span>}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* راهنما */}
      <div className="p-3 border-t border-navy-700">
        <button
          type="button"
          onClick={() => onPageChange("help")}
          aria-current={activePage === "help" ? "page" : undefined}
          title={!isOpen ? "راهنمای سامانه" : undefined}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm ${
            activePage === "help"
              ? "bg-brand-700 text-white"
              : "text-slate-300 hover:bg-navy-700 hover:text-white"
          } ${!isOpen ? "justify-center" : ""}`}
        >
          <CircleHelp size={18} className="shrink-0" />
          {isOpen && <span className="truncate">راهنمای سامانه</span>}
        </button>
      </div>
    </aside>
  );
}