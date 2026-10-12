///در این قسمت از هوش مصنوعی کمک گرفته شد برای بهبود کیفیت پروژه
//برای نرمال کردن اعداد انگلیسی به فارسی روی خروجی تاثیر زیادی داشت
const FA_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹']

// تبدیل ارقام لاتین به فارسی (شماره صفحه، تاریخ و ...)
export function toFaDigits (value: number | string): string {
  return String(value).replace(/\d/g, digit => FA_DIGITS[Number(digit)])
}

// تبدیل ارقام فارسی و عربی به لاتین (برای جست‌وجو)
export function normalizeDigits (value: string): string {
  return value
    .replace(/[\u06F0-\u06F9]/g, digit => String(digit.charCodeAt(0) - 0x06f0))
    .replace(/[\u0660-\u0669]/g, digit => String(digit.charCodeAt(0) - 0x0660))
}

/**
 * یکسان‌سازی متن فارسی برای جست‌وجو:
 * کیبورد عربی (ي/ك) → فارسی، و حذف نیم‌فاصله تا «نیک پور» با «نیک‌پور» یکی شود.
 * بدون این کار، جست‌وجوی نام‌هایی مثل «بهرام نیک‌پور» با فاصلهٔ معمولی نتیجه نمی‌داد.
 */
export function normalizePersian (value: string): string {
  return normalizeDigits(value)
    .replace(/ي/g, 'ی') // ي عربی
    .replace(/ك/g, 'ک') // ك عربی
    .replace(/[ً-ٰٟ-‏ـ]/g, '') // اعراب و نیم‌فاصله
    .toLowerCase()
}

// قالب‌بندی عدد با جداکننده هزارگان و ارقام فارسی
export function formatAmount (amount: number): string {
  return new Intl.NumberFormat('fa-IR').format(amount)
}
