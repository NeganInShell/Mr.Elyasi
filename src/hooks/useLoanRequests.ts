// ============================================
// هوک‌های React:
//   useState         → نگه‌داشتن state
//   useMemo          → بهینه‌سازی محاسبات سنگین (کش کردن)
//   useDeferredValue → تأخیر در مقدار (برای تایپ روان)
// ============================================
import { useDeferredValue, useMemo, useState } from 'react'

// ============================================
// داده‌های اولیه و ترتیب مراحل
// allRequests → ۷۲ درخواست (۳۰ دستی + ۴۲ تولیدشده)
// workflowOrder → ["initial", "documents", "committee", "payment"]
// ============================================
import { allRequests, workflowOrder } from '../data/requests'

// ============================================
// normalizePersian → یکسان‌سازی متن فارسی برای جستجو
//   ي عربی → ی فارسی
//   ك عربی → ک فارسی
//   حذف نیم‌فاصله و اعراب
//   ارقام فارسی/عربی → لاتین
// چرا؟ چون کاربر ممکنه با کیبورد عربی یا ارقام فارسی تایپ کنه
// ============================================
import { normalizePersian } from '../utils/formatAmount'

import type {
  LoanRequest,
  SortConfig,
  SortField,
  Status,
  StatusFilter
} from '../types/request'

// ============================================
// ثابت‌ها
// ============================================

// تعداد ردیف در هر صفحه (پیش‌فرض)
const DEFAULT_PAGE_SIZE = 10

// پیش‌فرض: تازه‌ترین درخواست‌ها بالای فهرست
const DEFAULT_SORT: SortConfig = { field: 'date', direction: 'desc' }

// ============================================
// collator → مقایسه‌گر رشته‌های فارسی
// چرا؟ چون localeCompare ساده، ترتیب حروف فارسی رو درست نمی‌ده.
// Intl.Collator("fa") ترتیب الفبای فارسی رو رعایت می‌کنه.
// ============================================
const collator = new Intl.Collator('fa')

