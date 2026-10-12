// ============================================
// ایمپورت آیکون‌های آماده از کتابخانه lucide-react
// نصب: npm install lucide-react
// شامل ۱۰۰۰+ آیکون SVG سبک، بدون نیاز به فایل عکس
// ============================================
import { FileText, Users, Wallet } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

// ============================================
// تایپ‌های داخلی پروژه (از لایه types)
// این‌ها ساختار داده‌ها را تعریف می‌کنند و به TS می‌گویند
// هر آبجکت باید چه فیلدهایی داشته باشد
// ============================================
import type {
  Document,
  HistoryEvent,
  Inquiry,
  LoanRequest,
  RequestDetail,
  Status
} from '../types/request'

// ============================================
// تابع isoDaysAgo از utils/jalali
// تاریخ ISO میلادی با offset روز نسبت به امروز می‌سازد
// مثال: isoDaysAgo(0) = امروز | isoDaysAgo(7) = ۷ روز پیش
// ============================================
import { isoDaysAgo } from '../utils/jalali'

// ============================================
// اطلاعات نمایشی هر وضعیت (label + رنگ)
//
// چرا Record<Status, ...>؟
//   چون همه‌ی ۴ وضعیت باید تعریف بشن.
//   اگه یکی جا بیفته، TypeScript قبل از اجرا ارور می‌ده.
//
// چرا هر وضعیت ۴ فیلد داره؟
//   label     → نام فارسی برای نمایش به کاربر
//   color     → نام رنگ برای کلاس‌های Tailwind (bg-blue-50)
//   colorHex  → کد رنگ برای inline style (بج، آیکون)
//   bgHex     → کد رنگ پس‌زمینه (کارت، بج)
// ============================================
export const statusInfo: Record<
  Status,
  { label: string; color: string; colorHex: string; bgHex: string }
> = {
  initial: {
    label: 'بررسی اولیه',
    color: 'blue',
    colorHex: '#4670dc',
    bgHex: '#eaf0ff'
  },
  documents: {
    label: 'تکمیل مستندات',
    color: 'amber',
    colorHex: '#bd8524',
    bgHex: '#fff4dd'
  },
  committee: {
    label: 'طرح در کمیته تسهیلات',
    color: 'purple',
    colorHex: '#8660d6',
    bgHex: '#f1eaff'
  },
  payment: {
    label: 'در انتظار پرداخت',
    color: 'green',
    colorHex: '#219a70',
    bgHex: '#e0f7ed'
  }
}

// ============================================
// ترتیب مراحل گردش کار
//
// چرا آرایه؟
//   ۱. مرحله بعد/قبل را از index استخراج می‌کنیم
//   ۲. اگه فردا مرحله‌ای اضافه شد، فقط یه عضو اضافه می‌شه
//   ۳. برای لوپ روی مراحل (Timeline، نمودار دونات) استفاده می‌شه
// ============================================
export const workflowOrder: Status[] = [
  'initial',
  'documents',
  'committee',
  'payment'
]

// ============================================
// تنظیمات کارت‌های داشبورد (StatsGrid)
//
// StageConfig = قرارداد هر کارت
//   id          → کدوم وضعیت
//   icon        → خود کامپوننت آیکون (نه اسمش) — بعداً <Icon /> می‌شه
//   description → توضیح کوتاه زیر کارت
//
// نکته: LucideIcon یه تایپ از lucide-react هست که می‌گه
// «این فیلد یه کامپوننت آیکون هست، نه string یا number»
// ============================================
export type StageConfig = {
  id: Status
  icon: LucideIcon
  description: string
}

export const stages: StageConfig[] = [
  {
    id: 'initial',
    icon: FileText,
    description: 'در انتظار بررسی'
  },
  {
    id: 'documents',
    icon: FileText,
    description: 'نیازمند تکمیل مدارک'
  },
  {
    id: 'committee',
    icon: Users,
    description: 'در انتظار تصمیم کمیته'
  },
  {
    id: 'payment',
    icon: Wallet,
    description: 'آماده پرداخت'
  }
]

