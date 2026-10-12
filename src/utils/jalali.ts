//در پروژه فجر دانش وجود داشت و در اینجا استفاده شد
//برای وابسته نشدن به دیپندسی های اضافه این بخش اضافه شد

import { toFaDigits } from './formatAmount'

export type JalaliDate = { jy: number; jm: number; jd: number }

export const jalaliMonths = [
  'فروردین',
  'اردیبهشت',
  'خرداد',
  'تیر',
  'مرداد',
  'شهریور',
  'مهر',
  'آبان',
  'آذر',
  'دی',
  'بهمن',
  'اسفند'
]

// هفته در تقویم ایران از شنبه آغاز می‌شود
export const jalaliWeekdays = [
  'شنبه',
  'یکشنبه',
  'دوشنبه',
  'سه‌شنبه',
  'چهارشنبه',
  'پنجشنبه',
  'جمعه'
]

// آیا موتور تقویم، تقویم هجری شمسی را پشتیبانی می‌کند؟
const supportsPersianCalendar = new Intl.DateTimeFormat('en-u-ca-persian')
  .resolvedOptions()
  .calendar.toLowerCase()
  .includes('persian')

const jalaliFormatter = new Intl.DateTimeFormat('en-u-ca-persian', {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric'
})

function buildDate (gy: number, gm: number, gd: number): Date {
  return new Date(gy, gm - 1, gd)
}

/** تجزیه تاریخ ISO («۲۰۲۶-۱۰-۱۲») به اجزای میلادی، بدون درگیری با منطقه زمانی */
function parseIsoDate (iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number)
  const date = buildDate(y, m, d)

  // داده ناقص یا نامعتبر نباید کل رابط کاربری را خراب کند
  if (Number.isNaN(date.getTime())) return new Date()

  return date
}

/** اجزای تاریخ شمسی یک تاریخ میلادی */
export function toJalali (date: Date): JalaliDate {
  if (!supportsPersianCalendar) {
    return {
      jy: date.getFullYear(),
      jm: date.getMonth() + 1,
      jd: date.getDate()
    }
  }

  const parts = jalaliFormatter.formatToParts(date)
  const value = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find(part => part.type === type)?.value)

  return {
    jy: value('year'),
    jm: value('month'),
    jd: value('day')
  }
}

/** نام روز هفته به تقویم ایران */
export function jalaliWeekday (date: Date): string {
  return jalaliWeekdays[(date.getDay() + 1) % 7]
}

export type JalaliFormat = 'short' | 'long' | 'full'

/**
 * قالب‌بندی تاریخ ISO میلادی به تقویم همسایه با ارقام فارسی
 * short: ۱۴۰۵/۰۷/۲۰ | long: ۲۰ مهر ۱۴۰۵ | full: دوشنبه ۲۰ مهر ۱۴۰۵
 */
export function formatJalali (
  iso: string,
  format: JalaliFormat = 'short'
): string {
  const date = parseIsoDate(iso)
  const { jy, jm, jd } = toJalali(date)

  if (format === 'short') {
    return [jy, jm, jd]
      .map(part => toFaDigits(String(part).padStart(2, '0')))
      .join('/')
  }

  const label = `${toFaDigits(jd)} ${jalaliMonths[jm - 1]} ${toFaDigits(jy)}`

  return format === 'full' ? `${jalaliWeekday(date)} ${label}` : label
}

/** فاصله زمانی نسبت به امروز — «۳ روز پیش» */
export function relativeTimeFromNow (iso: string): string {
  const target = parseIsoDate(iso)
  const now = new Date()
  const today = buildDate(now.getFullYear(), now.getMonth() + 1, now.getDate())

  const diffDays = Math.round((today.getTime() - target.getTime()) / 86_400_000)

  if (diffDays <= 0) return 'امروز'
  if (diffDays === 1) return 'دیروز'
  if (diffDays < 7) return `${toFaDigits(diffDays)} روز پیش`
  if (diffDays < 30) return `${toFaDigits(Math.floor(diffDays / 7))} هفته پیش`
  if (diffDays < 365) return `${toFaDigits(Math.floor(diffDays / 30))} ماه پیش`
  return `${toFaDigits(Math.floor(diffDays / 365))} سال پیش`
}

/** ساخت تاریخ ISO میلادی با offset روز نسبت به امروز (برای داده‌ی نمونه) */
export function isoDaysAgo (days: number): string {
  const date = new Date()
  date.setDate(date.getDate() - days)

  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')

  return `${y}-${m}-${d}`
}
