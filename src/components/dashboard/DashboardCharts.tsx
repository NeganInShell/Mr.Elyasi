import DonutChart from "./charts/DonutChart";
import BarChart from "./charts/BarChart";
import ProgressChart from "./charts/ProgressChart";
import type { LoanRequest } from "../../types/request";

type DashboardChartsProps = {
  requests: LoanRequest[];
};

export default function DashboardCharts({ requests }: DashboardChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-4">
      <div className="lg:col-span-1">
        <DonutChart requests={requests} />
      </div>

      <div className="lg:col-span-2">
        <BarChart requests={requests} />
      </div>

      <div className="lg:col-span-3">
        <ProgressChart requests={requests} />
      </div>
    </div>
  );
}
