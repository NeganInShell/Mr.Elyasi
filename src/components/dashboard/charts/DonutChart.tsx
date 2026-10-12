import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { statusInfo, workflowOrder } from "../../../data/requests";
import type { LoanRequest } from "../../../types/request";
import { formatAmount } from "../../../utils/formatAmount";

type DonutChartProps = {
  requests: LoanRequest[];
};

export default function DonutChart({ requests }: DonutChartProps) {
  const data = workflowOrder.map((status) => ({
    name: statusInfo[status].label,
    value: requests.filter((r) => r.status === status).length,
    color: statusInfo[status].colorHex,
    status,
  }));

  const total = requests.length;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 md:p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm md:text-base font-bold text-slate-800">
            توزیع وضعیت‌ها
          </h3>
          <p className="text-[11px] md:text-xs text-slate-500 mt-0.5">
            کل درخواست‌ها
          </p>
        </div>
        <div className="text-lg md:text-xl font-extrabold text-slate-800 tabular-nums">
          {formatAmount(total)}
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="w-full md:w-1/2 h-44">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={70}
                paddingAngle={2}
                stroke="none"
              >
                {data.map((entry) => (
                  <Cell key={entry.status} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  fontFamily: "Vazirmatn",
                  fontSize: "12px",
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                  direction: "rtl",
                }}
                formatter={(value, name) => [
                  `${formatAmount(Number(value))} درخواست`,
                  String(name),
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="w-full md:w-1/2 space-y-2">
          {data.map((item) => {
            const percent =
              total > 0 ? Math.round((item.value / total) * 100) : 0;
            return (
              <div
                key={item.status}
                className="flex items-center justify-between gap-2 text-xs"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-slate-600 truncate">{item.name}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-bold text-slate-700 tabular-nums">
                    {formatAmount(item.value)}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    ({formatAmount(percent)}٪)
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}