// ============================================
// داده‌های نمونه — ۳۰ درخواست دستی
//
// چرا isoDaysAgo؟
//   چون می‌خوایم تاریخ‌ها «نسبی به امروز» باشن، نه یه تاریخ ثابت.
//   isoDaysAgo(0) = امروز | isoDaysAgo(1) = دیروز | isoDaysAgo(29) = ۲۹ روز پیش
//   مزیت: هر بار اجرا، داده‌ها تازه‌ان، نه قدیمی و ثابت.
//
// چرا ۳۰ تا؟
//   ۱. برای صفحه‌بندی کافیه (۳ صفحه × ۱۰ ردیف)
//   ۲. نمودارها داده‌ی کافی دارن
//   ۳. همه‌ی ۴ وضعیت نماینده دارن
// ============================================
export const initialRequests: LoanRequest[] = [
  // ---------- بررسی اولیه (initial) ----------
  {
    id: 'LN-1405-001',
    employee: 'علی محمدی',
    department: 'فناوری اطلاعات',
    amount: 150_000_000,
    date: isoDaysAgo(0),
    status: 'initial'
  },
  {
    id: 'LN-1405-002',
    employee: 'سارا احمدی',
    department: 'منابع انسانی',
    amount: 80_000_000,
    date: isoDaysAgo(1),
    status: 'initial'
  },
  {
    id: 'LN-1405-003',
    employee: 'محمد رضایی',
    department: 'مالی',
    amount: 200_000_000,
    date: isoDaysAgo(2),
    status: 'initial'
  },
  {
    id: 'LN-1405-004',
    employee: 'نگار کریمی',
    department: 'فروش',
    amount: 100_000_000,
    date: isoDaysAgo(3),
    status: 'initial'
  },
  {
    id: 'LN-1405-005',
    employee: 'امیر حسینی',
    department: 'فناوری اطلاعات',
    amount: 120_000_000,
    date: isoDaysAgo(4),
    status: 'initial'
  },
  {
    id: 'LN-1405-006',
    employee: 'زهرا موسوی',
    department: 'بازاریابی',
    amount: 90_000_000,
    date: isoDaysAgo(5),
    status: 'initial'
  },
  {
    id: 'LN-1405-007',
    employee: 'رضا نوری',
    department: 'تولید',
    amount: 180_000_000,
    date: isoDaysAgo(6),
    status: 'initial'
  },
  {
    id: 'LN-1405-008',
    employee: 'مریم شریفی',
    department: 'پشتیبانی',
    amount: 70_000_000,
    date: isoDaysAgo(7),
    status: 'initial'
  },

  // ---------- تکمیل مستندات (documents) ----------
  {
    id: 'LN-1405-009',
    employee: 'حسین کاظمی',
    department: 'فناوری اطلاعات',
    amount: 130_000_000,
    date: isoDaysAgo(8),
    status: 'documents'
  },
  {
    id: 'LN-1405-010',
    employee: 'فاطمه یوسفی',
    department: 'منابع انسانی',
    amount: 95_000_000,
    date: isoDaysAgo(9),
    status: 'documents'
  },
  {
    id: 'LN-1405-011',
    employee: 'بهنام اسدی',
    department: 'مالی',
    amount: 175_000_000,
    date: isoDaysAgo(10),
    status: 'documents'
  },
  {
    id: 'LN-1405-012',
    employee: 'نازنین قاسمی',
    department: 'فروش',
    amount: 85_000_000,
    date: isoDaysAgo(11),
    status: 'documents'
  },
  {
    id: 'LN-1405-013',
    employee: 'سعید مرادی',
    department: 'تولید',
    amount: 160_000_000,
    date: isoDaysAgo(12),
    status: 'documents'
  },
  {
    id: 'LN-1405-014',
    employee: 'الهام رستمی',
    department: 'بازاریابی',
    amount: 110_000_000,
    date: isoDaysAgo(13),
    status: 'documents'
  },
  {
    id: 'LN-1405-015',
    employee: 'کاوه صادقی',
    department: 'پشتیبانی',
    amount: 75_000_000,
    date: isoDaysAgo(14),
    status: 'documents'
  },

  // ---------- طرح در کمیته (committee) ----------
  {
    id: 'LN-1405-016',
    employee: 'شیما بهرامی',
    department: 'فناوری اطلاعات',
    amount: 145_000_000,
    date: isoDaysAgo(15),
    status: 'committee'
  },
  {
    id: 'LN-1405-017',
    employee: 'آرش کریمی',
    department: 'منابع انسانی',
    amount: 88_000_000,
    date: isoDaysAgo(16),
    status: 'committee'
  },
  {
    id: 'LN-1405-018',
    employee: 'پریسا حیدری',
    department: 'مالی',
    amount: 190_000_000,
    date: isoDaysAgo(17),
    status: 'committee'
  },
  {
    id: 'LN-1405-019',
    employee: 'مهدی اکبری',
    department: 'فروش',
    amount: 105_000_000,
    date: isoDaysAgo(18),
    status: 'committee'
  },
  {
    id: 'LN-1405-020',
    employee: 'سحر جعفری',
    department: 'تولید',
    amount: 165_000_000,
    date: isoDaysAgo(19),
    status: 'committee'
  },
  {
    id: 'LN-1405-021',
    employee: 'یاسر رحیمی',
    department: 'بازاریابی',
    amount: 92_000_000,
    date: isoDaysAgo(20),
    status: 'committee'
  },

  // ---------- در انتظار پرداخت (payment) ----------
  {
    id: 'LN-1405-022',
    employee: 'مینا صالحی',
    department: 'فناوری اطلاعات',
    amount: 155_000_000,
    date: isoDaysAgo(21),
    status: 'payment'
  },
  {
    id: 'LN-1405-023',
    employee: 'فرزاد توکلی',
    department: 'منابع انسانی',
    amount: 82_000_000,
    date: isoDaysAgo(22),
    status: 'payment'
  },
  {
    id: 'LN-1405-024',
    employee: 'لیلا نجفی',
    department: 'مالی',
    amount: 210_000_000,
    date: isoDaysAgo(23),
    status: 'payment'
  },
  {
    id: 'LN-1405-025',
    employee: 'کامران شاهی',
    department: 'فروش',
    amount: 115_000_000,
    date: isoDaysAgo(24),
    status: 'payment'
  },
  {
    id: 'LN-1405-026',
    employee: 'رویا امینی',
    department: 'تولید',
    amount: 170_000_000,
    date: isoDaysAgo(25),
    status: 'payment'
  },
  {
    id: 'LN-1405-027',
    employee: 'پیمان فرهادی',
    department: 'بازاریابی',
    amount: 98_000_000,
    date: isoDaysAgo(26),
    status: 'payment'
  },
  {
    id: 'LN-1405-028',
    employee: 'هدیه سلطانی',
    department: 'پشتیبانی',
    amount: 78_000_000,
    date: isoDaysAgo(27),
    status: 'payment'
  },
  {
    id: 'LN-1405-029',
    employee: 'بابک مرادی',
    department: 'فناوری اطلاعات',
    amount: 140_000_000,
    date: isoDaysAgo(28),
    status: 'payment'
  },
  {
    id: 'LN-1405-030',
    employee: 'نرگس دهقان',
    department: 'منابع انسانی',
    amount: 87_000_000,
    date: isoDaysAgo(29),
    status: 'payment'
  }
]

