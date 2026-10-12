import { useEffect, useRef, useState } from "react";
import { ChevronDown, User, Settings, LogOut, HelpCircle } from "lucide-react";

const menuItems = [
  { id: "profile", label: "پروفایل من", icon: User },
  { id: "settings", label: "تنظیمات", icon: Settings },
  { id: "help", label: "راهنما", icon: HelpCircle },
];

export default function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // بستن با کلیک بیرون
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // بستن با Escape
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative">
      {/* دکمه پروفایل */}
      <button
        type="button"
        onClick={() => setIsOpen((o) => !o)}
        aria-label="منوی کاربر"
        aria-expanded={isOpen}
        className="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-50 transition-colors"
      >
        <div className="w-9 h-9 rounded-lg bg-brand-100 text-brand-600 grid place-items-center font-bold text-sm shrink-0">
          م
        </div>
        <div className="hidden md:block text-right">
          <div className="text-xs font-bold text-slate-800">مدیر سیستم</div>
          <div className="text-[10px] text-slate-500">مدیر تسهیلات</div>
        </div>
        <ChevronDown
          size={16}
          className={`hidden md:block text-slate-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          role="menu"
          aria-label="منوی کاربر"
          className="absolute left-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50"
        >
          {/* هدر پروفایل */}
          <div className="px-4 py-3 border-b border-slate-100">
            <div className="text-sm font-bold text-slate-800">مدیر سیستم</div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              admin@company.ir
            </div>
          </div>

          {/* آیتم‌ها */}
          <div className="p-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <Icon size={16} className="text-slate-400" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* خروج */}
          <div className="p-1 border-t border-slate-100">
            <button
              type="button"
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-rose-600 hover:bg-rose-50 transition-colors"
            >
              <LogOut size={16} />
              <span>خروج از حساب</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
