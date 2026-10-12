import { useEffect, useRef, useState } from "react";
import { ListFilter, Check, ChevronDown } from "lucide-react";
import { statusInfo } from "../../data/requests";
import type { StatusFilter } from "../../types/request";

type FilterButtonProps = {
  activeStatus: StatusFilter;
  onStatusChange: (status: StatusFilter) => void;
};

const filterOptions: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "همه مراحل" },
  { value: "initial", label: "بررسی اولیه" },
  { value: "documents", label: "تکمیل مستندات" },
  { value: "committee", label: "طرح در کمیته تسهیلات" },
  { value: "payment", label: "در انتظار پرداخت" },
];

export default function FilterButton({
  activeStatus,
  onStatusChange,
}: FilterButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const currentLabel =
    filterOptions.find((o) => o.value === activeStatus)?.label ?? "فیلتر";

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

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    }
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  // فوکوس روی اولین گزینه هنگام باز شدن منو
  useEffect(() => {
    if (!isOpen) return;
    const frame = requestAnimationFrame(() => {
      menuRef.current?.querySelector<HTMLElement>("button")?.focus();
    });
    return () => cancelAnimationFrame(frame);
  }, [isOpen]);

  function handleSelect(value: StatusFilter) {
    onStatusChange(value);
    setIsOpen(false);
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen((o) => !o)}
        aria-label="فیلتر وضعیت"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-controls={isOpen ? "status-filter-menu" : undefined}
        className="flex items-center justify-center gap-2 h-11 sm:h-10 px-3 sm:px-4 rounded-lg border border-slate-200 bg-white text-slate-600 text-sm hover:bg-slate-50 transition-colors"
      >
        <ListFilter size={16} />
        <span className="truncate max-w-[8rem]">{currentLabel}</span>
        <ChevronDown
          size={14}
          className={`transition-transform shrink-0 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div
          ref={menuRef}
          id="status-filter-menu"
          role="menu"
          aria-label="فیلتر وضعیت"
          className="absolute left-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-40 animate-dropdown"
        >
          <div className="p-1">
            {filterOptions.map((option) => {
              const isActive = activeStatus === option.value;
              const color =
                option.value === "all"
                  ? "#94a3b8"
                  : statusInfo[option.value].colorHex;

              return (
                <button
                  key={option.value}
                  type="button"
                  role="menuitemradio"
                  aria-checked={isActive}
                  onClick={() => handleSelect(option.value)}
                  className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs transition-colors text-right ${
                    isActive
                      ? "bg-brand-50 text-brand-700"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: color }}
                  />
                  <span className="flex-1 truncate">{option.label}</span>
                  {isActive && (
                    <Check size={14} className="text-brand-600 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