// ============================================
// داده‌های تولیدشده — ۴۲ درخواست اضافی
//
// چرا تولیدشده؟
//   نوشتن دستی ۷۲ تا درخواست وقت‌گیره و تکراریه.
//   با .map() و فرمول‌های ساده، داده‌ی متنوع می‌سازیم.
// ============================================

const extraNames = [
  'محمدعلی رستمی',
  'زینب احمدی',
  'حسین میرزایی',
  'فاطمه کاظمی',
  'امیر جهانی',
  'مریم رضایی',
  'سعید باقری',
  'نرگس موسوی',
  'مهدی نصیری',
  'الهه صادقی',
  'رضا خلیلی',
  'سارا یزدانی',
  'میلاد طاهری',
  'پریسا رحیمی',
  'حمید فرهادی',
  'شیرین امیری',
  'بهرام نیک‌پور',
  'نسرین اسلامی',
  'کامران زمانی',
  'لیلا شریفی',
  'آرش دلاور',
  'مرجان وثوقی',
  'سیاوش غفاری',
  'رویا مرادی',
  'فرهاد اکبری',
  'سمیه صدیقی',
  'پیمان حیدری',
  'الهام نوروزی',
  'مسعود کاظمی',
  'کیمیا شاهین',
  'نوید طوسی',
  'شیرین‌تره عبدالی',
  'یاسین برهان',
  'هستی کریمی',
  'میلاد ترابی',
  'رامین ذوالفقاری',
  'آناهیتا رستمی',
  'بهرام نجفی',
  'گلناز موحد',
  'امیرحسین سلطانی',
  'پریسا آذری',
  'حامد فروتن'
]

