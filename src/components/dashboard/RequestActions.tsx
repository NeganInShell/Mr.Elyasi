import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { MoreHorizontal, Check, Undo2, Eye } from "lucide-react";
import { workflowOrder, statusInfo } from "../../data/requests";
import type { LoanRequest, Status } from "../../types/request";

type RequestActionsProps = {
  request: LoanRequest;
  onMove: (requestId: string, status: Status) => void;
  onRevert: (requestId: string) => void;
  onView: (requestId: string) => void;
};

const MENU_WIDTH = 240;
const GAP = 6;

// جای‌دهی منو با احتساب فضای در دسترس بالا و پایین دکمه
function getMenuPosition(trigger: HTMLElement) {
  const rect = trigger.getBoundingClientRect();
  const menuHeight = 330;

  const spaceBelow = window.innerHeight - rect.bottom;
  const openUpwards = spaceBelow < menuHeight + GAP && rect.top > spaceBelow;

  const top = openUpwards
    ? Math.max(GAP, rect.top - menuHeight - GAP)
    : rect.bottom + GAP;

  const maxLeft = window.innerWidth - MENU_WIDTH - GAP;
  const left = Math.min(Math.max(GAP, rect.left - MENU_WIDTH + rect.width), maxLeft);

  return { top, left, openUpwards };
}

export default function RequestActions({
  request,
  onMove,
  onRevert,
  onView,
}: RequestActionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0, openUpwards: false });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const currentIndex = workflowOrder.indexOf(request.status);
  const previousStatus =
    currentIndex > 0 ? workflowOrder[currentIndex - 1] : undefined;

  // موقعیت منو پیش از رندر محاسبه می‌شود تا از پرش جلوگیری شود
  useLayoutEffect(() => {
    if (!isOpen || !triggerRef.current) return;

    setPosition(getMenuPosition(triggerRef.current));

    // فوکوس روی اولین آیتم منو تا کاربر با کیبورد آن را ببیند
    const frame = requestAnimationFrame(() => {
      menuRef.current?.querySelector<HTMLElement>("button:not([disabled])")?.focus();
    });

    return () => cancelAnimationFrame(frame);
  }, [isOpen]);

  // بستن با کلیک بیرون
  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (
        !triggerRef.current?.contains(target) &&
        !menuRef.current?.contains(target)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // بستن با Escape و بازگرداندن فوکوس به دکمه
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // با اسکرول یا تغییر اندازه، منو باید همراه دکمه جابه‌جا شود
  useEffect(() => {
    if (!isOpen) return;

    function reposition() {
      if (triggerRef.current) setPosition(getMenuPosition(triggerRef.current));
    }

    window.addEventListener("scroll", reposition, true);
    window.addEventListener("resize", reposition);

    return () => {
      window.removeEventListener("scroll", reposition, true);
      window.removeEventListener("resize", reposition);
    };
  }, [isOpen]);

  function handleAction(action: () => void) {
    action();
    setIsOpen(false);
    triggerRef.current?.focus();
  }

  const menu = isOpen && (
    <div
      ref={menuRef}
      id="request-actions-menu"
      role="menu"
      aria-label={`عملیات درخواست ${request.id}`}
      style={{ top: position.top, left: position.left, width: MENU_WIDTH }}
      className={`fixed z-50 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden animate-dropdown ${
        position.openUpwards ? "origin-bottom" : "origin-top"
      }`}
    >
      {/* عملیات پرکاربرد */}
      <div className="p-1 border-b border-slate-100">
        <button
          type="button"
          role="menuitem"
          onClick={() => handleAction(() => onView(request.id))}
          className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs text-slate-700 hover:bg-slate-50 transition-colors text-right"
        >
          <Eye size={14} className="shrink-0 text-slate-400" />
          <span className="flex-1">مشاهده درخواست</span>
        </button>

        <button
          type="button"
          role="menuitem"
          disabled={!previousStatus}
          onClick={() => handleAction(() => onRevert(request.id))}
          className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs transition-colors text-right ${
            previousStatus
              ? "text-amber-700 hover:bg-amber-50"
              : "text-slate-300 cursor-not-allowed"
          }`}
        >
          <Undo2 size={14} className="shrink-0" />
          <span className="flex-1">بازگردانی به مرحله قبل</span>
          {previousStatus && (
            <span className="text-[10px] opacity-70">
              {statusInfo[previousStatus].label}
            </span>
          )}
        </button>
      </div>

      {/* انتقال به مرحله دلخواه */}
      <div className="px-3 py-2 border-b border-slate-100">
        <div className="text-[10px] text-slate-400 font-medium">
          انتقال به مرحله
        </div>
      </div>

      <div className="p-1">
        {workflowOrder.map((status) => {
          const info = statusInfo[status];
          const isCurrent = request.status === status;

          return (
            <button
              key={status}
              type="button"
              role="menuitem"
              disabled={isCurrent}
              onClick={() => handleAction(() => onMove(request.id, status))}
              className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs transition-colors text-right ${
                isCurrent
                  ? "bg-brand-50 text-brand-700 cursor-not-allowed"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: info.colorHex }}
              />
              <span className="flex-1 truncate">{info.label}</span>
              {isCurrent && <Check size={14} className="text-brand-600 shrink-0" />}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen((o) => !o)}
        aria-label={`عملیات درخواست ${request.id}`}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-controls={isOpen ? "request-actions-menu" : undefined}
        className={`w-8 h-8 rounded-lg grid place-items-center transition-colors ${
          isOpen
            ? "text-brand-600 bg-brand-50"
            : "text-slate-400 hover:text-brand-600 hover:bg-brand-50"
        }`}
      >
        <MoreHorizontal size={18} />
      </button>

      {/* رندر در بیرون از ظرف جدول تا هرگز بریده نشود */}
      {menu && createPortal(menu, document.body)}
    </>
  );
}