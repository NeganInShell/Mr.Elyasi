import { LayoutDashboard, FileText, Users, CircleHelp } from "lucide-react";
import type { PageId } from "../../types/page";

type BottomNavProps = {
  activePage: PageId;
  onPageChange: (page: PageId) => void;
};

const navItems: { id: PageId; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "dashboard", label: "داشبورد", icon: LayoutDashboard },
  { id: "requests", label: "درخواست‌ها", icon: FileText },
  { id: "employees", label: "کارمندان", icon: Users },
  { id: "help", label: "راهنما", icon: CircleHelp },
];

export default function BottomNav({
  activePage,
  onPageChange,
}: BottomNavProps) {
  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-30 bg-white border-t border-slate-200 md:hidden"
      aria-label="ناوبری موبایل"
    >
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onPageChange(item.id)}
              aria-current={isActive ? "page" : undefined}
              className={`flex flex-col items-center justify-center gap-1 px-3 py-1 rounded-lg transition-colors ${
                isActive
                  ? "text-brand-600 bg-brand-50"
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
              }`}
            >
              <Icon size={20} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}