const allDepartments = [
  'فناوری اطلاعات',
  'منابع انسانی',
  'مالی',
  'فروش',
  'تولید',
  'بازاریابی',
  'پشتیبانی',
  'حقوقی'
]

// ============================================
// فرمول‌های تولید داده:
//   id:         index + 31 → ادامه شماره‌گذاری از ۳۱
//               String(...).padStart(3, "0") → سه‌رقمی کن (031)
//   department: index % 8 → چرخشی بین ۸ واحد (توزیع یکنواخت)
//   amount:     (index * 13) % 15 → عدد ۰ تا ۱۴ (تنوع بدون الگوی واضح)
//               * 10_000_000 + 70_000_000 → بین ۷۰ تا ۲۱۰ میلیون
//   date:       30 + index*2 → هر درخواست ۲ روز فاصله
//               + (index % 3) → یه کم تصادفی‌سازی
//   status:     index % 4 → چرخشی بین ۴ وضعیت
// ============================================
const extraRequests: LoanRequest[] = extraNames.map((employee, index) => ({
  id: `LN-1405-${String(index + 31).padStart(3, '0')}`,
  employee,
  department: allDepartments[index % allDepartments.length],
  amount: 70_000_000 + ((index * 13) % 15) * 10_000_000,
  date: isoDaysAgo(30 + index * 2 + (index % 3)),
  status: workflowOrder[index % workflowOrder.length]
}))

// ============================================
// فهرست نهایی — ترکیب داده‌های دستی + تولیدشده (۷۲ درخواست)
//
// چرا Spread Operator (...)؟
//   ۱. آرایه‌ی جدید می‌سازه (immutability)
//   ۲. ساده و خواناتره
//   ۳. دو آرایه رو یه‌جا می‌کنه بدون تغییر اصلشون
// ============================================
export const allRequests: LoanRequest[] = [...initialRequests, ...extraRequests]

