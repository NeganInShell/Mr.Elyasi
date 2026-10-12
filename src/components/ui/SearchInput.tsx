import { Search, X } from "lucide-react";
import { toFaDigits } from "../../utils/formatAmount";

type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  resultCount?: number;
  label?: string;
};

export default function SearchInput({
  value,
  onChange,
  placeholder = "جست‌وجوی نام، شماره درخواست یا واحد سازمانی...",
  resultCount,
  label = "جست‌وجوی درخواست‌ها",
}: SearchInputProps) {
  return (
    <div className="flex items-center gap-2 w-full h-11 px-3 rounded-lg border border-slate-200 bg-white text-slate-400 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-100 transition-all">
      <Search size={18} className="shrink-0" />

      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={label}
        className="w-full h-full border-0 outline-none text-slate-700 text-sm bg-transparent placeholder:text-slate-400"
      />

      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="پاک کردن جست‌وجو"
          className="shrink-0 w-6 h-6 rounded-md grid place-items-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X size={15} />
        </button>
      )}

      {resultCount !== undefined && value.trim() !== "" && (
        <span className="hidden sm:inline shrink-0 text-[11px] font-medium text-brand-600 whitespace-nowrap">
          {toFaDigits(resultCount)} نتیجه
        </span>
      )}
    </div>
  );
}