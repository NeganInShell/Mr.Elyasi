import { Construction } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";

type PlaceholderPageProps = {
  title: string;
  description: string;
};

export default function PlaceholderPage({
  title,
  description,
}: PlaceholderPageProps) {
  return (
    <>
      <PageHeader title={title} description={description} />

      <div className="bg-white rounded-xl border border-slate-200 p-10 md:p-16 text-center">
        <div className="w-14 h-14 rounded-full bg-slate-100 grid place-items-center text-slate-400 mx-auto mb-4">
          <Construction size={26} />
        </div>
        <h2 className="text-base font-bold text-slate-800 mb-2">
          این بخش در حال توسعه است
        </h2>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          به‌زودی تکمیل می‌شود. تا آن زمان از داشبورد و صفحه «درخواست‌ها»
          استفاده کنید.
        </p>
      </div>
    </>
  );
}