export type PageId = 'dashboard' | 'requests' | 'employees' | 'help'

export const pageTitles: Record<PageId, { label: string; parent: string }> = {
  dashboard: { label: 'نمای کلی', parent: 'داشبورد' },
  requests: { label: 'درخواست ها', parent: 'مدیریت تسهیلات' },
  employees: { label: 'کارمندان', parent: 'مدیریت تسهیلایت' },
  help: { label: 'راهنمای سامانه', parent: 'پشتیبانی' }
}
