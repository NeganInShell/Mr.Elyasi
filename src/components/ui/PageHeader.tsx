import type { ReactNode } from "react";

type PageHeaderProps = {
  title: string;
  description: string;
  action?: ReactNode;
};

export default function PageHeader({
  title,
  description,
  action,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-5">
      <div className="min-w-0">
        <h1 className="text-lg md:text-2xl font-extrabold text-slate-800">
          {title}
        </h1>
        <p className="text-xs md:text-sm text-slate-500 mt-1">{description}</p>
      </div>

      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}