// ============================================
// تولید جزئیات کامل بر اساس وضعیت درخواست
//
// چرا این تابع؟
//   توی صفحه‌ی RequestDetail، برای هر درخواست به مدارک/استعلام/تاریخچه نیاز داریم.
//   چون بک‌اند نداریم، این تابع داده‌ی نمایشی هوشمند می‌سازه.
//
// منطق کلیدی:
//   هرچی وضعیت «جلوتر»، جزئیات «کامل‌تر» می‌شه.
//   initial   → ۱ مدرک تأیید، ۱ استعلام، ۱ رویداد
//   documents → ۲ مدرک تأیید، ۲ استعلام، ۲ رویداد
//   committee → ۳ مدرک تأیید، ۳ استعلام، ۳ رویداد
//   payment   → ۴ مدرک تأیید، ۳ استعلام، ۵ رویداد
// ============================================
export function getRequestDetail (request: LoanRequest): RequestDetail {
  // ---------- بخش ۱: مدارک ----------
  // تعداد مدارک تأییدشده بر اساس وضعیت
  const approvedDocCount =
    request.status === 'initial'
      ? 1
      : request.status === 'documents'
      ? 2
      : request.status === 'committee'
      ? 3
      : 4

  // Omit<Document, "status"> → همه‌ی فیلدهای Document به جز status
  // چون status رو جدا حساب می‌کنیم
  const allDocs: Omit<Document, 'status'>[] = [
    {
      id: 'doc1',
      name: 'فرم درخواست تسهیلات',
      type: 'pdf',
      uploadedAt: request.date
    },
    { id: 'doc2', name: 'فیش حقوقی', type: 'pdf', uploadedAt: request.date },
    {
      id: 'doc3',
      name: 'مدارک هویتی',
      type: 'image',
      uploadedAt: request.date
    },
    { id: 'doc4', name: 'گواهی اشتغال', type: 'pdf', uploadedAt: request.date }
  ]

  // با .map() و شرط index، وضعیت هر مدرک رو تعیین می‌کنیم
  // اولی‌ها approved، بقیه pending
  const documents: Document[] = allDocs.map((doc, index) => ({
    ...doc,
    status: index < approvedDocCount ? 'approved' : 'pending'
  }))

  // ---------- بخش ۲: استعلام‌ها ----------
  const approvedInquiryCount =
    request.status === 'initial' ? 1 : request.status === 'documents' ? 2 : 3

  const allInquiries: Omit<Inquiry, 'status'>[] = [
    {
      id: 'inq1',
      department: 'منابع انسانی',
      respondedAt: request.date,
      note: 'تأیید می‌شود'
    },
    {
      id: 'inq2',
      department: 'امور مالی',
      respondedAt: request.date,
      note: 'بدون بدهی'
    },
    {
      id: 'inq3',
      department: 'حراست',
      respondedAt: request.date,
      note: 'تأیید امنیتی'
    }
  ]

  const inquiries: Inquiry[] = allInquiries.map((inq, index) => {
    const isApproved = index < approvedInquiryCount
    return {
      id: inq.id,
      department: inq.department,
      status: isApproved ? 'approved' : 'pending',
      // اگه تأیید نشده، respondedAt و note رو undefined بذار
      respondedAt: isApproved ? inq.respondedAt : undefined,
      note: isApproved ? inq.note : undefined
    }
  })

  // ---------- بخش ۳: تاریخچه ----------
  // چرا push و شرط؟ چون هر وضعیت، رویدادهای بیشتر و متفاوتی داره
  const baseHistory: HistoryEvent[] = [
    {
      id: 'h1',
      action: 'ثبت درخواست',
      actor: request.employee,
      date: request.date,
      time: '۰۹:۳۰'
    }
  ]

  if (request.status !== 'initial') {
    baseHistory.push({
      id: 'h2',
      action: 'تأیید منابع انسانی',
      actor: 'مدیر منابع انسانی',
      date: request.date,
      time: '۱۱:۰۰'
    })
  }

  if (request.status === 'committee' || request.status === 'payment') {
    baseHistory.push({
      id: 'h3',
      action: 'ارسال به کمیته تسهیلات',
      actor: 'مدیر منابع انسانی',
      date: request.date,
      time: '۱۴:۱۵'
    })
  }

  if (request.status === 'payment') {
    baseHistory.push({
      id: 'h4',
      action: 'تصویب در کمیته تسهیلات',
      actor: 'کمیته تسهیلات',
      date: request.date,
      time: '۱۶:۳۰'
    })
    baseHistory.push({
      id: 'h5',
      action: 'ارسال به صف پرداخت',
      actor: 'سیستم',
      date: request.date,
      time: '۱۶:۳۵'
    })
  }

  return {
    request,
    documents,
    inquiries,
    history: baseHistory
  }
}