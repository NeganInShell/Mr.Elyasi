import { useEffect, useRef, useState } from "react";
import { Bell, CheckCheck, Info, AlertCircle } from "lucide-react";

type Notification = {
  id: string;
  title: string;
  description: string;
  time: string;
  type: "info" | "success" | "warning";
  read: boolean;
};

const mockNotifications: Notification[] = [
  {
    id: "n1",
    title: "درخواست جدید",
    description: "درخواست تسهیلات علی محمدی ثبت شد",
    time: "۵ دقیقه پیش",
    type: "info",
    read: false,
  },
  {
    id: "n2",
    title: "تأیید کمیته",
    description: "درخواست سارا احمدی به مرحله پرداخت رفت",
    time: "۱ ساعت پیش",
    type: "success",
    read: false,
  },
  {
    id: "n3",
    title: "نقص مدارک",
    description: "مدارک درخواست محمد رضایی کامل نیست",
    time: "۳ ساعت پیش",
    type: "warning",
    read: true,
  },
];

const iconMap = {
  info: Info,
  success: CheckCheck,
  warning: AlertCircle,
};

const colorMap = {
  info: "text-brand-500 bg-brand-50",
  success: "text-emerald-500 bg-emerald-50",
  warning: "text-amber-500 bg-amber-50",
};

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  const containerRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

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

  function markAllAsRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  return (
    <div ref={containerRef} className="relative">
      {/* دکمه اعلان‌ها */}
      <button
        type="button"
        onClick={() => setIsOpen((o) => !o)}
        aria-label={`اعلان‌ها (${unreadCount} خوانده‌نشده)`}
        aria-expanded={isOpen}
        className="relative w-10 h-10 rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-brand-600 hover:bg-brand-50 hover:border-brand-200 transition-colors grid place-items-center"
      >
        <Bell size={19} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 text-white text-[10px] font-bold grid place-items-center">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          role="menu"
          aria-label="اعلان‌ها"
          className="absolute left-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50"
        >
          {/* هدر */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
            <div className="text-sm font-bold text-slate-800">اعلان‌ها</div>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="text-[11px] text-brand-600 hover:text-brand-700 font-medium"
              >
                خواندن همه
              </button>
            )}
          </div>

          {/* لیست */}
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-sm">
                اعلانی وجود ندارد
              </div>
            ) : (
              notifications.map((n) => {
                const Icon = iconMap[n.type];
                return (
                  <button
                    key={n.id}
                    type="button"
                    className={`w-full flex items-start gap-3 px-4 py-3 text-right transition-colors hover:bg-slate-50 border-b border-slate-50 last:border-0 ${
                      !n.read ? "bg-brand-50/30" : ""
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-lg grid place-items-center shrink-0 ${colorMap[n.type]}`}
                    >
                      <Icon size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-800">
                          {n.title}
                        </span>
                        {!n.read && (
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">
                        {n.description}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1">
                        {n.time}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* فوتر */}
          <div className="border-t border-slate-100 p-2">
            <button
              type="button"
              className="w-full text-center py-2 text-xs text-brand-600 hover:bg-brand-50 rounded-lg font-medium transition-colors"
            >
              مشاهده همه اعلان‌ها
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
