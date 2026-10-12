export type Status =
| "initial"
| "documents"
| "committee"
| "payment";

//ساختار تسهیلات 
export type LoanRequest = {
  id:string;
  employee: string;
  department: string;
  amount: number;
  date: string;
  status: Status;
};

//سند مدرک پیوست
export type Document = {
  id: string;
  name: string;
  type: "pdf" | "image" | "doc";
  status: "approved" | "pending" | "rejected";
  uploadedAt: string;

};

//مرحله استعلام گیری
export type Inquiry = {
  id: string;
  department: string;
  status: "approved" | "pending" | "rejected";
  respondedAt?:string;
  note?: string;
};
// رویداد تاریخچه — تاریخ به فرمت ISO میلادی ذخیره و در نمایش به شمسی تبدیل می‌شود       
export type HistoryEvent = {
  id: string;
  action: string;
  actor: string;
  date: string;
  time: string;
};
//جزئیات درخواست ها
export type RequestDetail = {
  request: LoanRequest;
  documents: Document[];
  inquiries: Inquiry[];
  history: HistoryEvent[];
};

//برای نمایش همه که فیتلر درست کار کنه بالاخره  
export type StatusFilter = Status | "all";

//مرتب سازی ستون ها 
export type SortField = "employee" | "department" | "amount" | "date";
export type SortDirection = "asc" | "desc" ;
export type SortConfig = {field: SortField; direction: SortDirection};