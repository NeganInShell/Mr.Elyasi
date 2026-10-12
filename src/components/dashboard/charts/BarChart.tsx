import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { toJalali, jalaliMonths } from "../../../utils/jalali";
import { formatAmount, toFaDigits } from "../../../utils/formatAmount";
import type { LoanRequest } from "../../../types/request";

type BarChartProps = {
  requests: LoanRequest[];
};

type MonthPoint = {
  key: string;
  label: string;
  count: number;
  amount: number;
};

function buildMonthlyData(requests: LoanRequest[]): MonthPoint[] {
  const groups = new Map<string, MonthPoint>();

  for (const request of requests) {
    const [y, m, d] = request.date.split("-").map(Number);
    const { jy, jm } = toJalali(new Date(y, m - 1, d));

    // کلید باید برای مقایسه‌ی عددی/رشته‌ای یکسان‌طول باشد،
    // وگرنه «۱۴۰۵/۱۰» از «۱۴۰۵/۷» کوچک‌تر شمرده می‌شود
    const key = `${jy}-${String(jm).padStart(2, "0")}`;

    const point = groups.get(key) ?? {
      key,
      label: `${jalaliMonths[jm - 1]} ${toFaDigits(jy)}`,
      count: 0,
      amount: 0,
    };

    point.count += 1;
    point.amount += request.amount;
    groups.set(key, point);
  }

  return Array.from(groups.values()).sort((a, b) => a.key.localeCompare(b.key));
}

export default function BarChart({ requests }: BarChartProps) {
  const data = buildMonthlyData(requests);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 md:p-5">
      <div className="mb-4">
        <h3 className="text-sm md:text-base font-bold text-slate-800">
          روند درخواست‌ها
        </h3>
        <p className="text-[11px] md:text-xs text-slate-500 mt-0.5">
          تعداد و مجموع مبالغ به تفکیک ماه
        </p>
      </div>

      <div className="w-full h-56">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart
            data={data}
            margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#f1f5f9"
              vertical={false}
            />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 10, fontFamily: "Vazirmatn", fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fontFamily: "Vazirmatn", fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
              width={25}
            />
            <Tooltip
              contentStyle={{
                fontFamily: "Vazirmatn",
                fontSize: "12px",
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
                direction: "rtl",
              }}
              cursor={{ fill: "#f8fafc" }}
              formatter={(value, name, item) => [
                name === "count"
                  ? `${formatAmount(Number(value))} درخواست`
                  : `${formatAmount(Number((item?.payload as MonthPoint)?.amount ?? 0))} تومان`,
                name === "count" ? "تعداد" : "مجموع مبلغ",
              ]}
              labelFormatter={(label) => `ماه ${label}`}
            />
            <Bar
              dataKey="count"
              name="count"
              fill="#5268d9"
              radius={[6, 6, 0, 0]}
              maxBarSize={48}
            />
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}