// ============================================
// هوک اصلی مدیریت درخواست‌ها
//
// چرا هوک جدا؟
//   تمام منطق داده، فیلتر، جستجو، صفحه‌بندی و انتخاب گروهی اینجاست.
//   صفحات فقط UI رو نشون می‌دن.
//
// مزیت:
//   اگه فردا بک‌اند اضافه شد، فقط همین فایل تغییر می‌کنه.
//   UI دست‌نخورده می‌مونه.
// ============================================
export function useLoanRequests () {
  // ============================================
  // state های اصلی
  // ============================================

  // لیست کامل درخواست‌ها (منبع اصلی)
  const [requests, setRequests] = useState<LoanRequest[]>(allRequests)

  // فیلتر وضعیت (پیش‌فرض: همه مراحل)
  const [activeStatus, setActiveStatusState] = useState<StatusFilter>('all')

  // متن جستجو (خام — همون چیزی که کاربر تایپ می‌کنه)
  const [search, setSearchState] = useState('')

  // صفحه فعلی (از ۱ شروع می‌شه)
  const [page, setPage] = useState(1)

  // تعداد ردیف در هر صفحه
  const [pageSize, setPageSizeState] = useState(DEFAULT_PAGE_SIZE)

  // شناسه درخواست‌های انتخاب‌شده (برای عملیات گروهی)
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  // تنظیمات مرتب‌سازی (کدوم ستون، صعودی/نزولی)
  const [sort, setSortState] = useState<SortConfig>(DEFAULT_SORT)

  // ============================================
  // بهینه‌سازی جستجو
  // ============================================

  // چرا useDeferredValue؟
  //   تایپ کاربر بلافاصله در ورودی نمایش داده می‌شه،
  //   ولی فیلتر با تأخیر کوتاه اجرا می‌شه.
  //   مزیت: با ۷۲ تا داده، تایپ روان می‌مونه.
  const deferredQuery = useDeferredValue(search)

  // کاربر ممکنه با ارقام فارسی یا کیبورد عربی تایپ کنه
  // normalizePersian همه رو یکسان می‌کنه
  const query = normalizePersian(deferredQuery)

  // ============================================
  // فیلتر کردن
  // ============================================

  // useMemo → نتیجه رو کش می‌کنه
  // چرا؟ چون فیلتر روی ۷۲ تا داده، محاسبه‌ی سنگینیه.
  // فقط وقتی requests یا activeStatus یا query تغییر کنه، دوباره حساب می‌شه.
  const filteredRequests = useMemo(() => {
    // حالت ۱: جستجو خالیه → فقط فیلتر وضعیت
    if (query === '') {
      return activeStatus === 'all'
        ? requests
        : requests.filter(request => request.status === activeStatus)
    }

    // حالت ۲: جستجو داریم → فیلتر وضعیت + جستجو
    return requests.filter(request => {
      const matchesStatus =
        activeStatus === 'all' || request.status === activeStatus

      // جستجو در: نام کارمند، شماره درخواست، واحد سازمانی
      // نکته: هر سه فیلد نرمال‌سازی می‌شن (چون کاربر ممکنه عربی/فارسی تایپ کنه)
      const matchesSearch =
        normalizePersian(request.employee).includes(query) ||
        normalizePersian(request.id).includes(query) ||
        normalizePersian(request.department).includes(query)

      return matchesStatus && matchesSearch
    })
  }, [requests, activeStatus, query])

  // ============================================
  // مرتب‌سازی
  // ============================================

  const visibleRequests = useMemo(() => {
    // کپی از آرایه (چون sort آرایه اصلی رو تغییر می‌ده)
    const sorted = [...filteredRequests]

    sorted.sort((a, b) => {
      let result: number

      switch (sort.field) {
        case 'amount':
          // مبلغ عدد خامه → تفریق کافیه
          result = a.amount - b.amount
          break

        case 'date':
          // تاریخ‌ها ISO هستن (YYYY-MM-DD)
          // پس مقایسه‌ی متنی = مقایسه‌ی تاریخی
          result = a.date.localeCompare(b.date)
          break

        case 'department':
          // collator → مقایسه‌ی الفبای فارسی
          result = collator.compare(a.department, b.department)
          break

        default:
          // پیش‌فرض: name کارمند
          result = collator.compare(a.employee, b.employee)
      }

      // ترتیب پایدار: اگه دو تا مساوی بودن، بر اساس شماره درخواست
      // چرا؟ چون مرتب‌سازی پایدار، UX بهتری می‌ده
      if (result === 0) result = a.id.localeCompare(b.id)

      // جهت: صعودی یا نزولی
      return sort.direction === 'asc' ? result : -result
    })

    return sorted
  }, [filteredRequests, sort])

  // ============================================
  // صفحه‌بندی
  // ============================================

  // تعداد کل صفحات
  const pageCount = Math.max(1, Math.ceil(visibleRequests.length / pageSize))

  // صفحه فعلی (اگه از محدوده خارج شد، برمی‌گرده به آخرین صفحه معتبر)
  // چرا؟ چون وقتی فیلتر عوض می‌شه، ممکنه صفحه فعلی دیگه وجود نداشته باشه
  const currentPage = Math.min(page, pageCount)

  // ردیف‌های صفحه جاری
  const pagedRequests = useMemo(
    () =>
      visibleRequests.slice(
        (currentPage - 1) * pageSize, // شروع
        currentPage * pageSize // پایان
      ),
    [visibleRequests, currentPage, pageSize]
  )

  // ============================================
  // اکشن‌ها (توابع تغییر state)
  // ============================================

  // تغییر فیلتر وضعیت
  // چرا page و selectedIds ریست می‌شن؟
  //   چون با فیلتر جدید، صفحه فعلی و انتخاب‌ها ممکنه بی‌معنی باشن
  function setActiveStatus (status: StatusFilter) {
    setActiveStatusState(status)
    setPage(1)
    setSelectedIds([])
  }

  // تغییر متن جستجو (همون دلیل بالا)
  function setSearch (value: string) {
    setSearchState(value)
    setPage(1)
    setSelectedIds([])
  }

  // مرتب‌سازی:
  //   کلیک روی همون ستون → جهت معکوس
  //   کلیک روی ستون جدید → از نزولی شروع
  function toggleSort (field: SortField) {
    setSortState(current => ({
      field,
      direction:
        current.field === field && current.direction === 'desc' ? 'asc' : 'desc'
    }))
    setPage(1)
  }

  // تغییر تعداد ردیف در هر صفحه
  function setPageSize (size: number) {
    setPageSizeState(size)
    setPage(1)
  }

  // ============================================
  // عملیات روی درخواست‌ها
  // ============================================

  // انتقال یک درخواست به وضعیت مشخص
  function moveRequest (requestId: string, status: Status) {
    setRequests(current =>
      current.map(request =>
        request.id === requestId ? { ...request, status } : request
      )
    )
    // بعد از انتقال، از انتخاب‌ها حذف کن
    setSelectedIds(ids => ids.filter(id => id !== requestId))
  }

  // بازگرداندن یک درخواست به مرحله قبل
  // چرا از moveRequest استفاده نمی‌کنیم؟
  //   چون اینجا باید «مرحله قبل» رو حساب کنیم
  function revertRequest (requestId: string) {
    const target = requests.find(request => request.id === requestId)
    if (!target) return

    const index = workflowOrder.indexOf(target.status)
    if (index <= 0) return // مرحله اول، قبلی نداره

    moveRequest(requestId, workflowOrder[index - 1])
  }

  // بازگرداندن گروهی: هر درخواست یه مرحله به عقب
  function bulkRevert () {
    const selectedIdSet = new Set(selectedIds)

    setRequests(current =>
      current.map(request => {
        if (!selectedIdSet.has(request.id)) return request

        const index = workflowOrder.indexOf(request.status)
        if (index <= 0) return request // مرحله اول، رد شو

        return { ...request, status: workflowOrder[index - 1] }
      })
    )

    setSelectedIds([])
  }

  // چند درخواست انتخاب‌شده قابلیت بازگردانی دارن؟
  // چرا؟ چون اگه همه توی مرحله اول باشن، دکمه بازگردانی باید غیرفعال بشه
  const revertibleCount = requests.filter(
    request =>
      selectedIds.includes(request.id) &&
      workflowOrder.indexOf(request.status) > 0
  ).length

  // ============================================
  // انتخاب
  // ============================================

  // انتخاب/لغو انتخاب یک درخواست
  function toggleSelection (requestId: string) {
    setSelectedIds(
      ids =>
        ids.includes(requestId)
          ? ids.filter(id => id !== requestId) // حذف
          : [...ids, requestId] // اضافه
    )
  }

  // انتخاب/لغو انتخاب همه ردیف‌های صفحه جاری
  // نکته: فقط ردیف‌های همین صفحه، نه کل دیتا
  function toggleAllOnPage () {
    const pageIds = pagedRequests.map(request => request.id)

    const allSelected =
      pageIds.length > 0 && pageIds.every(id => selectedIds.includes(id))

    if (allSelected) {
      // لغو انتخاب همه
      setSelectedIds(ids => ids.filter(id => !pageIds.includes(id)))
      return
    }

    // اضافه کردن همه (با Set برای حذف تکراری)
    setSelectedIds(ids => [...new Set([...ids, ...pageIds])])
  }

  // انتقال گروهی
  function bulkMove (status: Status) {
    if (selectedIds.length === 0) return

    const selectedIdSet = new Set(selectedIds)

    setRequests(current =>
      current.map(request =>
        selectedIdSet.has(request.id) ? { ...request, status } : request
      )
    )

    setSelectedIds([])
  }

  // ============================================
  // خروجی هوک
  // همه‌ی state ها و توابعی که UI نیاز داره
  // ============================================
  return {
    // داده‌ها
    requests,
    visibleRequests,
    pagedRequests,
    // فیلتر و جستجو
    activeStatus,
    search,
    // مرتب‌سازی
    sort,
    // صفحه‌بندی
    page: currentPage,
    pageSize,
    pageCount,
    // انتخاب
    selectedIds,
    revertibleCount,
    allPageSelected:
      pagedRequests.length > 0 &&
      pagedRequests.every(request => selectedIds.includes(request.id)),
    // اکشن‌ها
    setActiveStatus,
    setSearch,
    toggleSort,
    setPage,
    setPageSize,
    toggleSelection,
    toggleAllOnPage,
    moveRequest,
    revertRequest,
    bulkMove,
    bulkRevert
  }
}
